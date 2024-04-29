class apiConfig {
  /**
   * 根据serviceSuffix获取服务器后缀名称
   * @param {string} val
   * @param {boolean} isSocket 是否是websocket
   */
  static getUrl(val, isSocket = false) {
    switch (process.env.VUE_APP_ENV) {
      case 'dev':
        return window.serviceUrl('dev', val, isSocket)
      case 'test':
        return window.serviceUrl('test', val, isSocket)
      case 'stage':
        return window.serviceUrl('stage', val, isSocket)
    }
  }
}
export default apiConfig

/**
 * 资源资源状态
 */
export const assetStatus = [
  // {
  //   label: '创建失败',
  //   value: '7'
  // },
  {
    label: '开发中',
    value: '1'
  },
  // {
  //   label: '发布中',
  //   value: '3'
  // },
  // {
  //   label: '发布失败',
  //   value: '4'
  // },
  {
    label: '已发布',
    value: '5'
  }
// {
//   label: '创建中',
//   value: '6'
// },
// {
//   label: '创建失败',
//   value: '7'
// }
]

/**
 * 共享状态
 */
export const shareStatus = [{
  label: '已共享',
  value: '1'
},
{
  label: '未共享',
  value: '0'
}
]
/**
 * 页面类型
 */
export const pageTypeList = [
  // { label: '登录页', value: 1 },
  // { label: '门户页', value: 2 },
  // { label: '空白页', value: 3 },
  { label: '表单页面', value: '4' },
  { label: '审批列表', value: '5' },
  { label: '普通列表', value: '6' },
  { label: '统计列表页面', value: '7' },
  { label: '自定义页面', value: '8' },
  { label: '开发页面', value: '9' }
]
/**
 * 资源来源
 */
export const assetSrc = [{
  label: '自研',
  value: '1'
},
{
  label: '下载',
  value: '2'
},
{
  label: '导入',
  value: '3'
}
]
export const groupType = [{
  label: '租户',
  value: '1'
},
{
  label: '私有',
  value: '2'
},
{
  label: '公共',
  value: '3'
},
{
  label: '公共', // 4公有-不可见主资源
  value: '4'
},
{
  label: '公共', // 5公有-引用资源
  value: '5'
}
]

/**
 * 资源类型列表
 */
export const assetTypeList = [{
  label: '流程资源',
  value: '5',
  children: [{
    hidden: true,
    label: '业务流程',
    value: '51'
  }
    // { label: '逻辑流程', value: '52' }
  ]
}, {
  label: '对象资源',
  value: '3',
  children: [{
    label: '实体',
    value: '31'
  }
    // { label: '视图对象', value: '32'
    // }
  ]
}, {
  label: '数据资源',
  value: '1',
  nodidaima: false,
  children: [{
    label: '体征',
    value: '14'
  }
  // {
  //   label: '数据',
  //   value: '13'
  // }
  ]
}, {
  label: '技术资源',
  value: '2',
  children: [
    // {
    //   label: '算法资源',
    //   value: '21',
    //   nodidaima: true
    // },
    {
      label: '接口',
      value: '22'
    },
    {
      label: '页面',
      value: '23'
    }, {
      label: '脚本',
      value: '26'
    }
  //  {
  //   label: '支撑应用',
  //   value: '27'
  // }
    // { label: '逻辑函数', value: '24' },
    // { label: '定时任务', value: '25' }
  ]
}, {
  label: '模型资源',
  value: '7',
  nodidaima: false,
  children: [
    // {
    //   label: '模型',
    //   value: '71'
    // },
    {
      hidden: true,
      label: '模型',
      value: '72'
    }
  ]
}]

export const assetTypeListDiDaima = JSON.parse(JSON.stringify(assetTypeList)).filter(item => !item.nodidaima).map(parent => {
  parent.children = parent.children && parent.children.filter(item => !item.nodidaima && !item.hidden)
  parent.children = parent.children.length ? parent.children : null
  return parent
})

export const assetTypeListDailog = [{
  label: '流程资源',
  value: '5'
}, {
  label: '对象资源',
  value: '3',
  children: [{
    label: '实体',
    value: '31'
  }
  ]
}, {
  label: '技术资源',
  value: '2',
  children: [
    // {
    //   label: '算法资源',
    //   value: '21',
    //   nodidaima: true
    // },

    {
      label: '页面',
      value: '23'
    }, {
      label: '脚本',
      value: '26'
    }
  //  {
  //   label: '支撑应用',
  //   value: '27'
  // }
    // { label: '逻辑函数', value: '24' },
    // { label: '定时任务', value: '25' }
  ]
}]

export const assetTypeListSub = [

  {
    label: '接口',
    value: '22'
  }, {
    label: '支撑应用',
    value: '27'
  }

]

/**
 * @Description:
 * @Author: lianpeng
 * @Date: 2021-09-14
 */

export const typeTreeData = JSON.parse(JSON.stringify(assetTypeList)).map(parent => {
  return {
    groupId: parent.value,
    groupName: parent.label,
    isGroup: true,
    parentId: 0,
    treeId: 'group-' + parent.value,
    childList: !parent.children ? [] : parent.children.filter(item => !item.hidden).map(child => {
      return {
        groupId: child.value,
        groupName: child.label,
        isGroup: true,
        parentId: parent.value,
        treeId: 'group-' + child.value,
        childList: []
      }
    })
  }
})
// [{
//   groupId: 5,
//   groupName: '流程资源',
//   isGroup: true,
//   parentId: 0,
//   treeId: 'group-5',
//   childList: []
// }, {
//   groupId: 3,
//   groupName: '对象资源',
//   isGroup: true,
//   parentId: 0,
//   treeId: 'group-3',
//   childList: []
// },

// {
//   groupId: 1,
//   groupName: '数据资源',
//   isGroup: true,
//   parentId: 0,
//   treeId: 'group-1',
//   childList: [
//     {
//       groupId: 13,
//       groupName: '数据',
//       isGroup: true,
//       parentId: 1,
//       treeId: 'group-13',
//       childList: []
//     },
//     {
//       groupId: 11,
//       groupName: '指标',
//       isGroup: true,
//       parentId: 1,
//       treeId: 'group-11',
//       childList: []
//     }
//   ]
// }, {
//   groupId: 2,
//   groupName: '技术资源',
//   isGroup: true,
//   parentId: 0,
//   treeId: 'group-2',
//   childList: [{
//     groupId: 21,
//     groupName: '算法',
//     isGroup: true,
//     parentId: 2,
//     treeId: 'group-21',
//     childList: []
//   }, {
//     groupId: 22,
//     groupName: '接口',
//     isGroup: true,
//     parentId: 2,
//     treeId: 'group-22',
//     childList: []
//   }, {
//     groupId: 23,
//     groupName: '页面',
//     isGroup: true,
//     parentId: 2,
//     treeId: 'group-23',
//     childList: []
//   }]
// }]
/**
 * 资源类型
 */
export const assetType = assetTypeList.map(parent => {
  return {
    label: parent.label,
    value: parent.value
  }
})
// [
// // 1统计、2技术、3对象、5流程
//   { label: '数据资源', value: '1' },
//   { label: '技术资源', value: '2' },
//   { label: '对象资源', value: '3' },
//   { label: '流程资源', value: '5' }
// ]

// 资源编码提示文案
export const AssetCodeToolTipText = `
  编码构成为“类型_自定义编码”<br>
  支持英文、数字、下划线，整体长度不超过20。
`

// 特殊分割符
export const SplitFlag = '₪'

// 查看详情无数据字段显示符号
export const DefaultValue = '--'
