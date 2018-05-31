<template>
<div>
  <sticky :className="'sub-navbar published'" v-if="topShow && form.eptBidMain.zbStatus === '正在竞标'">
    <template v-if="fetchSuccess">
      <el-button v-show="edit" v-loading="jbloading" style="margin-left: 10px;" type="success"  @click="doAddOrUpdateEtpBid">提交报价
      </el-button>
      <el-button  type="warning" v-show="edit" @click="rebid">取消</el-button>
      <el-button  type="warning" v-show="!edit && form.eptBidMain.zbStatus === '正在竞标' && hasrole" @click="rebid">再次报价</el-button>
    </template>
    <template v-else>
      <el-tag>发送异常错误,刷新页面,或者联系程序员</el-tag>
    </template>
  </sticky>
  <div class="app-container">
    <el-form :model="form" ref="ruleForm" :rules="rules" :label-position="'left'" label-width="120px" >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="招标单号">
            {{form.eptBidMain.tpnumber}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="0">
            当前排名<span class="sort" :class="sortClass">{{sort}}</span>位
            <el-button type="text" v-loading="reflashLoading" @click="getBidSort" v-show="reflashShow">刷新</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="招标标题">
        {{form.eptBidMain.zbTitle}}
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="竞标总金额">
            {{totalAmount}}元
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="竞标时间" prop="eptBidMain.makebidtime">
            <template v-if="edit">
              <el-date-picker
                v-model="form.eptBidMain.makebidtime"
                type="datetime"
                :editable="false"
                placeholder="选择日期时间"
                align="right">
              </el-date-picker>
            </template>
            <template v-else >
              <span v-if="form.eptBidMain.makebidtime">{{form.eptBidMain.makebidtime|parseTime}}</span>
            </template>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="竞标单位">
            {{form.eptBidMain.servername}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="竞标状态">
            <el-tag :type="form.eptBidMain.status === '已中标' || form.eptBidMain.status === '部分中标' ? 'success' : form.eptBidMain.status === '竞标结束' ? 'info' : 'primary'">{{form.eptBidMain.status}}</el-tag>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="竞标备注">
        <template v-if="edit">
          <el-input type="textarea" v-model="form.eptBidMain.beizhu" rows='5' placeholder="竞标备注" style="float:right"></el-input>
        </template>
        <template v-else>
          {{form.eptBidMain.beizhu}}
        </template>
      </el-form-item>
      <div class="itemscont">
        <h3>招标物品明细</h3>
        <el-form-item label-width="0" prop="eptBidItems">
          <el-table
            :data="form.eptBidItems"
            style="width: 100%"
            border>
              <el-table-column
                label="中标状态"
                width="120">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.bidstatus === '已中标' ? 'success' : 'info' " >{{scope.row.bidstatus ? scope.row.bidstatus : '未中标'}}</el-tag>
                </template>
              </el-table-column>
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
                  <span>{{ scope.row.pdtno }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="商品名称"
                width="150">
                <template slot-scope="scope">
                  <span>{{ scope.row.pdtname }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="品牌"
                width="120">
                <template slot-scope="scope">
                  <span>{{ scope.row.pdtbrand }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="规格"
                width="200">
                <template slot-scope="scope">
                  <span>{{ scope.row.pdtmodel }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="型号"
                width="200">
                <template slot-scope="scope">
                  <span>{{ scope.row.pdtsize }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="数量"
                width="80">
                <template slot-scope="scope">
                  <span>{{ scope.row.pdtnumber }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="单位"
                width="80">
                <template slot-scope="scope">
                  <span>{{ scope.row.pdtunit }}</span>
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
                label="竞标方货号"
                width="100">
                <template slot-scope="scope">
                  <template v-if="edit">
                    <el-input class="edit-input" size="small" v-model="scope.row.supplierno"></el-input>
                  </template>
                  <span v-else>{{ scope.row.supplierno }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="本轮竞标价"
                width="100">
                <template slot-scope="scope">
                  <template v-if="edit">
                    <el-input class="edit-input" size="small" v-model="scope.row.bidprice"></el-input>
                  </template>
                  <span v-else>{{ scope.row.bidprice }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="小计"
                width="100">
                <template slot-scope="scope">
                  {{scope.row.bidprice*1000*scope.row.pdtnumber/1000}}
                </template>
              </el-table-column>
              <el-table-column
                label="备注"
                width="100">
                <template slot-scope="scope">
                  <template v-if="edit">
                    <el-input class="edit-input" size="small" v-model="scope.row.beizhu"></el-input>
                  </template>
                  <span v-else>{{ scope.row.beizhu }}</span>
                </template>
              </el-table-column>
            </el-table>
        </el-form-item>
      </div>
    </el-form>
  </div>
</div>
</template>

<script>
import { bidDetail, bidSort } from '@/api/bail'
import { addOrUpdateEtpBid } from '@/api/etp'
import { mapGetters } from 'vuex'
import Sticky from '@/components/Sticky' // 粘性header组件
import { parseTime } from '@/utils'
export default {
  components: { Sticky },
  data() {
    var checkDetail = (rule, value, callback) => {
      if (!value.length) {
        return callback(new Error('竞标物品明细不能空'))
      }
      setTimeout(() => {
        value.forEach(v => {
          if (!v.supplierno || !v.bidprice) {
            return callback(new Error('物品明细的竞标方货号和本轮竞标价必填'))
          }
        })
        callback()
      }, 300)
    }
    return {
      form: {
        eptBidMain: {},
        eptBidItems: []
      },
      fetchSuccess: true,
      loading: false,
      jbloading: false,
      topShow: true,
      sort: '',
      sortClass: '',
      reflashLoading: false,
      reflashShow: false,
      edit: false,
      rules: {
        eptBidMain: {
          makebidtime: [
            { required: true, message: '请选择竞标时间', trigger: 'change' }
          ]
        },
        eptBidItems: [
          { validator: checkDetail, required: true, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    totalAmount() {
      let m = 0
      this.form.eptBidItems.forEach(d => { m = m + d.bidprice * d.pdtnumber })
      return m
    },
    hasrole() {
      return this.roles.includes('710')
    },
    ...mapGetters([
      'company',
      'companyId',
      'roles'
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
  },
  methods: {
    getDetail() {
      bidDetail({ id: this.$route.params.id }).then(
        res => {
          console.log(res)
          this.form = res.data
          this.reflashShow = true
          this.getBidSort()
        }
      ).catch(err => {
        console.log(err)
        this.fetchSuccess = false
      })
    },
    getBidSort() {
      this.reflashLoading = true
      this.sortClass = ''
      bidSort({
        bdnumber: this.form.eptBidMain.bdnumber,
        tpnumber: this.form.eptBidMain.tpnumber
      }).then(res => {
        console.log(res)
        this.sort = res.data
        this.reflashLoading = false
        this.sortClass = 'active'
      }).catch(err => {
        console.log(err)
        this.reflashLoading = false
      })
    },
    rebid() {
      this.edit = !this.edit
    },
    cancelbid() {
      this.$router.go(0)
    },
    doAddOrUpdateEtpBid() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.jbloading = true
          this.edit = !this.edit
          const postData = {
            etpBidMain: this.form.eptBidMain,
            items: this.form.eptBidItems
          }
          addOrUpdateEtpBid(postData).then(
            res => {
              console.log(res)
              this.jbloading = false
              this.$alert('报价成功', '提示', {
                confirmButtonText: '确定',
                type: 'success',
                callback: action => {
                  this.$router.push({
                    name: 'biddetail',
                    params: {
                      id: res.data
                    }
                  })
                }
              })
            }
          ).catch(err => {
            console.log(err)
            this.jbloading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
h3 {
  font-size: 14px;
}
.sort {
  font-size: 16px;
  font-weight: bold;
  transition: all .3s;
  &.active {
    font-size: 24px;
    color: red;
  }
}
</style>
