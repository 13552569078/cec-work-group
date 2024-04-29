/**
 *
 * @param {参数名} name
 * @returns string
 */
export function GetQueryString(name: string) {
  // debugger;
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  let r = window.location.search.substr(1).match(reg) //获取url中"?"符后的字符串并正则匹配
  let context = ''
  if (r != null) context = r[2]
  r = null
  return context == null || context == '' || context == 'undefined' ? '' : context
}

/**
 * 生成uuid方法
 * @returns {string}
 */
export const createUUID = function () {
  let d = new Date().getTime()
  if (window.performance && typeof window.performance.now === 'function') {
    d += performance.now() // use high-precision timer if available
  }
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
  return uuid
}
/**
 * @param {string} variable
 * @returns {Object}
 */
export function getUrlSearch(name: string) {
  // 未传参，返回空
  if (!name) return null
  // 查询参数：先通过search取值，如果取不到就通过hash来取
  let after = window.location.search
  after = after.substr(1) || window.location.hash.split('?')[1]
  // 地址栏URL没有查询参数，返回空
  if (!after) return null
  // 如果查询参数中没有"name"，返回空
  if (after.indexOf(name) === -1) return null

  const reg = '(^|&)' + name + '=([^&]*)(&|$)'
  // 当地址栏参数存在中文时，需要解码，不然会乱码
  const r = decodeURI(after).match(reg)
  // 如果url中"name"没有值，返回空
  if (!r) return null
  return r[2]
}

export default function getPageTitle(pageTitle: string) {
  const title = defaultSettings.title || '魏县疫情防控平台'
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}

// 数组扁平化
export const flatten = (arr: any) => {
  return arr.reduce((result: any, item: any) => {
    return result.concat(item, item?.children.length > 0 ? flatten(item.children) : [])
  }, [])
}

export function randomID() {
  return Number(Math.random().toString().substr(2, 0) + Date.now()).toString(36)
}
