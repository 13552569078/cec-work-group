import axios from 'axios'
import { Message } from 'ccxd-ux'
import store from '@/store'
import * as router from '@/router'
import { getToken, removeToken } from '@/utils/auth'
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

let notif = null
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 20 * 1000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers.common['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

  /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
  response => {
    const res = response.data
    if (notif) {
      setTimeout(() => {
        notif.close()
      }, 1.5 * 1000)
    }

    const $router = router.default.app.$router

    if (response.config.responseType === 'blob') {
      return response
    }

    if (res.code === 9100) {
      window?.$wujie?.props?.method?.logout?.()
      removeToken()
      notif = Message.error(res.message || res.msg || '服务器错误')
      try {
        if (store.getters.appInfo.logoutUrl) {
          // 如果配置了跳转地址，则跳转相应地址，否则跳转自身的登陆
          window.location.href = store.getters.appInfo.logoutUrl
        } else {
          $router.push('/login')
        }
      } catch (error) {
        $router.push('/login')
      }
      return Promise.reject(res)
    } else if (res.code !== 0 && res.code !== 200) {
      notif = Message.error(res.message || res.msg || '服务器错误')
      return Promise.reject(res)
    }
    return res
  },
  error => {
    console.log('err' + error) // for debug
    if (notif) {
      notif.close()
    }
    notif = Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    // do something to handler your error
    // ssoErrorHandler(error)
    return Promise.reject(error)
  }
)

export default {
  // 通用方法
  post: (url, params, config = {}) => {
    return service.post(url, params, config)
      .then(res => res)
  },
  postForm: (url, params, config = {}) => {
    return service({
      url: `${url}?timer=${new Date().getTime()}`,
      data: params,
      method: 'post',
      transformRequest: [
        function(data) {
          let ret = ''
          // eslint-disable-next-line prefer-const
          for (let it in data) {
            ret +=
              encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }
          return ret
        }
      ],
      ...config,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(res => res)
  },
  get: (url, params, config = {}) => {
    params = params || {}
    params['timer'] = new Date().getTime()
    return service
      .get(`${url}`, {
        params,
        ...config
      })
      .then(res => res)
  },

  put: (url, params) => {
    return service.put(`${url}`, params).then(res => res)
  },

  delete: (url, params) => {
    return service
      .delete(`${url}`, {
        params: params
      })
      .then(res => res)
  },

  patch: (url, params) => {
    return service.patch(`${url}`, params).then(res => res)
  }
}
