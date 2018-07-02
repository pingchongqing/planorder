<template lang="html">
  <div class="app-container">
    <el-form :model="paymentform" :rules="rules" ref="ruleForm" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="款项类型" prop="payment.fundnature">
            <el-select v-model="paymentform.payment.fundnature" filterable clearable placeholder="请选择款项类型" prefix-icon="el-icon-search">
              <el-option
                v-for="item in fundnature"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-if="paymentform.payment.fundnature == 1">
        <el-col :span="8">
          <el-form-item label="关联采购单" prop="payment.purchorder">
            <el-input type="text"  prefix-icon="el-icon-search" @focus="purchorderFocus" v-model="paymentform.payment.purchorder"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同编号" prop="payment.contractno">
            <el-input type="text" v-model="paymentform.payment.contractno"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="收款方" prop="payment.receivables">
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
      </el-row>
      <el-row :gutter="20">
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
          <el-form-item label="本次付款金额" prop="payment.payamount">
            <el-input type="text" v-model="paymentform.payment.payamount"></el-input>
            <span v-if="paymentform.payment.fundnature == 1 && paymentform.payment.purchorder">该笔采购订单应付{{paymentform.payment.residualamount}}元</span>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="上传附件" prop="payment.enclosure">
            <el-button
              size="mini"
              type="primary"
              @click="importFile">
              {{paymentform.payment.enclosure ? '重新上传' : '上传附件'}}
            </el-button>
            <span>{{paymentform.payment.enclosure}}</span>
            <el-button type="text" v-show="paymentform.payment.enclosure" @click="delenclosure">删除</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form-item label="备注" prop="payment.memos">
            <el-input type="textarea" v-model="paymentform.payment.memos" rows='5'></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-form-item >
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
        :before-upload="beforeUpload"
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
    <el-dialog
      title="选择采购单"
      :visible.sync="orderchoiceshow"
      center
      width="80%">
      <orderchoice @subOrder="subOrder" @diClose="diClose"></orderchoice>
    </el-dialog>
  </div>
</template>

<script>
  import { addOrUpdatePayment, getPaymentDetail } from '@/api/payment'
  import { mapGetters } from 'vuex'
  import { parseTime, SettlementMethod } from '@/utils'
  import orderchoice from './Component/orderchoice'
  export default {
    components: {
      orderchoice
    },
    data() {
      var checkDetail = (rule, value, callback) => {
        if (value.length > 15) {
          return callback(new Error('长度不能大于15'))
        }
        if (value <= 0) {
          return callback(new Error('输入值需大于0'))
        }
        if (!parseFloat(value)) {
          return callback(new Error('请输入数字'))
        }
        if (this.paymentform.payment.fundnature === '1' && parseFloat(value) > this.paymentform.payment.residualamount) {
          return callback(new Error('付款金额不能超过应付金额'))
        }
        callback()
      }
      return {
        paymentform: {
          payment: {
            createuser: '', // 创建人
            enclosure: '', // 金额
            enterprise: '', // 企业
            enterprisename: '', // 企业名称
            fundnature: '', // 款项性质 1货款 2服务费
            memos: '', // 备注
            payamount: '', // 付款金额
            contractno: '', // 合同编号
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
              { validator: checkDetail, required: true, trigger: 'blur' }
            ],
            contractno: [
              { required: true, message: '请输入合同编号', trigger: 'blur' }
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
            value: 1
          },
          {
            name: '服务费',
            value: 2
          },
          {
            name: '投标保证金',
            value: 3
          }
        ],
        settlementmethod: SettlementMethod,
        orderchoiceshow: false
      }
    },
    computed: {
      getEntName() {
        let tname = ''
        if (this.gridData.length) {
          this.gridData.map(d => {
            if (d.requestid === this.paymentform.payment.enterprise) {
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
      if (this.$route.query.id) {
        this.getDetail(this.$route.query.id)
      }
    },
    methods: {
      beforeUpload(file) {
        // 如果上传文件大于5M
        if (file.size > 5000 * 1000) {
          this.$message.error('上传附件不能大于5M')
          this.$refs.upload.abort()
        }
      },
      delenclosure() {
        this.paymentform.payment.enclosure = ''
      },
      getDetail(id) {
        getPaymentDetail({
          ticketno: id
        }).then(res => {
          this.paymentform.payment = res.data.data[0]
          console.log(res)
        }).catch(err => {
          console.log(err)
        })
      },
      subOrder(row) {
        let currow = {}
        if (row && Object.keys(row).length) {
          currow = row
        }
        this.paymentform.payment.purchorder = currow.ticketno
        this.paymentform.payment.contractno = currow.contractno
        this.paymentform.payment.receivables = currow.servicer
        this.paymentform.payment.residualamount = currow.residualamount
        this.paymentform.payment.enterprise = currow.enterprise
        this.paymentform.payment.enterprisename = currow.enterprisename
      },
      purchorderFocus() {
        this.orderchoiceshow = true
      },
      diClose() {
        this.orderchoiceshow = false
      },
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
                  this.$confirm('操作成功！', '提示', {
                    confirmButtonText: '详情',
                    cancelButtonText: '关闭',
                    type: 'success'
                  }).then(
                    _ => {
                      this.$store.dispatch('delVisitedViews', view[0]).then(() => {
                        this.$router.push({
                          name: 'paymentdetail',
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
