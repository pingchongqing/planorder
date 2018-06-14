<template lang="html">
<div class="app-container">
  <el-form :inline="true" :model="formInline" class="demo-form-inline">
    <el-form-item label="供应商" >
      <el-input v-model="formInline.customer.name" @focus="getCustomer" clearable prefix-icon="el-icon-search"></el-input>
    </el-form-item>
    <el-form-item>
      <el-input v-model="formInline.searchNumber" placeholder="请输入查询号码"  class="input-with-select">
        <el-select v-model="formInline.searchType" placeholder="请选择" slot="prepend">
          <el-option label="招标编号" value="0" selected="true"></el-option>
          <el-option label="交易流水号" value="1"></el-option>
        </el-select>
      </el-input>
    </el-form-item>
    <el-form-item label="支付日期" >
      <el-date-picker
        v-model="formInline.time"
        type="daterange"
        range-separator="至"
        :editable="false"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSearchSubmit">查询</el-button>
    </el-form-item>
  </el-form>
  <el-table
    :data="tableData"
    v-loading="tbloading"
    border
    style="width: 100%">
    <el-table-column
      fixed
      label="招标编号"
      width="200">
      <template slot-scope="scope">
        {{scope.row.tpnumber}}
      </template>
    </el-table-column>
    <el-table-column
      label="交易流水号"
      width="200">
      <template slot-scope="scope">
        {{scope.row.ticketno}}
      </template>
    </el-table-column>
    <el-table-column
      label="供货企业"
      width="200">
      <template slot-scope="scope">
        {{scope.row.salename}}
      </template>
    </el-table-column>
    <el-table-column
      label="交易金额"
      width="100">
      <template slot-scope="scope">
        ￥{{scope.row.bailamount}}
      </template>
    </el-table-column>
    <el-table-column
      label="订单状态"
      width="100">
      <template slot-scope="scope">
        <el-tag size="medium" :type="scope.row.paystatus === 'R' ? 'success' : 'info'">{{scope.row.paystatus === 'S' ? '待退款' : '已退款'}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      label="支付日期">
      <template slot-scope="scope">
        {{scope.row.paydate}}
      </template>
    </el-table-column>
    <el-table-column
      fixed="right"
      width="200"
      label="操作">
      <template slot-scope="scope">
        <el-button
          v-if="scope.row.paystatus === 'R'"
          v-loading="refundLoading[scope.$index]"
          @click.native.prevent="viewRow(scope.row, scope.$index)"
          type="text"
          size="small">
          详情
        </el-button>
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
  <el-dialog title="供应商选择" :visible.sync="dialogTableVisible">
    <el-table :data="gridData" v-loading="gridLoading" ref="singleTable" highlight-current-row @current-change="handleCurrentChange">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column property="code" label="企业编号" ></el-table-column>
      <el-table-column property="name" label="企业名称" ></el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handelDialogCancel">取 消</el-button>
      <el-button type="primary" @click="handelDialogConfirm" :disabled="Object.keys(currentRow).length ? false : true">确 定</el-button>
    </span>
  </el-dialog>
  <el-dialog title="退款详情" :visible.sync="refundVisible">
    <el-form :model="refundDetail" label-width="120">
      <el-form-item label="订单交易流水号">
        <span class="formtext">{{refundDetail.ticketno}}</span>
      </el-form-item>
      <el-form-item label="退款单流水号">
        <span class="formtext">{{refundDetail.norefund}}</span>
      </el-form-item>
      <el-form-item label="退款状态">
        <el-tag size="medium" :type="refundDetail.refundstatus === 'S' ? 'success' : 'info'">{{refundDetail.refundstatus === 'S' ? '退款成功' : '退款失败'}}</el-tag>
      </el-form-item>
      <el-form-item label="退款企业">
        <span class="formtext">{{refundDetail.buyname}}</span>
      </el-form-item>
      <el-form-item label="退款账户">
        <span class="formtext">{{refundDetail.outaccount}}</span>
      </el-form-item>
      <el-form-item label="到账企业">
        <span class="formtext">{{refundDetail.salename}}</span>
      </el-form-item>
      <el-form-item label="退款金额">
        <span class="formtext">{{refundDetail.refundmoney}}</span>
      </el-form-item>
      <el-form-item label="退款时间">
        <span class="formtext">{{refundDetail.refunddate }}{{refundDetail.refundtime }}</span>
      </el-form-item>
      <el-form-item label="到账日期" v-if="refundDetail.actualdate">
        <span class="formtext">{{refundDetail.actualdate }}</span>
      </el-form-item>
    </el-form>
  </el-dialog>
</div>
</template>

<script>
import { bailBillList, companyList, retundDetail } from '@/api/bail'
import { parseTime } from '@/utils'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      tableData: [],
      pagesize: 10,
      pageindex: 1,
      formInline: {
        searchType: '0',
        searchNumber: '',
        time: [],
        customer: {
          code: '',
          id: '',
          name: ''
        }
      },
      tbloading: false,
      loading: false,
      dialogTableVisible: false,
      gridData: [],
      gridLoading: false,
      currentRow: {},
      total: 0,
      currentPage: 1,
      refundLoading: [],
      refundVisible: false,
      refundDetail: {}
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  filters: {
    parseTime
  },
  created() {
    this.getBailData({
      pageFlag: 1,
      pageindex: this.pageindex,
      pagesize: this.pagesize,
      saleenterprice: this.userInfo.companyid
    })
  },
  methods: {
    getBailData() {
      this.tbloading = true
      const postData = {
        pageFlag: 1,
        pageindex: this.pageindex,
        pagesize: this.pagesize,
        saleenterprice: this.userInfo.companyid
      }
      if (this.formInline.searchType === '0' && this.formInline.searchNumber) {
        postData.tpnumber = this.formInline.searchNumber
      }
      if (this.formInline.searchType === '1' && this.formInline.searchNumber) {
        postData.ticketno = this.formInline.searchNumber
      }
      if (this.formInline.customer && this.formInline.customer.id) {
        postData.saleenterprice = this.formInline.customer.id
      }
      if (this.formInline.time && this.formInline.time.length) {
        postData.startdate = parseTime(this.formInline.time[0], '{y}{m}{d}')
        postData.enddate = parseTime(this.formInline.time[1], '{y}{m}{d}')
      }
      bailBillList(postData).then(res => {
        this.tbloading = false
        this.tableData = res.data.data
        this.total = res.data.total
        this.currentPage = res.data.currentPage
      }).catch(err => {
        this.tbloading = false
        console.log(err)
      })
    },
    onSearchSubmit() {
      this.pageindex = 1
      this.getBailData()
    },
    getCustomer() {
      this.dialogTableVisible = true
      if (!this.gridData.length) {
        this.gridLoading = true
        companyList({
          ufBidBailBillRequestDTO: {
            pageFlag: 0
          },
          buyenterprice: this.userInfo.companyid
        }).then(
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
    handleCurrentChange(val) {
      this.currentRow = val
    },
    handelDialogConfirm() {
      this.dialogTableVisible = false
      this.formInline.customer = JSON.parse(JSON.stringify(this.currentRow))
    },
    handelDialogCancel() {
      this.dialogTableVisible = false
      this.formInline.customer = JSON.parse(JSON.stringify({
        code: '',
        id: '',
        name: ''
      }))
    },
    handleSizeChange(val) {
      this.pagesize = val
      this.getBailData()
    },
    handleCurrentPageChange(val) {
      this.pageindex = val
      this.getBailData()
    },
    viewRow(row, index) {
      this.$set(this.refundLoading, index, true)
      retundDetail({ norefund: row.norefund }).then(
        res => {
          console.log(res)
          this.$set(this.refundLoading, index, false)
          this.refundVisible = true
          this.refundDetail = res.data
        }
      ).catch(
        err => {
          console.log(err)
          this.$set(this.refundLoading, index, false)
        }
      )
    }
  }
}
</script>

<style>
  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
<style scoped>
.formtext {
  color: #000;
}
</style>
