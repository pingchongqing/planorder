<template lang="html">
  <div class="app-container">
    <el-form :model="paydata" :label-position="'left'" label-width="120px">
      <el-form-item label="交易流水号">
        <span>{{paydata.orderno}}</span>
      </el-form-item>
      <el-form-item label="需缴纳保证金额">
        <span>{{paydata.bailamount}}</span>
      </el-form-item>
    </el-form>
    <form :action="hiddendata.urlPath" method="post" ref="hiddenForm" target="_blank">
      <input type="hidden" name="version" :value="hiddendata.bankGateway.version"></input>
      <input type="hidden" name="oid_partner" :value="hiddendata.bankGateway.oid_partner"></input>
      <input type="hidden" name="user_id" :value="hiddendata.bankGateway.user_id"></input>
      <input type="hidden" name="sign_type" :value="hiddendata.bankGateway.sign_type"></input>
      <input type="hidden" name="sign" :value="hiddendata.sign"></input>
      <input type="hidden" name="userreq_ip" :value="hiddendata.bankGateway.userreq_ip"></input>
      <input type="hidden" name="busi_partner" :value="hiddendata.bankGateway.busi_partner"></input>
      <input type="hidden" name="name_goods" :value="hiddendata.bankGateway.name_goods"></input>
      <input type="hidden" name="money_order" :value="hiddendata.bankGateway.money_order"></input>
      <input type="hidden" name="timestamp" :value="hiddendata.bankGateway.timestamp"></input>
      <input type="hidden" name="no_order" :value="hiddendata.bankGateway.no_order"></input>
      <input type="hidden" name="dt_order" :value="hiddendata.bankGateway.dt_order"></input>
      <input type="hidden" name="info_order" :value="hiddendata.bankGateway.info_order"></input>
      <input type="hidden" name="notify_url" :value="hiddendata.bankGateway.notify_url"></input>
      <input type="hidden" name='risk_item' :value='hiddendata.bankGateway.risk_item'></input>
      <input type="hidden" name="url_return" :value="hiddendata.bankGateway.url_return"></input>
      <input type="hidden" name="col_userid" :value="hiddendata.bankGateway.col_userid"></input>
      <input type="hidden" name="valid_order" :value="hiddendata.bankGateway.valid_order"></input>
      <input type="submit" value="确认支付" class="submitButton primary" :class="disclass" :disabled="paydis" @click="handleFormSubmit"></input>
      <el-button type="button"  class="submitButton" @click="onCancel">取消</el-button>
    </form>
  </div>
</template>

<script>
import { payBailPage, createOrderBail } from '@/api/bail'
import { queryBail } from '@/api/etp'
export default {
  data() {
    return {
      paydata: {},
      payloading: false,
      hiddendata: {
        bankGateway: {},
        sign: '',
        urlPath: ''
      },
      paydis: true,
      disclass: 'is-disabled'
    }
  },
  created() {
    this.getPayData()
  },
  methods: {
    getPayData() {
      payBailPage({ id: this.$route.params.id }).then(
        res => {
          console.log(res)
          this.paydata = res.data
          this.onSubmit()
        }
      ).catch(err => {
        console.log(err)
      })
    },
    onSubmit() {
      this.payloading = true
      const postData = {
        orderid: this.paydata.orderid,
        money_order: this.paydata.bailamount,
        orderno: this.paydata.orderno
      }
      createOrderBail(postData).then(
        res => {
          console.log(res)
          this.payloading = false
          this.hiddendata = res.data
          this.paydis = false
          this.disclass = ''
        }
      ).catch(err => {
        console.log(err)
        this.payloading = false
      })
    },
    onCancel() {
      this.$router.back()
    },
    handleFormSubmit() {
      this.$confirm('等待支付结果', '提示', {
        confirmButtonText: '支付成功',
        cancelButtonText: '遇到问题'
      }).then(action => {
        if (action === 'confirm') {
          this.queryBailStatus()
        }
      })
    },
    queryBailStatus() {
      queryBail({ id: this.paydata.orderid }).then(
        res => {
          console.log(res)
          this.$router.push({
            name: 'quoted',
            params: {
              id: this.paydata.orderid
            }
          })
        }
      ).catch(
        err => {
          console.log(err)
          this.$message({
            message: '预付款支付失败，可能是网络原因，请稍后重试！',
            type: 'warn'
          })
        }
      )
    }
  }
}
</script>

<style lang="css">
.submitButton{
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    -webkit-transition: .1s;
    transition: .1s;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 4px;
}
.submitButton.primary {
    color: #fff;
    background-color: #409EFF;
    border-color: #409EFF;
}
.submitButton.is-disabled, .submitButton.is-disabled:focus, .submitButton.is-disabled:hover {
    color: #c0c4cc;
    cursor: not-allowed;
    background-image: none;
    background-color: #fff;
    border-color: #ebeef5;
}
</style>
