<template lang="html">
  <div class="app-container">
    <el-table
      :data="tableData"
      v-loading="loading"
      :row-class-name="tableRowClassName"
      border
      style="width: 100%">
      <el-table-column
        fixed
        label="招标公告号"
        width="180">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="viewRow(scope.row.id)"
            type="text"
            size="small">
            {{scope.row.tpnumber}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="公告标题">
      </el-table-column>
      <el-table-column
        label="招标类型"
        width="120">
        <template slot-scope="scope">
          {{scope.row.tptype|parseType}}
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        width="120">
        <template slot-scope="scope">
          <el-tag size="medium" :type="scope.row.status === '正在竞标' ? 'success': scope.row.status === '竞标结束'? 'info' :''">{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="customname"
        label="发标单位"
        width="120">
      </el-table-column> -->
      <el-table-column
        label="竞标状况"
        width="80">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>招标物品数量: {{ scope.row.sumNum }}件</p>
            <p>招标物品类别: {{ scope.row.itemNumber }}类</p>
            <p>参与竞标企业数: {{ scope.row.bidNum }}家</p>
            <div slot="reference" class="name-wrapper">
              <el-button size="medium" type="text">{{ scope.row.bidNum ? scope.row.bidNum + '家' : '无人' }}竞标</el-button>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        label="竞标开始时间"
        width="180">
        <template slot-scope="scope">
          {{scope.row.starttime|parseTime}}
        </template>
      </el-table-column>
      <el-table-column
        label="竞标结束时间"
        width="180">
        <template slot-scope="scope">
          {{scope.row.endtime|parseTime}}
        </template>
      </el-table-column>
      <el-table-column
        label="发布时间"
        width="180">
        <template slot-scope="scope">
          {{scope.row.subtime|parseTime}}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="edit(scope.row)"
            v-if="scope.row.status === '正在招标'"
            type="text"
            size="small">
            修改
          </el-button>
          <el-button
            @click.native.prevent="extendTime(scope.row)"
            v-if="scope.row.status === '正在竞标'"
            type="text"
            size="small">
            延长时间
          </el-button>
          <el-button
            @click.native.prevent="tender(scope.row)"
            v-if="scope.row.status === '正在竞标'"
            type="text"
            size="small">
            明细中标
          </el-button>
          <el-button
            @click.native.prevent="showZJ(scope.row)"
            type="text"
            size="small">
            总价
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
    <el-dialog title="延长招标时间" :visible.sync="extendVisible">
      <el-form :model="extendForm" label-width="120">
        <el-form-item label="时间延长至">
          <el-date-picker
            v-model="extendForm.endtime"
            :editable="false"
            type="datetime"
            placeholder="选择日期时间"
            align="right">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="extendVisible = false">取 消</el-button>
        <el-button type="primary" @click="handelDialogConfirm" v-loading="extendLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import { orderList, delayEtpOrderTime } from '@/api/etp'
export default {
  name: 'myetp',
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pagesize: 10,
      pageindex: 1,
      total: 0,
      loading: false,
      extendVisible: false,
      extendForm: {
        endtime: '',
        id: ''
      },
      extendLoading: false
    }
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
    this.getdata()
  },
  methods: {
    tableRowClassName({ row }) {
      if (row.status === '正在竞标') {
        return 'success-row'
      }
      if (row.status === '正在招标') {
        return 'warning-row'
      }
    },
    getdata() {
      if (!this.$store.state.user.companyId) {
        this.$message({
          message: '未获取到对应的公司信息',
          type: 'error'
        })
        return false
      }
      this.loading = true
      orderList({
        pageFlag: 1,
        pageindex: this.pageindex,
        pagesize: this.pagesize,
        belongcustom: this.$store.state.user.companyId,
        myOrderFlag: 1
      }).then(
        res => {
          this.loading = false
          let dt = {}
          const ar = []
          res.data.data.map(d => {
            dt = {
              bidNum: d.bidNum,
              itemNumber: d.itemNumber,
              sumNum: d.sumNum,
              ...d.etpOrderMain
            }
            ar.push(dt)
          })
          this.tableData = ar
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
        name: 'etpdetail',
        params: {
          id
        }
      })
    },
    extendTime(row) {
      console.log(row)
      this.extendForm.endtime = new Date(row.endtime)
      this.extendForm.id = row.id
      this.extendVisible = true
    },
    handelDialogConfirm() {
      let fend
      this.tableData.map(t => {
        if (t.id === this.extendForm.id) {
          fend = t.starttime
        }
      })
      if (Date.parse(this.extendForm.endtime) < Date.parse(fend)) {
        this.$message({
          message: '竞标结束时间不能小于竞标开始时间',
          type: 'error'
        })
        return false
      }
      this.extendLoading = true
      delayEtpOrderTime({ id: this.extendForm.id, endTime: this.extendForm.endtime }).then(
        res => {
          console.log(res)
          this.extendLoading = false
          this.extendVisible = false
          this.tableData.map(d => {
            if (d.id === this.extendForm.id) {
              d.endtime = this.extendForm.endtime
            }
          })
          this.$message({
            message: '延长招标时间成功！',
            type: 'success'
          })
        }
      ).catch(err => {
        console.log(err)
        this.extendLoading = false
      })
    },
    dateChange(val) {
      console.log(val)
    },
    // 总价按钮
    showZJ(row) {
      this.$router.push({
        name: 'bidlist',
        params: {
          tpnumber: row.tpnumber
        }
      })
    },
    handleSizeChange(val) {
      this.pagesize = val
      this.getdata()
    },
    handleCurrentChange(val) {
      this.pageindex = val
      this.getdata()
    },
    tender(row) {
      this.$router.push({
        name: 'tenderdetail',
        params: {
          id: row.id
        },
        query: {
          d: Date.now()
        }
      })
    },
    edit(row) {
      this.$router.push({
        name: 'addetp',
        query: {
          id: row.id
        }
      })
    }
  }
}
</script>

<style lang="css">
.el-table .warning-row {
  background: #f0f9eb;
}

.el-table .success-row {
  background: oldlace;
}
</style>
