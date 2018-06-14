<template lang="html">
<div class="app-container">
  <el-form :model="planform" ref="ruleForm" label-width="120px">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="入库单号" prop="inorder.ticketno">
          <el-input type="text" v-model="planform.inorder.ticketno" ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="收货通知单号">
          <el-input type="text" v-model="planform.inorder.innotice" ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="收货企业" prop="inorder.enterprise">
          <el-select v-model="planform.inorder.enterprise" filterable clearable placeholder="请选择" prefix-icon="el-icon-search" >
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
        <el-form-item label="入库日期" prop="inorder.postindate">
          <el-date-picker
            v-model="planform.inorder.postindate"
            type="datetimerange"
            :editable="false"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="创建人" prop="inorder.createuser">
          <el-input type="text" v-model="planform.inorder.createuser" ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label-width="350px" >
      <el-button type="primary" @click="onSubmit">查询</el-button>
      <el-button @click="onCancel">重置</el-button>
    </el-form-item>
    <div class="itemscont">
      <el-table
        :data="list"
        style="width: 100%"
        v-loading="loading"
        border
        max-height="600">
        <el-table-column
          label="入库单号"
          fixed="left"
          width="180">
          <template slot-scope="scope">
            <el-button type="text" @click="nextpage(scope.row)">{{ scope.row.ticketno }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="收货通知单号"
          width="180">
          <template slot-scope="scope">
            <el-button type="text" @click="nextpurchasepage(scope.row)">{{ scope.row.innotice }}</el-button>
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
          label="入库时间"
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
          label="入库数量"
          width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.innum }}</span>
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
import { InstoreList } from '@/api/planorder'
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils'
export default {
  data() {
    return {
      planform: {
        inorder: {
          ticketno: '', // 订单号
          enclosure: '', // 附件地址
          instore: '', // 出库仓库
          instorename: '', // 出库仓库名称
          indate: '', // 出库日期
          enterprise: '', // 平台企业
          enterprisename: '', // 平台企业 （裕大）
          createuser: '', // 创建人
          createdate: '', // 创建日期
          status: '', // -2（ 驳回 ） -1（草稿） 0（待审核）1（确认通过）
          checkuser: '', // 审核人
          checkdate: '', // 审核日期
          checkadvice: '', // 审核意见
          innotice: '', // 送货通知单id
          innum: '', // 实入数量
          isdelete: '', // 是否删除 默认0  1为删除
          postindate: []
        },
        inorderItems: []
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
      deliverway: [
        {
          name: '库发',
          value: '1'
        },
        {
          name: '供应商直发',
          value: '2'
        },
        {
          name: '自提',
          value: '3'
        }
      ],
      loading: false
    }
  },
  computed: {
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
      const postData = this.planform.inorder
      if (postData.postindate && postData.postindate.length) {
        postData.instartdate = postData.postindate[0]
        postData.inenddate = postData.postindate[1]
        postData.indate = ''
      }
      if (!postData.postindate.length) {
        postData.postindate = ''
      }
      const pData = {}
      for (const item of Object.keys(postData)) {
        if (postData[item] !== '') {
          pData[item] = postData[item]
        }
      }
      InstoreList({ pagesize: this.pagesize, pageindex: this.pageindex, ...pData }).then(res => {
        this.list = res.data.purchorders
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
        inorder: {},
        inorderItems: []
      }
    },
    nextpage(row) {
      this.$router.push({
        name: 'instoredetail',
        params: {
          ticketno: row.ticketno
        }
      })
    },
    nextpurchasepage(row) {
      this.$router.push({
        name: 'innoticedetail',
        params: {
          ticketno: row.innotice
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
