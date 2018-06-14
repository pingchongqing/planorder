<template lang="html">
<div class="app-container">
  <el-form :model="planform" :rules="rules" ref="ruleForm" label-width="120px">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="发货通知单号" prop="outOrder.outnotice">
          <el-input v-model="planform.outOrder.outnotice" disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="发货仓库" prop="outOrder.outstore">
          <el-select v-model="planform.outOrder.outstore" filterable clearable placeholder="请选择" prefix-icon="el-icon-search">
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
        <el-form-item label="出库日期" prop="outOrder.outdate">
          <el-date-picker
            v-model="planform.outOrder.outdate"
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
        <el-form-item label="出库数量合计" prop="outOrder.sumoutnum">
          <el-input :value="sumoutnum" disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-form-item label="上传附件" >
          <el-button
            size="mini"
            type="primary"
            @click="importFile">
            {{planform.outOrder.enclosure ? '重新上传' : '上传附件'}}
          </el-button>
          {{planform.outOrder.enclosure}}
        </el-form-item>
      </el-col>
    </el-row>
    <div class="itemscont">
      <h3>
        订单明细
      </h3>
      <el-form-item label-width="0" prop="outOrderItems">
        <el-table
          :data="planform.outOrderItems"
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
            label="商品编码"
            width="120">
            <template slot-scope="scope">
              <span >{{ scope.row.custommaterialno }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="商品名称"
            width="120">
            <template slot-scope="scope">
              <span >{{ scope.row.materialname }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="品牌"
            width="120">
            <template slot-scope="scope">
              <span >{{ scope.row.materialtag }}</span>
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
              <span >{{ scope.row.materialsize }}</span>
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
            label="备注">
            <template slot-scope="scope">
              <span >{{ scope.row.memos }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="出库数量"
            fixed="right"
            width="200">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-input-number v-model="scope.row.outnum" :min="0" :max="scope.row.backnum"></el-input-number>
              </template>
              <span v-else>{{ scope.row.outnum }}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="80">
            <template slot-scope="scope">
              <el-button v-if="scope.row.edit" type="success" @click="editRow(scope.row)" size="mini" >确定</el-button>
              <el-button v-else @click="goeditrow(scope.$index)" size="mini" >编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </div>
    <el-form-item label-width="0">
      <el-button type="primary" @click="onSubmit" v-loading="submitloading">{{$route.query.id ? '修改出库单' : '创建出库单'}}</el-button>
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
import { addOrUpdateOutOrder, getOutNoticeInfo, OutStoreDetail } from '@/api/planorder'
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils'
export default {
  data() {
    var checkDetail = (rule, value, callback) => {
      if (!value.length) {
        return callback(new Error('明细不能空'))
      }
      setTimeout(() => {
        callback()
      }, 300)
    }
    return {
      planform: {
        outOrder: {
          ticketno: '', // 订单号
          enclosure: '', // 附件地址
          outstore: '', // 出库仓库
          outstorename: '', // 出库仓库名称
          outdate: '', // 出库日期
          enterprise: '', // 平台企业
          enterprisename: '', // 平台企业 （裕大）
          createuser: '', // 创建人
          createdate: '', // 创建日期
          status: '', // -2（ 驳回 ） -1（草稿） 0（待审核）1（确认通过）
          checkuser: '', // 审核人
          checkdate: '', // 审核日期
          checkadvice: '', // 审核意见
          linkaddress: '', // 收货地址
          linkuser: '', // 收货联系人
          linktel: '', // 收货联系电话
          outOrder: '', // 送货通知单id
          closed: '', // 完结标识0未完结1完结
          memos: '', // 备注
          outnum: '', // 实出数量
          isdelete: '' // 是否删除 默认0  1为删除
        },
        outOrderItems: [
          // {
          //   itemno: '', // 序号
          //   material: '', // 川商品id
          //   materialno: '', // 川商品编码
          //   custommaterialno: '', //客户商品编码
          //   materialname: '', // 川商品名称
          //   materialrule: '', // 商品规格
          //   materialsize: '', // 商品型号
          //   materialtag: '', // 品牌
          //   orderunit: '', // 单位
          //   outnum: '', // 出库数量
          //   fromitemno: '', // 送货单子表行号
          // }
        ]
      },
      rules: {
        outOrder: {
          outstore: [
            { required: true, message: '请选择发货仓库', trigger: 'change' }
          ],
          outdate: [
            { required: true, message: '请选择计划到达日期', trigger: 'change' }
          ]
        },
        outOrderItems: [
          { validator: checkDetail, required: true, trigger: 'blur' }
        ]
      },
      dialogVisible: false,
      uploadUrl: '/planapi/api/fileupload/getfile', // 上传路径
      fileList: [],
      uploadButtonVisible: false,
      dialogTableVisible: false,
      submitloading: false
    }
  },
  computed: {
    sumoutnum() {
      let total = 0
      this.planform.outOrderItems.forEach(item => {
        total += item.outnum
      })
      return total
    },
    sumbacknum() {
      let total = 0
      this.planform.outOrderItems.forEach(item => {
        total += item.backnum
      })
      return total
    },
    sumamount() {
      let total = 0
      this.planform.outOrderItems.forEach(item => {
        total += item.ordernum * item.orderprice
      })
      return total
    },
    storename() {
      let tname = ''
      if (this.revstoreList.length) {
        this.revstoreList.map(d => {
          if (d.requestid === this.planform.outOrder.outstore) {
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
    if (this.$route.query.id) {
      this.getDetail()
    } else {
      this.getInfo()
    }
    if (!this.revstoreList.length) {
      this.$store.dispatch('GetStoreList')
    }
    if (!this.gridData.length) {
      this.$store.dispatch('GetGysList')
    }
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
    getDetail() {
      OutStoreDetail({ ticketno: this.$route.query.id }).then(
        res => {
          console.log(res)
          this.planform = res.data
        }
      ).catch(err => {
        console.log(err)
      })
    },
    getInfo() {
      getOutNoticeInfo({ ticketno: this.$route.params.ticketno }).then(
        res => {
          console.log(res)
          const resdata = res.data
          resdata.outOrder.outdate = ''
          resdata.outOrderItems.forEach(d => {
            d.edit = true
            d.backnum = d.outnum
          })
          this.planform = resdata
        }
      ).catch(err => {
        console.log(err)
      })
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
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleUploadSuccess(res, file, fileList) {
      if (res.code === '200') {
        this.$message({
          message: '上传附件成功~',
          type: 'success'
        })
        this.dialogVisible = false
        this.planform.outOrder.enclosure = res.data
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
      this.$refs['upload'].clearFiles()
    },
    importFile() {
      this.dialogVisible = true
    },
    onSubmit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.submitloading = true
          const view = this.visitedViews.filter(v => v.path === this.$route.path)
          this.planform.outOrderItems.forEach(d => {
            d.edit = false
          })
          const postData = JSON.parse(JSON.stringify(this.planform))
          postData.outOrder.outstorename = this.storename
          postData.outOrder.outdate = parseTime(this.planform.outOrder.outdate)
          postData.outOrder.createuser = this.userInfo.truename
          postData.outOrder.sumoutnum = this.sumoutnum
          addOrUpdateOutOrder(postData).then(
            res => {
              console.log(res)
              this.$confirm('新建出库单成功！', '提示', {
                confirmButtonText: '查看',
                cancelButtonText: '继续',
                type: 'success'
              }).then(
                _ => {
                  this.$store.dispatch('delVisitedViews', view[0]).then(() => {
                    this.$router.push({
                      name: 'outstoredetail',
                      params: {
                        ticketno: res.data
                      }
                    })
                  })
                }
              ).catch(
                _ => {
                  this.$store.dispatch('delVisitedViews', view[0]).then(() => {
                    this.$router.push({
                      name: 'outnoticelist'
                    })
                  })
                }
              )
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
    editRow(row) {
      row.edit = false
    },
    goeditrow(index) {
      this.planform.outOrderItems[index].edit = true
      this.planform = JSON.parse(JSON.stringify(this.planform))
    },
    onCancel() {
      this.$router.back()
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
