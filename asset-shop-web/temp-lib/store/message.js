import { message } from '../api'
const {
  addMsgConfig, findMsgConfig, queryNewFiveMsgList,
  updateReadState, selectNotReadMsgCount
} = message

import { easyClone } from '../utils'

const state = {
  unreadNum: 0,
  newMsgList: [],
  msgSettings: {
    voiceFlag: 1,
    clearFlag: 0
  }
}
const mutations = {
  SET_MSG_SETTINGS(state, { voiceFlag, clearFlag }) {
    state.msgSettings = { voiceFlag, clearFlag }
  },
  SET_MSG_UNREADNUM(state, unreadNum) {
    state.unreadNum = unreadNum
  },
  SET_NEW_MSGLIST(state, newMsgList) {
    state.newMsgList = newMsgList
  },
  SET_MSG_READED(state, msgId) {
    const msgItem = state.newMsgList.find(item => item.msgId === msgId)
    msgItem.readFlag = 1
    state.newMsgList = easyClone(state.newMsgList)
  }
}

const actions = {
  async getMsgSettings({ commit }) {
    const settingsData = await findMsgConfig()
    if (settingsData.data) {
      commit('SET_MSG_SETTINGS', settingsData.data)
    }
  },
  async submitMsgSettings({ commit }, { voiceFlag, clearFlag }) {
    await addMsgConfig(voiceFlag, clearFlag)
    commit('SET_MSG_SETTINGS', { voiceFlag, clearFlag })
  },
  async getMsgTipList({ commit }, { senderId, readFlag }) {
    const newMsgListData = await queryNewFiveMsgList(senderId, readFlag)
    const newMsgList = newMsgListData.data.list
    commit('SET_NEW_MSGLIST', newMsgList)
    const countData = await selectNotReadMsgCount(senderId)
    commit('SET_MSG_UNREADNUM', countData.data)
  },
  async readMsgById({ commit, state }, { msgId, userId }) {
    await updateReadState(msgId, 1, userId)
    commit('SET_MSG_READED', msgId)
    commit('SET_MSG_UNREADNUM', state.unreadNum - 1)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
