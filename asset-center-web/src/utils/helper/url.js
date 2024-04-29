/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
 * @param {string} variable
 * @returns {Object}
 */
export function getUrlSearch(name) {
  // 未传参，返回空
  if (!name) return null
  // 查询参数：先通过search取值，如果取不到就通过hash来取
  var after = window.location.search
  after = after.substr(1) || window.location.hash.split('?')[1]
  // 地址栏URL没有查询参数，返回空
  if (!after) return null
  // 如果查询参数中没有"name"，返回空
  if (after.indexOf(name) === -1) return null

  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  // 当地址栏参数存在中文时，需要解码，不然会乱码
  var r = decodeURI(after).match(reg)
  // 如果url中"name"没有值，返回空
  if (!r) return null

  return r[2]
}
/**
 * 在现有url上追加参数
 * @param {*} url
 * @param {key:'x',value:'2'} param
 * @returns
 */
export function addParamToUrl(url, params) {
  const { key, value } = params || {}
  var param = '';
  if (key) {
    param = encodeURIComponent(key);
  }
  var r = '([&?]|&amp;)' + param + '\\b(?:=(?:[^&#]*))*';
  var a = document.createElement('a');
  var regex = new RegExp(r);
  var str = param + (value ? '=' + encodeURIComponent(value) : '');
  a.href = url;
  var q = a.search.replace(regex, '$1' + str);
  if (q === a.search && !regex.test(a.search)) {
    a.search += (a.search ? '&' : '') + str;
  } else {
    a.search = q;
  }
  return a.href;
}
