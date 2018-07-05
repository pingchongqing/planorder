<template lang="html">
<div class="app-container">
  <el-form :model="planform" ref="ruleForm" label-width="80px">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="计划单号">
          <el-input v-model="planform.enquiryOrder.ticketno" placeholder="请输入计划单号"  style="width:220px"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="询价方" prop="enquiryOrder.customer">
          <el-select v-model="planform.enquiryOrder.customer" filterable clearable placeholder="请搜索或选择" style="min-width:220px" prefix-icon="el-icon-search">
            <el-option
              v-for="item in customerList"
              :key="item.id"
              :label="item.name"
              :value="item.requestid">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <!-- <el-col :span="8">
        <el-form-item label="报价方" prop="enquiryOrder.enterprise">
          <el-select v-model="planform.enquiryOrder.enterprise" filterable clearable placeholder="请搜索或选择" style="min-width:220px" prefix-icon="el-icon-search">
            <el-option
              v-for="item in gridData"
              :key="item.id"
              :label="item.name"
              :value="item.requestid">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col> -->
      <el-col :span="8">
        <el-form-item label="付款方式" prop="enquiryOrder.paymethod">
          <el-select v-model="planform.enquiryOrder.paymethod" placeholder="请选择" style="min-width:220px">
            <el-option
              v-for="item in paymethod"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="创建日期" prop="enquiryOrder.createdate">
          <el-date-picker
            v-model="planform.enquiryOrder.createdate"
            type="date"
            placeholder="创建日期"
            :editable="false">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-form-item label="询价日期" prop="enquiryOrder.postenquirydate">
          <el-date-picker
            v-model="planform.enquiryOrder.postenquirydate"
            type="datetimerange"
            :editable="false"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
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
        border>
        <el-table-column
          label="计划单号[供,客,采,销]"
          width="280">
          <template slot-scope="scope">
            <el-button type="text" @click="viewRow(scope.row.enquiryOrder)">{{scope.row.enquiryOrder.ticketno}}</el-button>
            [{{scope.row.serviceCount}},{{scope.row.customerCount}},{{scope.row.purchCount}},{{scope.row.saleCount}}]
          </template>
        </el-table-column>
        <el-table-column
          width="80"
          label="行数">
          <template slot-scope="scope">
            <span>{{ scope.row.rownum }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="200"
          label="询价企业">
          <template slot-scope="scope">
            <span>{{ scope.row.enquiryOrder.customname }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="200"
          label="状态">
          <template slot-scope="scope">
            <span>{{ scope.row.enquiryOrder.status|statusFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="询价日期"
          width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.enquiryOrder.enquirydate|parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="200"
          label="报价截止日期">
          <template slot-scope="scope">
            <span>{{ scope.row.enquiryOrder.enquiryenddate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="付款方式"
          width="120">
          <template slot-scope="scope">
            <span >{{ scope.row.enquiryOrder.paymethod|paymethodFilter }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="供货期"
          width="120">
          <template slot-scope="scope">
            <span >{{ scope.row.enquiryOrder.supplydate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="质保期"
          width="120">
          <template slot-scope="scope">
            <span >{{ scope.row.enquiryOrder.warrantydate }}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          label="创建人"
          width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.enquiryOrder.createuser }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="创建日期"
          width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.enquiryOrder.createdate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="备注"
          width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.enquiryOrder.memos }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="审核人"
          width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.checkuser }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="审核日期">
          <template slot-scope="scope">
            <span>{{ scope.row.checkdate }}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <a :href="printUrl('bss_enquiryorder_schedule', scope.row.enquiryOrder.ticketno)" target="_blank">
              <el-button type="text">查看进度</el-button>
            </a>
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
import { List } from '@/api/planorder'
import { mapGetters } from 'vuex'
import { parseTime, printUrl } from '@/utils'
export default {
  name: 'planorderlist',
  data() {
    return {
      planform: {
        enquiryOrder: {
          customer: '', // 询价方id
          customname: '', // 查询放名称
          enterprise: '', // 报价方id
          enterprisename: '', // 报价方名称
          createuser: '', // 创建人
          createdate: '', // 创建日期
          createtime: '', // 创建时间
          status: '', // -2（ 驳回 ） -1（草稿） 0（待审核）1（确认通过）
          checkuser: '', // 审核人
          checkdate: '', // 审核日期
          checktime: '', // 审核时间
          checkadvice: '', // 审核意见
          sumordernum: '', // 数量合计
          sumamount: '', // 金额合计
          memos: '', // 备注
          customerorderno: '', // 客户订单号
          enquirydate: '', // 询价日期
          enquiryenddate: '', // 询价截止日期
          paymethod: '', // 付款方式
          ordertype: null,
          postenquirydate: []
        }
      },
      postform: {},
      loading: false,
      list: [],
      pagesize: 10,
      pageindex: 1,
      total: 0,
      currentPage: 1,
      paymethod: [
        {
          name: '货到付款',
          value: '1'
        },
        {
          name: '货到票到付款',
          value: '2'
        },
        {
          name: '先款后货',
          value: '3'
        }
      ]
    }
  },
  computed: {
    customerList() {
      return this.gridData.filter(d => d.purchase === 1)
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
    paymethodFilter(val) {
      switch (parseInt(val)) {
        case 1: return '货到付款'
        case 2: return '货到票到付款'
        case 3: return '先款后货'
        default: return ''
      }
    }
  },
  created() {
    if (!this.gridData.length) {
      this.$store.dispatch('GetGysList')
    }
    this.setOrderType()
  },
  mounted() {
    this.$nextTick(() => {
      this.getListData()
    })
  },
  methods: {
    printUrl,
    parseTime,
    setOrderType() {
      // 订单类型（1.代办计划单，2.已过期计划单，3.已作废计划单）
      if (this.$route.name === 'planorderlist') {
        this.planform.enquiryOrder.ordertype = 1
        this.postform.ordertype = 1
      } else if (this.$route.name === 'overdueplanorderlist') {
        this.planform.enquiryOrder.ordertype = 2
        this.postform.ordertype = 2
      } else if (this.$route.name === 'invalidplanorderlist') {
        this.planform.enquiryOrder.ordertype = 3
        this.postform.ordertype = 3
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
      const postData = this.postform
      if (postData.postenquirydate && postData.postenquirydate.length) {
        postData.enquirystartsdate = parseTime(postData.postenquirydate[0])
        postData.enquiryendsdate = parseTime(postData.postenquirydate[1])
        postData.enquirydate = ''
      }
      if (postData.createdate && typeof (postData.createdate) === 'object') {
        postData.createdate = this.parseTime(postData.createdate, '{y}-{m}-{d}')
      }
      this.loading = true
      List({ pagesize: this.pagesize, pageindex: this.pageindex, ...postData }).then(res => {
        this.list = res.data.data
        this.total = res.data.total
        this.currentPage = res.data.currentPage
        console.log(res)
        this.loading = false
      }).catch(err => {
        console.log(err)
        this.loading = false
      })
    },
    onSubmit() {
      this.postform = this.planform.enquiryOrder
      this.pageindex = 1
      this.pagesize = 10
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
        enquiryOrder: {},
        enquiryOrderItems: []
      }
      this.pagesize = 10
      this.pageindex = 1
      this.setOrderType()
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
