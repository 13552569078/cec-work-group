/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
            1 +
            '月' +
            d.getDate() +
            '日' +
            d.getHours() +
            '时' +
            d.getMinutes() +
            '分'
    )
  }
}

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
 * @param {Array, String} tree, nodeId, parentIdkey,
 * @returns []
 * 根据当前节点的 id，查询出所有父亲节点, 如果有组的概念，则需要查询组的关系
 */
export function getTreeParent(tree, nodeId, parentIdkey, childrenKey, groupKey) {
  if (!childrenKey) {
    childrenKey = 'children'
  }
  if (!parentIdkey) {
    parentIdkey = 'parentId'
  }
  if (!groupKey) {
    groupKey = 'groupId'
  }
  let arrRes = []
  if (tree?.length === 0) {
    if (nodeId) {
      arrRes.unshift(tree)
    }
    return arrRes
  }
  const rev = (subTree, subNodeId) => {
    for (let i = 0, length = subTree?.length; i < length; i++) {
      const node = subTree[i]
      if (Number(node.id) === Number(subNodeId)) {
        arrRes.unshift(node)
        // 如果parentId = 0, 且有分组的话，继续匹配组
        if (node[parentIdkey] === 0) { // 匹配到了区域跟节点，进一步匹配组节点
          rev(tree, node[groupKey])
        } else {
          rev(tree, node[parentIdkey])
        }
        break
      } else {
        if (node[childrenKey] && node[childrenKey].length) {
          rev(node[childrenKey], subNodeId)
        }
      }
    }
    return arrRes
  }
  arrRes = rev(tree, nodeId)
  return arrRes
}

/**
 * @param {Array, String} tree,
 * @returns []
 * 把树形结构的叶子节点添加禁用属性
 */
export function setDisabledByLeaf(tree) {
  const revfn = (subTree) => {
    for (let i = 0; i < subTree.length; i++) {
      const node = subTree[i]
      if (node.children && node.children.length) { // 有子节点，且长度不为空
        revfn(node.children)
      } else {
        node.disabled = true
      }
    }
  }
  revfn(tree)
  return tree
}

/**
 * @param {Array, String} tree,
 * @returns []
 * 把树形结构的空 children 给删除
 */
export function removeEmptyChildren(tree) {
  const revfn = (subTree) => {
    for (const node of subTree) {
      if (node.children?.length) { // 有子节点，且长度不为空
        revfn(node.children)
      } else {
        delete node.children
      }
    }
  }
  revfn(tree)
  return tree
}

/**
 * @param {Number} range
 * @returns []
 * 设置默认时间区间
 */
export function setDefaultTimeRange(range = 7) {
  let start = new Date(new Date(Date.now()).setHours(0, 0, 0, 0))
  let end = new Date(new Date(Date.now()).setHours(23, 59, 59, 59))
  // 时间格式转换
  start = parseTime(new Date(start.getTime() - 3600 * 1000 * 24 * range))
  end = parseTime(end)
  return [start, end]
}

/**
 * @param {}
 * @returns
 * 函数防抖
 */
export function debounce(fn, delay = 500) {
  let timer = null
  return function() {
    const args = arguments
    if (timer) clearTimeout(timer)
    timer = null
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * @param {}
 * @returns uuid
 * 创建 uuid
 */
export function createUUID() {
  const s = []
  const hexDigits = '0123456789abcdef'
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-'

  return s.join('')
}

/**
 * @param []
 * @returns []
 * 数组对象扁平化处理
 */
export function flattenArray(arr) {
  return arr.reduce((result, item) => {
    return result.concat((Array.isArray(item.children) && item.children.length) ? result.push(item) && flattenArray(item.children) : item)
  }, [])
}

/**
 * @param [], id, idKey, childrenKey
 * @returns Boolean
 * 判断数组中是否有给定的对象
 */
export function hasInArray(arr, id, idKey, childrenKey) {
  if (!arr.length) return false
  let flag = false
  // debugger
  const revfn = (subArr, id, idKey, childrenKey) => {
    for (let i = 0, length = subArr.length; i < length; i++) {
      const item = subArr[i]
      // 如果没有childrenKey, 则不进行递归
      if (childrenKey) { // TODO: 待验证
        if (item[idKey] === id) {
          flag = true
          break
        } else {
          revfn(item[childrenKey], id, idKey, childrenKey)
        }
      } else {
        if (item[idKey] === id) {
          flag = true
          break
        }
      }
    }
  }
  revfn(arr, id, idKey, childrenKey)
  return flag
}

/**
 * @param Arraya, Arrayb(扁平的对象，不进行递归), idkey(两个数组比较的key), rec
 * @returns Array
 * 从数组 a 中排除 b 的元素，取差集，支持递归
 */
export function ArrayMinusB(arrA, arrB, idkey, rec) {
  if (!arrA.length) return []
  let result = []
  const revfn = (subArrA, arrB, idkey, rec) => {
    for (let i = 0, length = subArrA.length; i < length; i++) {
      const item = subArrA[i]
      // 如果 item 在arrB 存在，则从arrA 中剔除
      if (arrB.some(b => b[idkey] === item[idkey])) {
        subArrA.splice(i, 1)
      } else {
        if (Array.isArray(item.children) && item.children.length) {
          revfn(item.children, arrB, idkey, rec)
        }
      }
      result = subArrA
    }
  }
  if (rec) {
    revfn(arrA, arrB, idkey, rec)
  } else {
    result = arrA.filter(s => !arrB.some(b => b[idkey] === s[idkey]))
  }
  return result
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

  var reg = '(^|&)' + name + '=([^&]*)(&|$)'
  // 当地址栏参数存在中文时，需要解码，不然会乱码
  var r = decodeURI(after).match(reg)
  // 如果url中"name"没有值，返回空
  if (!r) return null
  return r[2]
}

/**
 * @param
 * @returns {Object}
 * 判断浏览器环境是什么系统
 */
export function getPosType() {
  const agent = navigator.userAgent.toLowerCase()
  const isMac = /macintosh|mac os x/i.test(agent)
  if (agent.indexOf('win32') >= 0 || agent.indexOf('wow32') >= 0) {
    return 'win32'
  }
  if (agent.indexOf('win64') >= 0 || agent.indexOf('wow64') >= 0) {
    return 'win64'
  }
  if (isMac) {
    return 'mac'
  }
}

/**
 * @param url 带参数的 url
 * @param delParams<Array> 要删除的参数数组
 * @returns url 新的地址
 * 删除 url 某些参数
 */
export function ridUrlParam(url, params) {
  for (let index = 0; index < params.length; index++) {
    const item = params[index]
    const fromIndex = url.indexOf(item + '=') // 必须加=号，避免参数值中包含item字符串
    if (fromIndex !== -1) {
      // 通过url特殊符号，计算出=号后面的的字符数，用于生成replace正则
      const startIndex = url.indexOf('=', fromIndex)
      const endIndex = url.indexOf('&', fromIndex)
      const hashIndex = url.indexOf('#', fromIndex)

      let reg = ''
      if (endIndex !== -1) {
        // 后面还有search参数的情况
        const num = endIndex - startIndex
        reg = new RegExp(item + '=.{' + num + '}')
        url = url.replace(reg, '')
      } else if (hashIndex !== -1) {
        // 有hash参数的情况
        const num = hashIndex - startIndex - 1
        reg = new RegExp('&?' + item + '=.{' + num + '}')
        url = url.replace(reg, '')
      } else {
        // search参数在最后或只有一个参数的情况
        reg = new RegExp('&?' + item + '=.+')
        url = url.replace(reg, '')
      }
    }
  }
  const noSearchParam = url.indexOf('=')
  if (noSearchParam === -1) {
    url = url.replace(/\?/, '') // 如果已经没有参数，删除？号
  }
  return url
}

/**
 * @param arr<Array>
 * @param key<String> 对象唯一值
 * @param subkey<Array> 其他参照值, 最多三级
 * @returns 去重后的数组
 * 数组对象去重
 */
export function singleArray(arr, key, subkey) {
  if (!key) {
    key = 'id'
  }
  const map = new Map()
  for (const item of arr) {
    if (subkey?.length) {
      let _key = ''
      switch (subkey.length) {
        case 1:
          _key = item[subkey[0]]
          break
        case 2:
          _key = item[subkey[0]][subkey[1]]
          break
        case 3:
          _key = item[subkey[0]][subkey[1]][subkey[2]]
          break

        default:
          break
      }
      map.set(item[key] + _key, item)
    } else {
      map.set(item[key], item)
    }
  }
  return [...map.values()]
}

/**
 * 深拷贝,适用于js 层级比较多对象
 * @param {*} obj
 */
export function deepClone(obj) {
  if (typeof obj !== 'object' || obj == null) {
    return obj
  }
  let res
  if (obj instanceof Array) {
    res = []
  } else {
    res = {}
  }
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      res[key] = deepClone(obj[key])
    }
  }
  return res
}

/**
 * 判断对象是否相同
 * @param obj1
 * @param obj2
 * @returns {boolean}
 */
export function isObjectEqual(obj1, obj2) {
  const obj1Keys = Object.keys(obj1)
  const obj2Keys = Object.keys(obj2)

  if (obj1Keys.length !== obj2Keys.length) {
    return false
  }

  for (const key of obj1Keys) {
    if (obj1[key] !== obj2[key]) {
      return false
    }
  }

  return true
}

// 在树中找某一个结点
export const findNode = (value, key, tree, childrenKey = 'children') => {
  if (tree && tree.length) {
    let node = tree.find((item) => item[key] === value)
    if (node) {
      return node
    } else {
      for (let i = 0; i < tree.length; i++) {
        const found = findNode(value, key, tree[i][childrenKey], childrenKey)
        if (found) {
          node = found
          break
        }
      }
    }
    return node
  }
}

/**
 * 递归过滤节点，但保留原树结构，即符合条件节点的父路径上所有节点不管是否符合条件都保留
 * @param {Node[]} nodes 要过滤的树
 * leafUpOne---叶子节点上一层停止
 * @return 过滤后的包含根节点数组
**/
const predicate = (node,speTypeList) => {
  if(node.leafPoint === 1 && node.speType && speTypeList) {
    let speTypeArr = node.speType.split(',')
    return speTypeArr.some(st => speTypeList.indexOf(st) > -1)
  }
  return false
}

export const filterEventTypeTree  = (nodes,speTypeList,leafUpOne) => {
  if (!(nodes && nodes.length)) {
    return []
  }
  const newChildren = []
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    if (predicate(node,speTypeList)) {
      newChildren.push(node)
      continue
    }
    if(leafUpOne && node.leafPoint === 0 && node?.childList?.length && node.childList[0].leafPoint === 1) {
      node.childList = []
      newChildren.push(node)
    }else{
      const subs = filterEventTypeTree(node.childList || [], speTypeList,leafUpOne)
      if ((subs && subs.length) || predicate(node,speTypeList)) {
        node.childList = subs || []
        newChildren.push(node)
      }
    }
  }
  return newChildren.length ? newChildren : []
}

//递归获取专项树
const predicateSpe = (node,speType) => {
  return node.dictValue && speType && node.dictValue === speType
}

export const filterSpeTypeTree  = (nodes,speType) => {
  try{
    if (!(nodes && nodes.length)) {
      return []
    }
    const newChildren = []
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      if (predicateSpe(node,speType)) {
        newChildren.push(node)
        continue
      }else {
        node.disabled = true
      }
      const subs = filterSpeTypeTree(node.children || [], speType)
      if ((subs && subs.length) || predicateSpe(node)) {
        node.children = subs || []
        newChildren.push(node)
      }
    }
    return newChildren.length ? newChildren : []
  }catch(e){
    console.log(e)
  }

}

//根据spetype查找所有专项叶子
const loopSpeTree = (arr,resultArr)=>{
  arr.forEach(item =>{
    if(!item?.children?.length) {
      resultArr.push(item)
    }else{
      loopSpeTree(item.children,resultArr)
    }
  })
}

export const getSpeLeafByVal = (nodes,speType)=>{
  let filterTreeData = filterSpeTypeTree(nodes,speType)
  let arr = []
  loopSpeTree(filterTreeData,arr)
  return arr.map(item => item.dictValue)
}


//多个事件树  重新组装 取并集
const getChildren = (data, treeResult, listResult, parentId) => {
  for (const item of data) {
    if (item.parentId === parentId) {
      item.isLevelGraterEqual3 = item.level >= 3
      item.isForbidden = item.status === 1 // 1是禁止
      const newItem = { ...item }
      if (item['haveChild']) newItem.childList = []
      treeResult.push(newItem)
      listResult.push({ ...item })
      getChildren(data, newItem.childList, listResult, item.id)
    }
  }
}
const arrayToTree = (data, parentId = 0) => {
  const treeResult = []
  const listResult = []
  getChildren(data, treeResult, listResult, parentId)
  return { treeResult, listResult }
}

const loopEtTree = (arr,etList) => {
  arr.forEach(item=>{
    if(Array.isArray(item)) {
      loopEtTree(item,etList)
    }else{
      if(!etList.some(et=> et.id === item.id)) {
        etList.push(item)
      }
      if(item?.childList?.length) loopEtTree(item.childList,etList)
    }
  })
}
export const makeNewEventTypeTree = (eventArr) =>{
  if(!eventArr || !eventArr.length) return []
  let etList = []
  loopEtTree(eventArr,etList)
  const { treeResult, listResult } = arrayToTree(etList,0)
  console.log(treeResult,listResult)
  return treeResult
}