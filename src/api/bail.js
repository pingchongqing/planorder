import request from '@/utils/request'
// 保证金列表
export function bailBillList(data) {
  return request({
    url: '/api/pay/bailBillList',
    method: 'post',
    data
  })
}
// 公司列表
export function companyList(data) {
  return request({
    url: '/api/pay/companyList',
    method: 'post',
    data
  })
}
// 退保证金
export function refundBail(data) {
  return request({
    url: '/api/pay/refundBail',
    method: 'post',
    data
  })
}

// 获取保证金支付信息
export function payBailPage(data) {
  return request({
    url: '/api/pay/payBailPage',
    method: 'post',
    data
  })
}

// 保证金下单
export function createOrderBail(data) {
  return request({
    url: '/api/pay/createOrderBail',
    method: 'post',
    data
  })
}

// 支付竞标订单保证金
export function bankGateway(data) {
  return request({
    url: '/api/pay/bankGateway',
    method: 'post',
    data
  })
}

// 竞标详情
export function bidDetail(data) {
  return request({
    url: '/api/etpBid/bidDetail',
    method: 'post',
    data
  })
}

// 竞标排名
export function bidSort(data) {
  return request({
    url: '/api/etpBid/bidSort',
    method: 'post',
    data
  })
}

// 竞标列表
export function bidList(data) {
  return request({
    url: '/api/etpBid/bidList',
    method: 'post',
    data
  })
}

// 保证金详情
export function retundDetail(data) {
  return request({
    url: '/api/pay/retundDetail',
    method: 'post',
    data
  })
}

// 开通保证金账户
export function openUser(data) {
  return request({
    url: '/api/pay/openUser',
    method: 'post',
    data
  })
}
