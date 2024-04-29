/**
 * @Description:服务后缀名称
 * @Author: shijianzhong
 * @Date: 2020-11-09
 */

import apiConfig from '@l/config'

import { getDefaultUrls } from '@l/api/service-suffix.js'

const urls = getDefaultUrls()

const serviceSuffix = {
  ...urls
}

/**
 * 指标平台
 */
serviceSuffix.api_indicator_platform_serve = 'indicator-platform-server'
/**
 * 文件预览
 */
serviceSuffix.fdfs_preview_prefix = 'fdfs_preview_prefix'
/**
 *  用户中心
 */
serviceSuffix.sso_uc = 'fx-usercenter'

/**
 *  消息服务
 */
serviceSuffix.msg_service = 'msg-service'

/**
 * 文件上传服务
 */
serviceSuffix.file_upload = 'ioc-fdfs'

/**
 * 资源管理中心
 */
serviceSuffix.asset_center_server = 'asset-center'
/**
 * 资源商城中心
 */
serviceSuffix.asset_shop = 'asset-shop'
serviceSuffix.fx_gateway = 'fx-gateway'

export default serviceSuffix

export function getProxyUrl(key, isSocket = false) {
  if (key === 'fdfs_preview_prefix') { // 不需要走网关
    return apiConfig.getUrl(key, isSocket)
  }
  if (isSocket) {
    return apiConfig.getUrl(key, isSocket)
  }
  return apiConfig.getUrl(key, isSocket)
}
