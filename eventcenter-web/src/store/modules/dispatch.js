import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'
import { removeEmptyChildren } from '@/utils'
import { getCustomizeTopConfig, getCustomizeTableConfig, setCustomizeTopConfig, setCustomizeTableConfig } from '@/utils/auth'

const tableColumnsList = [
  { id: 'eventCode', name: '事件编号' },
  { id: 'sourceText', name: '事件来源' },
  { id: 'eventTypeText', name: '事件类型' },
  { id: 'urgentText', name: '紧急程度' },
  { id: 'eventStateText', name: '处理状态' },
  { id: 'reporterName', name: '上报人' },
  { id: 'reporterMobile', name: '联系方式' },
  { id: 'happenTime', name: '上报时间' },
  { id: 'taskLeftTime', name: '是否超时' },
  { id: 'limitTimeDesc', name: '处置时限' }
]
const defaultCheckedColumns = tableColumnsList.map(({ id }) => id)

const state = {
  dictDatas: [], // 字典数据
  meetingDictDatas: [],
  allEventTypes: [], // 新全量数据类型tree
  allEventTypesHiddenForbidden: [], // 过滤禁用数据类型
  allEventTypesList: [], // 新全量数据类型list
  allEventTypesHistory: [], // 历史事件类型
  allGrids: [], // 全量所属区域
  accrualTree: [], // 权责清单tree树数据
  dictProcess: [], // 流程模板
  totoButtons: [], // 当前可操作按钮集合
  tableColumnsList, // todo的表格配置
  customizeTopConfig: getCustomizeTopConfig(), // 置顶配置
  customizeTableConfig: getCustomizeTableConfig([...defaultCheckedColumns]), // 定制表格,初始化默认全选
  unReadMessageNums: 0,
  thirdSystemList: [] // 三方系统列表
}

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

const mutations = {
  SET_DICTS: (state, dicts) => {
    state.dictDatas = dicts
  },
  SET_MEETING_DICTS: (state, dicts) => {
    state.meetingDictDatas = dicts
  },
  SET_EVENT_TYPE: (state, value) => {
    state.allEventTypes = value
  },
  SET_EVENT_TYPE_HIDDEN_DISABLED: (state, value) => {
    state.allEventTypesHiddenForbidden = value
  },
  SET_DUTIES_EVENT_TYPE_LIST: (state, value) => {
    state.allEventTypesList = value
  },
  SET_EVENT_TYPE_HISTORY: (state, value) => {
    state.allEventTypesHistory = value
  },
  SET_ACCRUAL_TREE: (state, value) => {
    state.accrualTree = value
  },
  SET_PROCESS_DICT: (state, value = []) => {
    state.dictProcess = value
  },
  SET_TODO_BUTTONS: (state, buttons = []) => {
    state.totoButtons = buttons
  },
  // 清空按钮权限集合
  RET_TODO_BUTTONS: (state, value) => {
    state.totoButtons = value
  },
  // 置顶配置
  SET_TODO_CUSTOMIZE_TOP_CONFIG: (state, value) => {
    state.customizeTopConfig = { ... value }
    setCustomizeTopConfig({ ...value })
  },
  // 定制表格
  SET_TODO_CUSTOMIZE_TABLE_CONFIG: (state, value) => {
    state.customizeTableConfig = [... value]
    setCustomizeTableConfig([... value])
  },
  SETALLGRIDS: (state, value) => {
    state.allGrids = value
  },
  SET_UNREADMESSAGENUMS: (state, value) => {
    state.unReadMessageNums = value
  },
  // 存储三方系统列表
  SET_THIRD_SYSTEM_LIST: (state, value) => {
    state.thirdSystemList = value
  }
}

const actions = {
  // get global dicts
  getDictDatas({ commit }) {
    moduleSrv.getDictData().then(res => {
      if (res.code === SUCCESS_CODE) {
        commit('SET_DICTS', res.data)
      } else {
        console.warn('get dicts interface error', res.message)
      }
    })
  },
  getMeetingDictDatas({ commit }) {
    moduleSrv.getDictListByType().then(res => {
      if (!res.code) {
        commit('SET_MEETING_DICTS', res.data)
      } else {
        console.warn('get dicts interface error', res.message)
      }
    })
  },

  // 事件类型新,几个模块都使用到了, 对全量的事件类型进行重组，转变为树形层级结构treeResult，listResult平铺
  // isLevelGraterEqual3用于新增事件类型判断level>=3
  getEventType({ commit }, params = {}) {
    const _params = {
      status: 0,
      sourceSystemCode: '100',
      ...params,
      busiType: '1'// 默认只查监管事件类型的事项
    }
    // params传了busitype===‘’需要查全量
    if (params.busiType === '') delete _params.busiType
    return new Promise((resolve) => {
      moduleSrv.getDutiesList(_params).then(res => {
        if (res.code === 0) {
          // listResult有顺序
          const { treeResult, listResult } = arrayToTree(res.data || [], 0)
          commit('SET_EVENT_TYPE', treeResult)
          commit('SET_DUTIES_EVENT_TYPE_LIST', listResult)
          resolve()
        }
      })
    })
  },
  getEventTypeHiddenDisabled({ commit }, params = {}) {
    return new Promise((resolve) => {
      moduleSrv.getDutiesList(params).then(res => {
        if (res.code === 0) {
          // listResult有顺序
          const { treeResult } = arrayToTree(res.data || [], 0)
          commit('SET_EVENT_TYPE_HIDDEN_DISABLED', treeResult)
          resolve()
        }
      })
    })
  },
  // 历史事件中使用的接口
  getEventTypesHistory({ commit }, params = {}) {
    moduleSrv.getEventTypesHistory(params).then(res => {
      const { data = [] } = res
      if (res.code === 0) {
        commit('SET_EVENT_TYPE_HISTORY', data)
      }
    })
  },
  // 权责清单tree数据
  getAccrualTree({ commit }, params = {}) {
    moduleSrv.eventGetEventType().then((res) => {
      if (res) {
        commit('SET_ACCRUAL_TREE', res)
      }
    })
  },

  // 策略配置的事件类型方法更改，之前的接口走了缓存
  getEventTypeList({ commit }, params = {}) {
    moduleSrv.getEventTypeList(params).then(res => {
      const { data = [] } = res
      if (res.code === SUCCESS_CODE) {
        commit('SET_EVENT_TYPE', data)
      }
    })
  },
  // 流程模板查询
  getProcess({ commit }, params = {}) {
    moduleSrv.getProcess(params).then(res => {
      commit('SET_PROCESS_DICT', res)
    })
  },

  // 所属区域全局存储
  getAllGrids({ commit }) {
    return new Promise((resolve, reject) => {
      moduleSrv.getAllGrids().then((res) => {
        if (res.code === SUCCESS_CODE) {
          commit('SETALLGRIDS', removeEmptyChildren(res.data) || [])
          resolve(res.data)
        } else {
          console.warn('getDeptTree 接口报错')
          reject()
        }
      })
    })
  },

  // 获取操作按钮权限接口
  getTodoButtons({ commit }, params = {}) {
    moduleSrv.getTodoButtons(params).then(res => {
      if (res.code === SUCCESS_CODE) {
        commit('SET_TODO_BUTTONS', res.data || [])
      } else {
        console.warn('getTodoButtons ----- error')
      }
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
