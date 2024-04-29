export default {

  title: '运营中心',
  title2: '运营中心',

  sysCode: 'assetShopManageWeb',

  /**
  * @type {boolean} true | false
  * @description 是否显示路由标题
  */
  showRouteTitle: true,

  /**
   * @type {boolean} true | false
   * @description 是否显示navbar
   */
  showNavbar: true,

  /**
   * @type {boolean} true | false
   * @description 是否使用动态路由
   */
  dynamicRouter: true,

  /**
   * @type {number}
   * 接口请求正确返回码
   */
  resSuccessCode: 0,

  /**
   * @type {number}
   * 接口请求token失效返回码
   */
  resTokenErrorCode: 9100,

  /**
   * @type {boolean} true | false
   * @description 是否使用框架的登录页
   */
  useOwnLogin: (function() {
    return location.hostname === 'localhost' || location.hostname === '127.1.1.1' || location.hostname === '0.0.0.0'
  })(),
  /**
   * @type {string}
   * @description 退出后的跳转地址，当useOwnLogin为false时生效
   * 实际项目中，请填入应用中枢的登录页地址值config.js中
   */
  logoutToUrl: window.login_page_url(process.env.VUE_APP_ENV),

  /**
   * @type {boolean} true | false
   * 是否启用消息功能
   */
  useMsg: true,
  /**
   * @type {boolean} true | false
   * 绕过登录，适用于无账号或网络环境而需要进入layout时
   */
  bypassLogin: false,
  /**
   * @type {boolean} true | false
   * 启用全屏切换模式控制
   */
  fullScreen: false
}
