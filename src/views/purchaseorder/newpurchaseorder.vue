<template lang="html">
<div class="app-container">
  <el-form :model="planform" :rules="rules" ref="ruleForm" label-width="120px">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="计划到货日期" prop="purchorder.planarrivedate">
          <el-date-picker
            v-model="planform.purchorder.planarrivedate"
            type="datetime"
            :editable="false"
            placeholder="选择日期时间"
            align="right">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="供应商" prop="purchorder.servicer">
          <el-select v-model="planform.purchorder.servicer" filterable clearable placeholder="请选择" size="100%" prefix-icon="el-icon-search">
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
        <el-form-item label="合同编号" prop="purchorder.contractno">
          <el-input v-model="planform.purchorder.contractno"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="收货人" prop="purchorder.linkusername">
          <el-input type="text" v-model="planform.purchorder.linkusername" ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="收货人电话" prop="purchorder.linktel">
          <el-input type="number" v-model="planform.purchorder.linktel" ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="收货地址">
          <el-input v-model="planform.purchorder.receiveaddress" ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="付款方式" prop="purchorder.paymethod">
          <el-select v-model="planform.purchorder.paymethod" placeholder="请选择">
            <el-option
              v-for="item in paymethod"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="交货方式" prop="purchorder.deliverway">
          <el-select v-model="planform.purchorder.deliverway" filterable clearable placeholder="请选择" prefix-icon="el-icon-search">
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
        <el-form-item label="到达仓库" prop="purchorder.revstore" v-if="planform.purchorder.deliverway == 1">
          <el-select v-model="planform.purchorder.revstore" filterable clearable placeholder="到达仓库" prefix-icon="el-icon-search">
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
        <el-form-item label="来源计划单号" prop="purchorder.ticketno">
          <el-input :disabled="true" v-model="planform.purchorder.enquiryorder"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <div class="itemscont">
      <h3>
        采购单明细
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
          type="primary"
          @click="addProduct">
          新增商品
        </el-button>
        <el-button
          size="mini"
          type="warning"
          v-show="multipleSelection.length"
          @click="delChecked">
          删除选中
        </el-button>
      </h3>
      <el-form-item label-width="0" prop="purchorderItems">
        <el-table
          :data="planform.purchorderItems"
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
            label="采购单价"
            width="100">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-input class="edit-input" size="small" v-model="scope.row.orderprice"></el-input>
              </template>
              <span v-else>{{ scope.row.orderprice }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="采购金额"
            width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.orderprice*scope.row.ordernum }}</span>
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
      <el-button type="primary" @click="onSubmit" v-loading="submitloading">{{$route.query.id ? '修改采购单' : '新建采购单'}}</el-button>
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
        <a class="dlink" href="/static/templet/createpurchose.xls" >下载模板</a>
      </div>
    </el-upload>
  </el-dialog>
  <el-dialog
    title="选择商品"
    :visible.sync="productvisible"
    center
    width="80%">
    <productchoice @subProduct="subProduct" @diClose="diClose"></productchoice>
  </el-dialog>
</div>
</template>

<script>
import { addOrUpdatePurchaseOrder, PurchorderDetail } from '@/api/planorder'
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils'
import productchoice from '@/views/tableComponent/product'
export default {
  components: {
    productchoice
  },
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
        purchorder: {
          ticketno: '', // 订单号
          customer: '', // 客户id
          customername: '', // 客户名称
          servicer: '', // 服务商
          servicername: '', // 服务商名称
          enterprise: '', // 平台企业 （裕大）
          enterprisename: '', // 平台企业 （裕大）
          createuser: '', // 创建人
          createdate: '', // 创建日期
          status: '', // -2（ 驳回 ） -1（草稿） 0（待审核）1（确认通过）
          checkuser: '', // 审核人
          checkdate: '', // 审核日期
          checkadvice: '', // 审核意见
          sumordernum: '', // 数量合计
          sumfactrecnum: '', // 已收数量
          sumamount: '', // 金额合计
          contractno: '', // 合同编号
          memos: '', // 备注
          customerorderno: '', // 合同号
          linkusername: '', // 收货联系人
          linktel: '', // 收货联系电话
          receiveaddress: '', // 收货地址
          revstore: '', // 到达仓库
          revstorename: '', // 到达仓库名称
          tkttype: '', // 单别
          fromorderno: '', // 来源单号
          planarrivedate: '', // 计划到达日期
          deliverway: '', // 交货方式 1库发  2供应商直发
          applyuser: '', // 订货人
          sumpackunitnum: '', // 包装数量合计
          closed: '', // 完结标识  0未完结 1完结
          rate: '', // 税率（%）
          paymethod: '', // 付款方式 1货到付款2预付款
          enquiryorder: '' // 来源计划单号
        },
        purchorderItems: [
          // {
          //   material: '', // 川商品id
          //   materialno: '', // 川商品编码
          //   materialname: '', // 川商品名称
          //   custommaterialno: '',
          //   materialrule: '', // 商品规格
          //   materialsize: '', // 商品型号
          //   materialtag: '', // 品牌
          //   orderunit: '', // 单位
          //   orderprice: '', // 单价
          //   orderamount: '', // 金额
          //   ordernum: '', // 数量
          //   factendnum: '', // 已收数量
          //   taxrate: '', // 税率（%）
          //   memos: '' // 备注
          // }
        ]
      },
      rules: {
        purchorder: {
          planarrivedate: [
            { required: true, message: '请选择到货日期', trigger: 'change' }
          ],
          linktel: [
            { required: true, message: '收货人电话', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ],
          contractno: [
            { required: true, message: '请输入合同编号', trigger: 'blur' },
            { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
          ],
          linkusername: [
            { required: true, message: '请输入收货人', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ],
          deliverway: [
            { required: true, message: '请选择交货方式', trigger: 'change' }
          ],
          servicer: [
            { required: true, message: '请选择供应商', trigger: 'change' }
          ],
          paymethod: [
            { required: true, message: '请选择付款方式', trigger: 'change' }
          ],
          revstore: [
            { required: true, message: '请选择到达仓库', trigger: 'change' }
          ]
        },
        purchorderItems: [
          { validator: checkDetail, required: true, trigger: 'blur' }
        ]
      },
      dialogVisible: false,
      uploadUrl: '/planapi/api/excel/purchOrder/export', // 上传路径
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
      productvisible: false,
      paymethod: [
        {
          name: '货到付款',
          value: '1'
        },
        {
          name: '货到票到付款',
          value: '2'
        },
        {
          name: '先款后货',
          value: '3'
        }
      ]
    }
  },
  computed: {
    sumordernum() {
      let total = 0
      this.planform.purchorderItems.forEach(item => {
        total += item.ordernum
      })
      return total
    },
    storename() {
      let tname = ''
      if (this.revstoreList.length) {
        this.revstoreList.map(d => {
          if (d.requestid === this.planform.purchorder.revstore) {
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
    if (!this.revstoreList.length) {
      this.$store.dispatch('GetStoreList')
    }
    if (!this.gridData.length) {
      this.$store.dispatch('GetGysList')
    }
    if (!this.$route.params.enquiryorder) {
      this.$alert('请先选择计划单再创建采购单').then(_ => {
        this.$router.push({
          name: 'planorderlist'
        })
      })
    }
    if (this.$route.query.id) {
      this.getDetail()
    }
    this.planform.purchorder.enquiryorder = this.$route.params.enquiryorder
  },
  methods: {
    addProduct() {
      this.productvisible = true
    },
    getDetail() {
      PurchorderDetail({ ticketno: this.$route.query.id }).then(
        res => {
          console.log(res)
          this.planform = res.data
        }
      ).catch(err => {
        console.log(err)
      })
    },
    getName(id) {
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
    onSubmit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.submitloading = true
          const postData = JSON.parse(JSON.stringify(this.planform))
          const view = this.visitedViews.filter(v => v.path === this.$route.path)
          postData.purchorder.revstorename = this.storename
          postData.purchorder.planarrivedate = parseTime(this.planform.purchorder.planarrivedate)
          postData.purchorder.servicername = this.getName(this.planform.purchorder.servicer)
          postData.purchorder.createuser = this.userInfo.truename
          addOrUpdatePurchaseOrder(postData).then(
            res => {
              console.log(res)
              if (res.code === '200' && res.data) {
                this.$confirm('新建采购单成功！', '提示', {
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
                ).catch(
                  _ => {
                    this.$store.dispatch('delVisitedViews', view[0]).then(() => {
                      this.$router.push('/')
                    })
                  }
                )
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
        this.planform.purchorderItems = [...this.planform.purchorderItems, ...res.data]
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
      this.planform.purchorderItems.splice(index, 1)
      this.$message({
        message: '成功删除一条记录！',
        type: 'success'
      })
    },
    editRow(row) {
      row.edit = false
    },
    goeditrow(index) {
      this.planform.purchorderItems[index].edit = true
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择上传 1 个文件`)
    },
    importEXL() {
      this.dialogVisible = true
    },
    addDetail() {
      this.planform.purchorderItems.push(
        {
          material: '', // 川商品id
          materialno: '', // 川商品编码
          materialname: '', // 川商品名称
          materialrule: '', // 商品规格
          materialsize: '', // 商品型号
          materialtag: '', // 品牌
          orderunit: '', // 单位
          orderprice: '', // 单价
          orderamount: '', // 金额
          ordernum: '', // 数量
          factendnum: '', // 已收数量
          taxrate: '', // 税率（%）
          memos: '', // 备注
          edit: true
        }
      )
    },
    subProduct(products) {
      products.forEach((cp, index) => {
        this.planform.purchorderItems.map(pr => {
          if (cp.requestid === pr.material) {
            this.$message({
              message: '编号' + pr.custommaterialno + '商品已存在',
              type: 'warning'
            })
            products = products.splice(index, 1)
          }
        })
      })
      products.map(product => {
        const pdata = {
          material: product.requestid, // 川商品id
          materialno: product.productno, // 川商品编码
          custommaterialno: product.productno, // 客户商品编码
          materialname: product.productname, // 川商品名称
          materialrule: product.productrule, // 商品规格
          materialsize: product.productsize, // 商品型号
          materialtag: product.brandname, // 品牌
          orderunit: product.invunitname, // 单位
          orderprice: '', // 单价
          orderamount: '', // 金额
          ordernum: '', // 数量
          factendnum: '', // 已收数量
          taxrate: '', // 税率（%）
          memos: '', // 备注
          edit: true
        }
        this.planform.purchorderItems.push(pdata)
      })
    },
    diClose() {
      this.productvisible = false
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
    delChecked() {
      const dt = this.planform.purchorderItems.filter(item => {
        return !this.multipleSelection.includes(item)
      })
      this.planform.purchorderItems = JSON.parse(JSON.stringify(dt))
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
