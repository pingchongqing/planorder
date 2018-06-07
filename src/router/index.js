import Vue from 'vue'
import Router from 'vue-router'
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
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  { path: '/401', component: () => import('@/views/401'), hidden: true },
  { path: '/payresult', component: () => import('@/views/payresult'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: 'dashboard',
    hidden: true,
    children: [{
      name: 'dashboard',
      path: '/dashboard',
      meta: { title: '主页', noCache: true },
      component: () => import('@/views/dashboard/index')
    }]
  },
  {
    path: '/planorder',
    component: Layout,
    redirect: '/planorder/newplanorder',
    name: 'planorder',
    alwaysShow: true,
    meta: { title: '计划单', icon: 'tree' }, // you can set roles in root nav
    children: [
      {
        path: 'newplanorder',
        component: _import('planorder/newplanorder'),
        name: 'newplanorder',
        meta: {
          title: '新建计划单',
          icon: 'form'
        }
      },
      {
        path: 'planorderlist',
        component: _import('planorder/planorderlist'),
        name: 'planorderlist',
        meta: {
          title: '计划单查询',
          icon: 'tree'
        }
      },
      {
        path: 'plandetail/:ticketno',
        component: _import('planorder/plandetail'),
        name: 'plandetail',
        hidden: true,
        meta: {
          title: '计划单详情'
        }
      }
    ]
  },
  {
    path: '/saleorder',
    component: Layout,
    redirect: '/saleorder/saleorderlist',
    name: 'saleorder',
    alwaysShow: false,
    meta: { title: '销售单', icon: 'tree' }, // you can set roles in root nav
    children: [
      {
        path: 'newsaleorder/:enquiryorder',
        component: _import('saleorder/newsaleorder'),
        name: 'newsaleorder',
        hidden: true,
        meta: {
          title: '新建销售单',
          icon: 'form'
        }
      },
      {
        path: 'saleorderlist',
        component: _import('saleorder/saleorderlist'),
        name: 'saleorderlist',
        meta: {
          title: '销售单查询',
          icon: 'form'
        }
      },
      {
        path: 'saleorderdetail/:ticketno',
        component: _import('saleorder/saleorderdetail'),
        name: 'saleorderdetail',
        hidden: true,
        meta: {
          title: '销售单详情',
          icon: 'form'
        }
      }
    ]
  },
  {
    path: '/purchaseorder',
    component: Layout,
    redirect: '/purchaseorder/newpurchaseorder',
    name: 'purchaseorder',
    alwaysShow: true,
    meta: { title: '采购单', icon: 'tree' }, // you can set roles in root nav
    children: [
      {
        path: 'newpurchaseorder/:enquiryorder',
        component: _import('purchaseorder/newpurchaseorder'),
        name: 'newpurchaseorder',
        hidden: true,
        meta: {
          title: '新建采购单',
          icon: 'form'
        }
      },
      {
        path: 'purchaseorderlist',
        component: _import('purchaseorder/purchaseorderlist'),
        name: 'purchaseorderlist',
        meta: {
          title: '采购单查询',
          icon: 'form'
        }
      },
      {
        path: 'purchaseorderdetail/:ticketno',
        component: _import('purchaseorder/purchaseorderdetail'),
        name: 'purchaseorderdetail',
        hidden: true,
        meta: {
          title: '采购单详情',
          icon: 'form'
        }
      }
    ]
  },
  {
    path: '/quotation',
    component: Layout,
    redirect: '/quotation/quotationorderlist',
    name: 'quotation',
    meta: { title: '报价单', icon: 'tree' }, // you can set roles in root nav
    children: [
      {
        path: 'newquotationorder/:enquiryorder/:type',
        component: _import('quotation/newquotationorder'),
        name: 'newquotationorder',
        hidden: true,
        meta: {
          title: '新建报价单',
          icon: 'form'
        }
      },
      {
        path: 'quotationorderlist',
        component: _import('quotation/quotationorderlist'),
        name: 'quotationorderlist',
        meta: {
          title: '报价单查询',
          icon: 'form'
        }
      },
      {
        path: 'quotationorderdetail/:ticketno',
        component: _import('quotation/quotationorderdetail'),
        hidden: true,
        name: 'quotationorderdetail',
        meta: {
          title: '报价单详情',
          icon: 'form'
        }
      }
    ]
  },
  {
    path: '/outnotice',
    component: Layout,
    redirect: '/outnotice/outnoticelist',
    name: 'outnotice',
    meta: { title: '发货通知单', icon: 'tree' }, // you can set roles in root nav
    children: [
      {
        path: 'newoutnotice/:ticketno',
        component: _import('outnotice/newoutnotice'),
        name: 'newoutnotice',
        hidden: true,
        meta: {
          title: '新建发货通知单',
          icon: 'form'
        }
      },
      {
        path: 'outnoticelist',
        component: _import('outnotice/outnoticelist'),
        name: 'outnoticelist',
        meta: {
          title: '发货通知单查询',
          icon: 'form'
        }
      },
      {
        path: 'outnoticedetail/:ticketno',
        component: _import('outnotice/outnoticedetail'),
        hidden: true,
        name: 'outnoticedetail',
        meta: {
          title: '发货通知单详情',
          icon: 'form'
        }
      }
    ]
  },
  {
    path: '/innotice',
    component: Layout,
    redirect: '/innotice/innoticelist',
    name: 'innotice',
    meta: { title: '收货通知单', icon: 'tree' }, // you can set roles in root nav
    children: [
      {
        path: 'newinnotice/:ticketno',
        component: _import('innotice/newinnotice'),
        name: 'newinnotice',
        hidden: true,
        meta: {
          title: '新建收货通知单',
          icon: 'form'
        }
      },
      {
        path: 'innoticelist',
        component: _import('innotice/innoticelist'),
        name: 'innoticelist',
        meta: {
          title: '收货通知单查询',
          icon: 'form'
        }
      },
      {
        path: 'innoticedetail/:ticketno',
        component: _import('innotice/innoticedetail'),
        hidden: true,
        name: 'innoticedetail',
        meta: {
          title: '收货通知单详情',
          icon: 'form'
        }
      }
    ]
  },
  {
    path: '/outstore',
    component: Layout,
    redirect: '/outstore/outstorelist',
    name: 'outstore',
    meta: { title: '出库单', icon: 'tree' }, // you can set roles in root nav
    children: [
      {
        path: 'newoutstore/:ticketno',
        component: _import('outstore/newoutstore'),
        name: 'newoutstore',
        hidden: true,
        meta: {
          title: '新建出库单',
          icon: 'form'
        }
      },
      {
        path: 'outstorelist',
        component: _import('outstore/outstorelist'),
        name: 'outstorelist',
        meta: {
          title: '出库单查询',
          icon: 'form'
        }
      },
      {
        path: 'outstoredetail/:ticketno',
        component: _import('outstore/outstoredetail'),
        hidden: true,
        name: 'outstoredetail',
        meta: {
          title: '出库单详情',
          icon: 'form'
        }
      }
    ]
  },
  {
    path: '/instore',
    component: Layout,
    redirect: '/instore/outstorelist',
    name: 'instore',
    meta: { title: '入库单', icon: 'tree' }, // you can set roles in root nav
    children: [
      {
        path: 'newinstore/:ticketno',
        component: _import('instore/newinstore'),
        name: 'newinstore',
        hidden: true,
        meta: {
          title: '新建入库单',
          icon: 'form'
        }
      },
      {
        path: 'instorelist',
        component: _import('instore/instorelist'),
        name: 'instorelist',
        meta: {
          title: '入库单查询',
          icon: 'form'
        }
      },
      {
        path: 'instoredetail/:ticketno',
        component: _import('instore/instoredetail'),
        hidden: true,
        name: 'instoredetail',
        meta: {
          title: '入库单详情',
          icon: 'form'
        }
      }
    ]
  }
]

export default new Router({
  mode: 'history', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/etp',
    component: Layout,
    redirect: '/etp/addetp',
    name: 'etp',
    alwaysShow: true,
    meta: { title: '招投标', roles: ['701', '710'], icon: 'table' }, // you can set roles in root nav
    children: [
      {
        path: 'addetp',
        component: _import('enterprice/index'),
        name: 'addetp',
        meta: {
          title: '我要发标',
          icon: 'form',
          roles: ['701']
        }
      },
      {
        path: 'myetp',
        component: _import('enterprice/myetp'),
        name: 'myetp',
        meta: {
          title: '我的招标',
          icon: 'busyness',
          roles: ['701']
        }
      },
      {
        path: 'bail',
        component: _import('bail/index'),
        name: 'bail',
        meta: {
          title: '保证金管理',
          icon: 'money',
          roles: ['701']
        }
      },
      {
        path: 'etpdetail/:id',
        component: _import('enterprice/etpdetail'),
        name: 'etpdetail',
        hidden: true,
        meta: {
          title: '招标详情',
          roles: ['701']
        }
      },
      {
        path: 'tenderdetail/:id',
        component: _import('enterprice/tenderdetail'),
        name: 'tenderdetail',
        hidden: true,
        meta: {
          title: '明细中标',
          roles: ['701']
        }
      },
      {
        path: 'etpdetailsale/:id',
        component: _import('enterprice/etpdetail'),
        name: 'etpdetailsale',
        hidden: true,
        meta: {
          title: '招标详情',
          roles: ['710']
        }
      },
      {
        path: 'bidlist/:tpnumber',
        component: _import('enterprice/bidlist'),
        name: 'bidlist',
        hidden: true,
        meta: {
          title: '总价中标',
          roles: ['701']
        }
      },
      {
        path: 'etpcenter',
        component: _import('enterprice/etpcenter'),
        name: 'etpcenter',
        meta: {
          title: '招标公告中心',
          roles: ['710'],
          icon: 'example'
        }
      },
      {
        path: 'bidrecord',
        component: _import('bail/bidrecord'),
        name: 'bidrecord',
        meta: {
          title: '竞标记录',
          roles: ['710'],
          icon: 'tree'
        }
      },
      {
        path: 'baillist',
        component: _import('bail/baillist'),
        name: 'baillist',
        meta: {
          title: '已交保证金',
          roles: ['710'],
          icon: 'money'
        }
      },
      {
        path: 'quoted/:id',
        component: _import('enterprice/quoted'),
        name: 'quoted',
        hidden: true,
        meta: {
          title: '竞标报价',
          roles: ['710'],
          icon: 'example'
        }
      },
      {
        path: 'biddetail/:id',
        component: _import('enterprice/biddetail'),
        name: 'biddetail',
        hidden: true,
        meta: {
          title: '竞标详情',
          roles: ['710', '701']
        }
      },
      {
        path: 'paybail/:id',
        component: _import('enterprice/paybail'),
        name: 'paybail',
        hidden: true,
        meta: {
          title: '支付竞标保证金',
          roles: ['710']
        }
      }
    ]
  }
]
