class apiConfig {
  /**
   * 根据serviceSuffix获取服务器后缀名称
   * @param {string} val
   * @param {boolean} isSocket 是否是websocket
   */
  static getUrl(val, isSocket = false) {
    switch (process.env.VUE_APP_ENV) {
      case 'dev':
        return window.serviceUrl('dev', val, isSocket)
      case 'test':
        return window.serviceUrl('test', val, isSocket)
      case 'stage':
        return window.serviceUrl('stage', val, isSocket)
    }
  }
}
export default apiConfig
