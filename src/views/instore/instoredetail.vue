<template lang="html">
<div class="app-container">
  <el-form :model="planform" ref="ruleForm" label-width="120px">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="入库单号" prop="inorder.ticketno">
          {{planform.inorder.ticketno}}
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="收货企业" prop="inorder.enterprise">
          {{planform.inorder.enterprisename}}
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="收货通知单号" prop="inorder.saleorder">
          {{planform.inorder.innotice}}
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="发货仓库" prop="inorder.outstore">
          {{planform.inorder.instorename}}
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="入库日期" prop="inorder.outdate">
          {{planform.inorder.indate}}
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="入库数量" prop="inorder.sumordernum">
          {{planform.inorder.innum}}
        </el-form-item>
      </el-col>
    </el-row>
    <div class="itemscont">
      <h3>
        订单明细
      </h3>
      <el-form-item label-width="0" prop="inorderItems">
        <el-table
          :data="planform.inorderItems"
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
            label="入库数量"
            fixed="right"
            width="100">
            <template slot-scope="scope">
              <span >{{ scope.row.innum }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </div>
  </el-form>
</div>
</template>

<script>
import { InStoreDetail } from '@/api/planorder'
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils'
export default {
  data() {
    return {
      planform: {
        inorder: {
          ticketno: '', // 订单号
          enclosure: '', // 附件地址
          instore: '', // 出库仓库
          instorename: '', // 出库仓库名称
          indate: '', // 出库日期
          enterprise: '', // 平台企业
          enterprisename: '', // 平台企业 （裕大）
          createuser: '', // 创建人
          createdate: '', // 创建日期
          status: '', // -2（ 驳回 ） -1（草稿） 0（待审核）1（确认通过）
          checkuser: '', // 审核人
          checkdate: '', // 审核日期
          checkadvice: '', // 审核意见
          innotice: '', // 送货通知单id
          innum: '', // 实入数量
          isdelete: '' // 是否删除 默认0  1为删除
        },
        inorderItems: [
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
    this.getinorderDetail()
  },
  methods: {
    getinorderDetail() {
      this.loading = true
      InStoreDetail({ ticketno: this.$route.params.ticketno }).then(
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
