<template lang="html">
  <el-table
    :data="list"
    style="width: 100%"
    v-loading="loading"
    show-summary
    :summary-method="getSummaries"
    border>
    <el-table-column
      label="状态"
      fixed="left"
      width="80">
      <template slot-scope="scope">
        <span>{{ scope.row.status|statusFilter }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="采购单"
      fixed="left"
      width="180">
      <template slot-scope="scope">
        <el-button type="text" @click="nextpage(scope.row)">{{ scope.row.ticketno }}</el-button>
      </template>
    </el-table-column>
    <el-table-column
      label="来源计划单"
      width="180">
      <template slot-scope="scope">
        <span>{{ scope.row.enquiryorder }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="订单数量"
      width="100">
      <template slot-scope="scope">
        <span>{{ scope.row.sumordernum }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="已入库数量"
      width="100">
      <template slot-scope="scope">
        <span>{{ scope.row.sumfactrecnum }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="完结状态"
      width="100">
      <template slot-scope="scope">
        <span>{{ scope.row.closed|closedFilter }}</span>
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
      label="合同编号"
      width="200">
      <template slot-scope="scope">
        <span>{{ scope.row.contractno }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="采购金额"
      width="120">
      <template slot-scope="scope">
        <span>{{ scope.row.sumamount }}</span>
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
      label="到达仓库"
      width="100">
      <template slot-scope="scope">
        <span>{{ scope.row.revstorename }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="供应商"
      width="160">
      <template slot-scope="scope">
        <span>{{ scope.row.servicername }}</span>
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
      label="付款方式"
      width="100">
      <template slot-scope="scope">
        <span>{{ scope.row.paymethod|paymethodFilter }}</span>
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
      width="160">
      <template slot-scope="scope">
        <span>{{ scope.row.checkdate }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="备注">
      <template slot-scope="scope">
        <span >{{ scope.row.memos }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { parseTime } from '@/utils'
export default {
  props: ['list', 'loading', 'totalorder', 'totalamount'],
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
    },
    deliverwayFilter(val) {
      switch (parseInt(val)) {
        case 1: return '库发'
        case 2: return '供应商直发'
        case 3: return '自提'
        default: return ''
      }
    },
    paymethodFilter(val) {
      switch (parseInt(val)) {
        case 1: return '货到付款'
        case 2: return '货到票到付款'
        case 3: return '先款后货'
        default: return ''
      }
    },
    closedFilter(val) {
      switch (parseInt(val)) {
        case 0: return '未完结'
        case 1: return '完结'
        default: return ''
      }
    }
  },
  methods: {
    nextpage(row) {
      this.$router.push({
        name: 'purchaseorderdetail',
        params: {
          ticketno: row.ticketno
        }
      })
    },
    getSummaries(param) {
      const { columns } = param
      const sums = []
      sums[0] = '合计'
      columns.forEach((column, index) => {
        if (column.label === '订单数量') {
          sums[index] = this.totalorder
        } else if (column.label === '采购金额') {
          sums[index] = this.totalamount
        }
      })
      return sums
    }
  }
}
</script>

<style lang="css">
</style>
