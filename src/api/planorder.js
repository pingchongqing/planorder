import request from '@/utils/request'
// 公司列表
export function getGys() {
  return request({
    url: '/yyjapi/api/gys/getdata',
    method: 'get'
  })
}

export function addOrUpdateenquiryOrder(data) {
  return request({
    url: '/planapi/api/enquiryOrder/addOrUpdateEnquiryOrder',
    method: 'post',
    data: data
  })
}

export function List(data) {
  return request({
    url: '/planapi/api/enquiryOrder/main/list',
    method: 'post',
    data: data
  })
}

export function DetailInfo(data) {
  return request({
    url: '/planapi/api/enquiryOrder/detailInfo',
    method: 'post',
    data: data
  })
}

// 新增销售单
export function addOrUpdateSaleOrder(data) {
  return request({
    url: '/planapi/api/saleOrder/addOrUpdateSaleOrder',
    method: 'post',
    data: data
  })
}

// 新增采购单
export function addOrUpdatePurchaseOrder(data) {
  return request({
    url: '/jqmapi/api/purchorder/addOrUpdatePurchaseOrder',
    method: 'post',
    data: data
  })
}

// 查询仓库接口
export function StroeList(data) {
  return request({
    url: '/yyjapi/api/store/getdata',
    method: 'get',
    data: data
  })
}

// 查询仓库接口
export function SaleList(data) {
  return request({
    url: '/planapi/api/saleOrder/main/list',
    method: 'post',
    data: data
  })
}

// 销售单详情
export function SaleDetailInfo(data) {
  return request({
    url: '/planapi/api/saleOrder/detailInfo',
    method: 'post',
    data: data
  })
}

// 采购单列表
export function PurchorderList(data) {
  return request({
    url: '/yyjapi/api/purchorder/getpurchorderMain',
    method: 'post',
    data: data
  })
}

// 采购单详情
export function PurchorderDetail(data) {
  return request({
    url: '/yyjapi/api/purchorder/getpurchorder',
    method: 'post',
    data: data
  })
}

// 新增报价单POST
export function addOrUpdateQuotationOrder(data) {
  return request({
    url: '/planapi/api/quotation/addOrUpdateQuotationOrder',
    method: 'post',
    data: data
  })
}

// 获取计划单详情用于报价单
export function GetEnquiryInfo(data) {
  return request({
    url: '/planapi/api/quotation/getEnquiryInfo',
    method: 'post',
    data: data
  })
}

// 报价单查询
export function GetQuotationList(data) {
  return request({
    url: '/planapi/api/quotation/main/list',
    method: 'post',
    data: data
  })
}

// 报价单详情
export function GetQuotationDetail(data) {
  return request({
    url: '/planapi/api/quotation/detailInfo',
    method: 'post',
    data: data
  })
}

// 审核删除保存草稿
export function OrderOperate(data) {
  return request({
    url: '/jqmapi/api/order/orderOperate',
    method: 'post',
    data: data
  })
}

// 获取新增发货通知单信息
export function GetSaleOrderInfo(data) {
  return request({
    url: '/planapi/api/outNotice/getSaleOrderInfo',
    method: 'post',
    data: data
  })
}

// 新增发货通知单
export function addOrUpdateOutNotice(data) {
  return request({
    url: '/planapi/api/outNotice/addOrUpdateOutNotice',
    method: 'post',
    data: data
  })
}

// 发货通知单列表
export function OutNoticeList(data) {
  return request({
    url: '/planapi/api/outNotice/main/list',
    method: 'post',
    data: data
  })
}

// 发货通知单详情
export function OutNoticeDetail(data) {
  return request({
    url: '/planapi/api/outNotice/detailInfo',
    method: 'post',
    data: data
  })
}

// 新增收货通知
export function addOrUpdateInoticeOrder(data) {
  return request({
    url: '/jqmapi/api/inoticeOrder/addOrUpdateInoticeOrder',
    method: 'post',
    data: data
  })
}

// 收货通知列表
export function InNoticeList(data) {
  return request({
    url: '/jqmapi/api/inoticeOrder/getMainDetail',
    method: 'post',
    data: data
  })
}

// 收货通知详情POST /api/inoticeOrder/getItemDetail
export function InNoticeDetail(data) {
  return request({
    url: '/jqmapi/api/inoticeOrder/getItemDetail',
    method: 'post',
    data: data
  })
}

// 获取新建出库单信息 /api/outOrder/getOutNoticeInfo
export function getOutNoticeInfo(data) {
  return request({
    url: '/planapi/api/outOrder/getOutNoticeInfo',
    method: 'post',
    data: data
  })
}

// 新建出库单
export function addOrUpdateOutOrder(data) {
  return request({
    url: '/planapi/api/outOrder/addOrUpdateOutOrder',
    method: 'post',
    data: data
  })
}

// 出库单列表
export function OutStoreList(data) {
  return request({
    url: '/planapi/api/outOrder/main/list',
    method: 'post',
    data: data
  })
}

// 出库单详情POST /api/outOrder/detailInfo
export function OutStoreDetail(data) {
  return request({
    url: '/planapi/api/outOrder/detailInfo',
    method: 'post',
    data: data
  })
}

// 入库单列表
export function InstoreList(data) {
  return request({
    url: '/yyjapi/api/inorder/getinorderMain',
    method: 'post',
    data: data
  })
}

// 新增入库单
export function addOrUpdateInOrder(data) {
  return request({
    url: '/yyjapi/api/inorder/addOrUpdateInOrder',
    method: 'post',
    data: data
  })
}

// 入库单详情
export function InStoreDetail(data) {
  return request({
    url: '/yyjapi/api/inorder/getinorder',
    method: 'post',
    data: data
  })
}
