// 协同中心所有接口
import request from '@/utils/request'
import baseUrlMap from '@/utils/config'

const urls = {
  tcDictDataZiDian: `${baseUrlMap.event}/tcDictData`, // 子集列表查询
  // 系统来源
  dictDataList: `${baseUrlMap.event}/tcDictData/list`, // 子集列表查询
  addDictData: `${baseUrlMap.event}/tcDictData/add`, // 子集字典新增
  editDictData: `${baseUrlMap.event}/tcDictData/edit`, // 子集字典编辑
  removedictData: `${baseUrlMap.event}/tcDictData/remove`, // 子集字典删除
  // bus api
  busApiPage: `${baseUrlMap.event}/apiManager/page`,
  busApiAdd: `${baseUrlMap.event}/apiManager/add`,
  busApiUpdate: `${baseUrlMap.event}/apiManager/update`,
  getBusApiById: `${baseUrlMap.event}/apiManager/get`,
  busLogPage: `${baseUrlMap.event}/log/page`,
  busLogById: `${baseUrlMap.event}/log/get`,
  busBenchEventThirdStateSummary: `${baseUrlMap.event}/bench/getEventThirdStateSummary`,
  // 数据转换
  busValuesConfigPage: `${baseUrlMap.event}/bus/valuesConfig/page`,
  busValuesConfigAdd: `${baseUrlMap.event}/bus/valuesConfig/add`,
  busValuesConfigUpdate: `${baseUrlMap.event}/bus/valuesConfig/update`,
  busValuesConfigDelete: `${baseUrlMap.event}/bus/valuesConfig/delete`,
  eventTypeConfigPage: `${baseUrlMap.event}/bus/eventTypeConfig/page`,
  eventTypeConfigListByParentId: `${baseUrlMap.event}/bus/eventTypeConfig/listByParentId`, // /{id}
  eventTypeConfigAdd: `${baseUrlMap.event}/bus/eventTypeConfig/add`,
  eventTypeConfigUpdate: `${baseUrlMap.event}/bus/eventTypeConfig/update`,
  eventTypeConfigUpdateAll: `${baseUrlMap.event}/bus/eventTypeConfig/updateAll`,
  eventTypeConfigDelete: `${baseUrlMap.event}/bus/eventTypeConfig/delete`,
  eventTypeConfigGet: `${baseUrlMap.event}/bus/eventTypeConfig/get`,
  eventTypeConfigList: `${baseUrlMap.event}/bus/eventTypeConfig/list`,
  eventTypeConfigFromAndTo: `${baseUrlMap.event}/bus/eventTypeConfig/fromAndTo`,
  selectMinByPlatFromSearch: `${baseUrlMap.event}/eventType/selectMinByPlatFrom`,
  selectMinByPlatFrom: `${baseUrlMap.event}/bus/eventTypeConfig/selectMinByPlatFrom`,

  mediadownload: `${baseUrlMap.event}/media/download`,
  getBuOverview: `${baseUrlMap.event}/tcEvent/science/bus/getBuOverview`,
  getBusSoure: `${baseUrlMap.event}/tcEvent/science/bus/getBusSoure`,
  getBusDisposition: `${baseUrlMap.event}/tcEvent/science/bus/getBusDisposition`,
  getBusProcessAnalysis: `${baseUrlMap.event}/tcEvent/science/bus/getBusProcessAnalysis`,
  getBusEventTypeTOP10: `${baseUrlMap.event}/tcEvent/science/bus/getBusEventTypeTOP10`,
  getBusOverTimeAnalysis: `${baseUrlMap.event}/tcEvent/science/bus/getBusOverTimeAnalysis`,
  getBusTrend: `${baseUrlMap.event}/tcEvent/science/bus/getBusTrend`,

  getInflowBySys: `${baseUrlMap.event}/monitor/getInflowBySys`,
  getInflowByType: `${baseUrlMap.event}/monitor/getInflowByType`,
  getInflowList: `${baseUrlMap.event}/monitor/getInflowList`,
  getOutflowBySys: `${baseUrlMap.event}/monitor/getOutflowBySys`,
  getOutflowByType: `${baseUrlMap.event}/monitor/getOutflowByType`,
  getOutflowList: `${baseUrlMap.event}/monitor/getOutflowList`,
  getTaskByEventCode: `${baseUrlMap.event}/monitor/getTaskByEventCode`,

  getEventThirdStateSummary: `${baseUrlMap.event}/monitor/getEventThirdStateSummary`,
  getEventThirdStateBySys: `${baseUrlMap.event}/monitor/getEventThirdStateBySys`,
  getEventThirdStateList: `${baseUrlMap.event}/monitor/getEventThirdStateList`,
  getEventThirdStateByEventCode: `${baseUrlMap.event}/monitor/getEventThirdStateByEventCode`,

  getTaskStateSummary: `${baseUrlMap.event}/monitor/getTaskStateSummary`,
  getTaskStateBySys: `${baseUrlMap.event}/monitor/getTaskStateBySys`,
  getTaskStateList: `${baseUrlMap.event}/monitor/getTaskStateList`,
  getTaskStateByEventCode: `${baseUrlMap.event}/monitor/getTaskStateByEventCode`,
  // 首页数据统计-事件总线-流转系统接口
  getOneMounthOverviewStatistics: `${baseUrlMap.event}/tcEvent/manager/oneMounthOverviewStatistics`,
  get30DispatchStatistics: `${baseUrlMap.event}/tcEvent/manager/get30DispatchStatistics`,
  getMounthDataStatistics: `${baseUrlMap.event}/tcEvent/manager/getMounthDataStatistics`,
  // 首页数据统计-协同中心-处置系统接口
  getOpenEventHandleStatistic: `${baseUrlMap.event}/tcEvent/science/handle/statistic`,
  getOpenTcEventTodoList: `${baseUrlMap.event}/tcEvent/todoList`,
  getOpenEventHandleUserStatistic: `${baseUrlMap.event}/tcEvent/science/user/info`,
  // 基础信息管理
  getPlatformInfoList: `${baseUrlMap.event}/platform/info`,
  addPlatformInfo: `${baseUrlMap.event}/platform/add`,
  deletePlatformInfo: `${baseUrlMap.event}/platform/delete`,
  getPlatformInfoDetail: `${baseUrlMap.event}/platform/detail`,
  updatePlatformInfo: `${baseUrlMap.event}/platform/update`,
  updatePlatformStatus: `${baseUrlMap.event}/platform/status`,
  // 基础平台下拉
  getPlatformInfoSelect: `${baseUrlMap.event}/platform/select/list`,
  getEvaluateModelSelect: `${baseUrlMap.event}/evaluate/model/select`,

  // 组织树
  getTreeV2WithHaveChild: `${baseUrlMap.uc}/openApi/org/v2/treeList`,
  getListV2WithHaveChild: `${baseUrlMap.uc}/openApi/org/v2/listV2WithHaveChild`,

  /**
   * 三方类型配置接口
   */
  addThirdTypeLevelOne: `${baseUrlMap.event}/third/event/type/addLevelOne`,
  addThirdTypeChild: `${baseUrlMap.event}/third/event/type/addChild`,
  getThirdTypeList: `${baseUrlMap.event}/third/event/type/treeList`,
  deleteThirdType: `${baseUrlMap.event}/third/event/type/delete`,
  updateThirdType: `${baseUrlMap.event}/third/event/type/update`,
  updateThirdTypeStatus: `${baseUrlMap.event}/third/event/type/update/status`,
  getThirdTypeById: `${baseUrlMap.event}/third/event/type/detail`,
  deleteThirdApi: `${baseUrlMap.event}/apiManager/delete`,

  // 行政区划转换
  getAreaTree: `${baseUrlMap.event}/area/tree`,
  updateThirdSystemArea: `${baseUrlMap.event}/area/mapping`,
  getAreaChildrenList: `${baseUrlMap.uc}/areaCode/getChildrenList`,
  // 来源系统类型转换
  sourceSystemRelationList: `${baseUrlMap.event}/third/eventType/trans/sourceSys/relation/listPage`,
  saveSourceSystemRelation: `${baseUrlMap.event}/third/eventType/trans/sourceSys/relation/save`,
  // 处置系统类型转换
  disposeSystemRelationList: `${baseUrlMap.event}/third/eventType/trans/disposeSys/relation/listPage`,
  saveDiaposeSystemRelation: `${baseUrlMap.event}/third/eventType/trans/disposeSys/relation/save`,

  // 处置系统转换-一键同步
  updateSyncConfDisposeSys: `${baseUrlMap.event}/third/eventType/trans/disposeSys/syncConf`,
  getSyncConfDisposeSysList: `${baseUrlMap.event}/third/eventType/trans/disposeSys/syncConf/multiple/conf`,
  saveSyncConfDisposeSys: `${baseUrlMap.event}/third/eventType/trans/disposeSys/syncConf/multiple/conf/save`

}

const moduleSrv = {
  getTcDictDataZiDian: (params = {}) => request.get(urls.tcDictDataZiDian, params),
  // 系统来源
  getDictDataList: (params = {}) => request.get(urls.dictDataList, params),
  addDictData: (params = {}) => request.post(urls.addDictData, params),
  editDictData: (params = {}) => request.post(urls.editDictData, params),
  removedictData: (params = {}) => request.post(urls.removedictData, params),
  // bus api
  getBusApiPage: (params = {}) => request.get(urls.busApiPage, params),
  busApiAdd: (params = {}) => request.post(urls.busApiAdd, params),
  busApiUpdate: (params = {}) => request.post(urls.busApiUpdate, params),
  getBusApiById: (params = {}) => request.get(`${urls.getBusApiById}/${params.id}`, params),
  getBusLogPage: (params = {}) => request.get(urls.busLogPage, params),
  getBusLogById: (params = {}) => request.get(`${urls.busLogById}/${params.id}`, params),
  busValuesConfigPage: (params = {}) => request.get(urls.busValuesConfigPage, params),
  busValuesConfigAdd: (params = {}) => request.post(urls.busValuesConfigAdd, params),
  busValuesConfigUpdate: (params = {}) => request.post(urls.busValuesConfigUpdate, params),
  busValuesConfigDelete: (params = {}) => request.get(`${urls.busValuesConfigDelete}/${params.id}`, params),
  busBenchEventThirdStateSummary: (params = {}) => request.get(`${urls.busBenchEventThirdStateSummary}`, params),
  eventTypeConfigPage: (params = {}) => request.get(urls.eventTypeConfigPage, params),
  eventTypeConfigListByParentId: (params = {}) => request.get(`${urls.eventTypeConfigListByParentId}/${params.id}`, params),
  eventTypeConfigAdd: (params = {}) => request.post(urls.eventTypeConfigAdd, params),
  eventTypeConfigUpdate: (params = {}) => request.post(urls.eventTypeConfigUpdate, params),
  eventTypeConfigUpdateAll: (params = {}) => request.post(urls.eventTypeConfigUpdateAll, params),
  eventTypeConfigDelete: (params = {}) => request.get(`${urls.eventTypeConfigDelete}/${params.id}`, params),
  eventTypeConfigGet: (params = {}) => request.get(`${urls.eventTypeConfigGet}/${params.id}`, params),
  eventTypeConfigList: (params = {}) => request.get(urls.eventTypeConfigList, params),
  eventTypeConfigFromAndTo: (params = {}) => request.get(urls.eventTypeConfigFromAndTo, params),
  selectMinByPlatFromSearch: (params = {}) => request.get(`${urls.selectMinByPlatFromSearch}`, params),
  selectMinByPlatFrom: (params = {}) => request.get(`${urls.selectMinByPlatFrom}`, params),

  mediadownload: (params = {}, config = {}) => request.get(urls.mediadownload, params, config),
  getBuOverview: (params = {}) => request.get(urls.getBuOverview, params),
  getBusSoure: (params = {}) => request.get(urls.getBusSoure, params),
  getBusDisposition: (params = {}) => request.get(urls.getBusDisposition, params),
  getBusProcessAnalysis: (params = {}) => request.get(urls.getBusProcessAnalysis, params),
  getBusEventTypeTOP10: (params = {}) => request.get(urls.getBusEventTypeTOP10, params),
  getBusOverTimeAnalysis: (params = {}) => request.get(urls.getBusOverTimeAnalysis, params),
  getBusTrend: (params = {}) => request.get(urls.getBusTrend, params),

  getInflowBySys: (params = {}) => request.get(urls.getInflowBySys, params),
  getInflowByType: (params = {}) => request.get(urls.getInflowByType, params),
  getInflowList: (params = {}) => request.get(urls.getInflowList, params),
  getOutflowBySys: (params = {}) => request.get(urls.getOutflowBySys, params),
  getOutflowByType: (params = {}) => request.get(urls.getOutflowByType, params),
  getOutflowList: (params = {}) => request.get(urls.getOutflowList, params),
  getTaskByEventCode: (params = {}) => request.get(urls.getTaskByEventCode, params),

  getEventThirdStateSummary: (params = {}) => request.get(urls.getEventThirdStateSummary, params),
  getEventThirdStateBySys: (params = {}) => request.get(urls.getEventThirdStateBySys, params),
  getEventThirdStateList: (params = {}) => request.get(urls.getEventThirdStateList, params),
  getEventThirdStateByEventCode: (params = {}) => request.get(urls.getEventThirdStateByEventCode, params),

  getTaskStateSummary: (params = {}) => request.get(urls.getTaskStateSummary, params),
  getTaskStateBySys: (params = {}) => request.get(urls.getTaskStateBySys, params),
  getTaskStateList: (params = {}) => request.get(urls.getTaskStateList, params),
  getTaskStateByEventCode: (params = {}) => request.get(urls.getTaskStateByEventCode, params),

  getInflowTotalCount: (params = {}) => request.get(`${baseUrlMap.event}/monitor/getInflowTotalCount`, params),
  getInflowHistoryTrend: (params = {}) => request.get(`${baseUrlMap.event}/monitor/getInflowHistoryTrend`, params),
  getInflowAnalysisBySys: (params = {}) => request.get(`${baseUrlMap.event}/monitor/getInflowAnalysisBySys`, params),
  getInflowAnalysisByEventType: (params = {}) => request.get(`${baseUrlMap.event}/monitor/getInflowAnalysisByEventType`, params),
  getInflowByDay: (params = {}) => request.get(`${baseUrlMap.event}/monitor/getInflowByDay`, params),
  getInflowYearTrend: (params = {}) => request.get(`${baseUrlMap.event}/monitor/getInflowYearTrend`, params),

  getOutflowTotalCount: (params = {}) => request.get(`${baseUrlMap.event}/monitor/getOutflowTotalCount`, params),
  getOutflowTrend: (params = {}) => request.get(`${baseUrlMap.event}/monitor/getOutflowTrend`, params),
  getTaskOutflowTotalCount: (params = {}) => request.get(`${baseUrlMap.event}/monitor/getTaskOutflowTotalCount`, params),
  getTaskOutflowTrend: (params = {}) => request.get(`${baseUrlMap.event}/monitor/getTaskOutflowTrend`, params),
  getOutflowByDealSys: (params = {}) => request.get(`${baseUrlMap.event}/monitor/getOutflowByDealSys`, params),
  getOutflowByDealEventType: (params = {}) => request.get(`${baseUrlMap.event}/monitor/getOutflowByDealEventType`, params),
  getOutflowByDay: (params = {}) => request.get(`${baseUrlMap.event}/monitor/getOutflowByDay`, params),
  getOutflowYearTrend: (params = {}) => request.get(`${baseUrlMap.event}/monitor/getOutflowYearTrend`, params),

  getAppraiseTargetList: (params = {}) => request.get(`${baseUrlMap.event}/evaluate/index/page`, params),
  postAppraiseTargetAdd: (params = {}) => request.post(`${baseUrlMap.event}/evaluate/index/add`, params),
  postAppraiseTargetUpdate: (params = {}) => request.post(`${baseUrlMap.event}/evaluate/index/update`, params),
  postAppraiseTargetDelete: (params = {}) => request.post(`${baseUrlMap.event}/evaluate/index/delete/${params.id}`, params),

  getAppraiseModuleList: (params = {}) => request.post(`${baseUrlMap.event}/evaluate/model/page`, params),
  postAppraiseModuleAdd: (params = {}) => request.post(`${baseUrlMap.event}/evaluate/model/add`, params),
  postAppraiseModuleStatusChange: (params = {}) => request.post(`${baseUrlMap.event}/evaluate/model/status`, params),
  postAppraiseModuleUpdate: (params = {}) => request.post(`${baseUrlMap.event}/evaluate/model/update`, params),
  getSelectEventTypeIdBySysCode: (params = {}) => request.get(`${baseUrlMap.event}/bus/evaluateModel/selectEventTypeIdBySysCode`, params),
  getSelectEvaluateList: (params = {}) => request.get(`${baseUrlMap.event}/evaluate/index/select`, params),
  getEvaluateModelById: (params = {}) => request.get(`${baseUrlMap.event}/evaluate/model/detail/${params.id}`, params),

  getEventEvaluatePage: (params = {}) => request.get(`${baseUrlMap.event}/tcEvent/manager/evaluate/eventList`, params),
  getEvaluateModelByEventCode: (params = {}) => request.get(`${baseUrlMap.event}/evaluate/index/getByEventId?eventId=${params.eventId}`, params),
  getEvaluateResultByEventCode: (params = {}) => request.get(`${baseUrlMap.event}/eventEvaluate/getByEventId?eventId=${params.eventId}`, params),
  postEventEvaluateAdd: (params = {}) => request.post(`${baseUrlMap.event}/eventEvaluate/score`, params),

  getEvaluateAnalysisOverview: (params = {}) => request.get(`${baseUrlMap.event}/bus/eventEvaluate/evaluate/getOverview`, params),
  getEvaluateAnalysisHasPJ: (params = {}) => request.get(`${baseUrlMap.event}/bus/eventEvaluate/evaluate/getEvaluateByEventType`, params),
  getEvaluateAnalysisNoPJ: (params = {}) => request.get(`${baseUrlMap.event}/bus/eventEvaluate/evaluate/getNoEvaluateByEventType`, params),
  getEvaluateAnalysisNoPZ: (params = {}) => request.get(`${baseUrlMap.event}/bus/eventEvaluate/evaluate/getNoConfigByEventType`, params),
  getEvaluateAnalysisFourLine: (params = {}) => request.get(`${baseUrlMap.event}/bus/eventEvaluate/evaluate/getTrendByMonth`, params),
  getEvaluateAnalysisManFenOrChaPingRank: (params = {}) => request.get(`${baseUrlMap.event}/bus/eventEvaluate/evaluate/getRanking`, params),

  getTimeStrategyList: (params = {}) => request.get(`${baseUrlMap.event}/timeStrategy/list`, params),
  getTimeStrategyProcessList: (params = {}) => request.get(`${baseUrlMap.event}/timeStrategy/getProcessList`, params),
  postTimeStrategyAdd: (params = {}) => request.post(`${baseUrlMap.event}/timeStrategy/add`, params),
  postTimeStrategyUpdate: (params = {}) => request.post(`${baseUrlMap.event}/timeStrategy/update`, params),
  getTimeStrategyDelete: (params = {}) => request.get(`${baseUrlMap.event}/timeStrategy/delete/${params.id}`, params),
  getTimeStrategyNodeDelete: (params = {}) => request.get(`${baseUrlMap.event}/timeStrategy/delete/node/${params.id}`, params),

  getEventRmvDupStayList: (params = {}) => request.get(`${baseUrlMap.event}/eventRmvDupStay/list`, params),
  getEventRmvDupStaySelectEventTypeIdByplatformSrc: (params = {}) => request.get(`${baseUrlMap.event}/eventRmvDupStay/selectEventTypeIdByplatformSrc`, params),
  postEventRmvDupStayAdd: (params = {}) => request.post(`${baseUrlMap.event}/eventRmvDupStay/add`, params),
  postEventRmvDupStayUpdate: (params = {}) => request.post(`${baseUrlMap.event}/eventRmvDupStay/update`, params),
  getEventRmvDupStayDelete: (params = {}) => request.get(`${baseUrlMap.event}/eventRmvDupStay/delete/${params.id}`, params),

  getEventRmvDupList: (params = {}) => request.get(`${baseUrlMap.event}/eventRmvDup/list`, params),
  getEventRmvDupDetail: (params = {}) => request.get(`${baseUrlMap.event}/eventRmvDup/get/${params.id}`, params),
  postEventRmvDupAbolish: (params = {}) => request.post(`${baseUrlMap.event}/eventRmvDup/abolish/${params.id}`, params), // 作废
  postEventRmvDupRevoke: (params = {}) => request.post(`${baseUrlMap.event}/eventRmvDup/revoke/${params.id}`, params), // 提交
  postEventRmvDupRmvDup: (params = {}) => request.post(`${baseUrlMap.event}/eventRmvDup/rmvDup`, params), // 事件去重
  postEventRmvDupRevokeRmvDup: (params = {}) => request.post(`${baseUrlMap.event}/eventRmvDup/revokeRmvDup/${params.id}`, params), // 事件撤销去重
  getEventRmvDupEventList: (params = {}) => request.get(`${baseUrlMap.event}/eventRmvDup/eventList`, params), // 合并弹窗列表
  postEventRmvDupEventMergeMerge: (params = {}) => request.post(`${baseUrlMap.event}/eventRmvDup/eventMerge`, params), // 事件合并
  postEventRmvDupEventMergeSplit: (params = {}) => request.post(`${baseUrlMap.event}/eventRmvDup/eventSplit/${params.id}`, params), // 事件拆分

  getOneClickSearch: (params = {}) => request.post(`${baseUrlMap.event}/oneClick/search`, params), // 一键直查 搜索
  getOneClickBoxSelection: (params = {}) => request.get(`${baseUrlMap.event}/oneClick/getBoxSelection`, params), // 一键直查 搜索

  getEventManualEventListPage: (params = {}) => request.get(`${baseUrlMap.event}/tcEvent/manager/manualEventList`, params), // 手动流转列表
  postManualHandleUpdate: (params = {}) => request.post(`${baseUrlMap.event}/tcEvent/manualHandle`, params), // 手动流转2退回 1办结
  postManualHandleSubmit: (params = {}) => request.post(`${baseUrlMap.event}/tcEvent/manager/manual/add`, params), // 手动流转确认
  postManualHandleErrorDetail: (params = {}) => request.post(`${baseUrlMap.event}/tcEvent/errorDetail`, params), // 查看原因
  postManualHandleEventStop: (params = {}) => request.post(`${baseUrlMap.event}/tcEvent/stop`, params), // 中止任务
  getManualStatesOptions: (params = {}) => request.get(`${baseUrlMap.event}/tcEvent/manager/manualStates`, params), // 流转状态下拉
  // 指令接收
  postReceive: (params = {}) => request.post(`${baseUrlMap.event}/command/receive`, params), // 指令接收列表
  getReceiveDetail: (params = {}) => request.get(`${baseUrlMap.event}/command/${params.id}`, params), // 指令接收详情
  postReceiveReply: (params = {}) => request.post(`${baseUrlMap.event}/command/reply`, params), // 指令接收反馈
  // 时限配置
  postTimeConfigAdd: (params = {}) => request.post(`${baseUrlMap.event}/timeConfig/add`, params), // 新增时限配置
  getTimeConfigPage: (params = {}) => request.get(`${baseUrlMap.event}/timeConfig/list`, params), // 时限配置分页列表
  postTimeConfigDelete: (params = {}) => request.post(`${baseUrlMap.event}/timeConfig/delete/${params.id}`, params), // 时限配置列表删除
  postTimeConfigEnable: (params = {}) => request.post(`${baseUrlMap.event}/timeConfig/enable?id=${params.id}&status=${params.status}`), // 时限配置状态变更
  getTimeConfigDetail: (params = {}) => request.get(`${baseUrlMap.event}/timeConfig/detail/${params.id}`, params), // 时限配置详情
  postTimeConfigEdit: (params = {}) => request.post(`${baseUrlMap.event}/timeConfig/update`, params), // 新增时限配置
  // 消息列表
  postQueryMessage: (params = {}) => request.post(`${baseUrlMap.msg}/messageCenter/message/queryInternalList`, params),

  // 首页数据统计-事件总线-流转系统接口
  // 月度数据
  getMounthDataStatistics: (params = {}) => request.get(urls.getMounthDataStatistics, params),
  // 近30天事件概览
  getOneMounthOverviewStatistics: (params = {}) => request.get(urls.getOneMounthOverviewStatistics, params),
  // 近30天流转事件
  get30DispatchStatistics: (params = {}) => request.get(urls.get30DispatchStatistics, params),
  // 协调中心-处置系统接口
  // 月度数据
  getOpenEventHandleUserStatistic: (params = {}) => request.get(urls.getOpenEventHandleUserStatistic, params),
  // 近30天处置事件
  getOpenEventHandleStatistic: (params = {}) => request.get(urls.getOpenEventHandleStatistic, params),
  // 待办事件信息分页查询
  getOpenTcEventTodoList: (params = {}) => request.get(urls.getOpenTcEventTodoList, params),

  // 基础信息管理
  // 基础信息平台列表
  getPlatformInfoList: (params = {}) => request.post(urls.getPlatformInfoList, params),
  // 新增基础信息
  addPlatformInfo: (params = {}) => request.post(urls.addPlatformInfo, params),
  // 删除基础信息
  deletePlatformInfo: (params = {}) => request.get(`${urls.deletePlatformInfo}/${params.id}`),
  // 基础信息详情
  getPlatformInfoDetail: (params = {}) => request.get(`${urls.getPlatformInfoDetail}/${params.id}`),
  // 更新基础信息
  updatePlatformInfo: (params = {}) => request.post(urls.updatePlatformInfo, params),
  // 启用停用平台
  updatePlatformStatus: (params = {}) => request.post(urls.updatePlatformStatus, params),

  // 基础平台下拉
  getPlatformInfoSelect: (params = {}) => request.post(urls.getPlatformInfoSelect, params),
  // 评价模型下拉
  getEvaluateModelSelect: (params = {}) => request.get(`${urls.getEvaluateModelSelect}`, params),

  // 删除第三方接口
  deleteThirdApi: (params = {}) => request.post(`${urls.deleteThirdApi}/${params.id}`),

  // 组织树
  getTreeV2WithHaveChild: (params = {}) => request.post(urls.getTreeV2WithHaveChild, params),
  getListV2WithHaveChild: (params = {}) => request.post(urls.getListV2WithHaveChild, params),

  // 三方类型配置
  addThirdTypeLevelOne: (params = {}) => request.post(urls.addThirdTypeLevelOne, params),
  addThirdTypeChild: (params = {}) => request.post(urls.addThirdTypeChild, params),
  getThirdTypeList: (params = {}) => request.get(`${urls.getThirdTypeList}?code=${params.code ? params.code : ''}&name=${params.name ? params.name : ''}&sourceSystemCode=${params.sourceSystemCode ? params.sourceSystemCode : ''}`),
  updateThirdType: (params = {}) => request.post(urls.updateThirdType, params),
  deleteThirdType: (params = {}) => request.post(urls.deleteThirdType, params),
  updateThirdTypeStatus: (params = {}) => request.post(urls.updateThirdTypeStatus, params),
  getThirdTypeById: (params = {}) => request.post(`${urls.getThirdTypeById}/${params.id}`),

  getAreaTree: (params = {}) => request.get(`${urls.getAreaTree}?platformCode=${params.platformCode ? params.platformCode : ''}`),
  updateThirdSystemArea: (params = {}) => request.post(urls.updateThirdSystemArea, params),
  getAreaChildrenList: (params = {}) => request.get(`${urls.getAreaChildrenList}?pcode=${params.pcode}`),

  sourceSystemRelationList: (params = {}) => request.post(urls.sourceSystemRelationList, params),
  saveSourceSystemRelation: (params = {}) => request.post(urls.saveSourceSystemRelation, params),

  disposeSystemRelationList: (params = {}) => request.post(urls.disposeSystemRelationList, params),
  saveDiaposeSystemRelation: (params = {}) => request.post(urls.saveDiaposeSystemRelation, params),

  updateSyncConfDisposeSys: (params = {}) => request.get(`${urls.updateSyncConfDisposeSys}/${params.disposeSystemCode}`),
  getSyncConfDisposeSysList: (params = {}) => request.get(`${urls.getSyncConfDisposeSysList}/${params.disposeSystemCode}`),
  saveSyncConfDisposeSys: (params = {}) => request.post(urls.saveSyncConfDisposeSys, params),
  // 自处置列表
  postSelfList: (params = {}) => request.post(`${baseUrlMap.event}/api/self/event/list`, params)
}

export default moduleSrv
