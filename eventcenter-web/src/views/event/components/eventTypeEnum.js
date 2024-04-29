// 事件管理类型
export const EVENT_TYPE_ENUM = {
  query: 'query', // 事件查询
  cgHistory: 'cgHistory', // 城管历史事件查询
  verify: 'verify', // 事件审核
  approve: 'approve', // 事件结案
  typeIn: 'typeIn', // 事件录入
  handle: 'handle', // 事件处理
  dispatch: 'dispatch', // 事件调度
  approve1: 'approve1', // 事件审批
  filter: 'filter', // 事件重复过滤
  todo: 'todo', // 工作台-待办
  workHandle: 'workHandle', // 工作台-经办
  workAssist: 'workAssist', // 工作台-协办
  workNotify: 'workNotify', // 工作台-知会
  workWhistle: 'workWhistle', // 工作台-吹哨事件查询
  draft: 'draft', // 事件草稿箱
  preAccepted: 'pre-accepted' // 事件预受理
}
