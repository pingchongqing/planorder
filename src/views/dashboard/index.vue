<template>
  <div class="dashboard-container">
    <el-card class="box-card" >
      <p><svg-icon icon-class="user" /> {{userInfo.truename}}</p>
      <p>
        <svg-icon icon-class="phone" /> {{userInfo.phone}}
        <el-tooltip class="item" effect="dark" :content="tipcontent" placement="right">
          <span :class="{'elsuccess': userInfo.openaccount === '4', 'elwarning': userInfo.openaccount === '5'}">
            <i :class="{'el-icon-success': userInfo.openaccount === '4', 'el-icon-warning': userInfo.openaccount === '5'}"></i>
          </span>
        </el-tooltip>
      </p>
      <p><svg-icon icon-class="email" /> {{userInfo.email}}</p>
      <p><svg-icon icon-class="company" /> {{userInfo.companyname}}</p>
    </el-card>
    <el-card class="box-card" v-if="!userInfo.openaccount && userInfo.type === 7">
      <div style="height:50px">您当前还未开通预付款账户</div>
      <form id="openuserForm" target="_blank" :action="openUserData.openUserUrl" ref="hiddenForm" method="post">
        <input type="hidden" name="version" :value="openUserData.openUser.version" />
        <input type="hidden" name="oid_partner" :value="openUserData.openUser.oid_partner"/>
        <input type="hidden" name="user_id" :value="openUserData.openUser.user_id"/>
        <input type="hidden" name="sign_type" :value="openUserData.openUser.sign_type"/>
        <input type="hidden" name="sign" :value="openUserData.sign"/>
        <input type="hidden" name="userreq_ip" :value="openUserData.openUser.userreq_ip"/>
        <input type="hidden" name="type_user" :value="openUserData.openUser.type_user"/>
        <input type="hidden" name="timestamp" :value="openUserData.openUser.timestamp"/>
        <input type="hidden" name="notify_url" :value="openUserData.openUser.notify_url"/>
        <input type="hidden" name="open_account_notify_url" :value="openUserData.openUser.open_account_notify_url"/>
        <input type="hidden" name="url_return" :value="openUserData.openUser.url_return"/>
        <input type="submit" value="立即开通" class="submitButton primary" :class="disclass" :disabled="openloading" @click="handleFormSubmit" ></input>
        </form>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { openUser } from '@/api/bail'

export default {
  name: 'dashboard',
  data() {
    return {
      openloading: false,
      openUserData: {
        openUser: {}
      },
      disclass: 'is-disabled'
    }
  },
  computed: {
    tipcontent() {
      if (this.userInfo.openaccount === '4') {
        return '已开通预付款账户'
      }
      if (this.userInfo.openaccount === '5') {
        return '预付款账户待审核'
      }
    },
    ...mapGetters([
      'userInfo'
    ])
  },
  created() {
    if (!this.userInfo.openaccount) {
      this.getOpenUserData()
    }
  },
  methods: {
    getOpenUserData() {
      this.openloading = true
      openUser().then(
        res => {
          console.log(res)
          this.openloading = false
          this.disclass = ''
          this.openUserData = res.data
        }
      ).catch(err => {
        this.openloading = false
        console.log(err)
      })
    },
    handleFormSubmit() {
      this.$confirm('等待账户开通结果', '提示', {
        confirmButtonText: '开户成功',
        cancelButtonText: '遇到问题'
      }).then(action => {
        if (action === 'confirm') {
          console.log(action)
          this.$store.dispatch('GetInfo').then(() => {
            if (this.userInfo.openaccount) {
              this.$message({
                message: '开通账户成功!',
                type: 'success'
              })
            } else {
              this.$message({
                message: '开通账户失败!',
                type: 'warning'
              })
            }
          })
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.box-card {
  width: 32%;
  float: left;
  margin-right: 2%;
  height: 188px;
  &:last-child {
    margin-right: 0;
  }
}
.elsuccess {
  color: green;
}
.elwarning {
  color: #ff6600;
}
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
