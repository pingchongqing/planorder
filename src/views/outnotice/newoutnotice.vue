<template lang="html">
<div class="app-container">
  <el-form :model="planform" :rules="rules" ref="ruleForm" label-width="120px">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="收货企业" prop="outNotice.enterprise">
          <el-select v-model="planform.outNotice.enterprise" filterable clearable placeholder="请选择" prefix-icon="el-icon-search" disabled>
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
        <el-form-item label="销售订单号" prop="outNotice.saleorder">
          <el-input v-model="planform.outNotice.saleorder" disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="发货仓库" prop="outNotice.outstore">
          <el-select v-model="planform.outNotice.outstore" filterable clearable placeholder="请选择" prefix-icon="el-icon-search">
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
        <el-form-item label="计划到达日期" prop="outNotice.outdate">
          <el-date-picker
            v-model="planform.outNotice.outdate"
            type="datetime"
            :editable="false"
            placeholder="选择日期时间"
            align="right">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="收货人" prop="outNotice.linkuser">
          <el-input type="text" v-model="planform.outNotice.linkuser" ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="收货地址" prop="outNotice.linkaddress">
          <el-input type="text" v-model="planform.outNotice.linkaddress" ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="联系电话" prop="outNotice.linktel">
          <el-input type="number" v-model="planform.outNotice.linktel" ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="订单数量合计" prop="outNotice.sumordernum">
          <el-input :value="sumordernum" disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="可用金额" >
          <el-input type="number" :value="'0'" disabled></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="16">
        <el-form-item label="备注" prop="outNotice.memos">
          <el-input v-model="planform.outNotice.memos"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <div class="itemscont">
      <h3>
        订单明细
      </h3>
      <el-form-item label-width="0" prop="outNoticeItems">
        <el-table
          :data="planform.outNoticeItems"
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
            label="申请数量"
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
import { addOrUpdateOutNotice, GetSaleOrderInfo } from '@/api/planorder'
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
        outNotice: {
          ticketno: '', // 订单号
          outstore: '', // 出库仓库
          outstorename: '', // 出库仓库名称
          outdate: '', // 计划到达日期
          enterprise: '', // 平台企业
          enterprisename: '', // 平台企业 （裕大）
          createuser: '', // 创建人
          createdate: '', // 创建日期
          status: '', // -2（ 驳回 ） -1（草稿） 0（待审核）1（确认通过）
          checkuser: '', // 审核人
          checkdate: '', // 审核日期
          checkadvice: '', // 审核意见
          sumoutnum: '', // 出库数量合计
          sumordernum: '', // 数量合计
          linkaddress: '', // 收货地址
          linkuser: '', // 收货联系人
          linktel: '', // 收货联系电话
          saleorder: '', // 销售单
          closed: '', // 完结标识0未完结1完结
          memos: '', // 备注
          isdelete: '' // 是否删除 默认0  1为删除
        },
        outNoticeItems: [
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
          //   orderprice: '', // 单价
          //   outnum: '', // 出库数量
          //   fromitemid: '', // 销售单子表id
          //   factendnum: '', // 已收数量
          //   closedcode: '' // 完成标识0未结束1自动结束（已发数量等于订单数量）2指定结束（业务取消该订单时修改为2）
          // }
        ]
      },
      rules: {
        outNotice: {
          outstore: [
            { required: true, message: '请选择发货仓库', trigger: 'change' }
          ],
          outdate: [
            { required: true, message: '请选择计划到达日期', trigger: 'change' }
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
        outNoticeItems: [
          { validator: checkDetail, required: true, trigger: 'blur' }
        ]
      },
      dialogVisible: false,
      uploadUrl: '/planapi/excel/outNotice/export', // 上传路径
      fileList: [],
      uploadButtonVisible: false,
      dialogTableVisible: false,
      gridLoading: false,
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
      ]
    }
  },
  computed: {
    sumordernum() {
      let total = 0
      this.planform.outNoticeItems.forEach(item => {
        total += item.ordernum
      })
      return total
    },
    sumbacknum() {
      let total = 0
      this.planform.outNoticeItems.forEach(item => {
        total += item.backnum
      })
      return total
    },
    sumamount() {
      let total = 0
      this.planform.outNoticeItems.forEach(item => {
        total += item.ordernum * item.orderprice
      })
      return total
    },
    storename() {
      let tname = ''
      if (this.revstoreList.length) {
        this.revstoreList.map(d => {
          if (d.requestid === this.planform.outNotice.outstore) {
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
    this.getSaleInfo()
    if (!this.revstoreList.length) {
      this.$store.dispatch('GetStoreList')
    }
    if (!this.gridData.length) {
      this.$store.dispatch('GetGysList')
    }
  },
  methods: {
    getSaleInfo() {
      GetSaleOrderInfo({ ticketno: this.$route.params.ticketno }).then(
        res => {
          console.log(res)
          const resdata = res.data
          resdata.outNoticeItems.forEach(d => {
            d.edit = true
            d.backnum = d.ordernum
          })
          this.planform = resdata
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
          const view = this.visitedViews.filter(v => v.path === this.$route.path)
          const postData = JSON.parse(JSON.stringify(this.planform))
          postData.outNotice.outstorename = this.storename
          postData.outNotice.outdate = parseTime(this.planform.outNotice.outdate)
          postData.outNotice.createuser = this.userInfo.truename
          postData.outNotice.sumordernum = this.sumordernum
          addOrUpdateOutNotice(postData).then(
            res => {
              console.log(res)
              if (res.code === '200' && res.data) {
                this.$confirm('新建发货通知单成功！', '提示', {
                  confirmButtonText: '继续',
                  cancelButtonText: '关闭',
                  type: 'success'
                }).then(
                  _ => {
                    this.$store.dispatch('delVisitedViews', view[0]).then(() => {
                      this.$router.push({
                        name: 'saleorderlist'
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
      this.planform.outNoticeItems[index].edit = true
      this.planform = JSON.parse(JSON.stringify(this.planform))
    },
    onCancel() {
      this.planform = {
        outNotice: {},
        outNoticeItems: []
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
