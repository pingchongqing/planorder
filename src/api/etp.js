import request from '@/utils/request'

// 根据商品编号获取商品信息{pdtno:pdtno}
export function getProductInfo(data) {
  return request({
    url: '/api/etpOrder/getProductInfo',
    method: 'post',
    data
  })
}

// 发布招标
export function addOrUpdateEtpOrder(data) {
  return request({
    url: '/api/etpOrder/addOrUpdateEtpOrder',
    method: 'post',
    data
  })
}

// 我的招标列表
export function orderList(data) {
  return request({
    url: '/api/etpOrder/orderList',
    method: 'post',
    data
  })
}

// 招标详情
export function orderDetail(data) {
  return request({
    url: '/api/etpOrder/orderDetail',
    method: 'post',
    data
  })
}

// 总价
export function bidList(data) {
  return request({
    url: '/api/etpBid/bidList',
    method: 'post',
    data
  })
}

// 设置中标
export function setWinBid(data) {
  return request({
    url: '/api/etpBid/setWinBid',
    method: 'post',
    data
  })
}

// 开始竞标
export function startEtpOrder(data) {
  return request({
    url: '/api/etpOrder/startEtpOrder',
    method: 'post',
    data
  })
}

// 查询用户是否支付保证金
export function queryBail(data) {
  return request({
    url: '/api/pay/queryBail',
    method: 'post',
    data
  })
}

// 报价开始竞标
export function addOrUpdateEtpBid(data) {
  return request({
    url: '/api/etpBid/addOrUpdateEtpBid',
    method: 'post',
    data
  })
}

// 延长招标时间
export function delayEtpOrderTime(data) {
  return request({
    url: '/api/etpOrder/delayEtpOrderTime',
    method: 'post',
    data
  })
}

// 延长招标时间
export function setWinDetailBid(data) {
  return request({
    url: '/api/etpBid/setWinDetailBid',
    method: 'post',
    data
  })
}

// 删除招标
export function deleteEtpOrder(data) {
  return request({
    url: '/api/etpOrder/deleteEtpOrder',
    method: 'post',
    data
  })
}
