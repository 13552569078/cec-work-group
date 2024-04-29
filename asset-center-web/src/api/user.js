import request from '@/utils/request'
import serviceSuffix, { getProxyUrl } from './service-suffix.js'

const baseURL = getProxyUrl(serviceSuffix.sso_uc)

export const login = (loginAccount, loginPwd) => request.post(baseURL + '/ioc/user/login', { loginAccount, loginPwd })

export const logout = (token) => request.post(baseURL + '/ioc/user/logout', { token })

export const getUserInfo = (token) => request.post(baseURL + '/ioc/user/info', { token })
// 路由菜单权限接口
export const getUserPermissions = (params) => request.get(baseURL + '/permission/v1/user/getUserPermissions', { params })
// export const getUserPermissions = () => new Promise(resolve => {
//   const data = require('../../public/static/permission.json')
//   resolve({ data: JSON.stringify(data) })
// })

