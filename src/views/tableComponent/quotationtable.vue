<template lang="html">
  <el-table
    :data="list"
    style="width: 100%"
    :loading="loading"
    border>
    <el-table-column
      label="报价单号"
      width="220">
      <template slot-scope="scope">
        <el-button type="text" @click="viewRow(scope.row)">{{scope.row.ticketno}}</el-button>
      </template>
    </el-table-column>
    <el-table-column
      label="关联计划单号"
      width="220">
      <template slot-scope="scope">
        <el-button type="text" @click="viewRowPlan(scope.row)">{{scope.row.fromorderno}}</el-button>
      </template>
    </el-table-column>
    <el-table-column
      width="200"
      label="询价企业">
      <template slot-scope="scope">
        <span>{{ scope.row.customername }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="报价日期"
      width="200">
      <template slot-scope="scope">
        <span v-if="scope.row.quotationdate">{{ scope.row.quotationdate|parseTime }}</span>
      </template>
    </el-table-column>
    <el-table-column
      width="200"
      label="报价企业">
      <template slot-scope="scope">
        <span>{{ scope.row.enterpricename }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="单据状态"
      width="120">
      <template slot-scope="scope">
        <span >{{ scope.row.status|statusFilter }}</span>
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
    <el-table-column
      label="备注">
      <template slot-scope="scope">
        <span>{{ scope.row.memos }}</span>
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
    }
  },
  methods: {
    viewRow(row) {
      this.$router.push({
        name: 'quotationorderdetail',
        params: {
          ticketno: row.ticketno
        }
      })
    },
    viewRowPlan(row) {
      this.$router.push({
        name: 'plandetail',
        params: {
          ticketno: row.fromorderno
        }
      })
    }
  }
}
</script>

<style lang="css">
</style>
