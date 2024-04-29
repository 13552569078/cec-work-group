import axios from 'axios'
import { Message } from 'fx-asset-ui'
import store from '@/store'
import { getToken } from '@l/utils/auth'
import settings from '@/settings'

const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API,
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 1000 * 30
})

service.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    config.headers['referer-custom'] = window.location.href
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    if (+res.code !== settings.resSuccessCode) {
      if (res.code === 1404) return res
      if (res.code + '' === '200010000') return res

      if (res.code === settings.resTokenErrorCode || res.code === 9100 || res.code === '1A0101') {
        console.log(res.code, res.data)
        store.dispatch('user/resetToken', res.data)
        return
      }
      Message({
        message: res.message || res.msg || '服务端错误',
        type: 'error',
        duration: 5 * 1000
      })

      return Promise.reject(new Error(res.message || res.msg || '服务端错误'))
    } else {
      return res
    }
  },
  error => {
    if (error.response.status === 401) return Promise.reject(error)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
