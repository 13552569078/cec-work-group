/**
 * 修改IP
 * @param {*} env
 * @param {*} serverName
 * @param {*} isSocket
 */
window.serviceUrl = function(env,serverName,isSocket){
  switch(env){
    case 'dev':
      //return `${isSocket ? 'ws' : 'http'}://10.255.144.70/${isSocket ? serverName.replace('api/', '') : serverName}`
      return `${isSocket ? 'ws' : 'http'}://web-proxy-dev.ioc.com:8580/${isSocket ? serverName.replace('api/', '') : serverName}`
    case 'test':
      return `${isSocket ? 'ws' : 'http'}://web-proxy-dev.ioc.com:8580/${isSocket ? serverName.replace('api/', '') : serverName}`
    case 'stage':
      // 现场部署时请把 ”部署环境的ip地址“ 这段文字修改成目标服务器的ip地址 
      //return `${isSocket ? 'ws' : 'http'}://部署环境的ip地址/${isSocket ? serverName.replace('api/', '') : serverName}` 
      return `${isSocket ? 'ws' : 'http'}://web-proxy-dev.ioc.com:8580/${isSocket ? serverName.replace('api/', '') : serverName}`
  }
}
/**
 * 前端配置繁星平台的登录页面地址
 * @param {*} env 环境标识
 */
window.login_page_url = function (env) {
  switch (env) {
    case 'dev':
      //return 'http://10.255.144.70/ioc-fx-portal-web/#/login?redirect=%2F'
      return `${isSocket ? 'ws' : 'http'}://web-proxy-dev.ioc.com:8580/${isSocket ? serverName.replace('api/', '') : serverName}`
    case 'test':
      return 'http://web-proxy-dev.ioc.com:8580/ioc-fx-portal-web/#/login?redirect=%2F'
    case 'stage':
      // 现场部署时请把 ”部署环境的繁星平台地址“ 这段文字修改成部署现场繁星平台的地址
      //return '部署环境的繁星平台地址'
      return `${isSocket ? 'ws' : 'http'}://web-proxy-dev.ioc.com:8580/${isSocket ? serverName.replace('api/', '') : serverName}`
  }
}
