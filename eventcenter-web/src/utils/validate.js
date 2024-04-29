/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 * 是否外部链接
 */
export function isExternal(path) {
  return /^(http(s)?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} path
 * @returns {Boolean}
 * 外部链接是否 iframe 嵌入
 */
export function isOpenInIframe(path) {
  if (isExternal(path)) {
    const qs = require('qs')
    const params = qs.parse(path.split('?')[1])
    if (params.iframe) {
      return true
    }
    return false
  }
  return false
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor', 'test01', 'test02', 'test03', 'test04']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {number} num
 * @returns {Boolean}
 */
export function validNumber(num) {
  return /^(0|[1-9][0-9]*)$/.test(num)
}

/**
 * @param {number} num
 * @returns {Boolean}
 * 校验是否手机号
 */
export function validPhone(num) {
  return /^1[3|4|5|6|7|8|9][0-9]{9}$/.test(num)
}

/**
 * @param {String} str
 * @returns {Boolean}
 * 校验是否包含事件流程提交过程中不能识别的特殊字符
 */
export function validCommitStr(str) {
  const pattern = new RegExp('[`~#$^&|{}\[\\]<>/~#&*]')
  return pattern.test(str)
}

// 时限配置 (0-999]整数
export const isOverTimeConfigNumber = (rule, value, callback) => {
  const regExp = /^(?!0$)([1-9]\d{0,2}|999)$/
  if (value && !regExp.test(value)) {
    callback(new Error('请输入0-999之间的整数,不包含0'))
  }
  callback()
}

// 时限配置 (0-99]leval
export const isOverTimeConfigLevalNumber = (rule, value, callback) => {
  const regExp = /^(?!0$)([1-9][0-9]?|99)$/
  if (value && !regExp.test(value)) {
    callback(new Error('请输入0-99之间的整数,不包含0'))
  }
  callback()
}

