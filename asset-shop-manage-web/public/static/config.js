/**
 * @Description: 配置文件
 * @Author: liugeng
 * @Date: 2021-08-27
 */

/**
 * 修改IP
 * @param {*} env
 * @param {*} serverName
 * @param {*} isSocket
 */
 window.serviceUrl = function(env, serverName, isSocket) {
  switch (env) {
    case 'dev':
      window.usre_center_server = 'http://10.255.135.171:9110'
      return `${isSocket ? 'ws' : 'http'}://10.255.144.70/fx-api/${serverName}`
    case 'test':
      window.usre_center_server = 'http://10.255.135.171:9110'
      return `${isSocket ? 'ws' : 'http'}://10.255.144.119/fx-api/${serverName}`
    case 'stage':
      window.usre_center_server = 'http://172.15.32.15:9005'
      // 现场部署时请把 ”部署环境的ip地址“ 这段文字修改成目标服务器的ip地址
      return `${isSocket ? 'ws' : 'http'}://10.255.144.119/fx-api/${serverName}`
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
      return 'http://10.255.144.119/fx-portal-web/#/'
    case 'stage':
      // 现场部署时请把 ”部署环境的繁星平台地址“ 这段文字修改成部署现场繁星平台的地址
      return '部署环境的繁星平台地址'
  }
}
// 常量 调用时使用window.ENUMS
window._ENUMS = {
  ASSET_TYPE_TREE: [{
    label: '数字资源',
    value: 99
  }, {
    label: '流程资源',
    value: 5
  }, {
    label: '对象资源',
    value: 3,
    childList: [
      { label: '实体', value: 31 }
    ]
  }, {
    label: '数据资源',
    value: 1,
    childList: [
      { label: '体征', value: 14 }
    ]
  }, {
    label: '技术资源',
    value: 2,
    childList: [
      { label: '页面', value: 23 },
      { label: '接口', value: 22 },
      { label: '支撑应用', value: 27 }
    ]
  }, {
    label: '模型资源',
    value: 7
  }]
}
window.ENUMS = Object.defineProperties({}, {
  ASSET_TYPE_TREE: {
    get: function() {
      // 只部署门户+运营，过滤掉 流程/对象/页面
      if (window.__systemConfig && +window.__systemConfig.deployType === 2) {
        return window._ENUMS.ASSET_TYPE_TREE.filter(d => {
          if (d.value === 2) {
            d.childList = d.childList.filter(dd => dd.value !== 23)
          }
          return d.value !== 5 && d.value !== 3
        })
      }
      return window._ENUMS.ASSET_TYPE_TREE
    }
  }
})

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
