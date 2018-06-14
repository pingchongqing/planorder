<template lang="html">
<div class="app-container">
  <el-form :model="stockform" ref="ruleForm" label-width="120px">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="仓库">
          <el-select v-model="stockform.store" filterable clearable placeholder="请选择" prefix-icon="el-icon-search">
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
        <el-form-item label="客户商品编号" >
          <el-input type="text" v-model="stockform.custommaterialno" ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="商品名称">
          <el-input type="text" v-model="stockform.materialname" ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="规格">
          <el-input type="text" v-model="stockform.materialrule" ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="型号">
          <el-input type="text" v-model="stockform.materialsize" ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label-width="350px" >
      <el-button type="primary" @click="onSubmit">查询</el-button>
      <el-button @click="onCancel">重置</el-button>
    </el-form-item>
    <div class="itemscont">
      <stocktable :list="list" :loading="loading"></stocktable>
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
import { StockList } from '@/api/planorder'
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils'
import stocktable from '@/views/tableComponent/stocktable'
export default {
  components: { stocktable },
  data() {
    return {
      stockform: {
        material: '', // --平台商品id
        materialno: '', // --平台商品编码
        custommaterialno: '', // --客户商品编码
        materialname: '', // --商品名称
        materialrule: '', // --规格
        materialsize: '', // --型号
        materialtag: '', // --品牌
        materialnum: '', // --库存数量
        price: '', // --库存单价
        amount: '', // --库存金额
        store: '', // --仓库
        storename: '', // --仓库名称
        orderunit: '', // --单位
        owner: '', // --货主
        ownername: '', // --货主名称
        enterprise: '', // --企业（裕达）
        enterprisename: '' // --平台企业名称 （裕大）
      },
      list: [],
      pagesize: 10,
      pageindex: 1,
      total: 0,
      currentPage: 1,
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
    if (!this.revstoreList.length) {
      this.$store.dispatch('GetStoreList')
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
      this.loading = true
      const postData = this.stockform
      const pData = {}
      for (const item of Object.keys(postData)) {
        if (postData[item] !== '') {
          pData[item] = postData[item]
        }
      }
      StockList({ pagesize: this.pagesize, pageindex: this.pageindex, ...pData }).then(res => {
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
