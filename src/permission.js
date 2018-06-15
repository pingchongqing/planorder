import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { MessageBox } from 'element-ui'
import { LoginPath } from '@/utils'
// import { getToken } from '@/utils/auth' // 验权

// permissiom judge function
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('service_admin') >= 0) return true // admin permission passed directly
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

// const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.path === '/csj_login') {
    // next({ path: '/' })
    next()
    NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
  } else {
    if (store.getters.roles.length === 0) {
      store.dispatch('GetInfo').then(res => { // 拉取用户信息
        let enterpriseRole = []
        if (res.data.type && res.data.sale && res.data.purchase) {
          enterpriseRole = [res.data.type.toString() + res.data.sale + res.data.purchase]
        }
        const scmRol = res.data.roles
        const roles = [...enterpriseRole, ...scmRol] // note: roles must be a array! such as: ['editor','develop']
        store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
          router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
          next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
        })
      }).catch(() => {
        store.dispatch('FedLogOut').then(() => {
          // Message.error('验证失败,请重新登录')
          // next({ path: '/csj_login' })
          // location.href = '/csj_login'
          MessageBox.alert('验证失败,请重新登录').then(_ => {
            store.dispatch('LogOut').then(() => {
              location.href = `${LoginPath}/logout?service=${location.origin}/csj_login`
            }).catch(() => {
              location.href = `${LoginPath}/logout?service=${location.origin}/csj_login`
            })
          })
        })
      })
    } else {
      next()
      // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
      if (hasPermission(store.getters.roles, to.meta.roles)) {
        next()//
      } else {
        next({ path: '/401', replace: true, query: { noGoBack: true }})
      }
      // 可删 ↑
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
