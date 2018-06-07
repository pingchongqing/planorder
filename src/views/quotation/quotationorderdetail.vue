<template lang="html">
<div class="app-container">
  <sticky :className="'sub-navbar published'" >
    <template v-if="fetchSuccess">
      <el-button  style="margin-left: 10px;" type="warning"  @click="delQuotation">删除</el-button>
    </template>
    <template v-else>
      <el-tag>发送异常错误,刷新页面,或者联系程序员</el-tag>
    </template>
  </sticky>
  <el-form :model="planform" ref="ruleForm" label-width="80px">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="询价方" prop="quotation.customer">
          {{planform.quotation.customername}}
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="报价方" prop="quotation.enterprise">
          {{planform.quotation.enterpricename}}
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="报价日期" prop="quotation.quotationdate">
          {{planform.quotation.quotationdate}}
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="金额">
          ￥{{planform.quotation.sumamount}}
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="创建日期" prop="quotation.createdate">
          {{planform.quotation.createdate}}
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="创建人" prop="quotation.createuser">
          {{planform.quotation.createuser}}
        </el-form-item>
      </el-col>
    </el-row>
    <div class="itemscont">
      <h3>
        计划单物品明细
      </h3>
      <el-form-item label-width="0" prop="quotationItems">
        <el-table
          :data="planform.quotationItems"
          style="width: 100%"
          border
          max-height="600">
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
            label="质保期"
            width="100">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-date-picker
                  v-model="scope.row.warrantydate"
                  type="datetime"
                  :editable="false"
                  placeholder="选择日期时间"
                  align="right">
                </el-date-picker>
              </template>
              <span v-else>{{ scope.row.warrantydate }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="供货期"
            width="100">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-date-picker
                  v-model="scope.row.supplydate"
                  type="datetime"
                  :editable="false"
                  placeholder="选择日期时间"
                  align="right">
                </el-date-picker>
              </template>
              <span v-else>{{ scope.row.supplydate }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="供应商"
            width="100">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-select v-model="scope.row.servvicer" filterable placeholder="请选择">
                  <el-option
                    v-for="item in servvicers"
                    :key="item.servvicer"
                    :label="item.servvicer"
                    :value="item.servvicername">
                  </el-option>
                </el-select>
              </template>
              <span v-else>{{ scope.row.servvicername }}</span>
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
import { GetQuotationDetail, OrderOperate } from '@/api/planorder'
import { mapGetters } from 'vuex'
import Sticky from '@/components/Sticky' // 粘性header组件
import { parseTime } from '@/utils'
export default {
  components: { Sticky },
  data() {
    return {
      planform: {
        quotation: {},
        quotationItems: []
      },
      fetchSuccess: true,
      delloading: false
    }
  },
  computed: {
    sumordernum() {
      let total = 0
      this.planform.quotationItems.forEach(item => {
        total += item.ordernum
      })
      return total
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
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    delQuotation() {
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
                name: 'quotationorderlist'
              })
            })
          }
        )
      })
    },
    getDetail() {
      GetQuotationDetail({ ticketno: this.$route.params.ticketno }).then(
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
        quotation: this.$route.params.ticketno
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
