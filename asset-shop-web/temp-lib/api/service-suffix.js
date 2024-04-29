/**
 * @Description:服务后缀名称
 * @Author: shijianzhong
 * @Date: 2020-11-09
 */

import apiConfig from '../config'

class serviceSuffix {
}
/**
 *  消息服务
 */
serviceSuffix.msg_service = 'msg-service'
/**
  *  消息设置服务
  */
serviceSuffix.basic_manage_platform = 'basic_manage_platform'
/**
  * 用户中心
  */
serviceSuffix.sso_uc = 'sso_uc'

/**
  * 文件上传服务
  */
serviceSuffix.file_upload = 'file_upload'

/**
  * 文件预览前缀
  */
serviceSuffix.fdfs_preview_prefix = 'fdfs_preview_prefix'

/**
  * 数据源服务
  */
serviceSuffix.dsm_server = 'dsm_server'

export default serviceSuffix

export function proxyUrl(key, isSocket = false) {
  return apiConfig.getUrl(serviceSuffix[key], isSocket)
}

export function getDefaultUrls() {
  return {
    ...serviceSuffix
  }
}
