const _import = require('./_import_' + process.env.NODE_ENV)

/* Layout */
import Layout from '../views/layout/Layout'

export default {
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
