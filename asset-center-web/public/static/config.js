/**
 * 修改IP
 * @param {*} env
 * @param {*} serverName
 * @param {*} isSocket
 */
window.serviceUrl = function(env,serverName,isSocket){
  switch(env){
    case 'dev':
      window.usre_center_server = 'http://10.255.135.171:9110'
      return `${isSocket ? 'ws' : 'http'}://10.255.144.70/fx-api/${serverName}`
    case 'test':
      window.usre_center_server = 'http://10.255.135.171:9110'
      return `${isSocket ? 'ws' : 'http'}://10.255.144.119/fx-api/${serverName}`
    case 'stage':
      window.usre_center_server = 'http://172.15.32.15:9005'
      // 现场部署时请把 ”部署环境的ip地址“ 这段文字修改成目标服务器的ip地址
      return `${isSocket ? 'ws' : 'http'}://部署环境的ip地址/${serverName}`
  }
}
/**
 * 前端配置繁星平台门户页面
 * @param {*} env 环境标识
 */
window.login_page_url = function (env) {
  switch (env) {
    case 'dev':
      return 'http://10.255.144.70/fx_portal_web/#/'
    case 'test':
      return 'http://172.15.32.15/fx-portal-web/#/'
    case 'stage':
      // 现场部署时请把 ”部署环境的繁星平台地址“ 这段文字修改成部署现场繁星平台的地址
      return '部署环境的繁星平台地址'
  }
}

/**
 * 消息中心相关配置信息
 * appcode与消息中心约定好的AppCode
 * pagePath跳转消息中心页面的地址
 * socketUrl是websocket地址
 * listApi获取消息列表的api
 */
 window.MESSAGE_CONFIG = {
  appcode: 'FX_PORTAL',
  pagePath: 'http://www.jczhdemo.etcc.group/swan-notice-center-pc/#/login',
  socketUrl: 'ws://www.jczhdemo.etcc.group/swan-message-websocket/ws',
  listApi: 'http://www.jczhdemo.etcc.group/swan-gateway/swan-message/center/search/receiveBox'
}