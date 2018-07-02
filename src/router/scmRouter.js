const _import = require('./_import_' + process.env.NODE_ENV)

/* Layout */
import Layout from '../views/layout/Layout'
import { reportCenterUrl } from '@/utils'

export default [{
  path: '/planorder',
  component: Layout,
  redirect: '/planorder/newplanorder',
  name: 'planorder',
  alwaysShow: true,
  meta: { title: '计划单管理', icon: 'plan', roles: ['service_business', 'service_business_verify', 'service_market'] }, // you can set roles in root nav
  children: [
    {
      path: 'newplanorder',
      component: _import('planorder/newplanorder'),
      name: 'newplanorder',
      meta: {
        title: '新建计划单',
        icon: 'form',
        roles: ['service_market']
      }
    },
    {
      path: 'planorderlist',
      component: _import('planorder/planorderlist'),
      name: 'planorderlist',
      meta: {
        title: '查询计划单',
        icon: 'search',
        roles: ['service_business', 'service_business_verify', 'service_market']
      }
    },
    {
      path: 'plandetail/:ticketno',
      component: _import('planorder/plandetail'),
      name: 'plandetail',
      hidden: true,
      meta: {
        title: '计划单详情',
        roles: ['service_business', 'service_business_verify', 'service_market']
      }
    }
  ]
},
{
  path: '/quotation',
  component: Layout,
  redirect: '/quotation/quotationorderlist',
  name: 'quotation',
  meta: { title: '报价单管理', icon: 'quotation', roles: ['service_business', 'service_business_verify', 'service_market'] }, // you can set roles in root nav
  children: [
    {
      path: 'newquotationorder/:enquiryorder/:type',
      component: _import('quotation/newquotationorder'),
      name: 'newquotationorder',
      hidden: true,
      meta: {
        title: '新建报价单',
        icon: 'form',
        roles: ['service_business', 'service_business_verify']
      }
    },
    {
      path: 'serverquotationorderlist',
      component: _import('quotation/quotationorderlist'),
      name: 'serverquotationorderlist',
      meta: {
        title: '供应商报价单',
        icon: 'search',
        roles: ['service_business', 'service_business_verify', 'service_market']
      }
    },
    {
      path: 'customerquotationorderlist',
      component: _import('quotation/quotationorderlist'),
      name: 'customerquotationorderlist',
      meta: {
        title: '给客户报价单',
        icon: 'search',
        roles: ['service_business', 'service_business_verify', 'service_market']
      }
    },
    {
      path: 'quotationorderdetail/:ticketno',
      component: _import('quotation/quotationorderdetail'),
      hidden: true,
      name: 'quotationorderdetail',
      meta: {
        title: '报价单详情',
        icon: 'form',
        roles: ['service_business', 'service_business_verify', 'service_market']
      }
    }
  ]
},
{
  path: '/purchaseorder',
  component: Layout,
  redirect: '/purchaseorder/purchaseorderlist',
  name: 'purchaseorder',
  alwaysShow: true,
  meta: { title: '采购订单管理', icon: 'purchase', roles: ['service_finance', 'service_business_verify', 'service_business', 'service_market'] }, // you can set roles in root nav
  children: [
    {
      path: 'newpurchaseorder/:enquiryorder',
      component: _import('purchaseorder/newpurchaseorder'),
      name: 'newpurchaseorder',
      hidden: true,
      meta: {
        title: '新建采购订单',
        icon: 'form',
        roles: ['service_business', 'service_business_verify']
      }
    },
    {
      path: 'purchaseorderlist',
      component: _import('purchaseorder/purchaseorderlist'),
      name: 'purchaseorderlist',
      meta: {
        title: '采购订单查询',
        icon: 'search',
        roles: ['service_finance', 'service_business', 'service_business_verify', 'service_market']
      }
    },
    {
      path: 'purchaseorderdetail/:ticketno',
      component: _import('purchaseorder/purchaseorderdetail'),
      name: 'purchaseorderdetail',
      hidden: true,
      meta: {
        title: '采购订单详情',
        icon: 'form',
        roles: ['service_finance', 'service_business', 'service_business_verify', 'service_market']
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
  meta: { title: '销售订单管理', icon: 'sale', roles: ['service_finance', 'service_business', 'service_business_verify', 'service_market'] }, // you can set roles in root nav
  children: [
    {
      path: 'newsaleorder/:enquiryorder',
      component: _import('saleorder/newsaleorder'),
      name: 'newsaleorder',
      hidden: true,
      meta: {
        title: '新建销售订单',
        icon: 'form',
        roles: ['service_business', 'service_business_verify']
      }
    },
    {
      path: 'saleorderlist',
      component: _import('saleorder/saleorderlist'),
      name: 'saleorderlist',
      meta: {
        title: '销售订单查询',
        icon: 'search',
        roles: ['service_business', 'service_business_verify', 'service_finance', 'service_market']
      }
    },
    {
      path: 'saleorderdetail/:ticketno',
      component: _import('saleorder/saleorderdetail'),
      name: 'saleorderdetail',
      hidden: true,
      meta: {
        title: '销售订单详情',
        icon: 'form',
        roles: ['service_business', 'service_business_verify', 'service_finance', 'service_market']
      }
    }
  ]
},
{
  path: '/inmanage',
  component: Layout,
  redirect: '/inmanage/innoticelist',
  name: 'inmanage',
  meta: { title: '收货管理', icon: 'in', roles: ['service_business', 'service_business_verify', 'service_finance', 'service_sell', 'service_market'] }, // you can set roles in root nav
  children: [
    {
      path: 'newinnotice/:ticketno',
      component: _import('innotice/newinnotice'),
      name: 'newinnotice',
      hidden: true,
      meta: {
        title: '新建收货通知单',
        icon: 'form',
        roles: ['service_business', 'service_business_verify']
      }
    },
    {
      path: 'innoticelist',
      component: _import('innotice/innoticelist'),
      name: 'innoticelist',
      meta: {
        title: '收货通知单查询',
        icon: 'search',
        roles: ['service_business', 'service_business_verify', 'service_finance', 'service_sell', 'service_market']
      }
    },
    {
      path: 'innoticedetail/:ticketno',
      component: _import('innotice/innoticedetail'),
      hidden: true,
      name: 'innoticedetail',
      meta: {
        title: '收货通知单详情',
        icon: 'form',
        roles: ['service_business', 'service_business_verify', 'service_finance', 'service_sell', 'service_market']
      }
    },
    {
      path: 'newinstore/:ticketno',
      component: _import('instore/newinstore'),
      name: 'newinstore',
      hidden: true,
      meta: {
        title: '新建入库单',
        icon: 'form',
        roles: ['service_business', 'service_business_verify']
      }
    },
    {
      path: 'instorelist',
      component: _import('instore/instorelist'),
      name: 'instorelist',
      meta: {
        title: '入库单查询',
        icon: 'search',
        roles: ['service_business', 'service_business_verify', 'service_finance', 'service_sell', 'service_market']
      }
    },
    {
      path: 'instoredetail/:ticketno',
      component: _import('instore/instoredetail'),
      hidden: true,
      name: 'instoredetail',
      meta: {
        title: '入库单详情',
        icon: 'form',
        roles: ['service_business', 'service_business_verify', 'service_finance', 'service_sell', 'service_market']
      }
    }
  ]
},
{
  path: '/outmanage',
  component: Layout,
  redirect: '/outmanage/outnoticelist',
  name: 'outmanage',
  meta: { title: '发货管理', icon: 'out', roles: ['service_business', 'service_business_verify', 'service_finance', 'service_sell', 'service_market'] }, // you can set roles in root nav
  children: [
    {
      path: 'newoutnotice/:ticketno',
      component: _import('outnotice/newoutnotice'),
      name: 'newoutnotice',
      hidden: true,
      meta: {
        title: '新建发货通知单',
        icon: 'form',
        roles: ['service_business', 'service_business_verify']
      }
    },
    {
      path: 'outnoticelist',
      component: _import('outnotice/outnoticelist'),
      name: 'outnoticelist',
      meta: {
        title: '发货通知单查询',
        icon: 'search',
        roles: ['service_business', 'service_business_verify', 'service_finance', 'service_sell', 'service_market']
      }
    },
    {
      path: 'outnoticedetail/:ticketno',
      component: _import('outnotice/outnoticedetail'),
      hidden: true,
      name: 'outnoticedetail',
      meta: {
        title: '发货通知单详情',
        icon: 'form',
        roles: ['service_business', 'service_business_verify', 'service_finance', 'service_sell', 'service_market']
      }
    },
    {
      path: 'newoutstore/:ticketno',
      component: _import('outstore/newoutstore'),
      name: 'newoutstore',
      hidden: true,
      meta: {
        title: '新建出库单',
        icon: 'form',
        roles: ['service_business', 'service_business_verify']
      }
    },
    {
      path: 'outstorelist',
      component: _import('outstore/outstorelist'),
      name: 'outstorelist',
      meta: {
        title: '出库单查询',
        icon: 'search',
        roles: ['service_business', 'service_business_verify', 'service_finance', 'service_sell', 'service_market']
      }
    },
    {
      path: 'outstoredetail/:ticketno',
      component: _import('outstore/outstoredetail'),
      hidden: true,
      name: 'outstoredetail',
      meta: {
        title: '出库单详情',
        icon: 'form',
        roles: ['service_business', 'service_business_verify', 'service_finance', 'service_sell', 'service_market']
      }
    }
  ]
},
{
  path: '/payment',
  component: Layout,
  redirect: '/payment/newpayment',
  name: 'payment',
  meta: { title: '付款管理', icon: 'tree', roles: ['service_finance'] }, // you can set roles in root nav
  children: [
    {
      path: 'newpayment',
      component: _import('payment/newpayment'),
      name: 'newpayment',
      meta: {
        title: '新建付款单',
        icon: 'form',
        roles: ['service_finance']
      }
    },
    {
      path: 'paymentlist',
      component: _import('payment/paymentlist'),
      name: 'paymentlist',
      meta: {
        title: '付款单查询',
        icon: 'search',
        roles: ['service_finance']
      }
    },
    {
      path: 'paymentdetail/:ticketno',
      component: _import('payment/paymentdetail'),
      hidden: true,
      name: 'paymentdetail',
      meta: {
        title: '付款单详情',
        icon: 'form',
        roles: ['service_finance']
      }
    }
  ]
},
{
  path: '/receivable',
  component: Layout,
  redirect: '/receivable/newreceivable',
  name: 'receivable',
  meta: { title: '收款管理', icon: 'tree', roles: ['service_finance'] }, // you can set roles in root nav
  children: [
    {
      path: 'newreceivable',
      component: _import('receivable/newreceivable'),
      name: 'newreceivable',
      meta: {
        title: '新建收款单',
        icon: 'form',
        roles: ['service_finance']
      }
    },
    {
      path: 'receivablelist',
      component: _import('receivable/receivablelist'),
      name: 'receivablelist',
      meta: {
        title: '收款单查询',
        icon: 'search',
        roles: ['service_finance']
      }
    },
    {
      path: 'receivabledetail/:ticketno',
      component: _import('receivable/receivabledetail'),
      hidden: true,
      name: 'receivabledetail',
      meta: {
        title: '收款单详情',
        icon: 'form',
        roles: ['service_finance']
      }
    }
  ]
},
{
  path: '/invoice/inputinvoice',
  component: Layout,
  redirect: '/invoice/inputinvoice/newinputinvoice',
  name: 'inputinvoice',
  meta: { title: '进项发票', icon: 'tree', roles: ['service_finance'] }, // you can set roles in root nav
  children: [
    {
      path: 'newinputinvoice',
      component: _import('invoice/inputinvoice/newinputinvoice'),
      name: 'newinputinvoice',
      meta: {
        title: '新建进项发票',
        icon: 'form',
        roles: ['service_finance']
      }
    },
    {
      path: 'inputinvoicelist',
      component: _import('invoice/inputinvoice/inputinvoicelist'),
      name: 'inputinvoicelist',
      meta: {
        title: '进项发票查询',
        icon: 'search',
        roles: ['service_finance']
      }
    },
    {
      path: 'inputinvoicedetail/:ticketno',
      component: _import('invoice/inputinvoice/inputinvoicedetail'),
      hidden: true,
      name: 'inputinvoicedetail',
      meta: {
        title: '进项发票详情',
        icon: 'form',
        roles: ['service_finance']
      }
    }
  ]
},
{
  path: '/invoice/outputinvoice',
  component: Layout,
  redirect: '/invoice/outputinvoice/newoutputinvoice',
  name: 'outputinvoice',
  meta: { title: '销项发票', icon: 'tree', roles: ['service_finance'] }, // you can set roles in root nav
  children: [
    {
      path: 'newoutputinvoice',
      component: _import('invoice/outputinvoice/newoutputinvoice'),
      name: 'newoutputinvoice',
      meta: {
        title: '申请销项发票',
        icon: 'form',
        roles: ['service_finance']
      }
    },
    {
      path: 'outputinvoicelist',
      component: _import('invoice/outputinvoice/outputinvoicelist'),
      name: 'outputinvoicelist',
      meta: {
        title: '开票申请查询',
        icon: 'search',
        roles: ['service_finance']
      }
    },
    {
      path: 'outputinvoiceresultlist',
      component: _import('invoice/outputinvoice/outputinvoiceresultlist'),
      name: 'outputinvoiceresultlist',
      meta: {
        title: '开票结果查询',
        icon: 'search',
        roles: ['service_finance']
      }
    },
    {
      path: 'outputinvoicedetail/:ticketno',
      component: _import('invoice/outputinvoice/outputinvoicedetail'),
      hidden: true,
      name: 'outputinvoicedetail',
      meta: {
        title: '销项开票申请详情',
        icon: 'form',
        roles: ['service_finance']
      }
    },
    {
      path: 'outputinvoiceresultdetail/:ticketno',
      component: _import('invoice/outputinvoice/outputinvoiceresultdetail'),
      hidden: true,
      name: 'outputinvoiceresultdetail',
      meta: {
        title: '销项开票详情',
        icon: 'form',
        roles: ['service_finance']
      }
    },
    {
      path: 'makeoutinvoice/:ticketno',
      component: _import('invoice/outputinvoice/makeoutinvoice'),
      hidden: true,
      name: 'makeoutinvoice',
      meta: {
        title: '财务开票',
        icon: 'form',
        roles: ['service_finance']
      }
    }
  ]
},
{
  path: '/stock',
  component: Layout,
  redirect: '/stock/stocklist',
  name: 'stock',
  meta: { title: '库存查询', icon: 'stock' },
  children: [
    {
      path: 'stocklist',
      component: _import('stock/stocklist'),
      name: 'stocklist',
      meta: {
        title: '库存查询',
        icon: 'stock'
      }
    }
  ]
},
{
  name: 'reportcenter',
  path: '/reportcenter',
  outLinkUrl: reportCenterUrl('supply_invin_main'),
  meta: { title: '报表中心', icon: 'stock' },
  children: [
    {
      name: 'supply_invin_main',
      path: 'supply_invin_main',
      outLinkUrl: reportCenterUrl('supply_invin_main'),
      meta: {
        title: '采购入库明细表',
        icon: 'stock',
        roles: ['service_finance']
      }
    },
    {
      name: 'supply_invout_main',
      path: 'supply_invout_main',
      outLinkUrl: reportCenterUrl('supply_invout_main'),
      meta: {
        title: '销售出库明细表',
        icon: 'stock',
        roles: ['service_finance']
      }
    },
    {
      name: 'supply_stock',
      path: 'supply_stock',
      outLinkUrl: reportCenterUrl('supply_stock'),
      meta: {
        title: '库存明细表',
        icon: 'stock',
        roles: ['service_finance']
      }
    }
  ]
}]
