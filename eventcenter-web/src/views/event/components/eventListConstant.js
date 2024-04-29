export const SPECIAL_EVENTTYPE = [
  'workHandle', 'workAssist', 'workNotify', 'approve1'
]

const colums = [
  {
    prop: 'eventCode',
    label: '事件编码',
    minWidth: 150
  },
  {
    prop: 'title',
    label: '事件标题',
    minWidth: 150
  },
  {
    prop: 'eventTypeText',
    label: '事件类型',
    minWidth: 180
  },
  {
    prop: 'sourceText',
    label: '事件来源',
    minWidth: 150
  },
  {
    prop: 'eventStateText',
    label: '事件状态',
    width: 150
  },
  {
    prop: 'happenTime',
    label: '发生时间',
    width: 200
  },
  {
    prop: 'eventAddress',
    label: '发生地址',
    minWidth: 200
  },
  {
    prop: 'taskLeftTime',
    label: '是否超时',
    minWidth: 180
  },
  {
    prop: 'limitTimeDesc',
    label: '处置时限',
    minWidth: 100
  }
]

export const EVENTTYPE_COLUMN = {
  'workHandle': colums,
  'workAssist': colums,
  'workNotify': colums,
  'approve1': colums
}
