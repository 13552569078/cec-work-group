/**
 * @Description: 枚举文件
 * @Author: zs
 * @Date: 2022-02-18
 */

// 申请对象
export const applyOptionsArr = [
  {
    value: 1,
    label: '组件资源'
  },
  {
    value: 2,
    label: '数字资源'
  }
]
// 申请类型
export const applyTypeOptionsArr = [
  // 1-上架申请、2-更新申请、 3-注册申请、4-下架申请
  {
    value: 1,
    label: '上架申请'
  },
  {
    value: 2,
    label: '升级申请'
  },
  {
    value: 3,
    label: '注册申请'
  },
  {
    value: 4,
    label: '下架申请'
  },
  {
    value: 5,
    label: '更新申请'
  }
]
// 资源申请 申请类型
export const ASEET_APPLY_TYPE = {
  1: '下载申请',
  2: '订阅申请',
  3: '权限分配',
  // 4: '独立部署'
}
// 申请状态
export const applyStatusOptionsArr = [
  {
    value: 0,
    label: '待审核'
  },
  {
    value: 1,
    label: '已通过'
  },
  {
    value: 2,
    label: '已驳回'
  }, {
    value: 3,
    label: '已通过'
  }, {
    value: 4,
    label: '已驳回'
  }
]

// 引用资源大类
export const referAssetType = [
  {
    value: 1,
    label: '数据资源'
  },
  {
    value: 2,
    label: '技术资源'
  },
  {
    value: 3,
    label: '对象资源'
  },
  {
    value: 4,
    label: '数据资源'
  },
  {
    value: 5,
    label: '流程资源'
  },
  {
    value: 7,
    label: '模型资源'
  },
  {
    value: 99,
    label: '应用'
  }
]
export const referAssetTypeObj = (() => {
  const o = {}
  referAssetType.forEach(d => {
    o[d.value] = d.label
  })
  return o
})()
// 应用类型
export const APP_TYPE = {
  1: 'APP',
  2: '大屏',
  3: 'PC',
  4: 'H5'
}
// 引用资源小类
export const referAssetSubtype = [
  {
    value: 11,
    label: '指标'
  },

  {
    value: 12,
    label: '模型'
  },
  {
    value: 13,
    label: '数据'
  },
  {
    value: 21,
    label: '算法'
  },
  {
    value: 22,
    label: '接口'
  },
  {
    value: 27,
    label: '支撑应用'
  },
  {
    value: 23,
    label: '页面'
  }, {
    value: 14,
    label: '体征'
  }, {
  //   value: 51,
  //   label: '业务'
  // }, {
    value: 31,
    label: '实体'
  // }, {
  //   value: 71,
  //   label: '模型'
  }
]
const obj = {}
referAssetSubtype.forEach(d => {
  obj[d.value] = d.label
})
// 资源小类
export const ASSET_SUBTYPE = {
  ...obj,
  ...APP_TYPE
}

function filterArr(val, arr) {
  const item = arr.find(d => d.value === val)
  return item ? item.label : ''
}

export function applyObjectFormat(val) {
  return filterArr(val, applyOptionsArr)
}

export function applyTypeFormat(val) {
  return filterArr(val, applyTypeOptionsArr)
}
export function assetApplyTypeFormat(val) {
  return ASEET_APPLY_TYPE[val] || ''
}

export function applyStatusFormat(val) {
  return filterArr(val, applyStatusOptionsArr)
}

export const asseTypeFormat = function(type, subType, s = '-') {
  if (+type === 99) return '数字资源'
  // 模型、流程只展示一级菜单
  if (+type === 7 || +type === 5) {
    return referAssetTypeObj[type]
  }
  const arr = []
  referAssetTypeObj[type] && arr.push(referAssetTypeObj[type])
  ASSET_SUBTYPE[subType] && arr.push(ASSET_SUBTYPE[subType])
  return arr.join(s)
}

export const ASSET_SOURCE = {
  1: '资源中心',
  2: '应用中枢',
  3: '体征引擎'
}
export const ASSET_TYPE_TREE = [{
  label: '数字资源',
  value: 99
}, {
  label: '流程资源',
  value: 5
}, {
  label: '对象资源',
  value: 3,
  childList: [
    { label: '实体', value: 31 }
  ]
}, {
  label: '数据资源',
  value: 1,
  childList: [
    { label: '体征', value: 14 }
  ]
}, {
  label: '技术资源',
  value: 2,
  childList: [
    { label: '页面', value: 23 },
    { label: '接口', value: 22 },
    { label: '支撑应用', value: 27 }
  ]
}, {
  label: '模型资源',
  value: 7
}]
// 厂商类型
export const FIRM_TYPE = {
  1: '开发厂商',
  2: '安全厂商',
  3: '运维厂商'
}
// 资源状态
export const APP_STATUS = {
  1: '待开发',
  2: '开发中',
  3: '已上线',
  4: '已停用'
}
// 建设渠道
export const CHANNEL = {
  1: '资源中心',
  2: '第三方'
}
// 网络类型
export const NET_TYPE = {
  1: '广域网',
  2: '局域网',
  3: '城域网'
}
// 申请类型
export const APPLY_TYPE = {
  3: '权限分配',
  4: '独立部署',
  1: '资源下载'
}
// 等保等级
export const SEC_LEVEL = {
  1: '第一级',
  2: '第二级',
  3: '第三级',
  4: '第四级',
  5: '第五级'
}
export const PACK_STATUS = {
  0: '上架未提交',
  1: '上架审核中',
  3: '上架失败',
  4: '已上架',
  5: '已下架',
  2: '上架已撤销',
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
