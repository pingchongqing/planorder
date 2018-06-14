import Vue from 'vue'
import Router from 'vue-router'
import etpRouter from './etpRouter'
import scmRouter from './scmRouter'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  // { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/login', redirect: '/csj_login', hidden: true },
  { path: '/404', component: _import('404'), hidden: true },
  { path: '/401', component: _import('401'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: 'dashboard',
    hidden: true,
    children: [{
      name: 'dashboard',
      path: '/dashboard',
      meta: { title: '主页', noCache: true },
      component: _import('dashboard/index')
    }]
  }
]

export default new Router({
  mode: 'hash', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  ...scmRouter,
  etpRouter
]
