<template lang="html">
  <el-table
    :data="list"
    style="width: 100%"
    v-loading="loading"
    border
    max-height="600">
    <el-table-column
      label="状态"
      fixed="left"
      width="80">
      <template slot-scope="scope">
        <span>{{ scope.row.status|statusFilter }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="销售订单号"
      fixed="left"
      width="150">
      <template slot-scope="scope">
        <el-button type="text" @click="nextpage(scope.row)">{{ scope.row.ticketno }}</el-button>
      </template>
    </el-table-column>
    <el-table-column
      label="计划单号"
      width="150">
      <template slot-scope="scope">
        <el-button type="text" @click="nextplanpage(scope.row)">{{ scope.row.enquiryorder }}</el-button>
      </template>
    </el-table-column>
    <el-table-column
      label="计划到货日期"
      width="200">
      <template slot-scope="scope">
        <span>{{ scope.row.planarrivedate }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="交货地址"
      width="200">
      <template slot-scope="scope">
        <span>{{ scope.row.receiveaddress }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="交货方式"
      width="100">
      <template slot-scope="scope">
        <span>{{ scope.row.deliverway|deliverwayFilter }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="客户"
      width="160">
      <template slot-scope="scope">
        <span>{{ scope.row.customername }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="供应商联系人"
      width="160">
      <template slot-scope="scope">
        <span >{{ scope.row.linkusername }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="供应商电话"
      width="160">
      <template slot-scope="scope">
        <span>{{ scope.row.linktel }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="采购金额"
      width="100">
      <template slot-scope="scope">
        <span>{{ scope.row.sumorderamount }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="税金"
      width="100">
      <template slot-scope="scope">
        <span>{{ scope.row.sumtaxamount }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="付款方式"
      width="100">
      <template slot-scope="scope">
        <span>{{ scope.row.recmethod|recmethodFilter }}</span>
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
</template>

<script>
import { parseTime } from '@/utils'
export default {
  props: ['list', 'loading'],
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
  methods: {
    nextpage(row) {
      this.$router.push({
        name: 'saleorderdetail',
        params: {
          ticketno: row.ticketno
        }
      })
    },
    nextplanpage(row) {
      this.$router.push({
        name: 'plandetail',
        params: {
          ticketno: row.enquiryorder
        }
      })
    }
  }
}
</script>

<style lang="css">
</style>
