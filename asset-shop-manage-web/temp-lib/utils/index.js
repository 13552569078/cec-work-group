import Vue from 'vue'
import { formatTime, parseTime } from './helper/time'
import { getUrlSearch, param2Obj } from './helper/url'
import { deepClone, easyClone, debounce, throttle } from './helper/tool'

const bus = new Vue()

/**
 * 被做为iframe嵌入时，获取父容器的页面路径
 */
function getWindowParentRef() {
  let url = ''
  try {
    url = window.top.document.referrer
  } catch (M) {
    if (window.parent) {
      try {
        url = window.parent.document.referrer
      } catch (L) { url = '' }
    }
  }
  if (url === '') {
    url = document.referrer
  }
  return url
}

export {
  bus,
  formatTime,
  parseTime,
  getUrlSearch,
  param2Obj,
  deepClone,
  easyClone,
  debounce,
  throttle,
  getWindowParentRef
}
