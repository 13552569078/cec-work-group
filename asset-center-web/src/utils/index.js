import Vue from 'vue'
import {
  formatTime,
  parseTime
} from './helper/time'
import {
  getUrlSearch,
  param2Obj,
  addParamToUrl
} from './helper/url'
import {
  deepClone,
  easyClone,
  debounce,
  throttle
} from './helper/tool'
import { getToken, removeToken } from '@/utils/auth'
import store from '@/store'
import { Message } from 'fx-asset-ui';
import { createSocket } from './websocket'
import service from './request'

/**
 * 通过subtype 获取自定义生成的编码
 * @param {string} subtype
 */
function getCodePrefix(subtype) {
  console.log(subtype, 'subtype')
  let s = ''
  switch (subtype + '') {
    case '99':// 应用
      s = 'YY'
      break;
    case '51':// 业务流程
      s = 'YW'
      break;
    case '31':// 实体对象
      s = 'ST'
      break;
    case '11':// 指标资源
      s = 'ZB'
      break;
    case '13':// 数据资源
      s = 'SJ'
      break;
    case '14':// 体征资源
      s = 'TZ'
      break;
    case '21':// 算法资源
      s = 'SF'
      break;
    case '22':// 接口
      s = 'JK'
      break;
    case '23':// 页面
      s = 'YM'
      break;
    case '26':// 脚本
      s = 'JB'
      break;
    case '72':// 模型
      s = 'MX'
      break;

    default:
      break;
  }
  s += '_'

  return s
}
function getRandomCode() {
  let s = Date.now()
  s += getRandomChar(4)
  return s
}
function getRandomChar(step) {
  const arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  let res = ''
  for (let index = 0; index < step; index++) {
    res += arr[parseInt(Math.random() * (arr.length - 1))]
  }
  return res
}

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

const bus = new Vue()
const reservedStr = (str = '', nums = 8) => {
  if (typeof str !== 'string') {
    return str
  }
  return str.substring(0, nums)
}

const openWindow = function (path) {
  if (path) {
    console.log('http://10.32.79.59/fx-portal-web/#/?url=' + encodeURIComponent('http://10.32.79.59/asset_center_web/#' + path) + '&token=' + getToken())
    // window.open('http://10.32.79.59/fx-portal-web/#/?url=' + encodeURIComponent('http://10.32.79.59/asset_center_web/#' + path) + '&token=' + getToken())
    window.open('./index.html#' + path)
    return
  }
}
const goDetail = function (row) {
  console.log(row, 'row')
  switch (row.assetType) {
    // 2技术、3对象、5流程
    case 1:
      if (row.subType + '' === '11' || row.subtype + '' === '11') { // 指标
        openWindow(`/asset-management/statistics-asset/kpi-asset/add?id=${row.assetId}&flag=detail`)
      } else if (row.subType + '' === '13' || row.subtype + '' === '13') { // 数据
        openWindow(`/asset-management/statistics-asset/data-asset/add?id=${row.assetId}&flag=detail`)
      } else if (row.subType + '' === '14' || row.subtype + '' === '14') { // 体征
        openWindow(`/asset-management/statistics-asset/ti-asset/add?id=${row.assetId}&flag=detail`)
      }
      break;
    case 2:
      if (row.subType + '' === '22' || row.subtype + '' === '22') { // 接口
        openWindow(`/asset-management/technology-asset/interface-asset?id=${row.assetId}&flag=detail`)
      } else if (row.subType + '' === '23' || row.subtype + '' === '23') { // 页面
        openWindow(`/asset-management/technology-asset/page-asset?id=${row.assetId}&flag=detail`)
      } else if (row.subType + '' === '26' || row.subtype + '' === '26') { // 脚本
        openWindow(`/asset-management/technology-asset/script-asset?id=${row.assetId}&flag=detail`)
      }
      break;
    case 3: // 对象资源 是弹框
      // return 'object'
      if (row.subType + '' === '31' || row.subtype + '' === '31') { // 实体对象
        openWindow(`/asset-management/object-asset/addEntry?id=${row.assetId}&flag=detail`)
      } else if (row.subType + '' === '32' || row.subtype + '' === '32') { // 视图对象
        openWindow(`/asset-management/object-asset/addView?id=${row.assetId}&flag=detail`)
      }
      break
    case 5: // 流程资源
      if (row.subType + '' === '51' || row.subtype + '' === '51') { // 业务
        openWindow(`/asset-management/flow-asset/add?id=${row.assetId}&flag=detail`)
      } else if (row.subType + '' === '52' || row.subtype + '' === '52') { // 逻辑
        openWindow(`/asset-management/flow-asset/add-logic?id=${row.assetId}&flag=detail`)
      }
      break;
    case 7: // 模型资源
      if (row.subType + '' === '72' || row.subtype + '' === '72') { // 模型
        openWindow(`/asset-management/mode-asset/mode-asset?id=${row.assetId}&flag=detail`)
      }
      break;
    case 99: // 应用
      openWindow(`/application-detail?id=${row.assetId}&code=${row.appCode || row.code}&goindex=true`)
      break;
    default:
      break;
  }
  return
}

const getAssetTypeLabel = function (assetType, subtype, appFull) {
  let res = ''
  switch (assetType) {
    // 1统计、2技术、3对象、4数据、5流程
    case 1:
      res = '数据资源'
      if (subtype + '' === '11') { // 指标
        res += ' - 指标'
      } else if (subtype + '' === '12') { // 模型
        res += ' - 模型'
      } else if (subtype + '' === '13') { // 数据
        res += ' - 数据'
      } else if (subtype + '' === '14') { // 体征
        res += ' - 体征'
      }
      break;
    case 2:
      res = '技术资源'
      if (subtype + '' === '22') { // 接口
        res += ' - 接口'
      } else if (subtype + '' === '23') { // 页面
        res += ' - 页面'
      } else if (subtype + '' === '24') { // 逻辑
        res += ' - 逻辑函数'
      } else if (subtype + '' === '25') { // 任务
        res += ' - 定时任务'
      } else if (subtype + '' === '26') { // 脚本
        res += ' - 脚本'
      } else if (subtype + '' === '27') { // 脚本
        res += ' - 支撑应用'
      }
      break;
    case 3: // 对象资源 是弹框
      res = '对象资源'
      if (subtype + '' === '31') { //
        res += ' - 实体'
      } else if (subtype + '' === '32') { // 接口
        res += ' - 视图'
      }
      break;
    case 4: // 4数据
      res = '数据'
      break;
    case 5: // 流程资源 是弹框
      res = '流程资源'
      // if (subtype + '' === '51') { //
      //   res += ' - 业务流程'
      // } else if (subtype + '' === '52') { // 接口
      //   res += ' - 逻辑流程'
      // }
      break;
    case 6: // 监控资源 是弹框
      res = '对象资源'
      if (subtype + '' === '61') { //
        res += ' - 监测模型'
      } else if (subtype + '' === '62') { // 接口
        res += ' - 监测策略'
      } else if (subtype + '' === '63') { // 接口
        res += ' - 监测布控'
      }
      break;
    case 7: // 模型资源
      res = '模型资源'
      // if (subtype + '' === '71') { // 模型资源
      //   res += ' - 模型'
      // }
      break;
    case 99: // 应用  // 1-PC、2-大屏、3-APP
      // eslint-disable-next-line no-case-declarations
      const _substring = ['', 'APP', '大屏', 'PC', 'H5']

      if (appFull) {
        res = '应用 - ';
        (subtype + '').split(',').forEach(item => {
          res += (_substring[item] || '') + ' '
        })
      } else {
        (subtype + '').split(',').forEach(item => {
          res += (_substring[item] || '') + ' '
        })
      }

      break;
    default:
      break;
  }
  return res
}

function getPath(row) {
  let res = '';
  switch (row.assetType) {
    // 1统计、2技术、3对象、4数据、5流程
    case 1:
      if (row.subtype + '' === '11') { // 指标
        res = ''
      } else if (row.subtype + '' === '12') { // 模型
        res = ''
      } else if (row.subtype + '' === '13') { // 数据
        res = ''
      } else if (row.subtype + '' === '14') { // 体征
        res = 'signsDesign'
      }
      break;
    case 2:
      if (row.subtype + '' === '22') { // 接口
        if (row.readonly) { // 查看
          res = 'apiDetail'
        } else {
          res = 'apiDesign' // 编辑
        }
      } else if (row.subtype + '' === '23') { // 页面
        switch (+row.businessType) {
          case 4:// 表单
            res = 'formDesign' //
            break;
          case 5:// 审批列表
            res = 'listDesign' //
            break;
          case 6:// 普通表单
            res = 'listDesign' //
            break;
          case 7:// 统计列表
            res = 'statisticsDesign' //
            break;
          case 8:// 自定义
            res = 'customPageDesign' //
            break;
          case 9:// 开发
            res = 'codePageDesign' //
            break;

          default:
            break;
        }
      } else if (row.subtype + '' === '24') { // 逻辑
        res = ''
      } else if (row.subtype + '' === '25') { // 任务
        res = ''
      } else if (row.subtype + '' === '26') { // 脚本
        res = 'groovyDesign' // 编辑
      }
      break;
    case 3: // 对象资源 是弹框
      if (row.subtype + '' === '31') { //
        res = 'modelDesign'
      } else if (row.subtype + '' === '32') { //
        res = ''
      }
      break;
    case 4: // 4数据
      res = ''
      break;
    case 5: // 流程资源 是弹框
      res = ''
      if (row.subtype + '' === '51') { //
        res = 'process'
      } else if (row.subtype + '' === '52') { //
        res = ''
      }
      break;
    case 7: // 流程资源 是弹框
      res = ''
      if (row.subtype + '' === '71') { //
        res = ''
      } else if (row.subtype + '' === '72') { // 模型
        res = 'signsDesign'
      }
      break;
    default:
      break;
  }
  return res;
}
function getLowPageType(row) {
  let res = '';
  if (row.subtype + '' === '26') {
    return 12
  } else if (row.subtype + '' === '14') {
    return 14
  } else if (row.subtype + '' === '72') {
    return 15
  }
  switch (+row.businessType) {
    case 4:// 表单
      res = '1' //
      break;
    case 5:// 审批列表
      res = '6' //
      break;
    case 6:// 普通表单
      res = '7' //
      break;
    case 7:// 统计列表
      res = '9' //
      break;
    case 8:// 自定义
      res = '10' //
      break;
    case 9:// 开发
      res = '11' //
      break;

    default:
      break;
  }
  return res
}
const openAssetEditorUrl = debounce(async (row, $message) => {
  console.log(row, '==========------')
  row.version = row.version || ''
  if (!row.assetCode) return

  if (window.__systemConfig && window.__systemConfig.platformUrl) {
    const openUrl = `${window.__systemConfig.platformUrl}lowcode-engine/${getPath(row)}?version=${row.version}&code=${row.assetCode}&name=${row.assetName}&readOnly=${!!row.readonly}&status=${row.readonly ? 2 : 1}&type=${getLowPageType(row)}`
    console.log(openUrl)
    window.open(openUrl)
  } else {
    $message.warning('没有获取到低代码平台跳转地址，请刷新页面后重试')
  }
}, 500, true)

const openNav = debounce(async (row, $message) => {
  console.log(row, '==========------')
  row.version = row.version || ''
  if (window.__systemConfig && window.__systemConfig.platformUrl) {
    const openUrl = `${window.__systemConfig.platformUrl}lowcode-engine/routeDesign?version=${row.version}&code=${row.appCode}&name=${row.appName}&readOnly=${!!row.readonly}`
    console.log(openUrl)
    window.open(openUrl)
  } else {
    $message.warning('没有获取到低代码平台跳转地址，请刷新页面后重试')
  }
}, 500, true)

/**
 * tab、 按钮显示
 * @param {*} key 页面key
 * @param {*} permissionKey 按钮key
 * @returns
 */
const getUserPermissionByKey = function (key, permissionKey) {
  if (window.userPermissions && window.userPermissions[key]) {
    if (permissionKey) {
      // console.log(window.userPermissions[key].permissions && window.userPermissions[key].permissions.findIndex(item => item.key === permissionKey) !== -1, window.userPermissions, key, permissionKey, 'window.userPermissions[key].permissions && window.userPermissions[key].permissions.findIndex(item => item.key === permissionKey) !== -1')
      return window.userPermissions[key].permissions && window.userPermissions[key].permissions.findIndex(item => item.key === permissionKey) !== -1
    }
    return !!window.userPermissions[key]
  } else { return false }
}
//
/**
 * tab页面的按钮显示
 * @param {*} subtype 资产小类 11、12、13
 * @param {*} permissionKey 按钮key
 * @returns
 */
const getPermissionByAssetsbutype = function(subtype, permissionKey) {
  const map = {
    11: 'kpiAsset',
    13: 'dataAsset',
    14: 'tiAsset',
    21: 'algorithmAsset',
    22: 'interfaceAsset',
    23: 'pageAsset',
    26: 'script',
    31: 'objectAssetEntity',
    51: 'flowAsset',
    61: 'monitorModel',
    62: 'monitorPolicy',
    63: 'monitorDeploy',
    72: 'modelAsset'
  }
  if (map[subtype]) {
    return getUserPermissionByKey(map[subtype], permissionKey)
  } else {
    return false
  }
}
/**
 * 红色按钮点击权限，租户可操作按钮
 * @param {*} dataUserId
 * @param {*} pageKey 页面key
 * @param {*} btnKey
 * @returns
 */
const validateTenant = function(dataUserId, pageKey, btnKey) {
  console.log(dataUserId, pageKey, btnKey, '----validateTenant')

  const permissions = window.userPermissions[pageKey].permissions && window.userPermissions[pageKey].permissions.find(item => item.key === btnKey)

  const user = store.getters.userId
  if (permissions && permissions.user) {
    // 判断 数据userId 是否与 当前userId 相同，不相同则提示“没有操作权限”
    console.log(dataUserId !== user, dataUserId, user, 'dataUserId !== user')
    if (dataUserId !== user) {
      return Message.warning('没有操作权限')
    }
  }
}
const formatInterfaceShowData = function(obj) {
  const arr = []
  if (!(obj && obj.paths)) return arr
  for (const key in obj.paths) {
    if (Object.hasOwnProperty.call(obj.paths, key)) { // path1
      const _path = obj.paths[key]

      for (const _key in _path) {
        if (Object.hasOwnProperty.call(_path, _key)) { // post
          const _obj = {
            tab: '1',
            path: key
            // protocol: (obj.servers[0] && obj.servers[0].url || '').split(':')[0]
          }
          const methodInfo = _path[_key]
          _obj.method = _key
          _obj.inputData = []
          _obj.outputData = []
          let requestBody = {}
          const requestBodyRef = methodInfo.requestBody ? methodInfo.requestBody.content['application/json'] && methodInfo.requestBody.content['application/json'].schema['$ref'] || '' : methodInfo.parameters && methodInfo.parameters.filter(item => item.name === 'body')[0] || '' ? methodInfo.parameters.filter(item => item.name === 'body')[0].schema.$ref : ''
          if (requestBodyRef) {
            const paths = requestBodyRef.split('/')
            const [first, ..._paths] = [...paths]
            if (first === '#') {
              requestBody = getObj(obj, _paths) || {}
            }
          }
          if (methodInfo.parameters) {
            _obj.inputData = _obj.inputData.concat(methodInfo.parameters.filter(item => item.name !== 'body').map(item => {
              return {
                name: item.name,
                in: item.in,
                required: item.required,
                type: item.schema.type,
                desc: item.desc
              }
            }))
          }
          for (const key in requestBody.properties) {
            if (Object.hasOwnProperty.call(requestBody.properties, key)) {
              const element = requestBody.properties[key]
              _obj.inputData.push({
                name: key,
                in: 'body',
                required: true,
                type: element.type,
                desc: element.example
              })
            }
          }
          if (methodInfo.responses && methodInfo.responses['200'] && methodInfo.responses['200'].content && methodInfo.responses['200'].content['application/json']) {
            if (methodInfo.responses['200'].content['application/json'].schema.type === 'object') {
              if (methodInfo.responses['200'].content['application/json'].schema.items.$ref.startWith('#')) {
                const paths = methodInfo.responses['200'].content['application/json'].schema.items.$ref.split('/')
                const [first, ..._paths] = [...paths]
                console.log(first)
                const res = getObj(obj, _paths) || {}
                for (const key in res) {
                  if (Object.hasOwnProperty.call(res, key)) {
                    const element = res[key]
                    _obj.outputData.push({
                      name: key,
                      in: 'body',
                      required: true,
                      type: element.type,
                      desc: element.example
                    })
                  }
                }
              }
            } else {
              if (methodInfo.responses['200'] && methodInfo.responses['200'].content['application/json'] && methodInfo.responses['200'].content['application/json'].schema) {
                if (methodInfo.responses['200'].content['application/json'].schema.type &&
                methodInfo.responses['200'].content['application/json'].schema.type === 'array'
                ) {
                  if (methodInfo.responses['200'].content['application/json'].schema.items &&
                  methodInfo.responses['200'].content['application/json'].schema.items.$ref &&
                  methodInfo.responses['200'].content['application/json'].schema.items.$ref.indexOf('#') === 0) {
                    const paths = methodInfo.responses['200'].content['application/json'].schema.items.$ref.split('/')
                    const [first, ..._paths] = [...paths]
                    console.log(first)
                    const res = getObj(obj, _paths) || {}
                    _obj.body = JSON.stringify([res])
                  }
                } else {
                  if (methodInfo.responses['200'].content['application/json'].schema.$ref &&
                  methodInfo.responses['200'].content['application/json'].schema.$ref.indexOf('#') === 0) {
                    const paths = methodInfo.responses['200'].content['application/json'].schema.$ref.split('/')
                    const [first, ..._paths] = [...paths]
                    console.log(first)
                    const res = getObj(obj, _paths) || {}
                    _obj.body = JSON.stringify(res)
                  }
                }
              }
            }
          }
          arr.push(_obj)
        }
      }
    }
  }
  return arr
  function getObj(obj, paths) {
    let o = obj
    for (let index = 0; index < paths.length; index++) {
      o = o[paths[index]]
      if (o === undefined) {
        return undefined
      }
    }
    return o
  }
}

export {
  bus,
  openNav,
  getWindowParentRef,
  goDetail,
  openWindow,
  getAssetTypeLabel,
  openAssetEditorUrl,
  formatTime,
  parseTime,
  getUrlSearch,
  param2Obj,
  deepClone,
  easyClone,
  debounce,
  formatInterfaceShowData,
  throttle,
  addParamToUrl,
  reservedStr,
  removeToken,
  getToken,
  getCodePrefix,
  getRandomCode,
  getUserPermissionByKey,
  validateTenant,
  getPermissionByAssetsbutype,
  createSocket,
  service
}
