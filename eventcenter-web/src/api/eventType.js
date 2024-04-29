// 协同中心所有接口
import request from '@/utils/request'
import baseUrlMap from '@/utils/config'
const eventTypeModuleSrv = {
  // 事件类型树
  postEventTypeselectAllTree: (params = {}) => request.post(`${baseUrlMap.event}/eventType/manager/selectAllTree
  `, params),
  // 事件类型树-new
  postEventTypeselectAllTreeNew: (params = {}) => request.post(`${baseUrlMap.event}/eventType/manager/treeListAll
  `, params),
  // 事件类型树-new
  getEventTypeselectAllTree: (params = {}) => request.post(`${baseUrlMap.event}/eventType/manager/treeList
    `, params),
  // 修改事件类型状态
  postUpdateEventTypeStatus: (params = {}) => request.post(`${baseUrlMap.event}/eventType/manager/updateEventTypeStatus
  `, params),
  // 生成类型编码
  postGenerateEventTypeCode: (params = {}) => request.post(`${baseUrlMap.event}/eventType/manager/generateEventTypeCode
  `, params),
  // 新增一级事件类型
  postAddLevelOne: (params = {}) => request.post(`${baseUrlMap.event}/eventType/manager/addLevelOne
  `, params),
  // 新增一级事件类型
  postAddChild: (params = {}) => request.post(`${baseUrlMap.event}/eventType/manager/addChild
  `, params),
  // 删除事件分类
  postDeleteEventType: (params = {}) => request.post(`${baseUrlMap.event}/eventType/manager/deleteEventType
  `, params),
  // 编辑非叶子节点事件分类
  posteditEventType: (params = {}) => request.post(`${baseUrlMap.event}/eventType/manager/editEventType
  `, params),
  // 模板下载
  getDownLoad: (params = {}, config = {}) => request.get(`${baseUrlMap.event}/eventExcel/eventTypeDownloadTemplate`, params, config),
  // 三方模版下载
  getThirdDownLoad: (params = {}, config = {}) => request.get(`${baseUrlMap.event}/eventExcel/threeEventTypeDownloadTemplate`, params, config),
  // 全量导入
  eventTypeImportAll: (params = {}) => request.post(`${baseUrlMap.event}/eventExcel/eventTypeImportAll`, params),
  // 增量导入
  eventTypeImportAppend: (params = {}) => request.post(`${baseUrlMap.event}/eventExcel/eventTypeImportAppend`, params),
  // 流程模板获取
  getProcdef: (params = {}, config = {}) => request.get(`${baseUrlMap.event}/tcEventStrategy/procdef`, params, config),
  // 字典项获取
  getDict: (params = {}, config = {}) => request.get(`${baseUrlMap.base}/dict/getDictListByType`, params, config),
  // 事件类型详情
  getEventDetail: (params = {}, config = {}) => request.get(`${baseUrlMap.event}/eventType/getById`, params, config),
  // 保存叶子节点 基本信息
  postSaveEventLeafBase: (params = {}) => request.post(`${baseUrlMap.event}/eventType/manager/saveEventLeafBase`, params),
  // 保存叶子节点 配置处置
  postSaveEventLeafConfig: (params = {}) => request.post(`${baseUrlMap.event}/eventType/manager/saveEventLeafConfig`, params),
  // 事件类型导出
  getEventTypesExcelExport: (params = {}, config) => request.get(`${baseUrlMap.event}/eventExcel/eventType/export`, params, config)
}

export default eventTypeModuleSrv
