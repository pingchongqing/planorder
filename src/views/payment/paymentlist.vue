<template lang="html">
  <div class="app-container">
    <el-form :model="paymentform" ref="ruleForm" label-width="80px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="付款单号" prop="payment.ticketno">
              <el-input type="text" v-model="paymentform.payment.ticketno"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="来源单号" prop="payment.purchorder">
            <el-input type="text" v-model="paymentform.payment.purchorder"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="单据状态" prop="payment.status">
            <el-select v-model="paymentform.payment.status" filterable clearable placeholder="请搜索或选择" prefix-icon="el-icon-search">
              <el-option
                v-for="item in statusList"
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
          <el-form-item label="收款方" prop="payment.receivables">
            <el-select v-model="paymentform.payment.receivables" filterable clearable placeholder="请选择供应商" prefix-icon="el-icon-search">
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
      <el-row>
        <el-col :span="8">
          <el-form-item label="付款日期" prop="payment.paydate">
            <el-date-picker
              v-model="paymentform.payment.paydate"
              type="date"
              :editable="false"
              placeholder="选择日期时间"
              align="right">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label-width="0" >
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button @click="onCancel">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="itemscont">
        <el-table
          :data="list"
          style="width: 100%"
          border>
          <el-table-column
            label="单号"
            width="220">
            <template slot-scope="scope">
              <el-button type="text" @click="viewRow(scope.row)">{{scope.row.ticketno}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            width="200"
            label="付款日期">
            <template slot-scope="scope">
              <span>{{ scope.row.paydate |parseTime}}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="200"
            label="付款方">
            <template slot-scope="scope">
              <span>{{ scope.row.enterpricename }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="收款方"
            width="200">
            <template slot-scope="scope">
              <span>{{ scope.row.receivablesname}}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="200"
            label="款项性质">
            <template slot-scope="scope">
              <span>{{ scope.row.fundnature|fundnatureFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="结算方式"
            width="120">
            <template slot-scope="scope">
              <span >{{ scope.row.settlementmethod|settlementmethodFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="来源采购订单"
            width="200">
            <template slot-scope="scope">
              <span>{{ scope.row.purchorder }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="本次实付金额"
            width="200">
            <template slot-scope="scope">
              <span>{{ scope.row.payamount }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="单据状态"
            width="200">
            <template slot-scope="scope">
              <span>{{ scope.row.status|statusFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="审核结果"
            width="200">
            <template slot-scope="scope">
              <span>{{ scope.row.checkadvice }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="制单人"
            width="200">
            <template slot-scope="scope">
              <span>{{ scope.row.createuser }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="制单日期"
            width="200">
            <template slot-scope="scope">
              <span>{{ scope.row.createdate}}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentPageChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
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
            status: '' // 状态
          }
        },
        paymentStatus: [
          {
            name: '货款',
            value: '0'
          },
          {
            name: '服务费',
            value: '1'
          }
        ],
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
        ],
        list: [],
        pagesize: 10,
        pageindex: 1,
        total: 0,
        currentPage: 1,
        statusList: [
          {
            name: '草稿', value: '-1'
          },
          {
            name: '待审核', value: '0'
          },
          {
            name: '确认通过', value: '1'
          },
          {
            name: '驳回', value: '-2'
          }
        ]
      }
    },
    computed: {
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
          case 1: return '现金'
          case 2: return '银行转账'
          case 3: return '银行承兑'
          case 4: return '商业承兑'
          default: return ''
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
          case 1: return '货款'
          case 2: return '服务费'
          default: return ''
        }
      }
    },
    created() {
      if (!this.gridData.length) {
        this.$store.dispatch('GetGysList')
      }
      this.getListData()
    },
    methods: {
      handleSizeChange(val) {
        this.pagesize = val
        this.getListData()
      },
      handleCurrentPageChange(val) {
        this.pageindex = val
        this.getListData()
      },
      getListData() {
        const postData = this.paymentform.payment
        const pData = {}
        for (const item of Object.keys(postData)) {
          if (postData[item] !== '') {
            pData[item] = postData[item]
          }
        }
        getPaymentDetail({ pagesize: this.pagesize, pageindex: this.pageindex, ...pData }).then(res => {
          this.list = res.data.data
          this.total = res.data.total
          this.currentPage = res.data.currentPage
          console.log(res)
        }).catch(err => {
          console.log(err)
        })
      },
      onSubmit() {
        this.getListData()
      },
      viewRow(row) {
        this.$router.push({
          name: 'paymentdetail',
          params: {
            ticketno: row.ticketno
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
