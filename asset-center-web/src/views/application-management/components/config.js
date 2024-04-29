/**
 * @Description:应用配置js
 * @Author: pancj
 * @Date: 2021-09-14
 */
// 应用类型 1-APP，2-大屏，3-PC
export const appTypeList = [
  { label: 'APP', value: 1 },
  { label: '大屏', value: 2 },
  { label: 'PC', value: 3 }
]
// 环境类型
export const ENV_TYPE = {
  TESTING: '测试环境',
  PRODUCTION: '生产环境'
}
// 资源类型
export const ENV_SOURCE = {
  SHARE: '共享',
  EXCLUSIVE: '独享'
}
// 应用来源
export const APP_SRC = {
  1: '自研',
  3: '导入'
}
// 应用状态
export const APP_STATE = {
  1: '开发中',
  // 4: '发布失败',
  5: '已发布',
  6: '已部署'
  // 8: '创建失败'
}
export const columsMap = {
  0: {
    name: 'varchar',
    textName: '字符串',
    length: 50,
    scaleDisabled: true,
    fieldType: 0
  },
  1: {
    name: 'int',
    textName: '整数',
    length: 10,
    scaleDisabled: true,
    lengthDisabled: true,
    fieldType: 1
  },
  2: {
    name: 'float',
    textName: '浮点类型',
    length: 53,
    scaleDisabled: true,
    fieldType: 2
  },
  12: {
    name: 'date',
    textName: '日期',
    length: null,
    scale: 6,
    lengthDisabled: true,
    fieldType: 12
  },
  13: {
    name: 'time',
    textName: '时间',
    length: null,
    scale: 6,
    lengthDisabled: true,
    fieldType: 13
  },
  3: {
    name: 'datetime',
    textName: '日期时间',
    length: null,
    // length: 26,
    scale: 6,
    lengthDisabled: true,
    fieldType: 3
  },
  4: {
    name: 'varchar2',
    textName: '字符串2',
    length: 50,
    scaleDisabled: true,
    fieldType: 4
  },
  5: {
    name: 'number',
    textName: '数字',
    length: 22,
    scale: 6,
    fieldType: 5
  },
  6: {
    name: 'char',
    textName: '字符',
    length: 10,
    scaleDisabled: true,
    fieldType: 6
  },
  7: {
    name: 'text',
    textName: '文本',
    scaleDisabled: true,
    lengthDisabled: true,
    fieldType: 7
  },
  8: {
    name: 'clob',
    textName: '字符大对象',
    scaleDisabled: true,
    lengthDisabled: true,
    fieldType: 8
  },
  9: {
    name: 'blob',
    textName: '二进制大对象',
    scaleDisabled: true,
    lengthDisabled: true,
    fieldType: 9
  },
  10: {
    name: 'bigint',
    textName: '长整数',
    length: 19,
    scaleDisabled: true,
    lengthDisabled: true,
    fieldType: 10
  },
  11: {
    name: 'varchar',
    textName: '字典',
    length: 50,
    scaleDisabled: true,
    fieldType: 11
  }
}
