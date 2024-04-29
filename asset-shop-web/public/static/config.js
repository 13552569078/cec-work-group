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
  // 组件资源-tab 过滤条件
  TAB_ASSET_TYPE: [{
    label: '数字资源',
    value: 99,
    desc: '数字资源支持资源中心及其他第三方开发的应用进行注册、上架。支持为其他开发者提供权限分配、独立部署、资源下载服务。',
    tips: '注：应用完成注册后即可在门户中查看，上架后用户可以在门户申请使用。'
  }, {
    label: '流程资源',
    value: 5,
    desc: '流程资源指一个审核表单从创建到结束的完整处理流程，该资源仅支持下载和开发中心内使用，如需上架该资源，需在开发中心中预先定义并完成打包',
    tips: ''
  }, {
    label: '对象资源',
    value: 3,
    childList: [
      {
        label: '实体',
        value: 31,
        desc: '对象资源-实体指一个实体对象的完整数据库表定义，该资源仅支持下载和开发中心内使用，如需上架该资源，需在开发中心中预先定义并完成打包',
        tips: '' }
    ]
  }, {
    label: '数据资源',
    value: 1,
    childList: [
      {
        label: '体征',
        value: 14
        ,desc: '可选择体征平台定义并在api管理器中发布后的体征，上架后采取订阅方式提供服务，订阅成功后，订阅方需基于订阅后提供的密钥信息对服务进行访问',
        tips: '' }
    ]
  }, {
    label: '技术资源',
    value: 2,
    childList: [
      {
        label: '页面',
        value: 23
        ,desc: '页面资源指一套完整的前端页面，具备完整的数据展示和数据交互逻辑以及页面元素与样式，包含表单页、列表页和自定义页面，仅支持下载和开发中心内使用，如需上架该资源，需在开发中心中预先定义并完成打包',
        tips: '' },
      {
        label: '接口',
        value: 22
        ,desc: '该类资源通过订阅的方式为其他开发者提供服务，订阅方需基于订阅后提供的密钥信息对服务进行访问',
        tips: '注：需要提前在API管理器中完成服务注册和发布后方能选中和上架' },
      {
        label: '支撑应用',
        value: 27
        ,desc: '支撑应用通过订阅的方式为其他开发者提供服务，订阅方对支撑数字资源并通过订阅后，即可对其包含的全部服务进行访问',
        tips: '注：支撑应用所包含的服务，若需要进行授权控制，则需要提前在API管理器中完成服务注册' }
    ]
  }, {
    label: '模型资源',
    value: 7,
    desc: '可选择AI中台定义并在api管理器中发布后的模型，上架后的模型采取订阅方式提供服务，订阅成功后，订阅方需基于订阅后提供的密钥信息对服务进行访问',
    tips: ''
  }],
  // 数字资源-tab 过滤条件
  TAB_APP_TYPE: [
    { label: 'PC', value: 3 },
    { label: 'H5', value: 4 },
  ],
  // 建设渠道
  CHANNEL: {
    1: '资源中心',
    2:'第三方'
  }
}
window.ENUMS = Object.defineProperties({}, {
  TAB_ASSET_TYPE: {
    get: function() {
      // 只部署门户+运营，过滤掉 流程/对象/页面
      if (window.__systemConfig && +window.__systemConfig.deployType === 2) {
        return window._ENUMS.TAB_ASSET_TYPE.filter(d => {
          if (d.value === 2) {
            d.childList = d.childList.filter(dd => dd.value !== 23)
          }
          return d.value !== 5 && d.value !== 3
        })
      }
      return window._ENUMS.TAB_ASSET_TYPE
    }
  },
  TAB_APP_TYPE: {
    get: function() {
      return window._ENUMS.TAB_APP_TYPE
    }
  },
  CHANNEL: {
    get: function() {
      // 只部署门户+运营，只保留第三方2
      if (window.__systemConfig && +window.__systemConfig.deployType === 2) {
        return { 2: window._ENUMS.CHANNEL[2] }
      }
      return window._ENUMS.CHANNEL
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
