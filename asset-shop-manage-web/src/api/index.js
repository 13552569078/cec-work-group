import request from '@/utils/request'
import { getProxyUrl } from './service-suffix.js'
const baseURL = getProxyUrl('asset_shop_manage_server')
const ssoURL = getProxyUrl('sso_uc')

// 获取公共配置信息
export const configInfo = params => request.get(`${baseURL}/api/sys/config/info`, { params })
// 路由菜单权限接口
export const getUserPermissions = (params) => request.get(ssoURL + '/permission/v1/user/getUserPermissions', { params })
// 中枢接口详情
export const queryApimInfo = bizCode => request.get(`${baseURL}/api/shop/pack/api/apim/detail/${bizCode}`)
// export const getUserPermissions = () => new Promise(resolve => {
//   const data = require('../../public/static/permission.json')
//   resolve({ data: JSON.stringify(data) })
// })
