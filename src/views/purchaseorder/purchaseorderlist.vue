<template lang="html">
<div class="app-container">
  <el-form :model="planform" ref="ruleForm" label-width="120px">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="状态" prop="purchorder.status">
          <el-select v-model="planform.purchorder.status" clearable placeholder="请选择" prefix-icon="el-icon-search">
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
        <el-form-item label="采购单号" prop="purchorder.ticketno">
          <el-input type="text" v-model="planform.purchorder.ticketno" ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="来源计划单号" prop="purchorder.enquiryorder">
          <el-input v-model="planform.purchorder.enquiryorder"></el-input>
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
        <el-form-item label="供应商" prop="purchorder.servicer">
          <el-select v-model="planform.purchorder.servicer" filterable clearable placeholder="请选择" prefix-icon="el-icon-search">
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
        <el-form-item label="付款方式" prop="purchorder.paymethod">
          <el-select v-model="planform.purchorder.paymethod" placeholder="请选择">
            <el-option label="货到付款" value="1" ></el-option>
            <el-option label="预付款" value="2" ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="到达仓库" prop="purchorder.revstore">
          <el-select v-model="planform.purchorder.revstore" filterable clearable placeholder="请选择" prefix-icon="el-icon-search">
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
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="onCancel">重置</el-button>
        </el-form-item>
      </el-col>
    </el-row>
    <div class="itemscont">
      <purchasetable :list="list" :loading="loading"></purchasetable>
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
import { PurchorderList } from '@/api/planorder'
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils'
import purchasetable from '@/views/tableComponent/purchasetable'
export default {
  components: { purchasetable },
  data() {
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
    parseTime,
    paymethodFilter(val) {
      switch (parseInt(val)) {
        case 1: return '货到付款'
        case 2: return '现金付款'
        case 3: return '预付款'
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
    deliverwayFilter(val) {
      switch (parseInt(val)) {
        case 1: return '库发'
        case 2: return '供应商直发'
        default: return ''
      }
    },
    recmethodFilter(val) {
      switch (parseInt(val)) {
        case 1: return '货到付款'
        case 2: return '预付款'
        default: return ''
      }
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
    }
  },
  created() {
    this.getListData()
    if (!this.revstoreList.length) {
      this.$store.dispatch('GetStoreList')
    }
    if (!this.gridData.length) {
      this.$store.dispatch('GetGysList')
    }
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
          if (d.ticketno === val) {
            tname = d.name
          }
        })
      }
      return tname
    },
    getListData() {
      this.loading = true
      const postData = this.planform.purchorder
      // if (postData.planarrivedate.length) {
      //   postData.planarrivestartdate = postData.planarrivedate[0]
      //   postData.planarriveenddate = postData.planarrivedate[1]
      //   postData.planarrivedate = ''
      // }
      const pData = {}
      for (const item of Object.keys(postData)) {
        if (postData[item] !== '') {
          pData[item] = postData[item]
        }
      }
      PurchorderList({ pagesize: this.pagesize, pageindex: this.pageindex, ...pData }).then(res => {
        this.list = res.data.purchorders
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
        purchorder: {},
        purchorderItems: []
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
