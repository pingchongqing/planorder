<template lang="html">
<div class="app-container">
  <el-form :model="planform" ref="ruleForm" label-width="80px">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="询价方" prop="enquiryOrder.customer">
          {{planform.enquiryOrder.customname}}
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="报价方" prop="enquiryOrder.enterprise">
          {{planform.enquiryOrder.enterprisename}}
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="询价日期" prop="enquiryOrder.enquirydate">
          {{planform.enquiryOrder.enquirydate|parseTime}}
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="数量合计">
          {{sumordernum}}
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="付款方式" prop="enquiryOrder.paymethod">
          {{planform.enquiryOrder.paymethod|paymethodFilter}}
        </el-form-item>
      </el-col>
    </el-row>
    <div class="itemscont">
      <h3>
        计划单物品明细
      </h3>
      <el-form-item label-width="0" prop="enquiryOrderItems">
        <el-table
          :data="planform.enquiryOrderItems"
          style="width: 100%"
          border
          max-height="600">
          <el-table-column
            label="物料名称"
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
                <el-input class="edit-input" size="small" v-model="scope.row.materialnrule"></el-input>
              </template>
              <span v-else>{{ scope.row.materialnrule }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="型号"
            width="200">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-input class="edit-input" size="small" v-model="scope.row.materialnsize"></el-input>
              </template>
              <span v-else>{{ scope.row.materialnsize }}</span>
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
            label="单价"
            width="100">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-input class="edit-input" size="small" v-model="scope.row.orderprice"></el-input>
              </template>
              <span v-else>{{ scope.row.orderprice }}</span>
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
import { DetailInfo, getGys } from '@/api/planorder'
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils'
export default {
  data() {
    return {
      planform: {
        enquiryOrder: {},
        enquiryOrderItems: []
      },
      gridData: []
    }
  },
  computed: {
    sumordernum() {
      let total = 0
      this.planform.enquiryOrderItems.forEach(item => {
        total += item.ordernum
      })
      return total
    },
    ...mapGetters([
      'company',
      'companyId',
      'userInfo'
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
    getCustomer() {
      if (!this.gridData.length) {
        getGys().then(
          res => {
            this.gridData = res.data
          }
        ).catch(err => {
          console.log(err)
        })
      }
    },
    getDetail() {
      DetailInfo({ requestid: this.$route.params.requestid }).then(
        res => {
          console.log(res)
          this.planform = res.data
        }
      ).catch(err => {
        console.log(err)
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
