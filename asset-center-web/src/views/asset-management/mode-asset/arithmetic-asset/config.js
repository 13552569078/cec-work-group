
export const TABLE_TITLE_ONE = ['参数名称', '参数显示名称', '参数类型', '允许为空', '操作'];
export const TABLE_TITLE_TWO = ['参数名称', '参数显示名称', '参数类型', '长度', '操作'];
export const TYPE_OPTIONS = [
  {
    value: 'int',
    label: 'int'
  }, {
    value: 'string',
    label: 'string'
  }, {
    value: 'float',
    label: 'float'
  }, {
    value: 'datetime',
    label: 'datetime'
  }
];
export const ALGO_TYPE_OPTION = [
  { label: '预测', id: 'prediction' },
  { label: '聚类', id: 'clustering' },
  { label: '分类', id: 'classification' },
  { label: '计算', id: 'formula' }
];
export const DSM_NUM = [
  { label: '1', id: '1' },
  { label: '2', id: '2' },
  { label: '3', id: '3' },
  { label: '4', id: '4' },
  { label: '5', id: '5' }
]
export const GET_TYPE = (type) => {
  if (type === 'string') {
    return 'varchar'
  } else if (type === 'float') {
    return 'decimal'
  } else {
    return type
  }
}
