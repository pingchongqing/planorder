import axios from 'axios'
import store from '@/store'
import { Message, MessageBox } from 'element-ui'
import { LoginPath } from '@/utils'
// import store from '../store'
// import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000 // 请求超时时间
})

// request拦截器
// service.interceptors.request.use(config => {
//   if (store.getters.token) {
//     config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
//   }
//   return config
// }, error => {
//   // Do something with request error
//   console.log(error) // for debug
//   Promise.reject(error)
// })

// respone拦截器
service.interceptors.response.use(
  response => {
  /**
  * code为非20000是抛错 可结合自己业务进行修改
  */
    const res = response.data
    if (res.code !== '0' && res.code !== '200' && res.code !== 'success') {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })

      // 512:未登录;
      if (res.code === '512') {
        MessageBox.alert('验证失败,请重新登录').then(_ => {
          store.dispatch('LogOut').then(() => {
            location.href = `${LoginPath}/logout?service=${location.origin}/csj_login`
          }).catch(() => {
            location.href = `${LoginPath}/logout?service=${location.origin}/csj_login`
          })
        })
      }
      return Promise.reject(res)
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
