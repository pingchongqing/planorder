<template lang="html">
<div class="app-container">
  <el-form :model="planform" ref="ruleForm" label-width="120px">
    <el-row :gutter="20">
      <el-col :span="10" v-if="$route.name === 'serverquotationorderlist'">
        <el-form-item label="报价企业" prop="quotation.enterprice">
          <el-select v-model="planform.quotation.enterprice" filterable clearable placeholder="请搜索或选择" size="100%" prefix-icon="el-icon-search">
            <el-option
              v-for="item in saleData"
              :key="item.id"
              :label="item.name"
              :value="item.requestid">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="10" v-else>
        <el-form-item label="询价企业" prop="quotation.customer">
          <el-select v-model="planform.quotation.customer" filterable clearable placeholder="请搜索或选择" size="100%" prefix-icon="el-icon-search">
            <el-option
              v-for="item in gridData"
              :key="item.id"
              :label="item.name"
              :value="item.requestid">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="14">
        <el-form-item label="报价日期" >
          <el-date-picker
            v-model="planform.quotation.postquotationdate"
            type="datetimerange"
            :editable="false"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="10">
        <el-form-item label="报价单号" prop="quotation.ticketno">
          <el-input type="text" v-model="planform.quotation.ticketno" ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="14">
        <el-form-item label="创建日期" prop="quotation.createdate">
          <el-date-picker
            v-model="planform.quotation.postcreatedate"
            type="datetimerange"
            :editable="false"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="单据状态" prop="quotation.status">
          <el-select v-model="planform.quotation.status" clearable placeholder="请选择">
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
        <el-form-item label="关联计划单">
          <el-input v-model="planform.quotation.fromorderno"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label-width="80px" >
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="onCancel">重置</el-button>
        </el-form-item>
      </el-col>
    </el-row>
    <div class="itemscont">
      <quotable :list="list" :loading="loading"></quotable>
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
import { GetQuotationList } from '@/api/planorder'
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils'
import quotable from '@/views/tableComponent/quotationtable'
export default {
  components: {
    quotable
  },
  data() {
    return {
      planform: {
        quotation: {
          checkadvice: '', // 审核意见
          checkdate: '', // 审核日期
          checkuser: '', // 审核人
          createdate: '', // 创建日期
          createuser: '', // 创建人
          customer: '', // 被报价企业ID
          customername: '', // 被报价企业名称
          enterprice: '', // 供应商ID
          enterpricename: '', // 供应商名称
          fromorderno: '', // 来源计划单
          isdelete: 0, // 是否删除
          memos: '', // 备注
          quotationdate: '', // 报价日期
          status: '', // 状态--1（草稿） 0（待审核） 1(确认通过) -2（ 驳回 ）
          sumamount: '', // 金额合计
          ticketno: '',
          postquotationdate: [],
          postcreatedate: []
        },
        quotationItems: []
      },
      list: [],
      pagesize: 10,
      pageindex: 1,
      total: 0,
      currentPage: 1,
      statusList: [
        {
          name: '草稿', value: -1
        },
        {
          name: '待审核', value: 0
        },
        {
          name: '确认通过', value: 1
        },
        {
          name: '驳回', value: -2
        }
      ],
      loading: false
    }
  },
  computed: {
    saleData() {
      return this.gridData.filter(d => d.sale === 1)
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
    statusFilter(val) {
      switch (parseInt(val)) {
        case -1: return '草稿'
        case 0: return '待审核'
        case 1: return '确认通过'
        case -2: return '驳回'
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
      const postData = this.planform.quotation
      if (postData.postquotationdate && postData.postquotationdate.length) {
        postData.quotationstartdate = parseTime(postData.postquotationdate[0])
        postData.quotationenddate = parseTime(postData.postquotationdate[1])
        postData.quotationdate = ''
      }
      if (postData.postcreatedate && postData.postcreatedate.length) {
        postData.createstartdate = parseTime(postData.postcreatedate[0])
        postData.createenddate = parseTime(postData.postcreatedate[1])
        postData.createdate = ''
      }
      if (this.$route.name === 'customerquotationorderlist') {
        postData.quotationflag = '0'
      } else if (this.$route.name === 'serverquotationorderlist') {
        postData.quotationflag = '1'
      }
      this.loading = true
      GetQuotationList({ pagesize: this.pagesize, pageindex: this.pageindex, ...postData }).then(res => {
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
    onCancel() {
      this.planform = {
        quotation: {},
        quotationItems: []
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
