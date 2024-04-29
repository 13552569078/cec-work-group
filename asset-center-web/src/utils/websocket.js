var __defProp = Object.defineProperty
var __defNormalProp = (obj, key, value) => (key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : (obj[key] = value))
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== 'symbol' ? key + '' : key, value)
  return value
}
class Ws {
  constructor(url, cb, options = {}) {
    __publicField(this, 'url')
    __publicField(this, 'callback')
    __publicField(this, 'heartTime', 3e3)
    __publicField(this, 'checkTime', 3e3)
    __publicField(this, 'lockTime', 4e3)
    __publicField(this, 'ws')
    __publicField(this, 'hTimer')
    __publicField(this, 'cTimer')
    __publicField(this, 'lTimer')
    __publicField(this, 'isLock', false)
    __publicField(this, 'token')
    __publicField(this, 'closeNow')
    this.url = url
    this.callback = cb
    this.init(options)
  }
  init(options) {
    const { token, heartTime, checkTime, lockTime, closeNow } = options
    if (token) {
      this.token = token
    }
    if (heartTime) {
      this.heartTime = heartTime
    }
    if (checkTime) {
      this.checkTime = checkTime
    }
    if (lockTime) {
      this.lockTime = lockTime
    }
    if (closeNow) {
      this.closeNow = closeNow
    }
    if (this.url === '') {
      throw new Error('socket\u94FE\u63A5\u5730\u5740\u4E0D\u80FD\u4E3A\u7A7A')
    }
    this.wsInit()
  }
  getUrl() {
    if (this.token !== void 0) {
      return `${this.url}?token=${this.token}`
    }
    return `${this.url}`
  }
  wsInit() {
    const ws = new WebSocket(this.getUrl())
    ws.onopen = () => {
      this.heartCheck()
    }
    ws.onclose = () => {
      if (!this.closeNow) {
        this.reconnect()
      }
    }
    ws.onerror = () => {
      this.reconnect()
    }
    ws.onmessage = e => {
      this.heartCheck()
      this.callback(e)
    }
    this.ws = ws
  }
  heartCheck() {
    this.hTimer && window.clearTimeout(this.hTimer)
    this.cTimer && window.clearTimeout(this.cTimer)
    this.hTimer = window.setTimeout(() => {
      this.cTimer = window.setTimeout(() => {
        if (this.ws.readyState !== 1) {
          this.ws.close()
        }
      }, this.checkTime)
    }, this.heartTime)
  }
  reconnect() {
    if (this.isLock) {
      return
    }
    this.isLock = true
    this.lTimer && window.clearTimeout(this.lTimer)
    this.lTimer = window.setTimeout(() => {
      this.wsInit()
      this.isLock = false
    }, this.lockTime)
  }
  close() {
    this.ws && this.ws.close()
  }
}
export const createSocket = (url, callback, options = {}) => {
  return new Ws(url, callback, options)
}
