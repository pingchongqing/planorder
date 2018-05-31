import request from '@/utils/request'
// 公司列表
export function getGys() {
  return request({
    url: '/planapi/gys/getdata',
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
