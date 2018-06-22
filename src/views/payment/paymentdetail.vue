<template lang="html">
  <div class="app-container">
    <el-form :model="paymentform" ref="ruleForm" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="付款单号" prop="payment.ticketno">
            <el-input type="text" v-model="paymentform.payment.ticketno" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="付款方" prop="payment.payername">
            <el-input type="text" v-model="paymentform.payment.payername" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="本次实付金额" prop="payment.payamount">
            <el-input type="text" v-model="paymentform.payment.payamount" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="收款方" prop="payment.receivablesname">
            <el-input type="text" :value="paymentform.payment.receivablesname" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="款项类型" prop="payment.fundnature">
            <el-input type="text" :value="paymentform.payment.fundnature|fundnatureFilter" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="结算方式" prop="payment.settlementmethod">
            <el-input type="text" :value="paymentform.payment.settlementmethod|settlementmethodFilter"
                      disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="审核人" prop="payment.checkuser">
            <el-input type="text" v-model="paymentform.payment.checkuser" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="审核日期" prop="payment.checkdate">
            <el-input type="text" :value="paymentform.payment.checkdate" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="审核结果" prop="payment.status">
            <el-input type="text" :value="paymentform.payment.status|statusFilter" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="制单人" prop="payment.createuser">
              <el-input type="text" v-model="paymentform.payment.createuser" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="制单日期" prop="payment.createdate">
              <el-input type="text" :value="paymentform.payment.createdate" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>

      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="备注" prop="payment.memos">
            <el-input type="text" v-model="paymentform.payment.memos" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="付款日期" prop="payment.paydate">
            <el-input type="text"  :value="paymentform.payment.paydate" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import { getPaymentDetail } from '@/api/payment'
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
            payer: '', // 付款企业
            payername: '', // 付款人姓名
            purchorder: '', // 采购单
            receivables: '', // 收款方
            receivablesname: '', // 收款方名称
            settlementmethod: '', // 结算方式 1现金 2银行转账 3银行承兑 4商业承兑
            status: '', // 状态
            checkdate: '',
            checkuser: '',
            createdate: ''
          }
        },
        list: [],
        pagesize: 10,
        pageindex: 1,
        total: 0,
        currentPage: 1,
        fundnature: [
          {
            name: '货款',
            value: '1'
          },
          {
            name: '服务费',
            value: '2'
          },
          {
            name: '投标保证金',
            value: '3'
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
      parseTime,
      settlementmethodFilter(val) {
        switch (parseInt(val)) {
          case 1:
            return '现金'
          case 2:
            return '银行转账'
          case 3:
            return '银行承兑'
          case 4:
            return '商业承兑'
          default:
            return ''
        }
      },
      statusFilter(val) {
        switch (parseInt(val)) {
          case -1: return '草稿'
          case 0: return '待审核'
          case 1: return '确认通过'
          case -2: return '驳回'
          default: return ''
        }
      },
      fundnatureFilter(val) {
        switch (parseInt(val)) {
          case 1:
            return '货款'
          case 2:
            return '服务费'
          case 3:
            return '投标保证金'
          default:
            return ''
        }
      }
    },
    created() {
      if (!this.gridData.length) {
        this.$store.dispatch('GetGysList')
      }
      getPaymentDetail({
        pagesize: this.pagesize,
        pageindex: this.pageindex,
        ticketno: this.$route.params.ticketno
      }).then(res => {
        this.list = res.data.data
        this.total = res.data.total
        this.currentPage = res.data.currentPage
        this.paymentform.payment = this.list[0]
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
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
