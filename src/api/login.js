import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data: {
      account: username,
      password
    }
  })
}

export function getInfo() {
  return request({
    url: '/api/user/baseInfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/api/auth/logout',
    method: 'post'
  })
}

export function csj_logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}

export function getcsjInfo() {
  return request({
    url: '/apii/home',
    method: 'get'
  })
}
