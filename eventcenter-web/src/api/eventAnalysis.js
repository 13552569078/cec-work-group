// 事件分析统计
import request from '@/utils/request'
import baseUrlMap from '@/utils/config'
const eventAnalysisApi = {
  // 本部门办理统计
  postThisDeptStat: (params = {}) => request.post(`${baseUrlMap.event}/deptProcessStat/getThisDeptStat
  `, params),
  // 本部门办理处理数统计
  postThisDeptProcessStatList: (params = {}) => request.post(`${baseUrlMap.event}/deptProcessStat/getThisDeptProcessStat/list
  `, params),
  // 下级部门办理统计
  postSubDeptStatList: (params = {}) => request.post(`${baseUrlMap.event}/deptProcessStat/getSubDeptStat/list
  `, params),
  // 事件类型办理统计
  postEventTypeStatPage: (params = {}) => request.post(`${baseUrlMap.event}/deptProcessStat/getEventTypeStat/page
  `, params),
  // 办理人员统计
  postProcessPersonStatPage: (params = {}) => request.post(`${baseUrlMap.event}/deptProcessStat/getProcessPersonStat/page
   `, params),
  // 事件类型分析分页列表
  getEventTypeAnalyseList: (params = {}) => request.get(`${baseUrlMap.event}/tcEvent/eventTypeAnalyseList`, params),
  // 事件类型分析分页列表
  getEventTypeAnalyseTotal: (params = {}) => request.get(`${baseUrlMap.event}/tcEvent/eventTypeAnalyseTotal`, params),
  // 网格id获取详情
  getGridById: (params = {}, config = {}) => request.get(`${baseUrlMap.uc}/openApi/grid/getById`, params, config),
  // 网格下级
  getChildGridList: (params = {}) => request.post(`${baseUrlMap.uc}/openApi/grid/getChildGridList`, params),
  // 区域实体机构
  getOrgListByToken: (params = {}, config = {}) => request.get(`${baseUrlMap.uc}/openApi/org/getOrgListByToken`, params, config)
}

export default eventAnalysisApi
