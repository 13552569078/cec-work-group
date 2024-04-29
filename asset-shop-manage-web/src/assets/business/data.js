/** 指标工厂-常量设置 */
// 指标类型
export const KPI_TYPE = {
    '1': '基础指标',
    // '2': '复合指标',
    '3': '指标簇'
  }
  // 指标状态
  export const KPI_STATUS = {
    '1': '启用',
    '0': '停用'
  }
  export const INPUT_TYPES = ['number', 'string']
  // 数据类型
  export const DATA_TYPES = [
    'varchar',
    'int',
    'bigint',
    'tinyint',
    'smallint',
    'mediumint',
    'float',
    'double',
    'decimal',
    'date',
    'datetime'
  ]
  // 固定长度的类型
  export const FIXED_LEN_DATA_TYPES = [
    'int',
    'bigint',
    'tinyint',
    'smallint',
    'mediumint',
    'date',
    'datetime'
  ]
  export const LENGTH_PLACEHOLDERS = {
    varchar: '必填，1~5000整数',
    float: '必填，格式如6,2',
    double: '必填，格式如6,2',
    decimal: '必填，格式如6,2'
  }
  export const INIT_LENGTH = {
    int: 11,
    bigint: 20,
    tinyint: 4,
    smallint: 6,
    mediumint: 9
  }
  