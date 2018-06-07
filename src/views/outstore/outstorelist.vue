<template lang="html">
<div class="app-container">
  <el-form :model="planform" ref="ruleForm" label-width="120px">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="出库单号" prop="outOrder.ticketno">
          <el-input type="text" v-model="planform.outOrder.ticketno" ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="发货通知单号">
          <el-input type="text" v-model="planform.outOrder.outnotice" ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="收货企业" prop="outOrder.enterprise">
          <el-select v-model="planform.outOrder.enterprise" filterable clearable placeholder="请选择" prefix-icon="el-icon-search" >
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
        <el-form-item label="出库日期" prop="outOrder.postoutdate">
          <el-date-picker
            v-model="planform.outOrder.postoutdate"
            type="datetimerange"
            :editable="false"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="创建人" prop="outOrder.createuser">
          <el-input type="text" v-model="planform.outOrder.createuser" ></el-input>
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
          label="出库单号"
          fixed="left"
          width="150">
          <template slot-scope="scope">
            <el-button type="text" @click="nextpage(scope.row)">{{ scope.row.ticketno }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="发货通知单号"
          width="150">
          <template slot-scope="scope">
            <el-button type="text" @click="nextsalepage(scope.row)">{{ scope.row.outnotice }}</el-button>
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
          label="出库仓库"
          width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.outstorename }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="出库时间"
          width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.outdate }}</span>
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
          label="出库数量"
          width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.outnum }}</span>
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
import { OutStoreList } from '@/api/planorder'
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils'
export default {
  data() {
    return {
      planform: {
        outOrder: {
          ticketno: '', // 订单号
          enclosure: '', // 附件地址
          outstore: '', // 出库仓库
          outstorename: '', // 出库仓库名称
          outdate: '', // 出库日期
          enterprise: '', // 平台企业
          enterprisename: '', // 平台企业 （裕大）
          createuser: '', // 创建人
          createdate: '', // 创建日期
          status: '', // -2（ 驳回 ） -1（草稿） 0（待审核）1（确认通过）
          checkuser: '', // 审核人
          checkdate: '', // 审核日期
          checkadvice: '', // 审核意见
          linkaddress: '', // 收货地址
          linkuser: '', // 收货联系人
          linktel: '', // 收货联系电话
          outOrder: '', // 送货通知单id
          closed: '', // 完结标识0未完结1完结
          memos: '', // 备注
          outnum: '', // 实出数量
          isdelete: '', // 是否删除 默认0  1为删除
          postoutdate: []
        },
        outOrderItems: []
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
    paymethodFilter(val) {
      switch (parseInt(val)) {
        case 1: return '货到付款'
        case 2: return '现金付款'
        case 3: return '预付款'
        default: return ''
      }
    },
    statusFilter(val) {
      switch (parseInt(val)) {
        case -1: return '草稿'
        case 0: return '待审核'
        case 1: return '确认通过'
        case -2: return '驳回'
        default: return ''
      }
    },
    deliverwayFilter(val) {
      switch (parseInt(val)) {
        case 1: return '库发'
        case 2: return '供应商直发'
        default: return ''
      }
    },
    recmethodFilter(val) {
      switch (parseInt(val)) {
        case 1: return '货到付款'
        case 2: return '预付款'
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
      const postData = this.planform.outOrder
      if (postData.postoutdate && postData.postoutdate.length) {
        postData.outstartdate = parseTime(postData.postoutdate[0])
        postData.outenddate = parseTime(postData.postoutdate[1])
        postData.outdate = ''
      }
      const pData = {}
      for (const item of Object.keys(postData)) {
        if (postData[item] !== '') {
          pData[item] = postData[item]
        }
      }
      OutStoreList({ pagesize: this.pagesize, pageindex: this.pageindex, ...pData }).then(res => {
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
        outOrder: {},
        outOrderItems: []
      }
    },
    nextpage(row) {
      this.$router.push({
        name: 'outstoredetail',
        params: {
          ticketno: row.ticketno
        }
      })
    },
    nextsalepage(row) {
      this.$router.push({
        name: 'outnoticedetail',
        params: {
          ticketno: row.outnotice
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
