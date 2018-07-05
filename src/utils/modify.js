import { OrderOperate } from '@/api/planorder'
export default function Modify(type, name, needfresh) {
  // 0 审核
  if (type === 0) {
    this.$prompt('请输入审核意见', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then(({ value }) => {
      console.log(value)
      OrderOperate({
        ticketNo: this.$route.params.ticketno,
        checkFlag: type,
        checkUser: this.userInfo.truename,
        checkAdvice: value
      }).then(res => {
        console.log(res)
        this.$message({
          type: 'success',
          message: '审核成功!'
        })
        if (needfresh) {
          this.needfresh()
        } else {
          this.planform[name].status = 1
          this.planform = JSON.parse(JSON.stringify(this.planform))
        }
      }).catch(err => {
        console.log(err)
        this.$message({
          type: 'warn',
          message: '审核失败!'
        })
      })
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '取消审核'
      })
    })
  } else if (type === 1) {
    this.$confirm('是否确定驳回?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      OrderOperate({
        ticketNo: this.$route.params.ticketno,
        checkFlag: type,
        checkUser: this.userInfo.truename
      }).then(res => {
        console.log(res)
        this.planform[name].status = -2
        this.planform = JSON.parse(JSON.stringify(this.planform))
        this.$message({
          type: 'success',
          message: '驳回成功!'
        })
      }).catch(err => {
        console.log(err)
        this.$message({
          type: 'error',
          message: '驳回失败'
        })
      })
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消驳回'
      })
    })
  } else if (type === 3) {
    this.$confirm('是否确定删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      OrderOperate({
        ticketNo: this.$route.params.ticketno,
        checkFlag: type,
        checkUser: this.userInfo.truename
      }).then(res => {
        console.log(res)
        const view = this.visitedViews.filter(v => v.path === this.$route.path)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.$store.dispatch('delVisitedViews', view[0]).then(() => {
          this.$router.push('/')
        })
      }).catch(err => {
        console.log(err)
        this.$message({
          type: 'error',
          message: '删除失败'
        })
      })
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消删除'
      })
    })
  } else if (type === 4) {
    this.$confirm('是否确定作废?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      OrderOperate({
        ticketNo: this.$route.params.ticketno,
        checkFlag: type,
        checkUser: this.userInfo.truename
      }).then(res => {
        console.log(res)
        this.planform[name].status = 2
        this.planform = JSON.parse(JSON.stringify(this.planform))
        this.$message({
          type: 'success',
          message: '作废成功!'
        })
      }).catch(err => {
        console.log(err)
        this.$message({
          type: 'error',
          message: '作废失败'
        })
      })
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消作废'
      })
    })
  }
}
