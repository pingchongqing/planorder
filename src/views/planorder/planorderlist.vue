<template lang="html">
<div class="app-container">
  <el-form :model="planform" ref="ruleForm" label-width="80px">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="询价方" prop="enquiryOrder.customer">
          <el-select v-model="planform.enquiryOrder.customer" filterable clearable placeholder="请搜索或选择" prefix-icon="el-icon-search">
            <el-option
              v-for="item in gridData"
              :key="item.id"
              :label="item.name"
              :value="item.requestid">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="报价方" prop="enquiryOrder.enterprise">
          <el-select v-model="planform.enquiryOrder.enterprise" filterable clearable placeholder="请搜索或选择" prefix-icon="el-icon-search">
            <el-option
              v-for="item in gridData"
              :key="item.id"
              :label="item.name"
              :value="item.requestid">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="询价日期" prop="enquiryOrder.enquirydate">
          <el-date-picker
            v-model="planform.enquiryOrder.enquirydate"
            type="datetime"
            :editable="false"
            placeholder="选择日期时间"
            align="right">
          </el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="付款方式" prop="enquiryOrder.paymethod">
          <el-select v-model="planform.enquiryOrder.paymethod" placeholder="请选择">
            <!-- <el-option label="全部" value="0" ></el-option> -->
            <el-option label="货到付款" value="1" ></el-option>
            <el-option label="现金付款" value="2" ></el-option>
            <el-option label="预付款" value="3" ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label-width="0">
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="onCancel">重置</el-button>
        </el-form-item>
      </el-col>
    </el-row>
    <div class="itemscont">
      <el-table
        :data="list"
        style="width: 100%"
        border>
        <el-table-column
          label="序号"
          width="55">
          <template slot-scope="scope">
            <span >{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="单号"
          prop="ticketno"
          width="220">
        </el-table-column>
        <el-table-column
          width="200"
          label="询价企业">
          <template slot-scope="scope">
            <span>{{ getCustomerName(scope.row.customer) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="询价日期"
          width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.enquirydate|parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="200"
          label="报价企业">
          <template slot-scope="scope">
            <span>{{ scope.row.enterprisename }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="付款方式"
          width="120">
          <template slot-scope="scope">
            <span >{{ scope.row.paymethod|paymethodFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="创建人"
          width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.createuser }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="创建日期"
          width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.createdate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="审核人"
          width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.checkuser }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="审核日期">
          <template slot-scope="scope">
            <span>{{ scope.row.checkdate }}</span>
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
import { getGys, List } from '@/api/planorder'
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils'
export default {
  data() {
    return {
      planform: {
        enquiryOrder: {
          customer: '', // 询价方id
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
          paymethod: '' // 付款方式
        }
      },
      gridData: [],
      gridLoading: false,
      currentRow: {},
      list: [],
      pagesize: 10,
      pageindex: 1,
      total: 0,
      currentPage: 1
    }
  },
  computed: {
    ...mapGetters([
      'company',
      'companyId'
    ])
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
    }
  },
  created() {
    this.getCustomer()
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
    getCustomerName(val) {
      let tname = ''
      if (this.gridData.length) {
        this.gridData.forEach(d => {
          if (d.requestid === val) {
            tname = d.name
          }
        })
      }
      return tname
    },
    getListData() {
      List({ pagesize: this.pagesize, pageindex: this.pageindex }).then(res => {
        this.list = res.data.data
        this.total = res.data.total
        this.currentPage = res.data.currentPage
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    },
    onSubmit() {

    },
    handleDelete(index, row) {
      this.planform.enquiryOrderItems.splice(index, 1)
      this.$message({
        message: '成功删除一条记录！',
        type: 'success'
      })
    },
    editRow(row) {
      row.edit = false
    },
    goeditrow(index) {
      this.planform.enquiryOrderItems[index].edit = true
      this.planform = JSON.parse(JSON.stringify(this.planform))
    },
    getCustomer() {
      this.dialogTableVisible = true
      if (!this.gridData.length) {
        this.gridLoading = true
        getGys().then(
          res => {
            this.gridData = res.data
            this.gridLoading = false
          }
        ).catch(err => {
          console.log(err)
          this.gridLoading = false
        })
      }
    },
    onCancel() {
      this.planform = {
        enquiryOrder: {},
        enquiryOrderItems: []
      }
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
