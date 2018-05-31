<template lang="html">
  <div class="app-container">
    <el-table
      :data="tableData"
      v-loading="loading"
      :row-class-name="tableRowClassName"
      @filter-change="filterChange"
      style="width: 100%">
      <el-table-column
        fixed
        label="招标公告号"
        width="180">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="viewRow(scope.row.etpOrderMain.id)"
            type="text"
            size="small">
            {{scope.row.etpOrderMain.tpnumber}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="etpOrderMain.title"
        label="公告标题">
      </el-table-column>
      <el-table-column
        label="招标类型"
        width="120">
        <template slot-scope="scope">
          {{scope.row.etpOrderMain.tptype|parseType}}
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        prop="etpOrderMain.status"
        :filters="filterData"
        filter-placement="bottom-end"
        :filter-multiple="false"
        column-key="status"
        width="100">
        <template slot-scope="scope">
          <el-tag size="medium" :type="scope.row.etpOrderMain.status === '正在竞标' ? 'success' : scope.row.etpOrderMain.status === '竞标结束' ? 'info' : 'primary'">{{scope.row.etpOrderMain.status}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="etpOrderMain.customname"
        label="发标单位">
      </el-table-column>
      <el-table-column
        label="竞标开始时间"
        width="180">
        <template slot-scope="scope">
          {{scope.row.etpOrderMain.starttime|parseTime}}
        </template>
      </el-table-column>
      <el-table-column
        label="竞标结束时间"
        width="180">
        <template slot-scope="scope">
          {{scope.row.etpOrderMain.endtime|parseTime}}
        </template>
      </el-table-column>
      <el-table-column
        label="发布时间"
        width="180">
        <template slot-scope="scope">
          {{scope.row.etpOrderMain.subtime|parseTime}}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="quoted(scope.row, scope.$index)"
            type="primary"
            v-loading="quotedLoading[scope.$index]"
            v-if="scope.row.etpOrderMain.status === '正在竞标'"
            size="small">
            {{scope.row.JBid ? '再次报价' : '报价'}}
          </el-button>
          <el-button
            v-if="scope.row.etpOrderMain.status === '竞标结束' && scope.row.JBid"
            @click.native.prevent="viewBidDetail(scope.row)"
            type="text"
            size="small">
            查看记录
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import { parseTime, formatTime } from '@/utils'
import { orderList, queryBail } from '@/api/etp'
export default {
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pagesize: 10,
      pageindex: 1,
      total: 0,
      loading: false,
      quotedLoading: [],
      filterData: [{ text: '正在招标', value: '正在招标' }, { text: '正在竞标', value: '正在竞标' }, { text: '竞标结束', value: '竞标结束' }],
      postData: {}
    }
  },
  filters: {
    parseTime,
    formatTime,
    parseType(val) {
      if (val === 0 || val === '0') {
        return '明细招标'
      }
      if (val === 1 || val === '1') {
        return '品类招标'
      }
      return val
    }
  },
  created() {
    this.getData()
  },
  methods: {
    filterChange(params) {
      this.pageindex = 1
      this.postData = { status: params.status[0] }
      console.log(params)
      this.getData()
    },
    filterTag(value, row) {
      return row.etpOrderMain.status === value
    },
    tableRowClassName({ row }) {
      if (row.etpOrderMain.status === '正在竞标') {
        return 'success-row'
      }
      if (row.etpOrderMain.status === '竞标结束') {
        return 'warning-row'
      }
    },
    getData() {
      this.loading = true
      orderList({
        pageFlag: 1,
        pageindex: this.pageindex,
        pagesize: this.pagesize,
        bidCenterFlag: 1,
        ...this.postData
      }).then(
        res => {
          this.loading = false
          this.tableData = res.data.data
          this.currentPage = res.data.currentPage
          this.total = res.data.total
        }
      ).catch(error => {
        console.log(error)
        this.loading = false
      })
    },
    viewRow(id) {
      this.$router.push({
        name: 'etpdetailsale',
        params: {
          id
        }
      })
    },
    deleteRow(index) {
      this.tableData.splice(index, 1)
    },
    handleSizeChange(val) {
      this.pagesize = val
      this.getData()
    },
    handleCurrentChange(val) {
      this.pageindex = val
      this.getData()
    },
    quoted(row, index) {
      this.$set(this.quotedLoading, index, true)
      if (row.JBid) {
        this.$router.push({
          name: 'biddetail',
          params: {
            id: row.JBid
          }
        })
      } else {
        queryBail({ id: row.etpOrderMain.id }).then(
          res => {
            console.log(res)
            this.$set(this.quotedLoading, index, false)
            this.$router.push({
              name: 'quoted',
              params: {
                id: row.etpOrderMain.id
              }
            })
          }
        ).catch(
          err => {
            console.log(err)
            this.$router.push({
              name: 'paybail',
              params: {
                id: row.etpOrderMain.id
              }
            })
            this.$set(this.quotedLoading, index, false)
          }
        )
      }
    },
    viewBidDetail(row) {
      this.$router.push({
        name: 'biddetail',
        params: {
          id: row.JBid
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
