<template lang="html">
  <div class="app-container">
    <el-form :model="paymentform" :rules="rules" ref="ruleForm" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="关联采购单" prop="payment.purchorder">
            <el-input type="text" v-model="paymentform.payment.purchorder"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="本次付款金额" prop="payment.payamount">
            <el-input type="text" v-model="paymentform.payment.payamount"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="付款日期" prop="payment.paydate">
            <el-date-picker
              v-model="paymentform.payment.paydate"
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
          <el-form-item label="收款客户" prop="payment.receivables">
            <el-select v-model="paymentform.payment.receivables" filterable clearable placeholder="请选择收款客户" prefix-icon="el-icon-search">
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
          <el-form-item label="款项性质" prop="payment.fundnature">
            <el-select v-model="paymentform.payment.fundnature" filterable clearable placeholder="请选择款项性质" prefix-icon="el-icon-search">
              <el-option
                v-for="item in fundnature"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="结算方式" prop="payment.settlementmethod">
            <el-select v-model="paymentform.payment.settlementmethod" filterable clearable placeholder="请选择结算方式" prefix-icon="el-icon-search">
              <el-option
                v-for="item in settlementmethod"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="上传附件" prop="payment.enclosure">
            <el-button
              size="mini"
              type="primary"
              @click="importFile">
              {{paymentform.payment.enclosure ? '重新上传' : '上传附件'}}
            </el-button>
              {{paymentform.payment.enclosure}}
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="备注" prop="payment.memos">
            <el-input type="text" v-model="paymentform.payment.memos"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-form-item label-width="0">
          <el-button type="primary" @click="onSubmit" v-loading="submitloading">新建付款单</el-button>
          <el-button @click="onCancel">取消</el-button>
        </el-form-item>
      </el-row>
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
        name="myFile"
        :on-change="handelUploadChange"
        :on-success="handleUploadSuccess"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload" v-show="uploadButtonVisible">上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">只能上传1个文件,文件最大不能超过5M。 </div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
  import { addOrUpdatePayment } from '@/api/payment'
  import { mapGetters } from 'vuex'
  import { parseTime } from '@/utils'

  export default {
    data() {
      return {
        paymentform: {
          payment: {
            createuser: '', // 创建人
            enclosure: '', // 金额
            enterprice: '', // 企业
            enterpricename: '', // 企业名称
            fundnature: '', // 款项性质 1货款 2服务费
            memos: '', // 备注
            payamount: '', // 付款金额
            paydate: '', // 付款日期
            payer: '', // 付款人
            payername: '', // 付款人姓名
            purchorder: '', // 采购单
            receivables: '', // 收款方
            receivablesname: '', // 收款方名称
            settlementmethod: '', // 结算方式 1现金 2银行转账 3银行承兑 4商业承兑
            status: '0' // 状态
          }
        },
        rules: {
          payment: {
            paydate: [
              { required: true, message: '请选择付款日期', trigger: 'change' }
            ],
            fundnature: [
              { required: true, message: '请选择款项性质', trigger: 'blur' }
            ],
            payamount: [
              { required: true, message: '请输入付款金额', trigger: 'blur' }
            ],
            receivables: [
              { required: true, message: '请选择收款方名称', trigger: 'change' }
            ],
            purchorder: [
              { required: true, message: '请输入采购单', trigger: 'change' }
            ],
            settlementmethod: [
              { required: true, message: '请选择结算方式', trigger: 'change' }
            ]
          }
        },
        dialogVisible: false,
        uploadUrl: '/planapi/api/fileupload/getfile', // 上传路径
        fileList: [],
        uploadButtonVisible: false,
        dialogTableVisible: false,
        multipleSelection: [],
        submitloading: false,
        fundnature: [
          {
            name: '货款',
            value: '1'
          },
          {
            name: '服务费',
            value: '2'
          }
        ],
        settlementmethod: [
          {
            name: '现金',
            value: '1'
          },
          {
            name: '银行转账',
            value: '2'
          },
          {
            name: '银行承兑',
            value: '3'
          },
          {
            name: '商业承兑',
            value: '4'
          }
        ]
      }
    },
    computed: {
      getEntName() {
        let tname = ''
        if (this.gridData.length) {
          this.gridData.map(d => {
            if (d.requestid === this.paymentform.payment.enterprice) {
              tname = d.name
            }
          })
        }
        return tname
      },
      getCusname() {
        let tname = ''
        if (this.gridData.length) {
          this.gridData.map(d => {
            if (d.requestid === this.paymentform.payment.receivables) {
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
      if (!this.gridData.length) {
        this.$store.dispatch('GetGysList')
      }
    },
    methods: {
      importFile() {
        this.dialogVisible = true
      },
      submitUpload() {
        this.$refs.upload.submit()
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择上传 1 个文件`)
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
          this.$message({
            message: '上传附件成功~',
            type: 'success'
          })
          this.dialogVisible = false
          this.paymentform.payment.enclosure = res.data
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
        this.$refs['upload'].clearFiles()
      },
      onSubmit() {
        this.$refs['ruleForm'].validate((valid) => {
          console.log(valid)
          if (valid) {
            this.submitloading = true
            const view = this.visitedViews.filter(v => v.path === this.$route.path)
            const postData = JSON.parse(JSON.stringify(this.paymentform))
            postData.payment.enterprice = this.companyId
            postData.payment.enterpricename = this.company
            postData.payment.payer = this.companyId
            postData.payment.payername = this.company
            postData.payment.receivablesname = this.getCusname
            postData.payment.paydate = parseTime(this.paymentform.payment.paydate)
            postData.payment.createuser = this.userInfo.truename
            console.log('send data: ' + JSON.stringify(postData))
            addOrUpdatePayment(postData.payment).then(
              res => {
                console.log(res)
                if (res.code === '200' && res.data) {
                  this.$confirm('新建付款单成功！', '提示', {
                    confirmButtonText: '详情',
                    cancelButtonText: '关闭',
                    type: 'success'
                  }).then(
                    _ => {
                      this.$store.dispatch('delVisitedViews', view[0]).then(() => {
                        this.$router.push({
                          name: 'payrecorddetail',
                          params: {
                            ticketno: res.data
                          }
                        })
                      })
                    }
                  ).catch(_ => {
                    this.$store.dispatch('delVisitedViews', view[0]).then(() => {
                      this.$router.push('/')
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
      onCancel() {
        this.paymentform = {
          payment: {}
        }
      }
    }
  }
</script>

<style scoped>
  .line {
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
