// 老用户中心相关接口
import settings from '@/settings.js'
import request from '@/utils/request'
import serviceSuffix, { getProxyUrl } from '@/api/service-suffix.js'

const baseURL = getProxyUrl(serviceSuffix.sso_uc)
const fx_gateway = getProxyUrl(serviceSuffix.fx_gateway)

export const login = (loginAccount, loginPwd) => request.post(baseURL + '/ioc/user/login', { loginAccount, loginPwd })

// 因为要带cookie不能走网关
export const logout = window.usre_center_server + '/permission/logout?post_logout_redirect_uri=' + encodeURIComponent(settings.logoutToUrl) + '&state'

export const getUserInfo = () => request.post(baseURL + '/permission/v1/user/getLoginUserInfo')

// 获取领导驾驶仓的用户数
export const fetchUnitUserTree = () => request({
  url: baseURL + '/ioc/dept/all-info-detail?type=0',
  method: 'get',
  timeout: 20000
})

export const login_url = `${fx_gateway}/login/oauth2/authorization?registrationId=asset-center&loginSuccessUrl=`
