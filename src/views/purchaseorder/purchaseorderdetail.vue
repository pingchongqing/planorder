<template lang="html">
<div class="app-container">
  <sticky :className="'sub-navbar published'" >
    <template v-if="fetchSuccess">
      <el-button  style="margin-left: 10px;" type="success"  @click="nextpage('newinnotice')">登记收货通知单</el-button>
      <el-button  style="margin-left: 10px;" type="warning"  @click="delpurchorder">删除</el-button>
    </template>
    <template v-else>
      <el-tag>发送异常错误,刷新页面,或者联系程序员</el-tag>
    </template>
  </sticky>
  <el-form :model="planform" ref="ruleForm" label-width="120px">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="计划到货日期" prop="purchorder.planarrivedate">
          {{planform.purchorder.planarrivedate}}
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="收货人电话" prop="purchorder.linktel">
          {{planform.purchorder.linktel}}
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="交货地址" prop="purchorder.receiveaddress">
          {{planform.purchorder.receiveaddress}}
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="收货人" prop="purchorder.linkusername">
          {{planform.purchorder.linkusername}}
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="交货方式" prop="purchorder.deliverway">
          {{planform.purchorder.deliverway|deliverwayFilter}}
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="供应商" prop="purchorder.servicer">
          {{planform.purchorder.servicername}}
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="付款方式" prop="purchorder.paymethod">
          {{planform.purchorder.paymethod|paymethodFilter}}
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="到达仓库" prop="purchorder.revstore">
          {{planform.purchorder.revstorename}}
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="来源计划单号" prop="purchorder.ticketno">
          {{planform.purchorder.enquiryorder}}
        </el-form-item>
      </el-col>
    </el-row>
    <div class="itemscont">
      <h3>
        采购单物品明细
      </h3>
      <el-form-item label-width="0" prop="purchorderItems">
        <el-table
          :data="planform.purchorderItems"
          style="width: 100%"
          border
          max-height="600">
          <el-table-column
            label="序号"
            width="55">
            <template slot-scope="scope">
              <span >{{ scope.$index+1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="商品编码"
            width="120">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-input class="edit-input" size="small" v-model="scope.row.custommaterialno"></el-input>
              </template>
              <span v-else>{{ scope.row.custommaterialno }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="商品名称"
            width="120">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-input class="edit-input" size="small" v-model="scope.row.materialname"></el-input>
              </template>
              <span v-else>{{ scope.row.materialname }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="品牌"
            width="120">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-input class="edit-input" size="small" v-model="scope.row.materialtag"></el-input>
              </template>
              <span v-else>{{ scope.row.materialtag }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="规格"
            width="200">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-input class="edit-input" size="small" v-model="scope.row.materialrule"></el-input>
              </template>
              <span v-else>{{ scope.row.materialrule }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="型号"
            width="200">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-input class="edit-input" size="small" v-model="scope.row.materialsize"></el-input>
              </template>
              <span v-else>{{ scope.row.materialsize }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="数量"
            width="80">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-input class="edit-input" size="small" v-model="scope.row.ordernum"></el-input>
              </template>
              <span v-else>{{ scope.row.ordernum }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="单位"
            width="80">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-input class="edit-input" size="small" v-model="scope.row.orderunit"></el-input>
              </template>
              <span v-else>{{ scope.row.orderunit }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="采购单价"
            width="100">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-input class="edit-input" size="small" v-model="scope.row.orderprice"></el-input>
              </template>
              <span v-else>{{ scope.row.orderprice }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="采购金额"
            width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.orderprice*scope.row.ordernum }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="税率"
            width="100">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-input class="edit-input" size="small" v-model="scope.row.taxrate"></el-input>
              </template>
              <span v-else>{{ scope.row.taxrate }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            width="100">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-input class="edit-input" size="small" v-model="scope.row.memos"></el-input>
              </template>
              <span v-else>{{ scope.row.memos }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </div>
  </el-form>
</div>
</template>

<script>
import { PurchorderDetail, OrderOperate } from '@/api/planorder'
import { mapGetters } from 'vuex'
import Sticky from '@/components/Sticky' // 粘性header组件
import { parseTime } from '@/utils'
export default {
  components: { Sticky },
  data() {
    return {
      planform: {
        purchorder: {},
        purchorderItems: []
      },
      fetchSuccess: true,
      delloading: false
    }
  },
  computed: {
    sumordernum() {
      let total = 0
      this.planform.purchorderItems.forEach(item => {
        total += item.ordernum
      })
      return total
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
    },
    ...mapGetters([
      'company',
      'companyId',
      'userInfo',
      'visitedViews'
    ])
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
    deliverwayFilter(val) {
      switch (parseInt(val)) {
        case 1: return '库发'
        case 2: return '供应商直发'
        default: return ''
      }
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    delpurchorder() {
      const view = this.visitedViews.filter(v => v.path === this.$route.path)
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(_ => {
        OrderOperate({ ticketNo: this.$route.params.ticketno, checkFlag: 3 }).then(
          res => {
            this.$message({
              message: '删除成功'
            })
            this.$store.dispatch('delVisitedViews', view[0]).then(() => {
              this.$router.push({
                name: 'purchorderlist'
              })
            })
          }
        )
      })
    },
    getDetail() {
      PurchorderDetail({ ticketno: this.$route.params.ticketno, pagesize: 10, pageindex: 1 }).then(
        res => {
          console.log(res)
          this.planform = res.data
        }
      ).catch(err => {
        console.log(err)
        this.fetchSuccess = false
      })
    },
    nextpage(name, type) {
      const params = {
        purchorder: this.$route.params.ticketno
      }
      if (type) params.type = type
      this.$router.push({
        name: name,
        params: params
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
