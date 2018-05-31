<template lang="html">
<div class="app-container">
  <el-form :inline="true" :model="formInline" class="demo-form-inline">
    <el-form-item label="竞标单位（供应商）">
      <el-input v-model="formInline.servername" placeholder="请输入竞标单位"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSearchSubmit">查询</el-button>
    </el-form-item>
  </el-form>
  <el-table
    :data="bidlist"
    v-loading="tbloading"
    border
    style="width: 100%">
    <el-table-column
      fixed
      label="招标公告号"
      width="150">
      <template slot-scope="scope">
        <el-button
          @click.native.prevent="viewRow(scope.row, 'zb')"
          type="text"
          size="small">
          {{scope.row.tpnumber}}
        </el-button>
      </template>
    </el-table-column>
    <el-table-column
      label="竞标单号"
      width="150">
      <template slot-scope="scope">
        <el-button
          @click.native.prevent="viewRow(scope.row, 'jb')"
          type="text"
          size="small">
          {{scope.row.bdnumber}}
        </el-button>
      </template>
    </el-table-column>
    <el-table-column
      label="竞标状态"
      width="100">
      <template slot-scope="scope">
        <el-tag size="medium" :type="scope.row.status === '已中标' ? 'success' : 'info'">{{scope.row.status?scope.row.status:'正在竞标'}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      label="总金额"
      width="150">
      <template slot-scope="scope">
        ￥{{scope.row.bdamount}}
      </template>
    </el-table-column>
    <el-table-column
      label="竞标单位"
      width="200">
      <template slot-scope="scope">
        {{scope.row.servername}}
      </template>
    </el-table-column>
    <el-table-column
      label="最后竞标时间">
      <template slot-scope="scope">
        {{scope.row.zbEndTime|parseTime}}
      </template>
    </el-table-column>
    <el-table-column
      fixed="right"
      width="200"
      label="设置">
      <template slot-scope="scope">
        <el-button
          @click.native.prevent="setBid(scope.row, scope.$index)"
          type="primary"
          :loading="loading"
          v-if="!scope.row.status || scope.row.status === '正在竞标'"
          size="small">
          设为中标
        </el-button>
        <el-button
          @click.native.prevent="viewRow(scope.row, 'jb')"
          type="text"
          size="small">
          竞标明细
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</div>
</template>

<script>
import { bidList, setWinBid } from '@/api/etp'
import { parseTime } from '@/utils'
export default {
  data() {
    return {
      bidlist: [],
      formInline: {
        servername: ''
      },
      loading: false,
      tbloading: false
    }
  },
  filters: {
    parseTime
  },
  created() {
    this.getBidList({ tpnumber: this.$route.params.tpnumber })
  },
  methods: {
    getBidList(params) {
      this.tbloading = true
      bidList(params).then(
        res => {
          console.log(res)
          this.bidlist = res.data.data
          this.tbloading = false
        }
      ).catch(err => {
        console.log(err)
        this.tbloading = false
      })
    },
    onSearchSubmit() {
      this.getBidList({ tpnumber: this.$route.params.tpnumber, servername: this.formInline.servername })
    },
    // 设置中标
    setBid(row, index) {
      this.loading = true
      setWinBid({ id: row.id }).then(
        res => {
          console.log(res)
          this.loading = false
          this.$message({
            message: res.message,
            type: 'success'
          })
          row.status = '已中标'
          this.$set(this.bidlist, index, row)
        }
      ).catch(err => {
        console.log(err)
        this.loading = false
      })
    },
    viewRow(row, type) {
      console.log(row)
      if (type === 'zb') {
        this.$router.push({
          name: 'etpdetail',
          params: {
            id: row.zbId
          },
          query: {
            d: Date.now()
          }
        })
      }
      if (type === 'jb') {
        this.$router.push({
          name: 'biddetail',
          params: {
            id: row.id
          },
          query: {
            d: Date.now()
          }
        })
      }
    }
  }
}
</script>

<style lang="css">
</style>
