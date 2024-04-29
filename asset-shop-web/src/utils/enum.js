// 资源开发 名称
export const ASSET_TITLE = '组件资源'
// 上架类型
export const PACK_TYPE = {
  1: '资源',
  2: '应用'
}
// 上架状态
export const PACK_STATUS = {
  0: '上架未提交',
  1: '上架审核中',
  2: '上架已撤销',
  3: '上架失败',
  4: '已上架',
  5: '已下架',
  6: '下架审核中',
  7: '下架失败',
  8: '下架已撤销',
  10: '注册未提交',
  11: '注册审核中',
  12: '注册失败',
  13: '已注册',
  14: '注册已撤销',
  15: '更新未提交',
  16: '更新审核中',
  17: '更新失败',
  18: '更新成功',
  19: '更新已撤销',
  20: '升级未提交',
  21: '升级审核中',
  22: '升级已撤销',
  23: '升级失败'
}
// 上架状态 应用
export const APP_PACK_STATUS = PACK_STATUS
// 上架状态 接口
export const API_PACK_STATUS = APP_PACK_STATUS
// 资源分类
export const ASSET_TYPE = {
  1: '数据资源',
  2: '技术资源',
  3: '对象资源',
  5: '流程资源',
  7: '模型资源',
  99: '应用资源'
}
// 应用类型
export const APP_TYPE = {
  1: 'APP',
  2: '大屏',
  3: 'PC',
  4: 'H5'
}
// 资源小类
export const ASSET_SUBTYPE = {
  11: '指标',
  12: '模型',
  13: '数据',
  14: '体征',
  21: '算法',
  22: '接口',
  23: '页面',
  24: '体征',
  26: '脚本',
  27: '支撑应用',
  25: '定时任务',
  31: '实体',
  32: '视图',
  51: '业务',
  52: '逻辑流程',
  71: '算法',
  72: '模型',
  ...APP_TYPE
}
// 下载
export const DOWNLOAD = {
  0: '下载',
  1: '已下载',
  2: '更新',
  3: '审核中',
  4: '重新下载'
}
// 下载 app
export const DOWNLOADAPP = {
  0: '使用',
  1: '已使用',
  2: '更新',
  3: '审核中',
  4: '重新使用'
}
// 资源分类树状结构
export const ASSET_TYPE_TREE = [{
  label: '应用资源',
  value: 99
}, {
  label: '流程资源',
  value: 5
}, {
  label: '对象资源',
  value: 3,
  childList: [
    {
      label: '实体',
      value: 31
    }
  ]
}, {
  label: '数据资源',
  value: 1,
  childList: [
    {
      label: '体征',
      value: 14
    }
  ]
}, {
  label: '技术资源',
  value: 2,
  childList: [
    {
      label: '页面',
      value: 23
    },
    {
      label: '接口',
      value: 22
    },
    {
      label: '支撑应用',
      value: 27
    }
  ]
}, {
  label: '模型资源',
  value: 7
}]
function flatTree(arr) {
  const obj = {}
  arr.forEach(d => {
    obj[d.value] = d.label
    if (d.childList) {
      const obj1 = flatTree(d.childList)
      Object.assign(obj, obj1)
    }
  })
  return obj
}
function flatTree2(arr, pid) {
  const obj = {}
  arr.forEach(d => {
    obj[d.value] = { pid: pid, ...d }
    if (d.childList) {
      const obj1 = flatTree2(d.childList, d.value)
      Object.assign(obj, obj1)
    }
  })
  return obj
}
const ASSET_TYPE_TREE_MAP = flatTree(ASSET_TYPE_TREE)
const ASSET_TYPE_TREE_MAP2 = flatTree2(ASSET_TYPE_TREE)
// 根据资源类型或者子类型获取 翻译 如对象资源-实体，或者获取[typeId, subTypeId]
export const getAssetTypeBySubtype = (type, isValue) => {
  const item = ASSET_TYPE_TREE_MAP2[type]
  let label = item ? item.label : ''
  const arr = item ? [item.value] : []
  if (item && item.pid) {
    label = ASSET_TYPE_TREE_MAP2[item.pid].label + '-' + label
    arr.unshift(item.pid)
  }
  if (isValue) {
    return arr
  }
  return label
}
// 翻译 如 对象资源-实体
export const asseTypeFormatLong = function(type, subType, s = '-') {
  // if (+type === 99) return '应用资源'
  if (+type === 99) return '数字资源'
  if (+type === 7 || +type === 5) {
    return ASSET_TYPE[type]
  }
  const arr = [];
  (ASSET_TYPE_TREE_MAP[type] || ASSET_TYPE[type]) && (arr.push(ASSET_TYPE_TREE_MAP[type] || ASSET_TYPE[type]))
  if (typeof subType === 'string' && subType) {
    const subTypeArr = subType.split(',').map(d => ASSET_TYPE_TREE_MAP[d] || APP_TYPE[d])
    arr.push(subTypeArr.join(','))
  } else {
    (ASSET_TYPE_TREE_MAP[subType] || APP_TYPE[subType]) && (arr.push(ASSET_TYPE_TREE_MAP[subType] || APP_TYPE[subType]))
  }
  return arr.join(s) || '-'
}
// 对应支撑平台数据结构类型
export const fieldTypeList = {
  '0': { 'name': 'varchar', 'textName': '字符串', 'length': 50, 'scaleDisabled': true, 'fieldType': 0 },
  '1': { 'name': 'int', 'textName': '整数', 'length': 10, 'scaleDisabled': true, 'lengthDisabled': true, 'fieldType': 1 },
  '2': { 'name': 'float', 'textName': '浮点类型', 'length': 53, 'scaleDisabled': true, 'fieldType': 2 },
  '3': { 'name': 'datetime', 'textName': '日期时间', 'length': null, 'scale': 6, 'lengthDisabled': true, 'fieldType': 3 },
  '4': { 'name': 'varchar2', 'textName': '字符串', 'length': 50, 'scaleDisabled': true, 'fieldType': 4 },
  '5': { 'name': 'number', 'textName': '数字', 'length': 22, 'scale': 6, 'fieldType': 5 },
  '6': { 'name': 'char', 'textName': '字符', 'length': 10, 'scaleDisabled': true, 'fieldType': 6 },
  '7': { 'name': 'text', 'textName': '文本', 'scaleDisabled': true, 'lengthDisabled': true, 'fieldType': 7 },
  '8': { 'name': 'clob', 'textName': '字符大对象', 'scaleDisabled': true, 'lengthDisabled': true, 'fieldType': 8 },
  '9': { 'name': 'blob', 'textName': '二进制大对象', 'scaleDisabled': true, 'lengthDisabled': true, 'fieldType': 9 },
  '10': { 'name': 'bigint', 'textName': '长整数', 'length': 19, 'scaleDisabled': true, 'lengthDisabled': true, 'fieldType': 10 },
  '11': { 'name': 'varchar', 'textName': '字典', 'length': 50, 'scaleDisabled': true, 'fieldType': 11 },
  '12': { 'name': 'date', 'textName': '日期', 'length': null, 'scale': 6, 'lengthDisabled': true, 'fieldType': 12 },
  '13': { 'name': 'time', 'textName': '时间', 'length': null, 'scale': 6, 'lengthDisabled': true, 'fieldType': 13 }
}
// 体征类型
export const TZ_TYPES = {
  'tz-category-01': '原子能力',
  'tz-category-02': '服务能力',
  'tz-category-03': '业务能力',
  'tz-category-04': '场景能力'
}
// 模型类型
export const MODEL_TYPES = {
  'mx-category-01': '计算机视觉',
  'mx-category-02': '语音识别',
  'mx-category-03': '推荐系统',
  'mx-category-04': '自然语言处理',
  'mx-category-05': '机器学习',
  'mx-category-06': '视频识别',
  'mx-category-07': '其他'
}
// 体征&模型
export const CATEGORY_TYPES = {
  ...TZ_TYPES,
  ...MODEL_TYPES,
  'zc-category-01': '服务资源'
}
// 页面类型
export const PAGE_TYPES = {
  '1': '登录页',
  '2': '门户页',
  '3': '空白页',
  '4': '表单页面',
  '5': '审批列表',
  '6': '普通列表',
  '7': '统计列表页面',
  '8': '自定义页面',
  '9': '开发页面'
}
