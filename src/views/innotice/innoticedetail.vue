<template lang="html">
<div class="app-container">
  <sticky :className="'sub-navbar published'" >
    <template v-if="fetchSuccess">
      <el-button  style="margin-left: 10px;" type="success"  @click="nextpage('newinstore')">登记入库单</el-button>
    </template>
    <template v-else>
      <el-tag>发送异常错误,刷新页面,或者联系程序员</el-tag>
    </template>
  </sticky>
  <el-form :model="planform" ref="ruleForm" label-width="120px">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="送货供应商" >
          {{planform.innotice.enterprisename}}
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="采购订单号" >
          {{planform.innotice.purchorder}}
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="收货仓库" >
          {{planform.innotice.instorename}}
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="计划到达日期" prop="innotice.outdate">
          {{planform.innotice.indate}}
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="收货人" prop="innotice.linkuser">
          {{planform.innotice.linkuser}}
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="收货地址" prop="innotice.linkaddress">
          {{planform.innotice.linkaddress}}
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="联系电话" prop="innotice.linktel">
          {{planform.innotice.linktel}}
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="订单数量合计" prop="innotice.sumordernum">
          {{planform.innotice.sumordernum}}
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="16">
        {{planform.innotice.memos}}
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
          v-loading="loading"
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
            label="订单数量"
            fixed="right"
            width="200">
            <template slot-scope="scope">
              <span >{{ scope.row.ordernum }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </div>
  </el-form>
</div>
</template>

<script>
import { InNoticeDetail, InNoticeList } from '@/api/planorder'
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils'
import Sticky from '@/components/Sticky' // 粘性header组件
export default {
  components: { Sticky },
  data() {
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
        innoticeItems: []
      },
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
      fetchSuccess: true
    }
  },
  computed: {
    ...mapGetters([
      'company',
      'companyId',
      'userInfo',
      'visitedViews'
    ])
  },
  filters: {
    parseTime
  },
  created() {
    this.getinnoticeDetail()
  },
  methods: {
    getinnoticeDetail() {
      this.loading = true
      InNoticeDetail({ ticketno: this.$route.params.ticketno }).then(
        res => {
          console.log(res)
          this.loading = false
          this.planform.innoticeItems = res.data
        }
      ).catch(err => {
        console.log(err)
        this.loading = false
        this.fetchSuccess = false
      })
      InNoticeList({ ticketno: this.$route.params.ticketno }).then(
        res => {
          console.log(res)
          this.planform.innotice = res.data.data[0]
        }
      ).catch(err => {
        console.log(err)
        this.fetchSuccess = false
      })
    },
    nextpage(page) {
      this.$router.push({
        name: page,
        params: {
          ticketno: this.$route.params.ticketno
        }
      })
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
