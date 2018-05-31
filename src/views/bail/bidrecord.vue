<template lang="html">
<div class="app-container">
  <el-table :data="tabelData" style="width: 100%">
    <el-table-column
      label="招标公告号"
      width="200">
      <template slot-scope="scope">
        <el-button type="text" @click="viewEtpDetail(scope.row)">{{scope.row.tpnumber}}</el-button>
      </template>
    </el-table-column>
    <el-table-column
      label="招标标题">
      <template slot-scope="scope">
        <span>{{scope.row.zbTitle}}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="竞标单号"
      width="200">
      <template slot-scope="scope">
        <el-button type="text" @click="viewBidDetail(scope.row)">{{scope.row.bdnumber}}</el-button>
      </template>
    </el-table-column>
    <el-table-column
      label="招标类型"
      width="120">
      <template slot-scope="scope">
        <span>{{scope.row.zbtyType|parseType}}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="竞标状态"
      width="120">
      <template slot-scope="scope">
        <el-tag :type="tagstatus(scope.row.status)">{{scope.row.status?scope.row.status:'未出竞标结果'}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      label="最后竞标日期">
      <template slot-scope="scope">
        <span v-if="scope.row.makebidtime">{{scope.row.makebidtime|parseTime}}</span>
      </template>
    </el-table-column>
    <el-table-column
      fixed="right"
      width="120"
      label="操作">
      <template slot-scope="scope">
        <el-button
          @click.native.prevent="viewBidDetail(scope.row)"
          type="text"
          size="small">
          竞标详情
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
import { bidList } from '@/api/bail'
import { parseTime } from '@/utils'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      tabelData: [],
      total: 0,
      currentPage: 1,
      pagesize: 10,
      pageindex: 1
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
    this.getTableData()
  },
  methods: {
    tagstatus(val) {
      if (val === '未中标') {
        return 'danger'
      }
      if (val === '已中标') {
        return 'success'
      }
      if (val === '部分中标') {
        return 'warning'
      }
      if (val === '正在竞标') {
        return 'primary'
      }
      return 'info'
    },
    getTableData() {
      bidList({
        pageFlag: 1,
        pagesize: this.pagesize,
        pageindex: this.pageindex,
        belongserver: this.companyId
      }).then(
        res => {
          console.log(res)
          this.tabelData = res.data.data
          this.total = res.data.total
          this.currentPage = res.data.currentPage
        }
      ).catch(err => {
        console.log(err)
      })
    },
    viewBidDetail(row) {
      this.$router.push({
        name: 'biddetail',
        params: {
          id: row.id
        },
        query: {
          t: +new Date() // 保证每次点击路由的query项都是不一样的，确保会重新刷新view
        }
      })
    },
    viewEtpDetail(row) {
      this.$router.push({
        name: 'etpdetailsale',
        params: {
          id: row.zbId
        }
      })
    },
    handleSizeChange(val) {
      this.pagesize = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.pageindex = val
      this.getTableData()
    }
  }
}
</script>

<style lang="css">
</style>
