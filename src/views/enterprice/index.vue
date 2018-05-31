<template>
  <div class="app-container">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px">
      <el-form-item label="招标标题" prop="etpOrderMain.title">
        <el-input v-model="form.etpOrderMain.title"></el-input>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="招标类型" prop="etpOrderMain.tptype">
            <el-select v-model="form.etpOrderMain.tptype" placeholder="请选择" @change="tptypeChange" :disabled="$route.query.id ? true : false">
              <el-option label="明细招标" value="0" ></el-option>
              <el-option label="品类招标" value="1" ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="应缴保证金" prop="etpOrderMain.bidbailamount">
            <el-input type="number" v-model="form.etpOrderMain.bidbailamount" placeholder="请输入应缴保证金额"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="招标总金额">
            <el-input type="number" :value="totalAmount" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发标时间" prop="etpOrderMain.subtime">
            <el-date-picker
              v-model="form.etpOrderMain.subtime"
              type="datetime"
              :editable="false"
              placeholder="选择日期时间"
              align="right">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="竞标时间" prop="etpOrderMain.jbtime">
        <el-date-picker
          v-model="form.etpOrderMain.jbtime"
          type="datetimerange"
          :editable="false"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="发标单位">
            <el-input :value="company" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="参标方要求" prop="etpOrderMain.registeramount">
            <el-input v-model="form.etpOrderMain.registeramount" type="number">
              <template slot="prepend">注册资本不低于</template>
              <template slot="append">万元</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="详细说明">
        <el-input type="textarea" v-model="form.etpOrderMain.smcontent" rows='5' placeholder="招标公告详细内容说明" style="float:right"></el-input>
      </el-form-item>
      <div class="itemscont">
        <h3>
          招标物品明细
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-add"
            @click="importEXL">
            导入Excel
          </el-button>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-add"
            @click="addDetail">
            新增一行
          </el-button>
        </h3>
        <el-form-item label-width="0" prop="items" v-if="form.etpOrderMain.tptype === '0'">
          <el-table
            :data="form.items"
            style="width: 100%"
            border
            max-height="250">
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
                <template v-if="scope.row.edit">
                  <el-input class="edit-input" size="small" v-model="scope.row.pdtno"></el-input>
                </template>
                <span v-else>{{ scope.row.pdtno }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="商品名称"
              width="150">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input class="edit-input" size="small" v-model="scope.row.pdtname"></el-input>
                </template>
                <span v-else>{{ scope.row.pdtname }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="品牌"
              width="120">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input class="edit-input" size="small" v-model="scope.row.pdtbrand"></el-input>
                </template>
                <span v-else>{{ scope.row.pdtbrand }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="规格"
              width="200">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input class="edit-input" size="small" v-model="scope.row.pdtmodel"></el-input>
                </template>
                <span v-else>{{ scope.row.pdtmodel }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="型号"
              width="200">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input class="edit-input" size="small" v-model="scope.row.pdtsize"></el-input>
                </template>
                <span v-else>{{ scope.row.pdtsize }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="数量"
              width="80">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input class="edit-input" size="small" v-model="scope.row.pdtnumber"></el-input>
                </template>
                <span v-else>{{ scope.row.pdtnumber }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="单位"
              width="80">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input class="edit-input" size="small" v-model="scope.row.pdtunit"></el-input>
                </template>
                <span v-else>{{ scope.row.pdtunit }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="参考单价"
              width="100">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input class="edit-input" size="small" v-model="scope.row.pdtprice"></el-input>
                </template>
                <span v-else>{{ scope.row.pdtprice }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="参考金额"
              width="100">
              <template slot-scope="scope">
                <span>{{scope.row.pdtprice*1000*scope.row.pdtnumber/1000}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="备注"
              width="100">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input class="edit-input" size="small" v-model="scope.row.beizhu"></el-input>
                </template>
                <span v-else>{{ scope.row.beizhu }}</span>
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
        <el-form-item label-width="0" prop="items" v-if="form.etpOrderMain.tptype === '1'">
          <el-table
            :data="form.items"
            style="width: 100%"
            border
            max-height="250">
            <el-table-column
              label="序号"
              width="120">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input class="edit-input" size="small" v-model="scope.row.rownumber"></el-input>
                </template>
                <span v-else>{{ scope.row.rownumber }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="大类"
              width="150">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input class="edit-input" size="small" v-model="scope.row.firstlev"></el-input>
                </template>
                <span v-else>{{ scope.row.firstlev }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="中分类"
              width="120">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input class="edit-input" size="small" v-model="scope.row.secondlev"></el-input>
                </template>
                <span v-else>{{ scope.row.secondlev }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="小分类"
              width="150">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input class="edit-input" size="small" v-model="scope.row.thirdlev"></el-input>
                </template>
                <span v-else>{{ scope.row.thirdlev }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="物品名称"
              width="120">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input class="edit-input" size="small" v-model="scope.row.pdtname"></el-input>
                </template>
                <span v-else>{{ scope.row.pdtname }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="品牌"
              width="200">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input class="edit-input" size="small" v-model="scope.row.pdtbrand"></el-input>
                </template>
                <span v-else>{{ scope.row.pdtbrand }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="规格型号"
              width="200">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input class="edit-input" size="small" v-model="scope.row.pdtsize"></el-input>
                </template>
                <span v-else>{{ scope.row.pdtsize }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="采购数量"
              width="80">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input class="edit-input" size="small" v-model="scope.row.pdtnumber"></el-input>
                </template>
                <span v-else>{{ scope.row.pdtnumber }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="计量单位"
              width="80">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input class="edit-input" size="small" v-model="scope.row.pdtunit"></el-input>
                </template>
                <span v-else>{{ scope.row.pdtunit }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="备注"
              width="100">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input class="edit-input" size="small" v-model="scope.row.beizhu"></el-input>
                </template>
                <span v-else>{{ scope.row.beizhu }}</span>
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
        <el-button type="primary" @click="onSubmit">确定发标</el-button>
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
          <a class="dlink" href="/static/templet/newetp.xls" v-if="form.etpOrderMain.tptype === '0'">下载明细模板</a>
          <a class="dlink" href="/static/templet/Typeofbidding.xls" v-if="form.etpOrderMain.tptype === '1'">下载品类模板</a>
        </div>
      </el-upload>
    </el-dialog>
    <!-- 新增物品明细 -->
    <el-dialog
      title="新增招标物品明细"
      :visible.sync="mxdialogVisible"
      center
      width="50%">
      <el-form :model="mxform" :rules="mxrules" ref="mxForm">
        <el-form-item label="商品编号" :label-width="formLabelWidth" prop="pdtno">
          <el-input v-model="mxform.pdtno" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="数量" :label-width="formLabelWidth" prop="pdtnumber">
          <el-input v-model="mxform.pdtnumber" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="参考单价" :label-width="formLabelWidth" prop="pdtprice">
          <el-input v-model="mxform.pdtprice" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="mxform.beizhu" rows='3' style="float:right"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="mxdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onmxformSubmit" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils'
import { getProductInfo, addOrUpdateEtpOrder, orderDetail } from '@/api/etp'
export default {
  data() {
    var checkNumber = (rule, value, callback) => {
      if (rule.field === 'etpOrderMain.bidbailamount') {
        if (!value) return callback()
      }
      const numbervalue = parseFloat(value)
      if (numbervalue.toString() !== value) {
        return callback(new Error('请输入数值'))
      }
      if (isNaN(numbervalue)) {
        return callback(new Error('请输入数值'))
      } else {
        callback()
      }
      setTimeout(() => {
        if (typeof (numbervalue) !== 'number') {
          callback(new Error('请输入数值'))
        } else {
          if (numbervalue <= 0) {
            callback(new Error('必须大于0'))
          } else {
            callback()
          }
        }
      }, 300)
    }
    var checkDetail = (rule, value, callback) => {
      if (!value.length) {
        return callback(new Error('招标物品明细不能空'))
      }
      setTimeout(() => {
        callback()
      }, 300)
    }
    return {
      form: {
        etpOrderMain: {
          tptype: '0'
        },
        items: []
      },
      uploadButtonVisible: false,
      dialogVisible: false,
      mxdialogVisible: false,
      formLabelWidth: '120px',
      fileList: [],
      mxform: {
        pdtno: '',
        pdtnumber: '',
        pdtprice: '',
        beizhu: ''
      },
      rules: {
        etpOrderMain: {
          title: [
            { required: true, message: '请输入招标标题', trigger: 'blur' },
            { min: 3, max: 45, message: '长度在 3 到 45 个字符', trigger: 'blur' }
          ],
          tptype: [
            { required: true, message: '请选择招标类型', trigger: 'change' }
          ],
          subtime: [
            { required: true, message: '请选择发标时间', trigger: 'change' }
          ],
          jbtime: [
            { required: true, message: '请选择竞标时间', trigger: 'change' }
          ],
          bidbailamount: [{ validator: checkNumber, trigger: 'blur' }],
          registeramount: [
            { validator: checkNumber, required: true, trigger: 'blur' }
          ]
        },
        items: [
          { validator: checkDetail, required: true, trigger: 'blur' }
        ]
      },
      mxrules: {
        pdtno: [
          { required: true, message: '请输入商品编号', trigger: 'blur' }
        ],
        pdtnumber: [
          { validator: checkNumber, required: true, trigger: 'blur' }
        ],
        pdtprice: [
          { validator: checkNumber, required: true, trigger: 'blur' }
        ]
      },
      loading: false,
      mxindex: 0
    }
  },
  computed: {
    uploadUrl() {
      if (this.form.etpOrderMain.tptype === '0') {
        return '/api/import/autoDetailType'
      }
      if (this.form.etpOrderMain.tptype === '1') {
        return '/api/import/categoryType'
      }
    },
    totalAmount() {
      let m = 0
      this.form.items.forEach(d => { m = m + d.pdtprice * d.pdtnumber })
      return m
    },
    ...mapGetters([
      'company',
      'companyId'
    ])
  },
  created() {
    if (this.$route.query.id) {
      this.getData()
    }
  },
  methods: {
    getData() {
      orderDetail({ id: this.$route.query.id }).then(
        res => {
          console.log(res)
          this.form.items = [...res.data.items]
          this.form.etpOrderMain = { ...res.data.etpOrderMain }
          this.form.etpOrderMain.amount = this.totalAmount
          this.form.etpOrderMain.customname = this.company
          this.form.etpOrderMain.belongcustom = this.companyId
          this.form.etpOrderMain.subtime = new Date(this.form.etpOrderMain.subtime)
          this.form.etpOrderMain.jbtime = [this.form.etpOrderMain.starttime, this.form.etpOrderMain.endtime]
          this.form.etpOrderMain.tptype = this.form.etpOrderMain.tptype.toString()
        }
      ).catch(err => {
        console.log(err)
      })
    },
    goeditrow(index) {
      this.form.items[index].edit = true
      this.form = JSON.parse(JSON.stringify(this.form))
    },
    onSubmit() {
      this.$refs['ruleForm'].validate((valid) => {
        console.log(valid)
        if (valid) {
          const postData = JSON.parse(JSON.stringify(this.form))
          postData.etpOrderMain.amount = this.totalAmount
          postData.etpOrderMain.customname = this.company
          postData.etpOrderMain.belongcustom = this.companyId
          if (postData.etpOrderMain.jbtime) {
            postData.etpOrderMain.starttime = parseTime(postData.etpOrderMain.jbtime[0])
            postData.etpOrderMain.endtime = parseTime(postData.etpOrderMain.jbtime[1])
          }
          postData.etpOrderMain.subtime = parseTime(postData.etpOrderMain.subtime)
          addOrUpdateEtpOrder(postData).then(
            res => {
              console.log(res)
              if (res.code === '200' && res.data) {
                this.$confirm('发布招标成功！', '提示', {
                  confirmButtonText: '立即查看',
                  cancelButtonText: '关闭',
                  type: 'success'
                }).then(
                  _ => {
                    this.$router.push({
                      name: 'etpdetail',
                      params: {
                        id: res.data
                      }
                    })
                  }
                ).catch(_ => {
                  this.$router.push({
                    name: 'myetp'
                  })
                })
              }
            }
          ).catch(err => {
            console.log(err)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 新增物品明细表单提交
    onmxformSubmit() {
      this.$refs['mxForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          getProductInfo({ pdtno: this.mxform.pdtno }).then(
            res => {
              console.log(res)
              this.loading = false
              const data = res.data
              this.form.items.push({ edit: false, ...data, ...this.mxform })
              this.mxdialogVisible = false
              this.$message({
                message: '成功增加一条商品明细!',
                type: 'success'
              })
            }
          ).catch(err => {
            console.log(err)
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onCancel() {
      this.form = {
        etpOrderMain: {
          tptype: '0'
        },
        items: []
      }
    },
    editRow(row) {
      row.edit = false
    },
    addDetail() {
      if (this.form.etpOrderMain.tptype === '0') {
        this.mxdialogVisible = true
        return
      }
      if (this.form.etpOrderMain.tptype === '1') {
        this.form.items.push({
          rownumber: '',
          firstlev: '',
          secondlev: '',
          thirdlev: '',
          pdtname: '',
          pdtbrand: '',
          pdtsize: '',
          pdtnumber: '',
          pdtunit: '',
          beizhu: '',
          edit: true
        })
      }
    },
    handleDelete(index, row) {
      this.form.items.splice(index, 1)
      this.$message({
        message: '成功删除一条记录！',
        type: 'success'
      })
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择上传 1 个文件`)
    },
    importEXL() {
      this.dialogVisible = true
    },
    renderHeader(h) {
      return h('div',
        [
          h('div', { 'class': 'renderd' }, ['操作']),
          h('el-button', {
            attrs: { size: 'mini', type: 'primary', icon: 'el-icon-add' },
            on: { click: this.importEXL }
          }, ['上传Excel']),
          h('el-button', {
            attrs: { size: 'mini', type: 'primary', icon: 'el-icon-add' },
            on: { click: this.addDetail }
          }, ['新增一条'])
        ]
      )
    },
    handelUploadChange(file, fileList) {
      // 选择文件时显示上传按钮
      if (Object.keys(file).length && fileList.length) {
        this.uploadButtonVisible = true
      } else {
        this.uploadButtonVisible = false
      }
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
        this.form.items = [...this.form.items, ...res.data]
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
      this.$refs['upload'].clearFiles()
    },
    tptypeChange(value) {

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
<style>
.renderd {
  display: block !important;
}
</style>
