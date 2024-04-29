/**
 * @Description: 消息api
 * @Author: qiyongguo
 * @Date: 2022-04-01
 */
import request from '@/utils/request'
import baseUrlMap from '@/utils/config'

const urls = {
  messageList: `${baseUrlMap.msg}/messageCenter/external/queryMessage`, // 消息列表
  readMsg: `${baseUrlMap.msg}/messageCenter/external/queryMessageDetail`, // 对外消息详情查询，设置已读
  msgCount: `${baseUrlMap.msg}/messageCenter/external/queryMessageNum` // 消息统计
}

const moduleSrv = {
  queryMessageList: (params = {}) => request.post(urls.messageList, params),
  setMsgRead: (params = {}) => request.postForm(urls.readMsg, params),
  getMsgCount: (params = {}) => request.postForm(urls.msgCount, params)
}

export default moduleSrv
