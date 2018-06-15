<template lang="html">
<div class="app-container">
  <el-form :model="planform" ref="ruleForm" label-width="120px">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="收货通知单号" prop="innotice.ticketno">
          <el-input type="text" v-model="planform.innotice.ticketno" ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="关联采购单号">
          <el-input type="text" v-model="planform.innotice.purchorder" ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="收货企业" prop="innotice.enterprise">
          <el-select v-model="planform.innotice.enterprise" filterable clearable placeholder="请选择" size="100%" prefix-icon="el-icon-search" >
            <el-option
              v-for="item in gridData"
              :key="item.id"
              :label="item.name"
              :value="item.requestid">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="16">
        <el-form-item label="计划到货日期" prop="innotice.postindate">
          <el-date-picker
            v-model="planform.innotice.postindate"
            type="datetimerange"
            :editable="false"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="创建人" prop="innotice.createuser">
          <el-input type="text" v-model="planform.innotice.createuser" ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label-width="350px" >
      <el-button type="primary" @click="onSubmit">查询</el-button>
      <el-button @click="onCancel">重置</el-button>
    </el-form-item>
    <div class="itemscont">
      <h3>
        <span>订单列表</span>
        <template v-if="printno">
          <a
            :href="printUrl('bss_receiving_BatchPrint', printno)"
            target="_blank">
            <el-button style="margin-left: 10px;"
              size="mini">
              打印选中
            </el-button>
          </a>
          <el-button style="margin-left: 10px;"
            @click="cancelCheck"
            size="mini">
            取消选中
          </el-button>
        </template>
        <template v-else>
          <el-button style="margin-left: 10px;"
            size="mini"
            disabled>
            打印选中
          </el-button>
          <el-button style="margin-left: 10px;"
            size="mini"
            disabled>
            取消选中
          </el-button>
        </template>
      </h3>
      <el-table
        :data="list"
        style="width: 100%"
        v-loading="loading"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        border
        max-height="600">
        <el-table-column
          type="selection"
          fixed="left"
          width="55">
        </el-table-column>
        <el-table-column
          label="收货通知单号"
          fixed="left"
          width="180">
          <template slot-scope="scope">
            <el-button type="text" @click="nextpage(scope.row)">{{ scope.row.ticketno }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="关联采购单号"
          width="180">
          <template slot-scope="scope">
            <el-button type="text" @click="nextpurchasepage(scope.row)">{{ scope.row.purchorder }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="企业"
          width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.enterprisename }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="入库仓库"
          width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.instorename }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="计划到达时间"
          width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.indate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.status|statusFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="联系人"
          width="160">
          <template slot-scope="scope">
            <span >{{ scope.row.linkuser }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="联系电话"
          width="160">
          <template slot-scope="scope">
            <span>{{ scope.row.linktel }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="数量"
          width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.sumordernum }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="入库数量"
          width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.suminnum }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="制单人"
          width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.createuser }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="制单时间"
          width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.createdate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="审核人"
          width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.checkuser }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="审核时间"
          width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.checkdate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="备注"
          width="100">
          <template slot-scope="scope">
            <span >{{ scope.row.memos }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentPageChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </el-form>
</div>
</template>

<script>
import { InNoticeList } from '@/api/planorder'
import { mapGetters } from 'vuex'
import { parseTime, printUrl } from '@/utils'
export default {
  data() {
    return {
      planform: {
        innotice: {
          ticketno: '', // 订单号
          instore: '', // 入库仓库
          instorename: '', // 入库仓库名称
          indate: '', // 入库日期
          enterprise: '', // 平台企业
          enterprisename: '', // 平台企业 （裕大）
          createuser: '', // 创建人
          createdate: '', // 创建日期
          status: '', // -2（ 驳回 ） -1（草稿） 0（待审核）1（确认通过）
          checkuser: '', // 审核人
          checkdate: '', // 审核日期
          checkadvice: '', // 审核意见
          suminnum: '', // 入库数量合计
          sumordernum: '', // 数量合计
          linkaddress: '', // 收货地址
          linkuser: '', // 收货联系人
          linktel: '', // 收货联系电话
          purchorder: '', // 采购单
          closed: '', // 完结标识0未完结1完结
          memos: '', // 备注
          isdelete: '', // 是否删除 默认0  1为删除
          postindate: []
        },
        innoticeItems: []
      },
      statusList: [
        {
          name: '草稿', value: '-1'
        },
        {
          name: '待审核', value: '0'
        },
        {
          name: '确认通过', value: '1'
        },
        {
          name: '驳回', value: '-2'
        }
      ],
      list: [],
      pagesize: 10,
      pageindex: 1,
      total: 0,
      currentPage: 1,
      multipleSelection: [],
      deliverway: [
        {
          name: '库发',
          value: '1'
        },
        {
          name: '供应商直发',
          value: '2'
        }
      ],
      loading: false
    }
  },
  computed: {
    printno() {
      const str = []
      this.multipleSelection.map(row => {
        if (row.closed === 1) {
          this.$message({
            message: row.ticketno + '已经完结,不支持打印',
            type: 'warning'
          })
          this.$refs.multipleTable.toggleRowSelection(row)
        } else {
          str.push(row.ticketno)
        }
      })
      return str.toString()
    },
    ...mapGetters({
      company: 'company',
      companyId: 'companyId',
      userInfo: 'userInfo',
      visitedViews: 'visitedViews',
      revstoreList: 'storeList',
      gridData: 'gysList'
    })
  },
  filters: {
    parseTime,
    statusFilter(val) {
      switch (parseInt(val)) {
        case -1: return '草稿'
        case 0: return '待审核'
        case 1: return '确认通过'
        case -2: return '驳回'
        default: return ''
      }
    }
  },
  created() {
    if (!this.gridData.length) {
      this.$store.dispatch('GetGysList')
    }
    this.getListData()
  },
  methods: {
    printUrl,
    cancelCheck() {
      this.$refs.multipleTable.clearSelection()
    },
    handleSelectionChange(val) {
      if (val.closed === 1) {
        this.$message('该订单已完结, 无法打印')
      } else {
        this.multipleSelection = val
      }
    },
    handleSizeChange(val) {
      this.pagesize = val
      this.getListData()
    },
    handleCurrentPageChange(val) {
      this.pageindex = val
      this.getListData()
    },
    getListData() {
      this.loading = true
      const postData = this.planform.innotice
      if (postData.postindate && postData.postindate.length) {
        postData.instartdate = postData.postindate[0]
        postData.inenddate = postData.postindate[1]
        postData.indate = ''
      }
      const pData = {}
      for (const item of Object.keys(postData)) {
        if (postData[item] !== '') {
          pData[item] = postData[item]
        }
      }
      InNoticeList({ pagesize: this.pagesize, pageindex: this.pageindex, ...pData }).then(res => {
        this.list = res.data.data
        this.total = res.data.total
        this.currentPage = res.data.currentPage
        this.loading = false
        console.log(res)
      }).catch(err => {
        console.log(err)
        this.loading = false
      })
    },
    onSubmit() {
      this.getListData()
    },
    viewRow(row) {
      this.$router.push({
        name: 'plandetail',
        params: {
          ticketno: row.ticketno
        }
      })
    },
    onCancel() {
      this.planform = {
        innotice: {},
        innoticeItems: []
      }
    },
    nextpage(row) {
      this.$router.push({
        name: 'innoticedetail',
        params: {
          ticketno: row.ticketno
        }
      })
    },
    nextpurchasepage(row) {
      this.$router.push({
        name: 'purchaseorderdetail',
        params: {
          ticketno: row.purchorder
        }
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
.dlink {
  color: #409EFF;
}
h3 {
  font-size: 14px;
  font-weight: normal;
}
</style>
