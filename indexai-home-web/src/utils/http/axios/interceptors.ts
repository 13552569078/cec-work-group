import axios from 'axios'
import { useUserStoreWithOut } from '/@/store/modules/user'
import { getToken } from '/@/utils/storage/auth'
import { ElMessage } from 'element-plus'
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
// 设置全局请求次数，和再次请求等待毫秒数
axios.defaults.headers.retry = 0
axios.defaults.headers._retryCount = 0
axios.defaults.headers.retryDelay = 1000
const instance = axios.create({
  timeout: 30000
})

// 请求拦截器
instance.interceptors.request.use(
  (request) => {
    // do something before request is sent
    const token = getToken()
    if (token) {
      request.headers.common['Authorization'] = token
    }
    return request
  },
  (err) => {
    return Promise.reject(err)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    const store = useUserStoreWithOut()
    const { data, status } = response
    if (status === 200) {
      const { code, msg } = data
      // code 0 is ok.
      if (code && code !== 200 && code !== 0) {
        ElMessage({
          message: msg || data.message || 'Error',
          type: 'error',
          duration: 5 * 1000
        })

        if (code === 402 || code === 401 || code === 9100) {
          store.logout(true)
        }
        return Promise.reject(response)
      } else {
        return code !== undefined ? data : response
      }
    } else {
      return response
    }
  },
  (err) => {
    const store = useUserStoreWithOut()
    const config = err.config
    // 重复次数为0表示取消重传
    if (config && !config.headers.retry) {
      const { data, status } = err.response
      if (data) {
        if (data.code === 9001 || data.code === 401 || data.code === 403) {
          ElMessage({
            message: '登录已失效，请重新登录！',
            type: 'error',
            duration: 5 * 1000
          })
          store.logout(true)
          return Promise.reject(err)
        }
        if (data.code === 9050) {
          return Promise.reject(err.response)
        }
      }
      if (status && status === 401) {
        ElMessage({
          message: '登录已失效，请重新登录！',
          type: 'error',
          duration: 5 * 1000
        })
        store.logout(true)
        return Promise.reject(err)
      }

      // ElMessage({
      //   message: data.msg,
      //   type: 'error',
      //   duration: 5 * 1000
      // })

      return Promise.reject(err)
    }

    config.headers.__retryCount = config.headers.__retryCount || 0
    if (config.headers.__retryCount >= config.headers.retry) {
      return Promise.reject(err)
    }
    config.headers.__retryCount += 1
    // 增加超时时间
    config.timeout = config.timeout + config.headers.__retryCount * 3000
    const backoff = new Promise<void>(function (resolve) {
      setTimeout(function () {
        resolve()
      }, config.headers.retryDelay || 1000)
    })
    return backoff.then(function () {
      return axios(config)
    })
  }
)

export default {
  // 通用方法
  post<T = any>(url: string, params?: any, config = {}): Promise<T> {
    return instance.post(url, params, config)
  },
  postForm<T = any>(url: string, params?: any): Promise<T> {
    return instance({
      url: `${url}?timer=${new Date().getTime()}`,
      data: params,
      method: 'post',
      transformRequest: [
        function (data) {
          let ret = ''
          // eslint-disable-next-line prefer-const
          for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }
          return ret
        }
      ],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  },
  get<T = any>(url: string, params?: any, config = {}): Promise<T> {
    params = params || {}
    params['timer'] = new Date().getTime()
    return instance.get(`${url}`, {
      params,
      ...config
    })
  },

  put<T = any>(url: string, params?: any): Promise<T> {
    return instance.put(`${url}`, params)
  },

  delete<T = any>(url: string, params?: any): Promise<T> {
    return instance.delete(`${url}`, {
      params: params
    })
  },

  patch<T = any>(url: string, params?: any): Promise<T> {
    return instance.patch(`${url}`, params)
  }
}
