<template lang="html">
<div class="app-container">
  <el-form :model="planform" :rules="rules" ref="ruleForm" label-width="120px">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="计划收货日期" prop="saleOrder.planarrivedate">
          <el-date-picker
            v-model="planform.saleOrder.planarrivedate"
            type="datetime"
            :editable="false"
            placeholder="选择日期时间"
            align="right">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="收货人电话" prop="saleOrder.linktel">
          <el-input type="number" v-model="planform.saleOrder.linktel" ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="交货地址" prop="saleOrder.receiveaddress">
          <el-input type="text" v-model="planform.saleOrder.receiveaddress" ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="收货人" prop="saleOrder.linkusername">
          <el-input type="text" v-model="planform.saleOrder.linkusername" ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="收款方式" prop="saleOrder.recmethod">
          <el-select v-model="planform.saleOrder.recmethod" placeholder="请选择">
            <!-- <el-option label="全部" value="0" ></el-option> -->
            <el-option label="货到收款" value="1" ></el-option>
            <el-option label="预收款" value="2" ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="客户" prop="saleOrder.customer">
          <el-select v-model="planform.saleOrder.customer" filterable clearable placeholder="请选择" size="100%" prefix-icon="el-icon-search">
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
    <el-row>
      <el-col :span="8">
        <el-form-item label="合同编号" prop="saleOrder.contractno">
          <el-input  v-model="planform.saleOrder.contractno"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="交货方式" prop="saleOrder.deliverway">
          <el-select v-model="planform.saleOrder.deliverway" filterable clearable placeholder="请选择" prefix-icon="el-icon-search">
            <el-option
              v-for="item in deliverway"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="发出仓库" prop="saleOrder.store" v-if="planform.saleOrder.deliverway == 1">
          <el-select v-model="planform.saleOrder.store" filterable clearable placeholder="发出仓库" prefix-icon="el-icon-search">
            <el-option
              v-for="item in revstoreList"
              :key="item.id"
              :label="item.storename"
              :value="item.requestid">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="来源计划单号" prop="saleOrder.enquiryorder">
          <el-input :disabled="true" v-model="planform.saleOrder.enquiryorder"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <div class="itemscont">
      <h3>
        销售单明细
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
      <el-form-item label-width="0" prop="saleOrderItems">
        <el-table
          :data="planform.saleOrderItems"
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
            label="商品编码"
            width="120">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-input class="edit-input" size="small" v-model="scope.row.custommaterialno"></el-input>
              </template>
              <span v-else>{{ scope.row.custommaterialno }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="商品名称"
            width="120">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-input class="edit-input" size="small" v-model="scope.row.materialname"></el-input>
              </template>
              <span v-else>{{ scope.row.materialname }}</span>
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
            label="销售数量"
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
            label="销售单价"
            width="100">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-input class="edit-input" size="small" v-model="scope.row.saleprice"></el-input>
              </template>
              <span v-else>{{ scope.row.saleprice }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="销售金额"
            width="100">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-input class="edit-input" size="small" v-model="scope.row.orderamount"></el-input>
              </template>
              <span v-else>{{ scope.row.orderamount }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="税率"
            width="100">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-input class="edit-input" size="small" v-model="scope.row.taxrate"></el-input>
              </template>
              <span v-else>{{ scope.row.taxrate }}</span>
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
      <el-button type="primary" @click="onSubmit" v-loading="submitloading">{{$route.query.id ? '修改销售单' : '新建销售单'}}</el-button>
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
      name="myFile"
      :accept="'.xls,.xlsx'"
      :on-change="handelUploadChange"
      :on-success="handleUploadSuccess"
      :auto-upload="false">
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload" v-show="uploadButtonVisible">上传到服务器</el-button>
      <div slot="tip" class="el-upload__tip">只能上传xls和xlsx文件,文件最大不能超过5M。
        <a class="dlink" href="/static/templet/saletemplet.xls" >下载模板</a>
      </div>
    </el-upload>
  </el-dialog>
</div>
</template>

<script>
import { addOrUpdateSaleOrder, SaleDetailInfo } from '@/api/planorder'
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils'
export default {
  data() {
    var checkDetail = (rule, value, callback) => {
      if (!value.length) {
        return callback(new Error('招标物品明细不能空'))
      }
      setTimeout(() => {
        value.forEach(v => {
          if (!v.orderunit) {
            return callback(new Error('请输入单位'))
          }
          if (!v.materialname) {
            return callback(new Error('请输入商品名称'))
          }
        })
        callback()
      }, 300)
    }
    return {
      planform: {
        saleOrder: {
          ticketno: '', // 订单号
          customer: this.$route.query.customer, // 客户id
          customername: '', // 客户名称
          planarrivedate: '', // 计划收货日期
          sumordernum: '', // 数量
          sumorderamount: '', // 金额
          sumsendnum: '', // 已发数量
          contractno: '', // 合同编号
          status: '', // 单据状态 --1（草稿） 0（待审核） 1(确认通过) -2（ 驳回 ）
          createuser: '', // 创建人
          createdate: '', // 创建日期
          createtime: '', // 创建时间
          checkuser: '', // 审核人
          checkdate: '', // 审核日期
          checktime: '', // 审核时间
          checkadvice: '', // 审核意见
          enterprise: '', // //企业id（裕达）
          enterprisename: '', // 企业名称（裕达）
          recmethod: '', // 收款方式
          deliverway: '', // 交货方式  1、库发  2、供应商直发
          receiveaddress: '', // 收货地址
          linkusername: '', // 收货联系人
          linktel: '', // 收货联系电话
          customerorderno: '', // 客户订单号
          sumtaxamount: '', // 税额
          store: '', // 发出仓库
          storename: '', // 发出仓库
          closed: '', // 完结标示
          memos: '', // 备注
          enquiryorder: this.$route.params.enquiryorder // 来源计划单号
        },
        saleOrderItems: [
          // {
          //   material: '', // 川商品id
          //   materialno: '', // 川商品编码
          //   custommaterialno: '',
          //   materialname: '', // 川商品名称
          //   materialrule: '', // 商品规格
          //   materialsize: '', // 商品型号
          //   materialtag: '', // 品牌
          //   orderunit: '', // 单位
          //   taxrate: '', // 税率（%）
          //   taxamount: '', // 税额
          //   ordernum: '', // 数量
          //   sendnum: '', // 已发数量
          //   saleprice: '', // 销售单价
          //   orderamount: '', // 销售金额
          //   closedcode: '' // 完成标示
          // }
        ]
      },
      rules: {
        saleOrder: {
          planarrivedate: [
            { required: true, message: '请选择到货日期', trigger: 'change' }
          ],
          linktel: [
            { required: true, message: '收货人电话', trigger: 'change' }
          ],
          receiveaddress: [
            { required: true, message: '请输入交货地址', trigger: 'blur' }
          ],
          contractno: [
            { required: true, message: '请输入合同编号', trigger: 'blur' }
          ],
          linkusername: [
            { required: true, message: '请输入收货人', trigger: 'blur' }
          ],
          deliverway: [
            { required: true, message: '请选择交货方式', trigger: 'change' }
          ],
          customer: [
            { required: true, message: '请选择客户', trigger: 'change' }
          ],
          recmethod: [
            { required: true, message: '请选择付款方式', trigger: 'change' }
          ],
          store: [
            { required: true, message: '请选择发货仓库', trigger: 'change' }
          ]
        },
        saleOrderItems: [
          { validator: checkDetail, required: true, trigger: 'blur' }
        ]
      },
      dialogVisible: false,
      uploadUrl: '/planapi/api/excel/saleOrder/export', // 上传路径
      fileList: [],
      uploadButtonVisible: false,
      dialogTableVisible: false,
      multipleSelection: [],
      submitloading: false,
      deliverway: [
        {
          name: '库发',
          value: '1'
        },
        {
          name: '供应商直发',
          value: '2'
        },
        {
          name: '自提',
          value: '3'
        }
      ],
      fetchSuccess: true
    }
  },
  computed: {
    sumorderamount() {
      let total = 0
      this.planform.saleOrderItems.forEach(item => {
        total += item.ordernum * item.saleprice
      })
      return total
    },
    sumordernum() {
      let total = 0
      this.planform.saleOrderItems.forEach(item => {
        total += item.ordernum
      })
      return total
    },
    enterprisename() {
      let tname = ''
      if (this.gridData.length) {
        this.gridData.map(d => {
          if (d.requestid === this.planform.saleOrder.enterprise) {
            tname = d.name
          }
        })
      }
      return tname
    },
    customername() {
      let tname = ''
      if (this.gridData.length) {
        this.gridData.map(d => {
          if (d.requestid === this.planform.saleOrder.customer) {
            tname = d.name
          }
        })
      }
      return tname
    },
    storename() {
      let tname = ''
      if (this.revstoreList.length) {
        this.revstoreList.map(d => {
          if (d.requestid === this.planform.saleOrder.store) {
            tname = d.storename
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
    if (!this.revstoreList.length) {
      this.$store.dispatch('GetStoreList')
    }
    if (!this.$route.params.enquiryorder) {
      this.$alert('请先选择计划单再创建销售单').then(_ => {
        this.$router.push({
          name: 'planorderlist'
        })
      })
    }
    if (this.$route.query.id) {
      this.getDetail()
    }
    this.getplanInfo()
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
    getplanInfo() {

    },
    getDetail() {
      SaleDetailInfo({ ticketno: this.$route.query.id }).then(
        res => {
          console.log(res)
          this.planform = res.data
          this.fetchSuccess = true
        }
      ).catch(err => {
        console.log(err)
        this.fetchSuccess = false
      })
    },
    onSubmit() {
      this.$refs['ruleForm'].validate((valid) => {
        console.log(valid)
        if (valid) {
          this.submitloading = true
          const view = this.visitedViews.filter(v => v.path === this.$route.path)
          const postData = JSON.parse(JSON.stringify(this.planform))
          postData.saleOrder.customername = this.customername
          postData.saleOrder.createuser = this.userInfo.truename
          postData.saleOrder.planarrivedate = parseTime(this.planform.saleOrder.planarrivedate)
          postData.saleOrder.sumorderamount = this.sumorderamount
          postData.saleOrder.storename = this.storename
          addOrUpdateSaleOrder(postData).then(
            res => {
              console.log(res)
              if (res.code === '200' && res.data) {
                this.$confirm('新建销售单成功！', '提示', {
                  confirmButtonText: '详情',
                  cancelButtonText: '关闭',
                  type: 'success'
                }).then(
                  _ => {
                    this.$store.dispatch('delVisitedViews', view[0]).then(() => {
                      this.$router.push({
                        name: 'saleorderdetail',
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
        this.planform.saleOrderItems = [...this.planform.saleOrderItems, ...res.data]
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
      this.planform.saleOrderItems.splice(index, 1)
      this.$message({
        message: '成功删除一条记录！',
        type: 'success'
      })
    },
    editRow(row) {
      row.edit = false
    },
    goeditrow(index) {
      this.planform.saleOrderItems[index].edit = true
      this.planform = JSON.parse(JSON.stringify(this.planform))
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择上传 1 个文件`)
    },
    importEXL() {
      this.dialogVisible = true
    },
    addDetail() {
      this.planform.saleOrderItems.push(
        {
          material: '', // 川商品id
          materialno: '', // 川商品编码
          materialname: '', // 川商品名称
          materialrule: '', // 商品规格
          materialsize: '', // 商品型号
          materialtag: '', // 品牌
          orderunit: '', // 单位
          taxrate: '', // 税率（%）
          taxamount: '', // 税额
          ordernum: '', // 数量
          sendnum: '', // 已发数量
          saleprice: '', // 销售单价
          orderamount: '', // 销售金额
          closedcode: '' // 完成标示
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
      this.planform.saleOrder.customer = JSON.parse(JSON.stringify(this.currentRow))
    },
    handelDialogCancel() {
      this.dialogTableVisible = false
      this.planform.saleOrder.customer = JSON.parse(JSON.stringify({
        code: '',
        id: '',
        name: ''
      }))
    },
    delChecked() {
      const dt = this.planform.saleOrderItems.filter(item => {
        return !this.multipleSelection.includes(item)
      })
      this.planform.saleOrderItems = JSON.parse(JSON.stringify(dt))
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
