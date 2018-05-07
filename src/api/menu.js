import request from '@/utils/request'

export function getMenu() {
  return request({
    url: '/api/sys/menu',
    method: 'get',
    data: {}
  })
}
