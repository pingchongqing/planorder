<template lang="html">
<div class="app-container">
  <el-form :model="planform" :rules="rules" ref="ruleForm" label-width="120px">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="报价方" prop="quotation.enterprice">
          <el-select v-model="planform.quotation.enterprice" filterable clearable placeholder="请选择" prefix-icon="el-icon-search" :disabled="type == 0">
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
        <el-form-item label="企业客户" prop="quotation.customer">
          <el-select v-model="planform.quotation.customer" filterable clearable placeholder="请选择" prefix-icon="el-icon-search" disabled>
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
        <el-form-item label="报价日期" prop="quotation.quotationdate">
          <el-date-picker
            v-model="planform.quotation.quotationdate"
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
        <el-form-item label="关联计划单单号" prop="quotation.fromorderno">
          <el-input :disabled="true" v-model="planform.quotation.fromorderno"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <div class="itemscont">
      <h3>
        报价单明细
      </h3>
      <el-form-item label-width="0" prop="quotationItems">
        <el-table
          :data="planform.quotationItems"
          style="width: 100%"
          border
          max-height="600">
          <el-table-column
            label="序号"
            width="55">
            <template slot-scope="scope">
              <span >{{ scope.row.itemno }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="物料名称"
            width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.materialname }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="品牌"
            width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.materialtag }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="规格"
            width="200">
            <template slot-scope="scope">
              <span >{{ scope.row.materialrule }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="型号"
            width="200">
            <template slot-scope="scope">
              <span>{{ scope.row.materialsize }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="数量"
            width="80">
            <template slot-scope="scope">
              <span >{{ scope.row.ordernum }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="单位"
            width="80">
            <template slot-scope="scope">
              <span >{{ scope.row.orderunit }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="质保期"
            width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.warrantydate }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="供货期"
            width="100">
            <template slot-scope="scope">
              <span >{{ scope.row.supplydate }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="供应商"
            width="100">
            <template slot-scope="scope">
              <span >{{ scope.row.servvicername }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.memos }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="价格"
            fixed="right"
            width="100">
            <template slot-scope="scope">
              <el-input v-if="scope.row.edit" type="number" v-model="scope.row.price" ></el-input>
              <span v-else>{{ scope.row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="120">
            <template slot-scope="scope">
              <el-button v-if="scope.row.edit" type="success" @click="editRow(scope.row)" size="mini" >确定</el-button>
              <el-button v-else @click="goeditrow(scope.$index)" size="mini" >报价</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </div>
    <el-form-item label-width="0">
      <el-button type="primary" @click="onSubmit" v-loading="submitloading">提交报价单</el-button>
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
import { addOrUpdateQuotationOrder, GetEnquiryInfo } from '@/api/planorder'
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
          if (!v.price) {
            return callback(new Error('请输入报价价格'))
          }
        })
        callback()
      }, 300)
    }
    return {
      type: this.$route.params.type, // 登记客户报价单位0，登记服务商报价单1）
      planform: {
        quotation: {
          checkadvice: '', // 审核意见
          checkdate: '', // 审核日期
          checkuser: '', // 审核人
          createdate: '', // 创建日期
          createuser: '', // 创建人
          customer: '', // 被报价企业ID
          customername: '', // 被报价企业名称
          enterprice: '', // 供应商ID
          enterpricename: '', // 供应商名称
          fromorderno: this.$route.params.enquiryorder, // 来源计划单
          isdelete: 0, // 是否删除
          memos: '', // 备注
          quotationdate: '', // 报价日期
          status: 0, // 状态--1（草稿） 0（待审核） 1(确认通过) -2（ 驳回 ）
          sumamount: 0, // 金额合计
          ticketno: ''
        },
        quotationItems: [
          // {
          //   amount: 0, // 金额
          //   categoryno: '', // 分类编号
          //   custommaterialno: '', // 客户商品编码
          //   department: '', // 使用部门
          //   description: '', // 描述
          //   fromitemno: '', // 计划单号id
          //   itemno: '', // 序号
          //   materialname: '', // 商品名称
          //   materialno: '', // 商品编码
          //   materialrule: '', // 规格
          //   materialsize: '', // 型号
          //   materialtag: '', // 品牌
          //   memos: '', // 备注
          //   ordernum: 0, // 数量
          //   orderunit: '', // 单位
          //   price: 0, // 价格
          //   supplydate: '', // 交货日期
          //   warrantydate: '' // 保质期
          // }
        ]
      },
      rules: {
        quotation: {
          quotationdate: [
            { required: true, message: '请选择到货日期', trigger: 'change' }
          ],
          enterprice: [
            { required: true, message: '请选择报价方', trigger: 'change' }
          ]
        },
        quotationItems: [
          { validator: checkDetail, required: true, trigger: 'blur' }
        ]
      },
      dialogVisible: false,
      uploadUrl: '/planapi/excel/quotation/export', // 上传路径
      fileList: [],
      uploadButtonVisible: false,
      dialogTableVisible: false,
      currentRow: {},
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
        }
      ],
      enquiryData: []
    }
  },
  computed: {
    sumamount() {
      let total = 0
      this.planform.quotationItems.forEach(item => {
        total += parseInt(item.price * 100) / 100
      })
      return total
    },
    sumordernum() {
      let total = 0
      this.planform.quotationItems.forEach(item => {
        total += item.ordernum
      })
      return total
    },
    enterprisename() {
      let tname = ''
      if (this.gridData.length) {
        this.gridData.map(d => {
          if (d.ticketno === this.planform.quotation.enterprise) {
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
          if (d.ticketno === this.planform.quotation.customer) {
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
    if (!this.$route.params.enquiryorder) {
      this.$alert('请先选择计划单再创建报价单').then(_ => {
        this.$router.push({
          name: 'planorderlist'
        })
      })
    }
    this.getEnquiryInfo()
  },
  methods: {
    getEnquiryInfo() {
      GetEnquiryInfo({
        ticketno: this.$route.params.enquiryorder,
        flag: this.type // 标志（登记客户报价单位0，登记服务商报价单1）
      }).then(
        res => {
          res.data.quotationItems.forEach(d => { d.edit = true })
          this.planform = res.data
        }
      ).catch(err => {
        console.log(err)
      })
    },
    onSubmit() {
      this.$refs['ruleForm'].validate((valid) => {
        console.log(valid)
        if (valid) {
          this.submitloading = true
          const postData = JSON.parse(JSON.stringify(this.planform))
          if (!postData.quotation.customername) {
            postData.quotation.customername = this.customername
          }
          postData.quotation.createuser = this.userInfo.truename
          postData.quotation.quotationdate = parseTime(this.planform.quotation.quotationdate)
          postData.quotation.sumamount = this.sumamount
          addOrUpdateQuotationOrder(postData).then(
            res => {
              console.log(res)
              const view = this.visitedViews.filter(v => v.path === this.$route.path)
              if (res.code === '200' && res.data) {
                this.$confirm('创建报价单成功', '提示', {
                  confirmButtonText: '继续',
                  cancelButtonText: '关闭',
                  type: 'success'
                }).then(
                  _ => {
                    this.$store.dispatch('delVisitedViews', view[0]).then(() => {
                      this.$router.push({
                        name: 'planorderlist'
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
        this.planform.quotationItems = [...this.planform.quotationItems, ...res.data]
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
      this.planform.quotationItems.splice(index, 1)
      this.$message({
        message: '成功删除一条记录！',
        type: 'success'
      })
    },
    editRow(row) {
      row.edit = false
    },
    goeditrow(index) {
      this.planform.quotationItems[index].edit = true
      this.planform = JSON.parse(JSON.stringify(this.planform))
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择上传 1 个文件`)
    },
    importEXL() {
      this.dialogVisible = true
    },
    addDetail() {
      this.planform.quotationItems.push(
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
      this.planform = {
        quotation: {},
        quotationItems: []
      }
    },
    handelDialogConfirm() {
      this.dialogTableVisible = false
      this.planform.quotation.customer = JSON.parse(JSON.stringify(this.currentRow))
    },
    handelDialogCancel() {
      this.dialogTableVisible = false
      this.planform.quotation.customer = JSON.parse(JSON.stringify({
        code: '',
        id: '',
        name: ''
      }))
    },
    delChecked() {
      const dt = this.planform.quotationItems.filter(item => {
        return !this.multipleSelection.includes(item)
      })
      this.planform.quotationItems = JSON.parse(JSON.stringify(dt))
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
