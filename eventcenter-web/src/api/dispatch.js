// 协同中心所有接口
import request from '@/utils/request'
import baseUrlMap from '@/utils/config'

const urls = {
  login: `${baseUrlMap.uc}/openApi/user/login`, // 临时登陆接口
  menuList: `${baseUrlMap.uc}/openApi/res/treeList`, // 菜单接口
  userFromToken: `${baseUrlMap.uc}/openApi/user/get`, // 通过 token 获取个人信息接口
  logout: `${baseUrlMap.uc}/openApi/user/logout`, // 退出
  config: `${baseUrlMap.event}/config`, // 全局配置查询接口
  eventTypes: `${baseUrlMap.event}/eventType`, // 事件类型查询接口
  getEventTypeList: `${baseUrlMap.event}/eventType/list`, // 事件类型查询接口
  dictData: `${baseUrlMap.event}/tcDictData`, // 字典接口
  strategy: `${baseUrlMap.event}/tcEventStrategy`, // 策略接口
  review: `${baseUrlMap.event}/tcEvent`, // 审核工作台接口
  cgReview: `${baseUrlMap.event}`, // 城管历史事件查询
  inspector: `${baseUrlMap.event}/supervise`, // 督办人员接口
  ParentDepts: `${baseUrlMap.event}/tcEvent/getParentDepts`, // 地址机构级联
  AllGrid: `${baseUrlMap.uc}/grid/cache/allTree`, // 地址机构级联--新
  processModelList: `${baseUrlMap.event}/activiti/model/list`, // 模型列表
  dictTreeData: `${baseUrlMap.event}/tcDictType/allData`, // 字典管理
  addDict: `${baseUrlMap.event}/tcDictType/add`, // 新增字典
  editDict: `${baseUrlMap.event}/tcDictType/edit`, // 编辑字典
  removeDict: `${baseUrlMap.event}/tcDictType/remove`, // 删除字典
  dictDataList: `${baseUrlMap.event}/tcDictData/list`, // 子集列表查询
  addDictData: `${baseUrlMap.event}/tcDictData/add`, // 子集字典新增
  editDictData: `${baseUrlMap.event}/tcDictData/edit`, // 子集字典编辑
  removedictData: `${baseUrlMap.event}/tcDictData/remove`, // 子集字典删除

  // 事件分析
  listEventType: `${baseUrlMap.event}/tcEvent/science/getEventTypeList`, // 事件类别统计 - 列表
  graphEventType: `${baseUrlMap.event}/tcEvent/science/getEventTypePic`, // 事件类别统计 - 图表
  trendEventType: `${baseUrlMap.event}/tcEvent/science/getEventTypeTrend`, // 事件类别统计 - 趋势
  trendEventTypeArea: `${baseUrlMap.event}/tcEvent/science/getEventDeptTrend`, // 事件类别统计 - 区域趋势

  // 事件分析-事件量统计
  eventCountList: `${baseUrlMap.event}/tcEvent/science/getEventCountList`, // 事件量统计 - 列表
  // 通讯录
  addrbookDepts: `${baseUrlMap.event}/addrbook/getDepts`, // 通讯录机构数
  getLinkmanPage: `${baseUrlMap.event}/addrbook/getLinkmanPage`, // 个人通讯录联系人列表
  getUserOrgPageList: `${baseUrlMap.event}/addrbook/getUserOrgPageList`, // 公共通讯录联系人列表
  updateAddrbookgroupLinkman: `${baseUrlMap.event}/addrbook/updateAddrbookgroupLinkman`, // 公共通讯录联系人列表
  getAllGroup: `${baseUrlMap.event}/addrbook/getAllGroup`, // 公共通讯录联系人列表
  saveAddrbookgroup: `${baseUrlMap.event}/addrbook/saveAddrbookgroup`, // 个人通讯录分组新增
  editRbookgroup: `${baseUrlMap.event}/addrbook/updateAddrbookgroup`, // 个人通讯录分组修改
  deleteGroup: `${baseUrlMap.event}/addrbook/deleteByIds`, // 删除通讯录组
  deleteLinkmanByIds: `${baseUrlMap.event}/addrbook/deleteLinkmanByIds`, // 删除个人通讯录联系人
  // 值班
  dutyList: `${baseUrlMap.event}/tcRota/getPage`, // 值班表列表
  updateStatus: `${baseUrlMap.event}/tcRota/updateStatus`, // 值班表状态修改
  deleteRota: `${baseUrlMap.event}/tcRota/deleteRota`, // 删除值班
  saveRota: `${baseUrlMap.event}/tcRota/saveRota`, // 新增值班
  updateRota: `${baseUrlMap.event}/tcRota/updateRota`, // 修改值班
  rotaInfo: `${baseUrlMap.event}/tcRota/getListByRotaId`, // 值班回显
  getTime: `${baseUrlMap.event}/tcRota/getTime`, // 值班表时间
  // 平台事件类型
  eventTypeSelect: `${baseUrlMap.event}/eventType/selectAllByPlatFrom`,
  // 平台来源
  eventGetEventType: `${baseUrlMap.event}/api/getEventType`

}

const moduleSrv = {
  // 登陆接口
  toLogin: (params = {}) => request.post(urls.login, params),
  // 退出接口
  toLogOut: (params = {}) => request.post(urls.logout, params),
  // 菜单获取接口
  getMenuList: (params = {}) => request.post(urls.menuList, params),
  // 通过 token 获取个人信息接口
  getUserFromToken: (params = {}) => request.get(urls.userFromToken, params),
  // 字典接口
  getDictData: (params = {}) => request.get(`${urls.dictData}`, params),
  // 全局配置接口
  getConfig: (params = {}) => request.get(`${urls.config}`, params),

  // 地址级联
  getParentDepts: (params = {}) => request.get(`${urls.ParentDepts}`, params),
  // 地址级联-新
  getAllGrids: (params = {}) => request.post(`${urls.AllGrid}`, params),

  // 事件类型
  addEventType: (params = {}) => request.post(urls.eventTypes, params),
  updateEventType: (params = {}) => request.put(urls.eventTypes, params),
  getEventTypeList: (params = {}) => request.get(urls.getEventTypeList, params),
  removeEventType: (params = {}) => request.delete(urls.eventTypes, params),
  // getEventTypes: (params = {}) => request.get(urls.eventTypes, params),//更换接口
  getEventTypes: (params = {}) => request.get(`${urls.eventTypes}`, params),
  getEventTypesHistory: (params = {}) => request.post(`${baseUrlMap.event}/eventType/getTreeListByCode`, params), // 历史查询的事件类型

  // 权责清单
  getOrgTypes: (params = {}) => request.get(`${urls.eventTypes}/orgTypeAll`, params),
  getList: (params = {}) => request.get(`${urls.eventTypes}/list`, params), // 三级类型菜单
  getAttrList: (params = {}) => request.get(`${urls.eventTypes}/attrList`, params), // 处置角色折叠列表
  getAccrualList: (params = {}) => request.get(`${urls.eventTypes}/attr`, params),
  getAllOrgTypeRole: (params = {}) => request.get(`${urls.eventTypes}/allOrgTypeRole`, params), // 处置级别、角色
  getAllOrgTypeCategory: (params = {}) => request.get(`${urls.eventTypes}/allOrgTypeCategory`, params), // 处置组织
  removeAccrual: (params = {}) => request.delete(`${urls.eventTypes}/attr`, params).then(res => res.data),
  updateAccrual: (params = {}) => request.put(`${urls.eventTypes}/attr`, params), // 添加处置角色
  exportAccrual: (params = {}) => request.get(`${urls.eventTypes}/attr/export`, params, { responseType: 'arraybuffer' }).then(res => res.data),

  // 权责清单新
  getSelectLeftTree: (params = {}) => request.get(`${urls.eventTypes}/selectLeftTree`, params), // 左侧机构数
  getEventTypeDutyList: (params = {}) => request.get(`${baseUrlMap.event}/eventTypeDuty/list`, params), // 事项权责列表
  getPlatformInfoDepartmentList: (params = {}) => request.get(`${baseUrlMap.event}/eventTypeDuty/getPlatformInfoDepartmentList`, params), // 根据组织分类获取组织及对应的处置系统
  getdutyDetail: (params = {}) => request.get(`${baseUrlMap.event}/eventTypeDuty/dutyDetail`, params), // 事项权责详情
  saveDuty: (params = {}) => request.post(`${baseUrlMap.event}/eventTypeDuty/saveDuty`, params), // 生成权责
  updateStateDuty: (params = {}) => request.post(`${baseUrlMap.event}/eventTypeDuty/updateState`, params), // 权责启停
  deleteEventTypeDuty: (params = {}) => request.post(`${baseUrlMap.event}/eventTypeDuty/deleteDuty`, params), // 删除权责

  // 策略配置
  getStrategyList: (params = {}) => request.get(`${urls.strategy}`, params),
  addStrategy: (params = {}) => request.post(`${urls.strategy}`, params),
  updateStrategy: (params = {}) => request.put(`${urls.strategy}`, params),
  removeStrategy: (params = {}) => request.delete(`${urls.strategy}`, params),
  getStrategyKey: (params = {}) => request.get(`${urls.strategy}/strategyKey`, params).then(res => res.data),
  getProcess: (params = {}) => request.get(`${urls.strategy}/procdef`, params).then(res => res.data),
  eventTypeSelect: (params = {}) => request.get(`${urls.eventTypeSelect}`, params).then(res => res.data), // 平台事件类型
  eventGetEventType: (params = {}) => request.get(`${urls.eventGetEventType}`, params).then(res => res.data), // 平台来源

  // 审核工作台
  getTodoList: (params = {}) => request.get(`${urls.review}/todoList`, params),
  getPassList: (params = {}) => request.get(`${urls.review}/passList`, params),
  getAssistList: (params = {}) => request.get(`${urls.review}/assistList`, params), // 协办列表
  getNotifyList: (params = {}) => request.get(`${urls.review}/notify/queryNotifyList`, params), // 知会列表
  getWhistleList: (params = {}) => request.get(`${urls.review}/getWhistleList`, params), // 吹哨事件列表查询
  getInformList: (params = {}) => request.get(`${urls.review}/notify/requestNotifyList`, params).then(res => res.data),
  getTodoPassCount: (params = {}) => request.get(`${urls.review}/todoAndPassCount`, params).then(res => res.data),
  batchReview: (params = {}) => request.post(`${urls.review}/verifyBatchSuccess`, params).then(res => res.data),
  getTodoButtons: (params = {}) => request.get(`${urls.review}/todoButtons`, params),
  getPassButtons: (params = {}) => request.get(`${urls.review}/passButtons`, params).then(res => res.data),
  getEventDetail: (id, taskId) => {
    const url = taskId ? `${urls.review}/${id}?taskId=${taskId}` : `${urls.review}/${id}`
    return request.get(url)
  },
  getRoleByEventId: (eventId, taskId) => request.get(`${urls.review}/getRoleByEventDeptId/${eventId}/${taskId}`), // 认领之前根据机构获取角色
  claim: (params = {}) => request.post(`${urls.review}/claim`, params), // 认领
  unclaim: (taskId) => request.post(`${urls.review}/unClaim/${taskId}`), // 取消认领
  review: (params = {}) => request.post(`${urls.review}/verify`, params),
  getNotifyMap: (params = {}) => request.get(`${urls.review}/notify/dept`, params), // 知会下拉数据
  getNotifyRoleByDeptId: (deptId) => request.get(`${urls.review}/notify/role/${deptId}`), // 知会根据机构查角色

  // 调度工作台
  getDispatchDepts: (params = {}) => request.get(`${urls.review}/dispatch/dept`, params),
  getRolesByOrg: (params = {}) => request.post(`${baseUrlMap.uc}/openApi/role/list`, params), // 根据组织查角色
  getUsersByOrg: (params = {}) => request.post(`${baseUrlMap.uc}/openApi/user/userList`, params), // 根据组织查人员
  getPlatformsByOrg: (params = {}) => request.post(`${baseUrlMap.event}/platform/listByOrgId`, params), // 根据组织查第三方平台
  getUsersListFromUc: (params = {}) => request.post(`${baseUrlMap.uc}/openApi/user/getUserList`, params), // 获取用户列表
  dispatch: (params = {}) => request.post(`${urls.review}/dispatch`, params),
  getInformTargetOptions: (params = {}) => request.get(`${urls.review}/notify/getCommunity`, params).then(res => res.data),
  // 审批列表
  reply: (params = {}) => request.post(`${urls.review}/apply/reply`, params),
  replyReject: (params = {}) => request.post(`${urls.review}/apply/replyReject`, params),
  getDelayApplyDetail: (id) => request.get(`${urls.review}/apply/${id}`), // 审批详情
  getApplyList: (params = {}) => request.get(`${urls.review}/apply/reply/list`, params),
  // 处理工作台
  handle: (params = {}) => request.post(`${urls.review}/handle`, params),
  selfHandle: (params = {}) => request.post(`${urls.review}/selfHandle`, params).then(res => res.data),
  getWhistleDepts: (params = {}) => request.get(`${urls.review}/whistle/dept`, params).then(res => res.data),
  getPishiDepts: (params = {}) => request.get(`${urls.review}/whistle/gwhistleRoles`, params).then(res => res.data),
  submitWhistle: (params = {}) => request.post(`${urls.review}/whistle/dispatch`, params).then(res => res.data),
  submitCheck: (params = {}) => request.post(`${urls.review}/whistle/check`, params).then(res => res.data),
  whistleComplete: (params = {}) => request.post(`${urls.review}/whistle/complete`, params).then(res => res.data),
  whistleApplyReview: (params = {}) => request.post(`${urls.review}/whistle/gwhistle`, params).then(res => res.data),
  whistleReply: (params = {}) => request.post(`${urls.review}/gwhistle/reply`, params).then(res => res.data),
  whistleReject: (params = {}) => request.post(`${urls.review}/whistle/reject`, params),
  submitCheckFeed: (params = {}) => request.post(`${urls.review}/check`, params).then(res => res.data),
  getBuildingOwnersList: (params = {}) => request.get(`${baseUrlMap.bd}/building/buildingLeaders`, params).then(res => res.data),
  applyReject: (params = {}) => request.post(`${baseUrlMap.event}/v2/tcEvent/apply/applyReject`, params), // 申请驳回
  delayApply: (params = {}) => request.post(`${baseUrlMap.event}/v2/tcEvent/apply/postpone`, params), // 申请延期
  eventtomq: (params = {}) => request.get(`${urls.review}/handle/report`, params).then(res => res.data),
  eventtoChengGuan: (params = {}) => request.get(`${urls.review}/manager/pushEventToChengGuan`, params), // 下发城管
  eventToMunicipalPlat: (params = {}) => request.get(`${urls.review}/manager/pushEventToMunicipalPlat`, params), // 上报市平台

  // 结案工作台
  approve: (params = {}) => request.post(`${urls.review}/approve`, params),
  selfApprove: (params = {}) => request.post(`${urls.review}/selfApprove`, params).then(res => res.data),

  // 管理工作台
  getEventList: (params = {}) => request.get(`${urls.review}/manager/eventList`, params),
  getUnclaimButton: (params = {}) => request.get(`${urls.review}/manager/unClaimButton`, params).then(res => res.data),
  managerUnclaim: (taskId) => request.post(`${urls.review}/manager/unClaim/${taskId}`).then(res => res.data),
  destroy: (params = {}) => request.post(`${urls.review}/manager/invalid`, params).then(res => res.data),
  delete: (params = {}) => request.post(`${urls.review}/manager/delete`, params).then(res => res.data),

  // 事件录入
  getAreaTree: (params = {}) => request.post(baseUrlMap.cs + '/system/organ/subTree', params).then(res => res.data),
  saveEvent: (params = {}) => request.post(`${urls.review}/save`, params),
  submitEvent: (params = {}) => request.post(`${urls.review}/submit`, params),
  batchSubmit: (params = {}) => request.post(`${urls.review}/batch-submit`, params).then(res => res.data),
  batchDelete: (params = {}) => request.post(`${urls.review}/batch-delete`, params),
  getWaitEventList: (params = {}) => request.get(`${urls.review}/wait-to-submit-list`, params),

  // 事件汇聚
  getPendingEventList: (params = {}) => request.get(`${urls.review}/manager/pendingList`, params),

  // 重复事件过滤
  getFilterEventList: (params = {}) => request.get(`${baseUrlMap.event}/repeat/list`, params),
  getfilterEventDetail: (params = {}) => request.get(`${baseUrlMap.event}/repeat/${params}`),
  filterEventVerify: (params = {}) => request.post(`${baseUrlMap.event}/tcEvent/manager/invalid`, params),

  // 获取网格街道网格边界
  getGridPoints: (params = {}) => request.post(baseUrlMap.gm + '/stereoscopic/border/grid', params).then(res => res.data),

  // 督办人员工作台
  getEventListBySupervise: (params = {}) => request.get(`${urls.inspector}/getEventListBySupervise`, params),
  getSuperviseDepts: (params = {}) => request.get(`${urls.inspector}/getSuperviseDepts`, params).then(res => res.data),
  getSuperviseList: (params = {}) => request.get(`${urls.inspector}/getSuperviseList`, params),
  getTodoSuperviseList: (params = {}) => request.get(`${urls.inspector}/getTodoSuperviseList`, params),
  getSuperviseById: (id) => request.get(`${urls.inspector}/getSuperviseById/${id}`),
  submitSupervise: (params = {}) => request.post(`${urls.inspector}/submitSupervise`, params),
  feedSupervise: (params = {}) => request.post(`${urls.inspector}/feedSupervise`, params),
  verifySupervise: (params = {}) => request.post(`${urls.inspector}/verifySupervise`, params),
  getDeptsByUserDept: (params = {}) => request.get(`${baseUrlMap.dc}/event/statistics/getDeptsByUserDept`, params).then(res => res.data),
  getSuperviseStatistics: (params = {}) => request.get(`${urls.inspector}/getSuperviseStatistics`, params).then(res => res.data),
  getEventStatistics: (params = {}) => request.get(`${baseUrlMap.dc}/event/statistics/getEventStatistics`, params).then(res => res.data),
  claimSupervise: (params = {}) => request.post(`${urls.inspector}/claim`, params),
  unClaimSupervise: (params = {}) => request.post(`${urls.inspector}/unClaim`, params),
  commentSupervise: (params = {}) => request.post(`${urls.inspector}/superviseCommnet`, params),
  feedbackSupervise: (params = {}) => request.post(`${urls.inspector}/dealtCommnet`, params),
  getStateAnalysisByGrid: (params = {}) => request.post(`${urls.inspector}/report/stateAnalysisByGrid`, params),
  getStateAnalysisByDept: (params = {}) => request.post(`${urls.inspector}/report/stateAnalysisByDept`, params),
  // 流程模型
  getProcessModelList: (params = {}) => request.get(urls.processModelList, params),
  getProcessList: (params = {}) => request.get(`${baseUrlMap.event}/activiti/process/list`, params),
  getProcessTaskList: (params = {}) => request.get(`${baseUrlMap.event}/activiti/process/taskList/${params.key}/${params.processId}`),
  getProcessTaskButtons: (params = {}) => request.get(`${baseUrlMap.event}/activiti/button/list`, params),
  addProcessTaskButton: (params = {}) => request.post(`${baseUrlMap.event}/activiti/button/add`, params),
  editProcessTaskButton: (params = {}) => request.post(`${baseUrlMap.event}/activiti/button/edit`, params),
  removeProcessTaskButton: (params = {}) => request.post(`${baseUrlMap.event}/activiti/button/remove`, params),
  getProcessTaskRoles: (params = {}) => request.get(`${baseUrlMap.event}/activiti/role/list`, params),
  getProcessRoleList: (params = {}) => request.get(`${baseUrlMap.event}/activiti/role/allRoleList`, params), // 所有角色
  addProcessTaskRole: (params = {}) => request.post(`${baseUrlMap.event}/activiti/role/add`, params),
  editProcessTaskRole: (params = {}) => request.post(`${baseUrlMap.event}/activiti/role/edit`, params),
  removeProcessTaskRole: (params = {}) => request.post(`${baseUrlMap.event}/activiti/role/remove`, params),
  // 添加模型
  addModel: (params = {}) => request.post(`${baseUrlMap.event}/activiti/model/add`, params),
  // 发布流程
  deployModel: (modelId) => request.get(`${baseUrlMap.event}/activiti/model/deploy/${modelId}`),
  // 删除模型
  removeModel: (params) => request.post(`${baseUrlMap.event}/activiti/model/remove`, params),
  // 删除流程
  removeProcess: (params) => request.post(`${baseUrlMap.event}/activiti/process/remove`, params),
  // 节点提醒类型列表
  getRemindList: (params) => request.post(`${baseUrlMap.event}/activiti/remind/list`, params),
  // 节点详情
  getRemindDetail: (params) => request.get(`${baseUrlMap.event}/activiti/remind/get`, params),
  // 节点提醒详情配置
  submitRemind: (params) => request.post(`${baseUrlMap.event}/activiti/remind/save`, params),
  // 角色分组下角色列表查询
  getGroupRoleList: (params) => request.post(`${baseUrlMap.uc}/openApi/role/groupRoleList`, params),
  // 组织查询
  getChildrenOrgList: (params) => request.post(`${baseUrlMap.uc}/openApi/org/getChildrenOrgListExcludeRole`, params),
  // 调度策略配置列表
  getDisScopeConfigList: (params = {}) => request.post(`${baseUrlMap.event}/tcEvent/disScopeConfig/list`, params),
  getDisScopeConfigDetail: (params = {}) => request.get(`${baseUrlMap.event}/tcEvent/disScopeConfig/get`, params),
  addDisScopeConfig: (params = {}) => request.post(`${baseUrlMap.event}/tcEvent/disScopeConfig/add`, params),
  updateDisScopeConfig: (params = {}) => request.post(`${baseUrlMap.event}/tcEvent/disScopeConfig/update`, params),
  removeDisScopeConfig: (params = {}) => request.post(`${baseUrlMap.event}/tcEvent/disScopeConfig/delete`, params),

  // 查看方案列表
  querySchemeList: (params) => request.post(`${baseUrlMap.msg}/messageCenter/external/querySchemeList`, params),

  // 根据机构级别查询角色
  getRoleByOrgType: (params) => request.get(`${baseUrlMap.event}/eventType/deptRole`, params),

  // 字典管理
  getDictTreeData: (params = {}) => request.get(urls.dictTreeData, params),
  addDict: (params = {}) => request.post(urls.addDict, params),
  editDict: (params = {}) => request.post(urls.editDict, params),
  removeDict: (params = {}) => request.post(urls.removeDict, params),
  getDictDataList: (params = {}) => request.get(urls.dictDataList, params),
  addDictData: (params = {}) => request.post(urls.addDictData, params),
  // resTreeList: (params = {}) => request.post(`${baseUrlMap.uc}/res/treeList`, params),

  editDictData: (params = {}) => request.post(urls.editDictData, params),
  removedictData: (params = {}) => request.post(urls.removedictData, params),

  // 草稿
  getDraftList: (params = {}) => request.get(`${baseUrlMap.event}/draft/list`, params),
  getDraftDetail: (id) => request.get(`${baseUrlMap.event}/draft/detail/${id}`),
  withdrawDraft: (params = {}) => request.post(`${baseUrlMap.event}/draft/invalid`, params),
  submitDraft: (params = {}) => request.post(`${baseUrlMap.event}/draft/submitEventTraft`, params),
  saveEventTraft: (params = {}) => request.post(`${baseUrlMap.event}/draft/saveEventTraft`, params),

  // 事件分析
  getListEventType: (params = {}) => request.get(urls.listEventType, params),
  getGraphEventType: (params = {}) => request.get(urls.graphEventType, params),
  getTrendEventType: (params = {}) => request.get(urls.trendEventType, params),
  getTrendEventTypeArea: (params = {}) => request.get(urls.trendEventTypeArea, params),
  // 事件分析-事件量统计
  getEventCountList: (params = {}) => request.get(urls.eventCountList, params),

  //  任务中心
  // --待办任务
  getTaskList: (params = {}) => request.get(`${baseUrlMap.event}/plan/task/list`, params),
  getTaskInfoById: (id) => request.get(`${baseUrlMap.event}/plan/task/query/${id}`),
  handleTask: (params = {}) => request.post(`${baseUrlMap.event}/plan/task/handle`, params),
  // --计划任务配置
  getFormulateList: (params = {}) => request.get(`${baseUrlMap.event}/plan/formulate/list`, params),
  addFormulate: (params = {}) => request.post(`${baseUrlMap.event}/plan/formulate/add`, params),
  deleteFormulate: (params = {}) => request.post(`${baseUrlMap.event}/plan/formulate/delete`, params),
  updateFormulate: (params = {}) => request.post(`${baseUrlMap.event}/plan/formulate/update`, params),
  changeStatusFormulate: (params = {}) => request.post(`${baseUrlMap.event}/plan/formulate/changeStatus`, params),
  runFormulate: (params = {}) => request.get(`${baseUrlMap.event}/plan/formulate/run`, params),
  getFormulateInfoById: (id) => request.get(`${baseUrlMap.event}/plan/formulate/query/${id}`),
  translateToChinese: (params = {}) => request.get(`${baseUrlMap.event}/plan/formulate/translateToChinese`, params),
  getJobLog: (params = {}) => request.get(`${baseUrlMap.event}/monitor/jobLog/list`, params),
  getTaskManageList: (params = {}) => request.get(`${baseUrlMap.event}/plan/task/manager/list`, params),

  // 通讯录
  getAddrbookDepts: (params = {}) => request.get(urls.addrbookDepts, params), // 机构树
  getLinkmanPage: (params = {}) => request.post(urls.getLinkmanPage, params), // 个人通讯录联系人列表
  getUserOrgPageList: (params = {}) => request.post(urls.getUserOrgPageList, params), // 公共通讯录联系人列表
  updateAddrbookgroupLinkman: (params = {}) => request.post(urls.updateAddrbookgroupLinkman, params), // 联系人 新增、编辑
  getAllGroup: (params = {}) => request.get(urls.getAllGroup, params), // 新增联系人 分组下拉
  saveAddrbookgroup: (params = {}) => request.post(urls.saveAddrbookgroup, params),
  editRbookgroup: (params = {}) => request.post(urls.editRbookgroup, params),
  deleteGroup: (params = {}) => request.post(urls.deleteGroup, params),
  deleteLinkmanByIds: (params = {}) => request.post(urls.deleteLinkmanByIds, params),
  // 值班
  getDutyList: (params = {}) => request.post(urls.dutyList, params), // 值班表列表
  updateStatus: (params = {}) => request.get(urls.updateStatus, params), // 值班状态修改
  deleteRota: (params = {}) => request.get(urls.deleteRota, params), // 删除值班
  saveRota: (params = {}) => request.post(urls.saveRota, params), // 新增值班
  updateRota: (params = {}) => request.post(urls.updateRota, params),
  getRotaInfo: (params = {}) => request.get(urls.rotaInfo, params),
  getTime: (params = {}) => request.get(urls.getTime, params),

  // 吹哨事件
  getWhistleListNew: (params = {}) => request.get(`${baseUrlMap.event}/tcEvent/whistleList`, params), // 吹哨事件列表查询
  getWhistleDept: (params = {}) => request.get(`${baseUrlMap.event}/tcEvent/whistle/dept`, params),
  whistleOne: (params = {}) => request.post(`${baseUrlMap.event}/tcEvent/whistle/dispatch`, params), // 一次吹哨调度
  whistleTwo: (params = {}) => request.post(`${baseUrlMap.event}/tcEvent/whistle/secWhistle`, params), // 二次吹哨调度
  whistleThree: (params = {}) => request.post(`${baseUrlMap.event}/tcEvent/whistle/thrWhistle`, params), // 三次吹哨调度
  whistleToReply: (params = {}) => request.post(`${baseUrlMap.event}/tcEvent/whistle/reply`, params), // 吹哨答复批示
  whistleToComplete: (params = {}) => request.post(`${baseUrlMap.event}/tcEvent/whistle/complete`, params), // 吹哨办结
  // 城管历史事件查询
  getEventHisList: (params = {}) => request.get(`${urls.cgReview}/tcEventHis/eventHisList`, params),
  gettcEventHisDetail: (id, taskId) => {
    const url = taskId ? `${urls.cgReview}/tcEventHis/detail/${id}?taskId=${taskId}` : `${urls.cgReview}/tcEventHis/detail/${id}`
    return request.get(url)
  },

  // 联席
  // 资源树
  resTreeList: (params = {}) => request.post(`${baseUrlMap.uc}/res/treeList`, params),
  // 发起会议
  createEventMeeting: (params = {}) => request.post(`${baseUrlMap.event}/tcEvent/meeting/createEventMeeting`, params),
  // 获取组织结构树人员信息
  getContact: (params = {}) => request.get(`${baseUrlMap.event}/tcEvent/getContact`, params),
  // 联席会议分页查询
  queryMeetingPage: (params = {}) => request.post(`${baseUrlMap.event}/tcEvent/meeting/queryMeetingPage`, params),
  // 我的联席会议分页查询
  queryMyMeetingPage: (params = {}) => request.post(`${baseUrlMap.event}/tcEvent/meeting/queryMyMeetingPage`, params),
  // 提交会议纪要接口
  submitMeetingSummary: (params = {}) => request.post(`${baseUrlMap.event}/tcEvent/meeting/submitMeetingSummary`, params),
  // 获取联席会议记录详细信息
  eventMeeting: (params = {}) => request.get(`${baseUrlMap.event}/eventMeeting/${params.id}`, params),
  // 事件详情
  getTcEventt: (params = {}) => request.get(`${baseUrlMap.event}/tcEvent/${params.id}`, params),
  getAllInfos: (params = {}) => request.get(`${baseUrlMap.uc}/ioc/dept/all-info-detail`, params),
  getDictListByType: (params = {}) => request.get(`${baseUrlMap.base}/dict/getDictListByType`, params),
  getTreeListByOrgId: (params = {}) => request.get(`${baseUrlMap.igridcenter}/socialGovernance/org/treeListByOrgId`, params),
  pushEventToChengGuan: (params = {}) => request.get(`${baseUrlMap.event}/tcEvent/manager/updEventMeeting`, params),

  // 切换组织角色
  switchOrgRole: (params = {}) => request.post(`${baseUrlMap.uc}/openApi/user/login4SwitchRole`, params),
  // 系统配置
  systemConfiglist: (params = {}) => request.post(`${baseUrlMap.uc}/openApi/systemConfig/list`, params),
  // 城管事件办理过程
  getProcessListFromChengguan: (params = {}) => request.get(`${baseUrlMap.event}/tcEvent/manager/getProcessListFromChengguan`, params),
  // 郑郑订通讯录
  getZzdList: (params = {}) => request.get(`${baseUrlMap.uc}/contacts/get`, params),
  zzdChange: (params = {}) => request.post(`${baseUrlMap.event}/tcEvent/manager/zzdChange`, params), // 郑政钉转派
  // 通过点位查询网格
  searchGridDOByLonLat: (params = {}) => request.post(`${baseUrlMap.uc}/gps/searchGridDOByLonLat`, params),
  // 新增事项
  addDuty: (params = {}) => request.post(`${baseUrlMap.event}/eventType/add`, params),
  // 删除事项
  deleteDuty: (params = {}) => request.post(`${baseUrlMap.event}/eventType/delete`, params),
  // 根据id获取事项详情
  getDutyDetailById: (params = {}) => request.get(`${baseUrlMap.event}/eventType/getById`, params),
  // 获取子事项列表
  getDutyChildList: (params = {}) => request.post(`${baseUrlMap.event}/eventType/getChildList`, params),
  // 事项列表
  getDutiesList: (params = {}) => request.post(`${baseUrlMap.event}/eventType/list`, params),
  // 移动排序
  updateDutySort: (params = {}) => request.post(`${baseUrlMap.event}/eventType/sort`, params),
  // 修改事项
  updateDuty: (params = {}) => request.post(`${baseUrlMap.event}/eventType/update`, params),
  // 根据id获取关联数据对象
  getDutiesRelById: (params = {}) => request.get(`${baseUrlMap.uc}/dutiesRel/getByDutiesId`, params),
  // 获取关联数据对象字典树
  getDutiesRelDict: (params = {}) => request.get(`${baseUrlMap.uc}/dutiesRel/relDataDict`, params),
  // 保存关联数据对象
  saveDutiesRel: (params = {}) => request.post(`${baseUrlMap.uc}/dutiesRel/save`, params),
  // 关联对象分页查询
  getDutiesRelPageList: (params = {}) => request.post(`${baseUrlMap.uc}/dutiesRel/pageList`, params),
  // 关联对象分页查询
  updateStatusBatch: (params = {}) => request.post(`${baseUrlMap.event}/eventType/updateStatusBatch`, params),
  // 获取事项大中小类数量
  getDutiesNum: (params = {}) => request.get(`${baseUrlMap.event}/eventType/getDutiesNum`, params),
  // 权责清单导出
  getDutiesExcelExport: (params = {}, config) => request.get(`${baseUrlMap.event}/eventExcel/exportEventTypeDuty`, params, config),

  // 请求鉴权配置
  getAuthPageList: (params = {}) => request.get(`${baseUrlMap.event}/apiAuth/page`, params),
  postAuthPageAdd: (params = {}) => request.post(`${baseUrlMap.event}/apiAuth/add`, params),
  postAuthPageUpdate: (params = {}) => request.post(`${baseUrlMap.event}/apiAuth/update`, params),
  postGenerateSecret: (params = {}) => request.post(`${baseUrlMap.event}/apiAuth/generateSecret`, params),

  // 根据网格grid 查询面数据
  getOrgWkt: (params = {}) => request.get(`${baseUrlMap.uc}/grid/cache/getGridVOById`, params),
  // 根据网格grid 查询子网格数据
  getByIdWithChildren: (params = {}) => request.get(`${baseUrlMap.uc}/openApi/grid/getByIdWithChildren`, params),
  // 查询默认根节点
  getGridRootList: (params = {}) => request.get(`${baseUrlMap.uc}/openApi/grid/getGridRootList`, params),

  // 预受理
  getEventPreList: (params = {}) => request.post(`${baseUrlMap.event}/eventPre/getEventPreList`, params),
  acceptPreEvent: (params = {}) => request.post(`${baseUrlMap.event}/eventPre/acceptEvent`, params),
  returnPreEvent: (params = {}) => request.post(`${baseUrlMap.event}/eventPre/returnEvent`, params),
  getPreEventDetail: (id) => request.get(`${baseUrlMap.event}/eventPre/detail/${id}`),
  completePreEventInfo: (params = {}) => request.post(`${baseUrlMap.event}/eventPre/completeInfo`, params),

  // 事件点位周边网格
  getNearGrids: (params = {}) => request.postForm(`${baseUrlMap.uc}/gps/searchNearGridList`, params),
  // 周边视频/
  getNearCameras: (params = {}) => request.get(`${baseUrlMap.uc}/resource/getDeviceList`, params),
  // 周边力量
  getGridPowerList: (params = {}) => request.post(`${baseUrlMap.uc}/grid-user-manage/getGridUserListByNearWkt`, params),
  // 获取视频流
  getStreamUrl: (params = {}) => request.get(`${baseUrlMap.uc}/resource/getStreamUrl`, params),
  // 代办事件统计
  todoCountByUrgent: (params = {}) => request.post(`${baseUrlMap.event}/tcEvent/todoCountByUrgent`, params),
  // 职能部门
  getDutyDeptListByTree: (params = {}) => request.get(`${baseUrlMap.event}/dutyDept/treeList`, params),
  getDutyDeptList: (params = {}) => request.post(`${baseUrlMap.event}/dutyDept/list`, params),
  addDutyDept: (params = {}) => request.post(`${baseUrlMap.event}/dutyDept/add`, params),
  updateDutyDept: (params = {}) => request.post(`${baseUrlMap.event}/dutyDept/update`, params),
  deleteDutyDept: (params = {}) => request.post(`${baseUrlMap.event}/dutyDept/delete`, params),
  updateDutyDeptState: (params = {}) => request.post(`${baseUrlMap.event}/dutyDept/updateStatus`, params),
  downloadTemplateDutyDept: (params = {}, config = {}) => request.get(`${baseUrlMap.event}/eventExcel/downloadTemplateDutyDept`, params, config),
  dutyDeptImportAll: (params = {}, config = {}) => request.post(`${baseUrlMap.event}/eventExcel/dutyDeptImportAll`, params, config),
  dutyDeptImportAppend: (params = {}, config = {}) => request.post(`${baseUrlMap.event}/eventExcel/dutyDeptImportAppend`, params, config),

  // 自处置详情
  getSelfDetail: (id) => request.get(`${baseUrlMap.event}/api/self/event/${id}`),
  // 查询网格员统计
  gridManageCount: (params = {}) => request.get(`${baseUrlMap.uc}/grid-user-manage/gridManageCount/v2`, params),
  // 查询网格员列表
  queryAllGridUsersInfoPage: (params = {}) => request.post(`${baseUrlMap.uc}/grid-user-manage/queryAllGridUsersInfoPage`, params),
  // 获取全量组织
  getAllOrgTree: (params = {}) => request.post(`${baseUrlMap.uc}/openApi/org/v2/treeList`, params),
  // 根据组织获取角色
  getRoleByOrg: (params = {}) => request.post(`${baseUrlMap.uc}/openApi/role/list`, params),
  // 智能推荐
  getSimilarity: (id) => request.get(`${baseUrlMap.event}/tcEvent/recommend/${id}`),
  // 区域办理统计-直属部门
  getDirectDept: (params = {}) => request.post(`${baseUrlMap.event}/regionProcessStat/directDept`, params),
  // 区域办理统计-下属行政区划
  getSubDivision: (params = {}) => request.post(`${baseUrlMap.event}/regionProcessStat/subDivision`, params),
  // 升级到联动指挥事件
  upgradeEventToDispatch: (params = {}) => request.post(`${baseUrlMap.event}/tcEvent/handle/upgradeEventToDispatch`, params),
  // 汇聚事件统计
  getEventFocusSummaryCount: (params = {}) => request.get(`${baseUrlMap.event}/event/converge/getSummaryCount`, params),
  // 汇聚事件分页
  getConvergeByPage: (params = {}) => request.post(`${baseUrlMap.event}/event/converge/getByPage`, params),
  // 汇聚事件状态下拉
  getEventConvergeStateList: (params = {}) => request.get(`${baseUrlMap.event}/event/converge/getStateList`, params),
  // 汇聚事件详情
  getDetailByEventCode: (params = {}) => request.get(`${baseUrlMap.event}/event/converge/getDetailByEventCode`, params),
  // 汇聚事件处理进度数量统计(进行中已办结已作废)
  getSummaryCount4Process: (params = {}) => request.post(`${baseUrlMap.event}/event/converge/getSummaryCount4Process`, params),
  // 汇聚事件来源统计(三方上报网格员上报系统录入)
  getSummaryCount4Source: (params = {}) => request.post(`${baseUrlMap.event}/event/converge/getSummaryCount4Source`, params),
  // 审批
  approvalEvent: (params = {}) => request.post(`${baseUrlMap.event}/tcEvent/approval`, params)
}

export default moduleSrv
