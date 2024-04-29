import request from '@/utils/request'

import { proxyUrl } from './service-suffix.js'

const messageURL = proxyUrl('msg_service')
const messageSettingsURL = proxyUrl('basic_manage_platform')

/**
 * 新增和修改消息设置
 * @param {Number} voiceFlag 是否声音提示，1是0否
 * @param {Number} clearFlag 是否清空看过的消息，1是0否
 */
export const addMsgConfig = (voiceFlag, clearFlag) => request.post(messageSettingsURL + '/portal/addMsgConfig', { voiceFlag, clearFlag })

/**
 * 获取消息设置
 */
export const findMsgConfig = () => request.get(messageSettingsURL + '/portal/findMsgConfig')

/**
 * 消息置为已读
 * @param {*} msgId 消息id
 * @param {Number} readFlag 读取状态，1已读0未读
 * @param {Number} receiverCode 消息接收人标识（userId）
 */
export const updateReadState = (msgId, readFlag, receiverCode) => request.post(messageURL + '/msg/updateReadState', { msgId, readFlag, receiverCode })

/**
 * 全部消息置为已读
 * @param {Number} readFlag 读取状态，1已读0未读
 * @param {Number} receiverCode 消息接收人标识（userId）
 */
export const updateAllReadState = (readFlag, receiverCode) => request.post(messageURL + '/msg/updateAllReadState', { readFlag, receiverCode })

/**
 * 全部消息置为已读
 * @param {Number} readFlag 读取状态，1已读0未读
 * @param {Number} senderId 消息接收人标识（userId）
 * @param {Number} projectCode
 * @param {Number} msgTypeCode
 */
export const batchMsgConfigIsRead = (readFlag, senderId, projectCode, msgTypeCode) => request.post(messageURL + '/msg/batchMsgConfigIsRead', {
  readFlag,
  senderId,
  projectCode,
  msgTypeCode,
  terminalCodeList: ['PC']
})

/**
 * 获取全部未读消息数量
 * @param {*} terminalCodeList 渠道终端 PC端传PC
 * @param {*} senderId userId
 */
export const selectNotReadMsgCount = (senderId) => request.post(messageURL + '/msg/selectNotReadMsgCount', { terminalCodeList: ['PC'], senderId })

/**
 * 删除消息
 * @param {Number} msgId
 * @param {Number} userId
 */
export const delMsgById = (msgId, userId) => request.get(messageURL + '/msg/delMsgById', { params: { msgId, userId }})

/**
 * 查询消息列表
 * @param {Object} data 查询条件，参见：http://192.168.200.12:8081/xiaoyaoji/doc/Y8P8b1n6S
 */
export const queryMsgList = (data) => request.post(messageURL + '/msg/querySendMsgList', data)

/**
 * 清空某个消息类型下的所有消息
 * @param {*} senderId
 * @param {*} readFlag
 * @param {*} projectCode
 * @param {*} msgTypeCode
 */
export const batchDelMsg = (senderId, readFlag, projectCode, msgTypeCode) => request.post(messageURL + '/msg/batchDelMsg', {
  senderId,
  readFlag,
  projectCode,
  msgTypeCode,
  terminalCodeList: ['PC']
})

/**
 * 查询消息左侧导航
 * @param {*} userId
 */
export const queryMsgNavitemTree = (userId) => request.post(messageURL + '/msg/msgNavitemTree', {}, {
  headers: {
    userId
  }
})

/**
 * 查询最新5条
 * @param {*} senderId
 * @param {*} readFlag
 */
export const queryNewFiveMsgList = (senderId, readFlag) => request.post(messageURL + '/msg/queryNewFiveMsgList', {
  senderId,
  readFlag,
  terminalCodeList: ['PC'],
  pageNum: 1,
  pageSize: 5
})

/**
 * 获取消息资源
 * @param {*} data
 */
export const getResourceUrlByCode = (data) => request.post(messageSettingsURL + '/resource/getResourceUrlByCode', data)
