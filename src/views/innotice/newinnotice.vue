<template lang="html">
<div class="app-container">
  <el-form :model="planform" :rules="rules" ref="ruleForm" label-width="120px">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="送货供应商" prop="innotice.enterprise">
          <el-select v-model="planform.innotice.enterprise" filterable clearable placeholder="请选择" prefix-icon="el-icon-search" disabled>
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
        <el-form-item label="采购订单号" prop="innotice.purchorder">
          <el-input v-model="planform.innotice.purchorder" disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="收货仓库" prop="innotice.instore">
          <el-select v-model="planform.innotice.instore" filterable clearable placeholder="请选择" prefix-icon="el-icon-search">
            <el-option
              v-for="item in revstoreList"
              :key="item.id"
              :label="item.storename"
              :value="item.requestid">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="计划入库日期" prop="innotice.indate">
          <el-date-picker
            v-model="planform.innotice.indate"
            type="datetime"
            :editable="false"
            placeholder="选择日期时间"
            align="right">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="收货人" prop="innotice.linkuser">
          <el-input type="text" v-model="planform.innotice.linkuser" ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="收货地址" prop="innotice.linkaddress">
          <el-input type="text" v-model="planform.innotice.linkaddress" ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="联系电话" prop="innotice.linktel">
          <el-input type="number" v-model="planform.innotice.linktel" ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="订单数量合计" prop="innotice.sumordernum">
          <el-input :value="sumordernum" disabled></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="16">
        <el-form-item label="备注" prop="innotice.memos">
          <el-input v-model="planform.innotice.memos"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <div class="itemscont">
      <h3>
        订单明细
      </h3>
      <el-form-item label-width="0" prop="innoticeItems">
        <el-table
          :data="planform.innoticeItems"
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
            label="计划入库数量"
            fixed="right"
            width="200">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-input-number v-model="scope.row.ordernum" :min="0" :max="scope.row.backnum"></el-input-number>
              </template>
              <span v-else>{{ scope.row.ordernum }}</span>
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
      <el-button type="primary" @click="onSubmit" v-loading="submitloading">创建发货通知单</el-button>
      <el-button @click="onCancel">取消</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import { addOrUpdateInoticeOrder, PurchorderDetail } from '@/api/planorder'
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
        innotice: {
          ticketno: '', // 订单号
          instore: '', // 入库仓库
          instorename: '', // 入库仓库名称
          indate: '', // 入库日期
          enterprise: '', // 平台企业
          enterprisename: '', // 平台企业 （裕大）
          createuser: '', // 创建人
          createdate: '', // 创建日期
          status: '', // -2（ 驳回 ） -1（草稿） 0（待审核）1（确认通过）
          checkuser: '', // 审核人
          checkdate: '', // 审核日期
          checkadvice: '', // 审核意见
          suminnum: '', // 入库数量合计
          sumordernum: '', // 数量合计
          linkaddress: '', // 收货地址
          linkuser: '', // 收货联系人
          linktel: '', // 收货联系电话
          purchorder: '', // 采购单
          closed: '', // 完结标识0未完结1完结
          memos: '', // 备注
          isdelete: '' // 是否删除 默认0  1为删除
        },
        innoticeItems: [
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
          //   ordernum: '', // 订单数量
          //   innum: '', // 实际入库数量
          //   fromitemid: '', // 采购单子表id
          //   closedcode: '' // 完成标识0未结束1自动结束（已发数量等于订单数量）2指定结束（业务取消该订单时修改为2）
          // }
        ]
      },
      rules: {
        innotice: {
          instore: [
            { required: true, message: '请选择收货仓库', trigger: 'change' }
          ],
          indate: [
            { required: true, message: '请选择计划入库日期', trigger: 'change' }
          ],
          linkuser: [
            { required: true, message: '请输入收货人', trigger: 'blur' }
          ],
          linkaddress: [
            { required: true, message: '请输入收货地址', trigger: 'blur' }
          ],
          linktel: [
            { required: true, message: '收货人电话', trigger: 'blur' }
          ]
        },
        innoticeItems: [
          { validator: checkDetail, required: true, trigger: 'blur' }
        ]
      },
      dialogVisible: false,
      uploadUrl: '/planapi/excel/innotice/export', // 上传路径
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
        }
      ]
    }
  },
  computed: {
    sumordernum() {
      let total = 0
      this.planform.innoticeItems.forEach(item => {
        total += item.ordernum
      })
      return total
    },
    sumbacknum() {
      let total = 0
      this.planform.innoticeItems.forEach(item => {
        total += item.backnum
      })
      return total
    },
    sumamount() {
      let total = 0
      this.planform.innoticeItems.forEach(item => {
        total += item.ordernum * item.orderprice
      })
      return total
    },
    storename() {
      let tname = ''
      if (this.revstoreList.length) {
        this.revstoreList.map(d => {
          if (d.requestid === this.planform.innotice.instore) {
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
    this.getPurchaseInfo()
  },
  methods: {
    getPurchaseInfo() {
      PurchorderDetail({ ticketno: this.$route.params.ticketno }).then(
        res => {
          console.log(res)
          const resdata = res.data
          this.planform.innotice.enterprise = resdata.purchorder.servicer
          this.planform.innotice.enterprisename = resdata.purchorder.servicername
          this.planform.innotice.purchorder = resdata.purchorder.ticketno
          this.planform.innotice.instore = resdata.purchorder.revstore
          this.planform.innotice.instorename = resdata.purchorder.revstorename || this.storename
          resdata.purchorderItems.forEach(d => {
            const pushdata = {}
            pushdata.edit = true
            pushdata.backnum = d.ordernum
            pushdata.custommaterialno = d.custommaterialno
            pushdata.itemno = d.itemno
            pushdata.materialname = d.materialname
            pushdata.materialrule = d.materialrule
            pushdata.materialsize = d.materialsize
            pushdata.materialtag = d.materialtag
            pushdata.ordernum = d.ordernum
            pushdata.orderunit = d.orderunit
            this.planform.innoticeItems.push(pushdata)
          })
          // this.planform = resdata
        }
      ).catch(err => {
        console.log(err)
      })
    },
    onSubmit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.submitloading = true
          const view = this.visitedViews.filter(v => v.path === this.$route.path)
          const postData = JSON.parse(JSON.stringify(this.planform))
          postData.innotice.instorename = this.storename
          postData.innotice.indate = parseTime(this.planform.innotice.indate)
          postData.innotice.createuser = this.userInfo.truename
          postData.innotice.sumordernum = this.sumordernum
          addOrUpdateInoticeOrder(postData).then(
            res => {
              console.log(res)
              if (res.code === '200' && res.data) {
                this.$confirm('新建收货通知单成功！', '提示', {
                  confirmButtonText: '继续',
                  cancelButtonText: '关闭',
                  type: 'success'
                }).then(
                  _ => {
                    this.$store.dispatch('delVisitedViews', view[0]).then(() => {
                      this.$router.push({
                        name: 'purchaseorderlist'
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
    editRow(row) {
      row.edit = false
    },
    goeditrow(index) {
      this.planform.innoticeItems[index].edit = true
      this.planform = JSON.parse(JSON.stringify(this.planform))
    },
    onCancel() {
      this.planform = {
        innotice: {},
        innoticeItems: []
      }
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
