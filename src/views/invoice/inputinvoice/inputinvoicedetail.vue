<template lang="html">
  <div class="createPost-container">
    <el-form  class="form-container" :model="inputInvoiceDetail" ref="postForm">
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="21">

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="110px" label="开票单号:" class="postInfo-container-item">
                    {{inputInvoiceDetail.inputInvoice.ticketno}}
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label-width="120px" label="服务商:" class="postInfo-container-item">
                    {{inputInvoiceDetail.inputInvoice.servicername}}
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label-width="120px" label="开票日期:" class="postInfo-container-item">
                    {{inputInvoiceDetail.inputInvoice.invoicedate}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="110px" label="发票号码:" class="postInfo-container-item">
                    {{inputInvoiceDetail.inputInvoice.invoiceno}}
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label-width="120px" label="单据状态:" class="postInfo-container-item">
                    {{inputInvoiceDetail.inputInvoice.status|statusFilter}}
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label-width="120px" label="税前金额:" class="postInfo-container-item">
                    ￥{{inputInvoiceDetail.inputInvoice.pretaxamount}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="110px" label="税额:" class="postInfo-container-item">
                    ￥{{inputInvoiceDetail.inputInvoice.taxamount}}
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label-width="120px" label="实际开票金额:" class="postInfo-container-item">
                    ￥{{inputInvoiceDetail.inputInvoice.invoiceamount}}
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="计划开票金额:" class="postInfo-container-item">
                    ￥{{inputInvoiceDetail.inputInvoice.planinvoiceamount}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8" v-show="inputInvoiceDetail.inputInvoice.checkuser">
                  <el-form-item label-width="110px" label="审核人:" class="postInfo-container-item">
                    ￥{{inputInvoiceDetail.inputInvoice.checkuser}}
                  </el-form-item>
                </el-col>

                <el-col :span="8" v-show="inputInvoiceDetail.inputInvoice.checkdate">
                  <el-form-item label-width="80px" label="审核日期:" class="postInfo-container-item">
                    ￥{{inputInvoiceDetail.inputInvoice.checkdate}}
                  </el-form-item>
                </el-col>
              </el-row>

            </div>
          </el-col>
        </el-row>
        <el-form-item style="margin-bottom: 40px;" label-width="0">
          <el-table
            :data="inputInvoiceDetail.inputInvoiceItems"
            ref="inputInvoiceTable"
            style="width: 100%"
            border
            max-height="600">
            <el-table-column
              label="入库单号"
              width="160">
              <template slot-scope="scope">
                <span >{{ scope.row.inorder }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="采购订单号"
              width="160">
              <template slot-scope="scope">
                <span >{{ scope.row.purchorder }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="采购合同号"
              width="120">
              <template slot-scope="scope">
                <span >{{ scope.row.contractno }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="物料名称"
              width="200">
              <template slot-scope="scope">
                <span >{{ scope.row.materialname }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="物料规格"
              width="200">
              <template slot-scope="scope">
                <span >{{ scope.row.materialrule }}</span>
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
              label="含税单价"
              width="100">
              <template slot-scope="scope">
                <span >{{ scope.row.price }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="含税金额"
              width="100">
              <template slot-scope="scope">
                <span >{{ scope.row.planinvoiceamount }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="税率"
              width="60">
              <template slot-scope="scope">
                <span >{{ scope.row.taxrate }}</span>
              </template>
            </el-table-column>
            <el-table-column
              width="110"
              label="大类">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input v-model="scope.row.bigcategoryname" style="max-width: 150px"></el-input>
                </template>
                <span v-else>{{ scope.row.bigcategoryname }}</span>
              </template>
            </el-table-column>
            <el-table-column
              width="110"
              label="计划开票数量">
              <template slot-scope="scope">
                <span >{{ scope.row.planinvoicenum }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="本次开票数量"
              width="175">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input-number v-model="scope.row.invoicenum" :min="1" :max="scope.row.planinvoicenum" style="max-width: 150px" @change="reflashData"></el-input-number>
                </template>
                <span v-else>{{ scope.row.invoicenum }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="开票金额"
              width="80">
              <template slot-scope="scope">
                <span >{{ scope.row.invoicenum * scope.row.price }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </div>
    </el-form>

  </div>
</template>

<script>
import { getItemDetail, getMainDetail } from '@/api/invoice'
export default {
  data() {
    return {
      inputInvoiceDetail: {
        inputInvoice: {},
        inputInvoiceItems: []
      }
    }
  },
  created() {
    this.getInputInvoiceDetail()
  },
  methods: {
    async getInputInvoiceDetail() {
      await getMainDetail({
        inputInvoice: {
          ticketno: this.$route.params.ticketno
        }
      }).then(res => {
        console.log(res)
        this.inputInvoiceDetail.inputInvoice = res.data.data[0]
      }).catch(err => {
        console.log(err)
      })
      await getItemDetail({
        ticketno: this.$route.params.ticketno
      }).then(res => {
        console.log(res)
        this.inputInvoiceDetail.inputInvoiceItems = res.data
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .title-prompt{
    position: absolute;
    right: 0px;
    font-size: 12px;
    top:10px;
    color:#ff4949;
  }
  .createPost-container {
    position: relative;
    .createPost-main-container {
      padding: 40px 45px 20px 50px;
      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;
        .postInfo-container-item {
          float: left;
        }
      }
      .editor-container {
        min-height: 500px;
        margin: 0 0 30px;
        .editor-upload-btn-container {
            text-align: right;
            margin-right: 10px;
            .editor-upload-btn {
                display: inline-block;
            }
        }
      }
    }
    .word-counter {
      width: 40px;
      position: absolute;
      right: -10px;
      top: 0px;
    }
  }
</style>
