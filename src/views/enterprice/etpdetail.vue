<template>
<div>
  <sticky :className="'sub-navbar published'" v-if="topShow">
    <template v-if="fetchSuccess">
      <el-button v-if="form.etpOrderMain.status === '正在招标'" v-loading="jbloading" style="margin-left: 10px;" type="success"  @click="doStartEtpOrder">开始竞标
      </el-button>
      <el-button v-if="form.etpOrderMain.status === '正在招标'" v-loading="loading" type="warning" @click="doDeleteEtpOrder">删除记录</el-button>
      <div style="height:50px"></div>
    </template>
    <template v-else>
      <el-tag>发送异常错误,刷新页面,或者联系程序员</el-tag>
    </template>
  </sticky>
  <div class="app-container">
    <el-form :model="form" ref="ruleForm" :label-position="'left'" label-width="120px" >
      <el-form-item label="招标标题">
        {{form.etpOrderMain.title}}
      </el-form-item>
      <el-form-item label="竞标时间" prop="etpOrderMain.jbtime">
        {{form.etpOrderMain.starttime|parseTime}}至{{form.etpOrderMain.endtime|parseTime}}
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="招标类型" prop="etpOrderMain.tptype">
            {{form.etpOrderMain.tptype|parseType}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="应缴保证金" prop="etpOrderMain.bidbailamount">
            {{form.etpOrderMain.bidbailamount}}元
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="招标总金额">
            {{totalAmount}}元
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发标时间">
            {{form.etpOrderMain.subtime|parseTime}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="发标单位">
            {{form.etpOrderMain.customname}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="参标方要求" prop="etpOrderMain.registeramount">
            注册资本不低于{{form.etpOrderMain.registeramount}}万元
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="详细说明">
        {{form.etpOrderMain.smcontent}}
      </el-form-item>
      <div class="itemscont">
        <h3>招标物品明细</h3>
        <el-table
          :data="form.items"
          style="width: 100%"
          border>
            <el-table-column
              label="小分类编码"
              width="120">
              <template slot-scope="scope">
                <span>{{scope.row.thirdlevno}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="thirdlev"
              label="小分类名称"
              width="150">
            </el-table-column>
            <el-table-column
              label="商品编号"
              width="120">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input class="edit-input" size="small" v-model="scope.row.pdtno"></el-input>
                </template>
                <span v-else>{{ scope.row.pdtno }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="商品名称"
              width="150">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input class="edit-input" size="small" v-model="scope.row.pdtname"></el-input>
                </template>
                <span v-else>{{ scope.row.pdtname }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="品牌"
              width="120">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input class="edit-input" size="small" v-model="scope.row.pdtbrand"></el-input>
                </template>
                <span v-else>{{ scope.row.pdtbrand }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="规格"
              width="200">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input class="edit-input" size="small" v-model="scope.row.pdtmodel"></el-input>
                </template>
                <span v-else>{{ scope.row.pdtmodel }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="型号"
              width="200">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input class="edit-input" size="small" v-model="scope.row.pdtsize"></el-input>
                </template>
                <span v-else>{{ scope.row.pdtsize }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="数量"
              width="80">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input class="edit-input" size="small" v-model="scope.row.pdtnumber"></el-input>
                </template>
                <span v-else>{{ scope.row.pdtnumber }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="单位"
              width="80">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input class="edit-input" size="small" v-model="scope.row.pdtunit"></el-input>
                </template>
                <span v-else>{{ scope.row.pdtunit }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="参考单价"
              width="100">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input class="edit-input" size="small" v-model="scope.row.pdtprice"></el-input>
                </template>
                <span v-else>{{ scope.row.pdtprice }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="参考金额"
              width="100">
              <template slot-scope="scope">
                <span>{{scope.row.pdtprice*1000*scope.row.pdtnumber/1000}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="备注"
              width="100">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input class="edit-input" size="small" v-model="scope.row.beizhu"></el-input>
                </template>
                <span v-else>{{ scope.row.beizhu }}</span>
              </template>
            </el-table-column>
          </el-table>
      </div>
    </el-form>
  </div>
</div>
</template>

<script>
import { orderDetail, startEtpOrder, deleteEtpOrder } from '@/api/etp'
import { mapGetters } from 'vuex'
import Sticky from '@/components/Sticky' // 粘性header组件
import { parseTime } from '@/utils'
export default {
  components: { Sticky },
  data() {
    return {
      form: {
        etpOrderMain: {},
        items: []
      },
      fetchSuccess: true,
      loading: false,
      jbloading: false,
      topShow: true
    }
  },
  computed: {
    totalAmount() {
      let m = 0
      this.form.items.forEach(d => { m = m + d.pdtprice * d.pdtnumber })
      return m
    },
    ...mapGetters([
      'company',
      'companyId',
      'visitedViews'
    ])
  },
  filters: {
    parseTime,
    parseType(val) {
      if (val === 0 || val === '0') {
        return '明细招标'
      }
      if (val === 1 || val === '1') {
        return '品类招标'
      }
      return val
    }
  },
  created() {
    this.getDetail()
    if (this.$route.name === 'etpdetailsale') {
      this.topShow = false
    }
  },
  methods: {
    getDetail() {
      orderDetail({ id: this.$route.params.id }).then(
        res => {
          console.log(res)
          this.form = res.data
        }
      ).catch(err => {
        console.log(err)
        this.fetchSuccess = false
      })
    },
    doStartEtpOrder() {
      this.jbloading = true
      startEtpOrder({ id: this.$route.params.id }).then(
        res => {
          console.log(res)
          this.jbloading = false
          this.$message({
            message: res.message,
            type: 'success'
          })
          this.$set(this.form.etpOrderMain, 'status', '正在竞标')
        }
      ).catch(_ => { this.jbloading = false })
    },
    doDeleteEtpOrder() {
      console.log(this.$store.state.tagsView.visitedViews)
      this.loading = true
      deleteEtpOrder({ id: this.$route.params.id }).then(
        res => {
          console.log(res)
          this.loading = false
          this.$message({
            message: res.message,
            type: 'success'
          })
          const view = this.visitedViews.filter(v => v.path === this.$route.path)
          this.$store.dispatch('delVisitedViews', view[0]).then(() => {
            this.$router.push('/')
          })
        }
      ).catch(_ => {
        this.loading = false
        this.$message({
          message: _.message,
          type: 'error'
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
h3 {
  font-size: 14px;
}
</style>
