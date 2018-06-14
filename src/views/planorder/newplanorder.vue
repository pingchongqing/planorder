<template lang="html">
<div class="app-container">
  <el-form :model="planform" :rules="rules" ref="ruleForm" label-width="120px">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="询价方" prop="enquiryOrder.customer">
          <el-select
            v-model="planform.enquiryOrder.customer"
            filterable
            clearable
            @change="customerChange"
            placeholder="请搜索或选择" prefix-icon="el-icon-search">
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
        <el-form-item label="报价截止日期" prop="enquiryOrder.enquiryenddate">
          <el-date-picker
            v-model="planform.enquiryOrder.enquiryenddate"
            type="datetime"
            :editable="false"
            placeholder="选择日期时间"
            align="right">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="数量合计">
          <el-input :value="sumordernum" :disabled="true" ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="付款方式" prop="enquiryOrder.paymethod">
          <el-select v-model="planform.enquiryOrder.paymethod" placeholder="请选择">
            <!-- <el-option label="全部" value="0" ></el-option> -->
            <el-option label="货到付款" value="1" ></el-option>
            <el-option label="预付款" value="2" ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <div class="itemscont">
      <h3>
        计划单物品明细
        <el-button
          size="mini"
          type="primary"
          @click="importEXL">
          导入Excel
        </el-button>
        <el-button
          size="mini"
          type="primary"
          @click="addDetail">
          新增一行
        </el-button>
        <el-button
          size="mini"
          type="warning"
          v-show="multipleSelection.length"
          @click="delChecked">
          删除选中
        </el-button>
      </h3>
      <el-form-item label-width="0" prop="enquiryOrderItems">
        <el-table
          :data="planform.enquiryOrderItems"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          border
          max-height="600">
          <el-table-column
            type="selection"
            fixed="left"
            width="55">
          </el-table-column>
          <el-table-column
            label="序号"
            width="80">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-input class="edit-input" size="small" v-model="scope.row.itemno"></el-input>
              </template>
              <span v-else>{{ scope.row.itemno }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="物料名称"
            width="120">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-input class="edit-input" size="small" v-model="scope.row.materialname"></el-input>
              </template>
              <span v-else>{{ scope.row.materialname }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="小分类"
            width="120">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-input class="edit-input" size="small" v-model="scope.row.categoryname"></el-input>
              </template>
              <span v-else>{{ scope.row.categoryname }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="品牌"
            width="120">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-input class="edit-input" size="small" v-model="scope.row.materialtag"></el-input>
              </template>
              <span v-else>{{ scope.row.materialtag }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="规格"
            width="200">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-input class="edit-input" size="small" v-model="scope.row.materialrule"></el-input>
              </template>
              <span v-else>{{ scope.row.materialrule }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="型号"
            width="200">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-input class="edit-input" size="small" v-model="scope.row.materialsize"></el-input>
              </template>
              <span v-else>{{ scope.row.materialsize }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="数量"
            width="80">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-input class="edit-input" size="small" v-model="scope.row.ordernum"></el-input>
              </template>
              <span v-else>{{ scope.row.ordernum }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="单位"
            width="80">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-input class="edit-input" size="small" v-model="scope.row.orderunit"></el-input>
              </template>
              <span v-else>{{ scope.row.orderunit }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="质保期"
            width="260">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-date-picker
                  v-model="scope.row.warrantydate"
                  type="date"
                  :editable="false"
                  placeholder="选择日期时间"
                  align="right">
                </el-date-picker>
              </template>
              <span v-else>{{ scope.row.warrantydate }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="供货期"
            width="260">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-date-picker
                  v-model="scope.row.supplydate"
                  type="date"
                  :editable="false"
                  placeholder="选择日期时间"
                  align="right">
                </el-date-picker>
              </template>
              <span v-else>{{ scope.row.supplydate }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="供应商"
            width="180">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-select v-model="scope.row.servicer" filterable placeholder="请选择">
                  <el-option
                    v-for="item in gridData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.requestid">
                  </el-option>
                </el-select>
              </template>
              <span v-else>{{ scope.row.servicername }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            width="100">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-input class="edit-input" size="small" v-model="scope.row.memos"></el-input>
              </template>
              <span v-else>{{ scope.row.memos }}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="220">
            <template slot-scope="scope">
              <el-button v-if="scope.row.edit" type="success" @click="editRow(scope.row)" size="mini" >确定</el-button>
              <el-button v-else @click="goeditrow(scope.$index)" size="mini" >编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </div>
    <el-form-item label-width="0">
      <el-button type="primary" @click="onSubmit" v-loading="submitloading">提交</el-button>
      <el-button @click="onCancel">取消</el-button>
    </el-form-item>
  </el-form>
  <!-- 上传弹框 -->
  <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    center
    width="50%">
    <el-upload
      class="upload-demo"
      ref="upload"
      :action="uploadUrl"
      :limit="1"
      :file-list = "fileList"
      :on-exceed="handleExceed"
      :data = "uploadData"
      name="myFile"
      :accept="'.xls,.xlsx'"
      :on-change="handelUploadChange"
      :on-success="handleUploadSuccess"
      :auto-upload="false">
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload" v-show="uploadButtonVisible">上传到服务器</el-button>
      <div slot="tip" class="el-upload__tip">只能上传xls和xlsx文件,文件最大不能超过5M。
        <a class="dlink" :href="templetUrl" >下载{{special ? '专用' : ''}}模板</a>
      </div>
    </el-upload>
  </el-dialog>
</div>
</template>

<script>
import { addOrUpdateenquiryOrder, CompanyTemplet } from '@/api/planorder'
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils'
export default {
  data() {
    var checkDetail = (rule, value, callback) => {
      if (!value.length) {
        return callback(new Error('招标物品明细不能空'))
      }
      setTimeout(() => {
        callback()
      }, 300)
    }
    return {
      planform: {
        enquiryOrder: {
          customer: '', // 询价方id
          customname: '', // 查询放名称
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
          sumordernum: 0, // 数量合计
          sumamount: '', // 金额合计
          memos: '', // 备注
          customerorderno: '', // 客户订单号
          enquirydate: '', // 询价日期
          enquiryenddate: '', // 询价截止日期
          paymethod: '' // 付款方式
        },
        enquiryOrderItems: [
          // {
          //   servicer: '', // 服务商
          //   servicername: '', // 服务商名称
          //   categoryid:"402881325a5e22c4015a5f7ed3000035", // 分类id
          //   categoryname:"断路器", //分类名称
          //   itemno: '', // 行号
          //   material: '', // 川商品id
          //   materialno: '', // 川商品编码
          //   materialname: '', // 川商品名称
          //   materialrule: '', // 商品规格
          //   materialsize: '', // 商品型号
          //   materialtag: '', // 品牌
          //   orderunit: '', // 单位
          //   orderprice: '', // 单价
          //   orderamount: '', // 金额
          //   ordernum: '', // 数量
          //   warrantydate: '', // 质保期
          //   supplydate: '', // 交货日期
          //   memos: '' // 备注
          // }
        ]
      },
      rules: {
        enquiryOrder: {
          customer: [
            { required: true, message: '请选择询价方', trigger: 'blur' }
          ],
          enterprise: [
            { required: true, message: '请选报价方', trigger: 'blur' }
          ],
          enquirydate: [
            { required: true, message: '请选择询价日期', trigger: 'change' }
          ],
          enquiryenddate: [
            { required: true, message: '请选择询价截止日期', trigger: 'change' }
          ],
          paymethod: [
            { required: true, message: '请选择付款方式', trigger: 'change' }
          ]
        },
        enquiryOrderItems: [
          { validator: checkDetail, required: true, trigger: 'blur' }
        ]
      },
      dialogVisible: false,
      // uploadUrl: '/planapi/api/excel/enquiryOrder/export', // 上传路径
      uploadUrl: '/planapi/api/excel/equiryOrder/new/export',
      fileList: [],
      uploadButtonVisible: false,
      dialogTableVisible: false,
      multipleSelection: [],
      submitloading: false,
      templetUrl: '',
      special: false
    }
  },
  computed: {
    uploadData() {
      return { companyId: this.planform.enquiryOrder.customer }
    },
    sumordernum() {
      let total = 0
      this.planform.enquiryOrderItems.forEach(item => {
        if (parseFloat(item.ordernum)) {
          total = total + parseFloat(item.ordernum)
        }
      })
      return total
    },
    enterprisename() {
      let tname = ''
      if (this.gridData.length) {
        this.gridData.map(d => {
          if (d.requestid === this.planform.enquiryOrder.enterprise) {
            tname = d.name
          }
        })
      }
      return tname
    },
    customname() {
      let tname = ''
      if (this.gridData.length) {
        this.gridData.map(d => {
          if (d.requestid === this.planform.enquiryOrder.customer) {
            tname = d.name
          }
        })
      }
      return tname
    },
    ...mapGetters({
      company: 'company',
      companyId: 'companyId',
      userInfo: 'userInfo',
      visitedViews: 'visitedViews',
      revstoreList: 'storeList',
      gridData: 'gysList'
    })
  },
  filters: {
    parseTime
  },
  created() {
    // if (!this.gridData.length) {
    //   this.$store.dispatch('GetGysList').then(() => {
    //     this.planform.enquiryOrder.enterprise = this.companyId
    //   })
    // }
    this.getTemplate()
  },
  beforeRouteLeave(to, from, next) {
    this.$confirm('离开页面后输入内容将不被保存，确定离开吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      next()
    }).catch(() => {})
  },
  methods: {
    getTemplate() {
      CompanyTemplet().then(
        res => {
          console.log(res)
          this.$store.commit('SET_GYSLIST', res.data)
          this.planform.enquiryOrder.enterprise = this.companyId
        }
      ).catch(err => {
        console.log(err)
      })
    },
    customerChange(val) {
      console.log(val)
      let url = ''
      this.special = false
      this.gridData.map(d => {
        if (d.requestid === val) {
          url = d.remark
          if (d.remark) {
            this.special = true
          }
        }
      })
      this.templetUrl = url || '/static/templet/enquiry.xls'
    },
    onSubmit() {
      this.$refs['ruleForm'].validate((valid) => {
        console.log(valid)
        if (valid) {
          if (this.planform.enquiryOrder.enquirydate.getTime() >= this.planform.enquiryOrder.enquiryenddate.getTime()) {
            this.$message({
              message: '询价截止日期不能早于询价日期',
              type: 'warn'
            })
            return false
          }
          this.submitloading = true
          const view = this.visitedViews.filter(v => v.path === this.$route.path)
          const postData = JSON.parse(JSON.stringify(this.planform))
          postData.enquiryOrder.enterprisename = this.enterprisename
          postData.enquiryOrder.customname = this.customname
          postData.enquiryOrder.createuser = this.userInfo.truename
          addOrUpdateenquiryOrder(postData).then(
            res => {
              console.log(res)
              if (res.code === '200' && res.data) {
                this.$confirm('新建计划单成功！', '提示', {
                  confirmButtonText: '详情',
                  cancelButtonText: '计划单列表',
                  type: 'success'
                }).then(
                  _ => {
                    this.$store.dispatch('delVisitedViews', view[0]).then(() => {
                      this.$router.push({
                        name: 'plandetail',
                        params: {
                          ticketno: res.data
                        }
                      })
                    })
                  }
                ).catch(_ => {
                  this.$store.dispatch('delVisitedViews', view[0]).then(() => {
                    this.$router.push({
                      name: 'planorderlist'
                    })
                  })
                })
              }
              this.submitloading = false
            }
          ).catch(err => {
            console.log(err)
            this.submitloading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handelUploadChange(file, fileList) {
      // 选择文件时显示上传按钮
      if (Object.keys(file).length && fileList.length) {
        this.uploadButtonVisible = true
      } else {
        this.uploadButtonVisible = false
      }
    },
    handleUploadSuccess(res, file, fileList) {
      if (res.code === '200') {
        this.$confirm(res.message, '提示', {
          confirmButtonText: '完成',
          cancelButtonText: '继续导入',
          type: 'success'
        }).then(_ => {
          this.dialogVisible = false
        }).catch(_ => {})
        res.data.map(row => { row.edit = false })
        this.planform.enquiryOrderItems = [...this.planform.enquiryOrderItems, ...res.data]
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
      this.$refs['upload'].clearFiles()
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    handleDelete(index, row) {
      this.planform.enquiryOrderItems.splice(index, 1)
      this.$message({
        message: '成功删除一条记录！',
        type: 'success'
      })
    },
    getservicename(id) {
      let tname = ''
      if (this.gridData.length) {
        this.gridData.map(d => {
          if (d.requestid === id) {
            tname = d.name
          }
        })
      }
      return tname
    },
    editRow(row) {
      //   warrantydate: '', // 质保期
      //   supplydate: '', // 交货日期
      if (row.warrantydate) {
        row.warrantydate = parseTime(new Date(row.warrantydate), '{y}-{m}-{d}')
      }
      if (row.supplydate) {
        row.supplydate = parseTime(new Date(row.supplydate), '{y}-{m}-{d}')
      }
      row.servicername = this.getservicename(row.servicer)
      row.edit = false
    },
    goeditrow(index) {
      this.planform.enquiryOrderItems[index].edit = true
      this.planform = JSON.parse(JSON.stringify(this.planform))
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择上传 1 个文件`)
    },
    importEXL() {
      this.dialogVisible = true
    },
    addDetail() {
      this.planform.enquiryOrderItems.push(
        {
          servicer: '', // 服务商
          servicername: '', // 服务商名称
          itemno: '', // 行号
          material: '', // 川商品id
          materialno: '', // 川商品编码
          materialname: '', // 川商品名称
          materialrule: '', // 商品规格
          materialsize: '', // 商品型号
          materialtag: '', // 品牌
          orderunit: '', // 单位
          orderprice: '', // 单价
          orderamount: '', // 金额
          ordernum: 0, // 数量
          warrantydate: '', // 质保期
          supplydate: '', // 交货日期
          memos: '', // 备注
          edit: true
        }
      )
    },
    handleCurrentChange(val) {
      this.currentRow = val
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    onCancel() {
      this.$router.back()
    },
    handelDialogConfirm() {
      this.dialogTableVisible = false
      this.planform.enquiryOrder.customer = JSON.parse(JSON.stringify(this.currentRow))
    },
    handelDialogCancel() {
      this.dialogTableVisible = false
      this.planform.enquiryOrder.customer = JSON.parse(JSON.stringify({
        code: '',
        id: '',
        name: ''
      }))
    },
    delChecked() {
      const dt = this.planform.enquiryOrderItems.filter(item => {
        return !this.multipleSelection.includes(item)
      })
      this.planform.enquiryOrderItems = JSON.parse(JSON.stringify(dt))
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
