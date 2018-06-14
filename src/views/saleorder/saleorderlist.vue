<template lang="html">
<div class="app-container">
  <el-form :model="planform" ref="ruleForm" label-width="80px">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="状态" prop="saleOrder.status">
          <el-select v-model="planform.saleOrder.status" clearable placeholder="请选择" prefix-icon="el-icon-search">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="销售单号" prop="saleOrder.ticketno">
          <el-input type="text" v-model="planform.saleOrder.ticketno" ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="计划单号">
          <el-input type="text" v-model="planform.saleOrder.enquiryorder" ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="16">
        <el-form-item label="交货日期" prop="saleOrder.planarrivedate">
          <el-date-picker
            v-model="planform.saleOrder.planarrivedate"
            type="datetimerange"
            :editable="false"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="制单人" prop="saleOrder.createuser">
          <el-input type="text" v-model="planform.saleOrder.createuser" ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="收款方式" prop="saleOrder.recmethod">
          <el-select v-model="planform.saleOrder.recmethod" clearable placeholder="请选择">
            <!-- <el-option label="全部" value="0" ></el-option> -->
            <el-option label="货到收款" value="1" ></el-option>
            <el-option label="预收款" value="2" ></el-option>
          </el-select>
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
        <el-form-item label="客户" prop="saleOrder.customer">
          <el-select v-model="planform.saleOrder.customer" filterable clearable placeholder="请选择" prefix-icon="el-icon-search">
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
    <el-form-item label-width="350px" >
      <el-button type="primary" @click="onSubmit">查询</el-button>
      <el-button @click="onCancel">重置</el-button>
    </el-form-item>
    <div class="itemscont">
      <saletable :list="list" :loading="loading"></saletable>
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
import { SaleList } from '@/api/planorder'
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils'
import saletable from '@/views/tableComponent/saletable'
export default {
  components: { saletable },
  data() {
    return {
      planform: {
        saleOrder: {
          ticketno: '', // 订单号
          customer: '', // 客户id
          customername: '', // 客户名称
          planarrivedate: '', // 计划收货日期
          sumordernum: '', // 数量
          sumorderamount: '', // 金额
          sumsendnum: '', // 已发数量
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
          closed: '', // 完结标示
          memos: '', // 备注
          enquiryorder: '' // 来源计划单号
        },
        saleOrderItems: []
      },
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
      ],
      list: [],
      pagesize: 10,
      pageindex: 1,
      total: 0,
      currentPage: 1,
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
      loading: false
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
    parseTime
  },
  created() {
    if (!this.gridData.length) {
      this.$store.dispatch('GetGysList')
    }
    this.getListData()
  },
  methods: {
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
    handleSizeChange(val) {
      this.pagesize = val
      this.getListData()
    },
    handleCurrentPageChange(val) {
      this.pageindex = val
      this.getListData()
    },
    getCustomerName(val) {
      let tname = ''
      if (this.gridData.length) {
        this.gridData.forEach(d => {
          if (d.requestid === val) {
            tname = d.name
          }
        })
      }
      return tname
    },
    getListData() {
      this.loading = true
      const postData = this.planform.saleOrder
      if (postData.planarrivedate && postData.planarrivedate.length) {
        postData.planarrivestartdate = postData.planarrivedate[0]
        postData.planarriveenddate = postData.planarrivedate[1]
        postData.planarrivedate = ''
      }
      SaleList({ pagesize: this.pagesize, pageindex: this.pageindex, ...postData }).then(res => {
        this.list = res.data.data
        this.total = res.data.total
        this.currentPage = res.data.currentPage
        this.loading = false
        console.log(res)
      }).catch(err => {
        console.log(err)
        this.loading = false
      })
    },
    onSubmit() {
      this.getListData()
    },
    viewRow(row) {
      this.$router.push({
        name: 'plandetail',
        params: {
          ticketno: row.ticketno
        }
      })
    },
    onCancel() {
      this.planform = {
        saleOrder: {},
        saleOrderItems: []
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
