
/**
 * 简单深拷贝,适用于js对象
 * @param {*} obj
 */
export function easyClone(obj) {
  if (obj === undefined) {
    obj = null
  }
  return JSON.parse(JSON.stringify(obj))
}
// 处理标签树的数据,只能选择非一级的叶节点
export function treeRecursion(data) {
  if (Array.isArray(data) && data.length) {
    data.forEach((unit, index) => {
      if (!unit.parentId || unit.childList.length) {
        unit.disabled = true
      }
      if (unit.childList && unit.childList.length) {
        treeRecursion(unit.childList)
      }
    })
  }
}
// 处理树数据,非叶子节点不能选择
export function changeTreeDataByChildListLength(data) {
  if (Array.isArray(data) && data.length) {
    data.forEach((unit, index) => {
      if (unit.childList.length) {
        unit.disabled = true
      }
      if (unit.childList && unit.childList.length) {
        changeTreeDataByChildListLength(unit.childList)
      }
    })
  }
}

/**
 * 标准深拷贝
 * @param {*} obj
 */
export function deepClone(obj) {
  if (!obj || typeof obj !== 'object') {
    return obj
  }
  let result
  if (Array.isArray(obj)) {
    result = []
    obj.forEach(item => {
      result.push(deepClone(item))
    })
  } else {
    result = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = deepClone(obj[key])
      }
    }
  }
  return result
}

/**
 * 防抖
 * @param {*} fn
 * @param {*} delay
 */
export function debounce(fn, delay, immediate) {
  delay = delay || 200
  let timer
  return function () {
    if (timer) clearTimeout(timer)
    if (immediate) {
      if (!timer) fn.apply(this, arguments)
      timer = setTimeout(() => {
        timer = null
      }, delay);
    } else {
      timer = setTimeout(() => {
        fn.apply(this, arguments)
      }, delay);
    }
  }
}
// export function debounce(fn, _delay) {
//   var delay = _delay || 200
//   var timer
//   return function() {
//     var th = this
//     var args = arguments
//     if (timer) {
//       clearTimeout(timer)
//     }
//     timer = setTimeout(function() {
//       timer = null
//       fn.apply(th, args)
//     }, delay)
//   }
// }

/**
 * 节流
 * @param {*} fn
 * @param {*} interval
 */
export function throttle(fn, _interval) {
  var last
  var timer
  var interval = _interval || 200
  return function() {
    var th = this
    var args = arguments
    var now = +new Date()
    if (last && now - last < interval) {
      clearTimeout(timer)
      timer = setTimeout(function() {
        last = now
        fn.apply(th, args)
      }, interval)
    } else {
      last = now
      fn.apply(th, args)
    }
  }
}
