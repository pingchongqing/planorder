<template>
<div>
  <sticky :className="'sub-navbar published'" v-if="topShow">
    <template v-if="fetchSuccess">
      <el-button v-if="form.etpOrderMain.status === '正在竞标'" v-loading="jbloading" style="margin-left: 10px;" type="success"  @click="doAddOrUpdateEtpBid">开始竞标
      </el-button>
      <div style="height:50px"></div>
    </template>
    <template v-else>
      <el-tag>发送异常错误,刷新页面,或者联系程序员</el-tag>
    </template>
  </sticky>
  <div class="app-container">
    <el-form :model="form" ref="ruleForm" :rules="rules" :label-position="'left'" label-width="120px" >
      <el-form-item label="招标单号">
        {{form.etpOrderMain.tpnumber}}
      </el-form-item>
      <el-form-item label="招标标题">
        {{form.etpOrderMain.title}}
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="竞标总金额">
            {{totalAmount}}元
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="竞标时间" prop="etpOrderMain.makebidtime">
            <el-date-picker
              v-model="form.etpOrderMain.makebidtime"
              type="datetime"
              :editable="false"
              placeholder="选择日期时间"
              align="right">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="竞标单位">
            {{company}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="竞标状态">
            <el-tag :type="form.etpOrderMain.status === '正在竞标' ? 'success' : form.etpOrderMain.status === '竞标结束' ? 'info' : 'primary'">{{form.etpOrderMain.status}}</el-tag>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="竞标备注">
        <el-input type="textarea" v-model="form.etpOrderMain.beizhu" rows='5' placeholder="竞标备注" style="float:right"></el-input>
      </el-form-item>
      <div class="itemscont">
        <h3>
          竞标物品明细
          <el-button
            size="mini"
            type="primary"
            v-loading="downloadLoading"
            icon="el-icon-add"
            @click="exportExcel">
            导出Excel
          </el-button>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-add"
            @click="importExcel">
            导入Excel
          </el-button>
        </h3>
        <el-form-item prop="items" label-width="0">
          <el-table
            :data="form.items"
            style="width: 100%"
            border>
              <el-table-column
                fixed="left"
                :render-header="renderHeader"
                width="80">
                <template slot-scope="scope">
                  <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
              <el-table-column
                label="小分类编码"
                width="120">
                <template slot-scope="scope">
                  <span>{{scope.row.thirdlevno}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="thirdlev"
                label="小分类名称"
                width="150">
              </el-table-column>
              <el-table-column
                label="商品编号"
                width="120">
                <template slot-scope="scope">
                  <span>{{ scope.row.pdtno }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="商品名称"
                width="150">
                <template slot-scope="scope">
                  <span>{{ scope.row.pdtname }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="品牌"
                width="120">
                <template slot-scope="scope">
                  <span>{{ scope.row.pdtbrand }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="规格"
                width="200">
                <template slot-scope="scope">
                  <span>{{ scope.row.pdtmodel }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="型号"
                width="200">
                <template slot-scope="scope">
                  <span>{{ scope.row.pdtsize }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="数量"
                width="80">
                <template slot-scope="scope">
                  <span>{{ scope.row.pdtnumber }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="单位"
                width="80">
                <template slot-scope="scope">
                  <span >{{ scope.row.pdtunit }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="参考单价"
                width="100">
                <template slot-scope="scope">
                  {{ scope.row.pdtprice }}
                </template>
              </el-table-column>
              <el-table-column
                label="竞标方货号"
                width="100">
                <template slot-scope="scope">
                  <el-input class="edit-input" size="small" v-model="scope.row.supplierno"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="本轮竞标价"
                width="100">
                <template slot-scope="scope">
                  <el-input class="edit-input" size="small" v-model="scope.row.bidprice"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="小计"
                width="100">
                <template slot-scope="scope">
                  {{scope.row.bidprice*1000*scope.row.pdtnumber/1000}}
                </template>
              </el-table-column>
              <el-table-column
                label="备注"
                width="100">
                <template slot-scope="scope">
                  <el-input class="edit-input" size="small" v-model="scope.row.beizhu"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
      </div>
    </el-form>
  </div>
  <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    center
    width="80%">
    <upload-excel-component @on-selected-file='selected'></upload-excel-component>
  </el-dialog>
</div>
</template>

<script>
import { orderDetail, startEtpOrder, addOrUpdateEtpBid } from '@/api/etp'
import { mapGetters } from 'vuex'
import Sticky from '@/components/Sticky' // 粘性header组件
import { parseTime } from '@/utils'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
export default {
  components: { Sticky, UploadExcelComponent },
  data() {
    var checkDetail = (rule, value, callback) => {
      if (!value.length) {
        return callback(new Error('竞标物品明细不能空'))
      }
      setTimeout(() => {
        value.forEach(v => {
          if (!v.supplierno || !v.bidprice) {
            return callback(new Error('物品明细的竞标方货号和本轮竞标价必填'))
          }
        })
        callback()
      }, 300)
    }
    return {
      form: {
        etpOrderMain: {},
        items: []
      },
      fetchSuccess: true,
      loading: false,
      jbloading: false,
      topShow: true,
      downloadLoading: false,
      dialogVisible: false,
      rules: {
        etpOrderMain: {
          makebidtime: [
            { required: true, message: '请选择竞标时间', trigger: 'change' }
          ]
        },
        items: [
          { validator: checkDetail, required: true, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    totalAmount() {
      let m = 0
      this.form.items.forEach(d => { m = m + d.bidprice * d.pdtnumber })
      return m
    },
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
    this.getDetail()
    if (this.$route.name === 'etpdetailsale') {
      this.topShow = false
    }
  },
  methods: {
    selected(data) {
      const rese = []
      data.results.map(r => {
        const nr = {}
        nr.thirdlevno = r['小分类编码']
        nr.thirdlev = r['小分类名称']
        nr.pdtno = r['商品编号']
        nr.pdtname = r['商品名称']
        nr.pdtbrand = r['品牌']
        nr.pdtmodel = r['规格']
        nr.pdtsize = r['型号']
        nr.pdtnumber = r['数量']
        nr.pdtunit = r['单位']
        nr.pdtprice = r['参考单价']
        nr.supplierno = r['竞标方货号']
        nr.bidprice = r['本轮竞标价']
        nr.beizhu = r['备注']
        rese.push(nr)
      })
      this.form.items = rese
      console.log(data)
      this.dialogVisible = false
    },
    getDetail() {
      orderDetail({ id: this.$route.params.id }).then(
        res => {
          console.log(res)
          res.data.etpOrderMain.makebidtime = new Date()
          this.form = res.data
        }
      ).catch(err => {
        console.log(err)
        this.fetchSuccess = false
      })
    },
    doStartEtpOrder() {
      this.jbloading = true
      startEtpOrder({ id: this.$route.params.id }).then(
        res => {
          console.log(res)
          this.jbloading = false
          this.$message({
            message: res.message,
            type: 'success'
          })
          this.$set(this.form.etpOrderMain, 'status', '正在竞标')
        }
      ).catch(_ => { this.jbloading = false })
    },
    renderHeader(h) {
      return h('div', { 'class': 'renderd' }, ['操作'])
    },
    handleDelete(index, row) {
      this.form.items.splice(index, 1)
      this.$message({
        message: '成功删除一条记录！',
        type: 'success'
      })
    },
    importExcel() {
      this.dialogVisible = true
    },
    exportExcel() {
      this.$prompt('请输入导出的表格名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\w/,
        inputErrorMessage: '表格命名不规范'
      }).then(({ value }) => {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['小分类编码', '小分类名称', '商品编号', '商品名称', '品牌', '规格', '型号', '数量', '单位', '参考单价', '竞标方货号', '本轮竞标价', '备注']
          const filterVal = ['thirdlevno', 'thirdlev', 'pdtno', 'pdtname', 'pdtbrand', 'pdtmodel', 'pdtsize', 'pdtnumber', 'pdtunit', 'pdtprice', 'supplierno', 'bidprice', 'beizhu']
          const list = this.form.items
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: value,
            autoWidth: true
          })
          this.downloadLoading = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消导出'
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    doAddOrUpdateEtpBid() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.jbloading = true
          const postData = {
            etpBidMain: {
              tpnumber: this.form.etpOrderMain.tpnumber,
              bdamount: this.totalAmount,
              subtime: this.form.etpOrderMain.subtime,
              belongserver: this.companyId,
              beizhu: this.form.etpOrderMain.beizhu,
              servername: this.company,
              tpid: this.form.etpOrderMain.id,
              status: this.form.etpOrderMain.status,
              tptype: this.form.etpOrderMain.tptype,
              makebidtime: this.form.etpOrderMain.makebidtime
            },
            items: this.form.items
          }
          addOrUpdateEtpBid(postData).then(
            res => {
              console.log(res)
              this.jbloading = false
              this.$alert('报价成功', '提示', {
                confirmButtonText: '确定',
                type: 'success',
                callback: action => {
                  this.$router.push({
                    name: 'biddetail',
                    params: {
                      id: res.data
                    }
                  })
                }
              })
            }
          ).catch(err => {
            console.log(err)
            this.jbloading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
h3 {
  font-size: 14px;
}
</style>
