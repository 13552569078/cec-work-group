import { deepClone, filterEventTypeTree, getSpeLeafByVal, makeNewEventTypeTree } from '@/utils'
import { getProfile, getConfig } from '@/utils/auth'
const currentProfile = getProfile()
const currentConfig = getConfig()

const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  getConfig: state => state.app.config || currentConfig,
  token: state => state.user.token,
  profile: state => state.user.profile || currentProfile,
  appInfo: state => state.user.appInfo,
  appCode: state => state.user.appCode,
  menuList: state => state.route.menuList,
  systemConfiglist: state => state.user.systemConfiglist,
  orgRoleList: state => state.user.orgRoleList,
  selectedOrgRole: state => state.user.selectedOrgRole,
  bsDicts: state => state.user.bsDicts,
  getBsDictsByType: (state, getters) => (dictType) => {
    const matchNode = getters.bsDicts.filter(item => item.dictType === dictType)
    if (!matchNode.length) return []
    return matchNode
  },
  dictDatas: state => state.dispatch.dictDatas || [],
  meetingDictDatas: state => state.dispatch.meetingDictDatas || [],
  dictProcess: state => state.dispatch.dictProcess || [],
  allGridsNoDisabled: state => state.dispatch.allGrids,
  allGrids: state => {
    const allGrids = deepClone(state.dispatch.allGrids)
    // 分组节点不可以选择
    return allGrids.map(item => {
      if (item.groupName) {
        item.disabled = true
      }
      return item
    })
  },
  // 从全局字典中过滤需要使用的类型
  getDictsByType: (state, getters) => (type) => {
    return getters.dictDatas.filter(item => item.dictType === type)
  },
  // 从全局字典中过滤需要使用的类型
  getMeetingDictsByType: (state, getters) => (type) => {
    return getters.meetingDictDatas.filter(item => item.dictType === type)
  },
  // 全量事件类型数据--已经改造为树形结构，无需进行重组了
  getAllEventTypes: state => state.dispatch.allEventTypes,
  // 筛选事件类型----eventTypeCode，需求变更 不涉及了 暂时保留
  getAllEventTypesBySpe: (state) => (speTypeStr, leafUpOne) => {
    if (!state.dispatch.allEventTypes?.length) return []
    if (!speTypeStr) {
      const allEventTypeArr = deepClone(state.dispatch.allEventTypes)
      return leafUpOne ? filterEventTypeTree(allEventTypeArr, '', leafUpOne) : allEventTypeArr
    }
    const speList = speTypeStr.split(',')
    const treeList = []
    speList.forEach(speType => {
      const allEventTypeArr = deepClone(state.dispatch.allEventTypes)
      const speTree = deepClone(state.user.speTypeTree)
      const spLeafList = getSpeLeafByVal(speTree, speType)
      const ldzh_speTree = deepClone(state.user.ldzhspeTypeTree)
      const ldzh_spLeafList = getSpeLeafByVal(ldzh_speTree, speType)
      const allSpeList = spLeafList.concat(ldzh_spLeafList)
      const uniqueSpeLeafList = Array.from(new Set(allSpeList))
      let arr = []
      if (spLeafList?.length) arr = filterEventTypeTree(allEventTypeArr, uniqueSpeLeafList)
      if (leafUpOne) arr = filterEventTypeTree(arr, '', leafUpOne)
      arr.length && treeList.push(arr)
    })
    console.log(treeList, makeNewEventTypeTree(treeList))
    return treeList.length === 1 ? treeList[0] : makeNewEventTypeTree(treeList)
  },
  // 新全量事件类型数据
  allEventTypesList: state => state.dispatch.allEventTypesList,
  getAllEventTypesHistory: state => state.dispatch.allEventTypesHistory,
  // 根据全量的事件类型，转换为树形结构数据
  // hasDisabled: 是否保留禁用，hasHidden：是否保留隐藏的数据
  getEventTypeByFlag: (state, getters) => ({ hasDisabled = false, hasHidden = false }) => {
    let eventTypeTree = JSON.parse(JSON.stringify(getters.getAllEventTypes))
    if (!hasHidden) { // 隐藏状态是隐藏的数据
      eventTypeTree = eventTypeTree.filter(item => item.optShow === '1')
    }
    return eventTypeTree
  },
  todoButtons: state => state.dispatch.totoButtons,
  getAccrualTree: state => state.dispatch.accrualTree,
  getUnReadMessageNums: state => state.dispatch.unReadMessageNums,
  getThirdSystemList: state => state.dispatch.thirdSystemList,
  speTypeTree: state => state.user.speTypeTree,
  ldzhspeTypeTree: state => state.user.ldzhspeTypeTree
}
export default getters
