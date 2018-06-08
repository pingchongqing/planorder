<template lang="html">
<div class="app-container">
  <sticky :className="'sub-navbar published'" >
    <template v-if="fetchSuccess">
      <el-button
        style="margin-left: 10px;"
        v-loading="downloadLoading"
        @click="exportExcel">
        导出询价单
      </el-button>
      <el-button  style="margin-left: 10px;" type="success"  @click="nextpage('newpurchaseorder')">登记采购单</el-button>
      <el-button  style="margin-left: 10px;" type="success"  @click="nextpage('newsaleorder')">登记销售单</el-button>
      <el-button  style="margin-left: 10px;" type="success"  @click="nextpage('newquotationorder', '0')">登记给客户报价单</el-button>
      <el-button  style="margin-left: 10px;" type="success"  @click="nextpage('newquotationorder', '1')">登记给服务商报价单</el-button>
    </template>
    <template v-else>
      <el-tag>发送异常错误,刷新页面,或者联系程序员</el-tag>
    </template>
  </sticky>
  <el-tabs type="border-card" style="margin-top: 15px;">
    <el-tab-pane>
      <span slot="label"><i class="el-icon-date"></i> 计划单详情</span>
      <el-form :model="planform" ref="ruleForm" label-width="120px">
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
          <el-col :span="8">
            <el-form-item label="创建日期">
              {{planform.enquiryOrder.createdate}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="报价截止日期">
              {{planform.enquiryOrder.enquiryenddate}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建人" >
              {{planform.enquiryOrder.createuser}}
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
                label="序号"
                width="55">
                <template slot-scope="scope">
                  <template v-if="scope.row.edit">
                    <el-input class="edit-input" size="small" v-model="scope.row.itemno"></el-input>
                  </template>
                  <span v-else>{{ scope.row.itemno }}</span>
                </template>
              </el-table-column>
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
                    <el-select v-model="scope.row.servicer" filterable placeholder="请选择">
                      <el-option
                        v-for="item in servicers"
                        :key="item.servicer"
                        :label="item.servicer"
                        :value="item.servicername">
                      </el-option>
                    </el-select>
                  </template>
                  <span v-else>{{ scope.row.servicername }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="备注">
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
    </el-tab-pane>
    <el-tab-pane>
      <span slot="label">
        关联供应商报价单<el-badge :value="fromservicelist.length" class="mark" v-show="fromservicelist.length"></el-badge>
      </span>
      <quotable :list="fromservicelist" :loading="fromserviceloading"></quotable>
    </el-tab-pane>
    <el-tab-pane>
      <span slot="label">
        关联给客户报价单<el-badge :value="tocustomerlist.length" class="mark" v-show="tocustomerlist.length"></el-badge>
      </span>
      <quotable :list="tocustomerlist" :loading="tocustomerloading"></quotable>
    </el-tab-pane>
    <el-tab-pane>
      <span slot="label">
        关联采购订单<el-badge :value="purchaselist.length" class="mark" v-show="purchaselist.length"></el-badge>
      </span>
      <purchasetable :list="purchaselist" :loading="purchaseloading"></purchasetable>
    </el-tab-pane>
    <el-tab-pane >
      <span slot="label">
        关联销售订单<el-badge :value="salelist.length" class="mark" v-show="salelist.length"></el-badge>
      </span>
      <saletable :list="salelist" :loading="saleloading"></saletable>
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
import { DetailInfo, GetQuotationList, PurchorderList, SaleList } from '@/api/planorder'
import { mapGetters } from 'vuex'
import Sticky from '@/components/Sticky' // 粘性header组件
import { parseTime } from '@/utils'
import quotable from '@/views/tableComponent/quotationtable'
import purchasetable from '@/views/tableComponent/purchasetable'
import saletable from '@/views/tableComponent/saletable'
export default {
  components: { Sticky, quotable, purchasetable, saletable },
  data() {
    return {
      planform: {
        enquiryOrder: {},
        enquiryOrderItems: []
      },
      fetchSuccess: true,
      downloadLoading: false,
      dialogVisible: false,
      fromserviceloading: false,
      fromservicelist: [],
      tocustomerlist: [],
      tocustomerloading: false,
      purchaselist: [],
      purchaseloading: false,
      salelist: [],
      saleloading: false
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
    getfromservicelist(params, name) {
      this[name + 'loading'] = true
      GetQuotationList(params).then(res => {
        this[name] = res.data.data
        this[name + 'loading'] = false
        console.log(res)
      }).catch(err => {
        console.log(err)
        this[name + 'loading'] = false
      })
    },
    getsalelist() {
      this.saleloading = true
      SaleList({ enquiryorder: this.planform.enquiryOrder.ticketno }).then(res => {
        this.salelist = res.data.data
        this.saleloading = false
        console.log(res)
      }).catch(err => {
        console.log(err)
        this.saleloading = false
      })
    },
    getpurchaselist() {
      this.purchaseloading = true
      PurchorderList({ enquiryorder: this.planform.enquiryOrder.ticketno }).then(res => {
        this.purchaselist = res.data.purchorders
        this.purchaseloading = false
        console.log(res)
      }).catch(err => {
        console.log(err)
        this.purchaseloading = false
      })
    },
    getDetail() {
      DetailInfo({ ticketno: this.$route.params.ticketno }).then(
        res => {
          console.log(res)
          this.planform = res.data
          // 获取供应商报价
          this.getfromservicelist({ enterprise: this.planform.enquiryOrder.enterprise, fromorderno: this.planform.enquiryOrder.ticketno }, 'fromservicelist')
          // 获取给客户报价
          this.getfromservicelist({ customer: this.planform.enquiryOrder.customer, fromorderno: this.planform.enquiryOrder.ticketno }, 'tocustomerlist')
          // 获取采购单
          this.getpurchaselist()
          // 获取销售订单
          this.getsalelist()
        }
      ).catch(err => {
        console.log(err)
        this.fetchSuccess = false
      })
    },
    nextpage(name, type) {
      const params = {
        enquiryorder: this.$route.params.ticketno
      }
      if (type) params.type = type
      this.$router.push({
        name: name,
        params: params
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    exportExcel() {
      this.$prompt('请输入导出的表格名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\w/,
        inputErrorMessage: '表格命名不规范'
      }).then(({ value }) => {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['物料名称', '品牌', '规格', '型号', '数量', '单位', '质保期', '供货期', '供应商', '备注']
          const filterVal = ['materialname', 'materialtag', 'materialrule', 'materialsize', 'ordernum', 'orderunit', 'warrantydate', 'supplydate', 'servicername', 'memos']
          const list = this.planform.enquiryOrderItems
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: value,
            autoWidth: true
          })
          this.downloadLoading = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消导出'
        })
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
