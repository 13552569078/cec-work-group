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
 *  消息服务
 */
serviceSuffix.msg_service = 'msg-service'
/**
  * 文件预览
  */
serviceSuffix.fdfs_preview_prefix = 'fdfs_preview_prefix'
/**
  * 文件上传服务
  */
serviceSuffix.file_upload = 'ioc-fdfs'
/**
 * 资源商城之运营中心
 */
serviceSuffix.asset_shop_manage_server = 'asset-shop'
/**
 * 网关
 */
serviceSuffix.fx_gateway = 'fx-gateway'
/**
  * 用户中心
  */
serviceSuffix.sso_uc = 'fx-usercenter'

export default serviceSuffix

export function getProxyUrl(key, isSocket = false) {
  return apiConfig.getUrl(serviceSuffix[key], isSocket)
}
