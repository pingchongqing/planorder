<template>
<div>
  <sticky :className="'sub-navbar published'" v-if="topShow">
    <template v-if="fetchSuccess">
      <el-button v-loading="loading" type="warning" @click="makebid" v-if="form.etpOrderMain.status === '正在竞标'">一键中标</el-button>
      <el-button  type="info" v-if="form.etpOrderMain.status === '竞标结束'">竞标结束</el-button>
      <div style="height:50px"></div>
    </template>
    <template v-else>
      <el-tag>发送异常错误,刷新页面,或者联系程序员</el-tag>
    </template>
  </sticky>
  <div class="app-container">
    <el-form :model="form" ref="ruleForm" :label-position="'left'" label-width="120px" >
      <el-form-item label="招标单号">
        {{form.etpOrderMain.tpnumber}}
      </el-form-item>
      <el-form-item label="招标标题">
        {{form.etpOrderMain.title}}
      </el-form-item>
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
            <el-table-column
              label="设置中标"
              v-if="form.etpOrderMain.status === '正在竞标'"
              fixed="right"
              width="200">
              <template slot-scope="scope">
                <template v-if="scope.row.companyList.length">
                  <el-select v-model="form.items[scope.$index].tender" placeholder="请选择" clearable>
                    <el-option
                      v-for="item in scope.row.companyList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                      <span style="float: left">{{ item.name }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.supplierno }}|{{ item.bidprice }}</span>
                    </el-option>
                  </el-select>
                </template>
                <template v-else>
                  <span>无人竞标</span>
                </template>
              </template>
            </el-table-column>
          </el-table>
      </div>
    </el-form>
  </div>
</div>
</template>

<script>
import { orderDetail, setWinDetailBid } from '@/api/etp'
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
      'companyId'
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
      orderDetail({ id: this.$route.params.id, myOrderFlag: '1' }).then(
        res => {
          console.log(res)
          this.form = res.data
        }
      ).catch(err => {
        console.log(err)
        this.fetchSuccess = false
      })
    },
    makebid() {
      console.log(this.form)
      const arr = []
      this.form.items.map(item => {
        if (item.tender) {
          arr.push({ belongserver: item.tender, pdtno: item.pdtno })
        }
      })
      if (!arr.length) {
        this.$message({
          message: '未设置中标信息或无人竞标',
          type: 'warning'
        })
        return false
      }
      this.loading = true
      setWinDetailBid({
        etpBidMain: {
          tpnumber: this.form.etpOrderMain.tpnumber
        },
        items: arr
      }).then(res => {
        console.log(res)
        this.loading = false
        this.$message({
          message: '设置中标成功！',
          type: 'success'
        })
      }).catch(err => {
        console.log(err)
        this.loading = false
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
