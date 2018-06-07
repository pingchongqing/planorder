<template lang="html">
<div class="app-container">
  <sticky :className="'sub-navbar published'" >
    <template v-if="fetchSuccess">
      <el-button  style="margin-left: 10px;" type="success"  @click="nextpage('newoutstore')">登记出库单</el-button>
    </template>
    <template v-else>
      <el-tag>发送异常错误,刷新页面,或者联系程序员</el-tag>
    </template>
  </sticky>
  <el-form :model="planform" ref="ruleForm" label-width="120px">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="收货企业" prop="outNotice.enterprise">
          {{planform.outNotice.enterprisename}}
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="销售订单号" prop="outNotice.saleorder">
          {{planform.outNotice.saleorder}}
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="发货仓库" prop="outNotice.outstore">
          {{planform.outNotice.outstorename}}
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="计划到达日期" prop="outNotice.outdate">
          {{planform.outNotice.outdate}}
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="收货人" prop="outNotice.linkuser">
          {{planform.outNotice.linkuser}}
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="收货地址" prop="outNotice.linkaddress">
          {{planform.outNotice.linkaddress}}
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="联系电话" prop="outNotice.linktel">
          {{planform.outNotice.linktel}}
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="订单数量合计" prop="outNotice.sumordernum">
          {{planform.outNotice.sumordernum}}
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="备注" >
          {{planform.outNotice.memos}}
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
import { OutNoticeDetail } from '@/api/planorder'
import Sticky from '@/components/Sticky' // 粘性header组件
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils'
export default {
  components: { Sticky },
  data() {
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
      gridData: [],
      gridLoading: false,
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
      ],
      revstoreList: [],
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
    this.getOutNoticeDetail()
  },
  methods: {
    getOutNoticeDetail() {
      this.loading = true
      OutNoticeDetail({ ticketno: this.$route.params.ticketno }).then(
        res => {
          console.log(res)
          this.loading = false
          this.planform = res.data
        }
      ).catch(err => {
        console.log(err)
        this.loading = false
        this.fetchSuccess = false
      })
    },
    nextpage(name) {
      this.$router.push({ name })
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
