/**
 * 用户授权缓存key
 */
const token = new URLSearchParams(window.location.search).get('token');
let AUTH_TOKEN: string;

if (token) {
  sessionStorage.setItem('TOKEN', token);
  AUTH_TOKEN = token as string;
} else {
  AUTH_TOKEN = (sessionStorage.getItem('TOKEN') as string) || '';
}

export { AUTH_TOKEN };
// 缓存前缀
export const DOMAIN = 'monitoring.warning.centre';

export const ECHARTS_RESPONSE_LIST = ['lineHeight', 'margin', 'fontSize', 'left', 'right', 'top', 'bottom', 'padding', 'itemWidth', 'itemHeight', 'itemGap', 'symbolSize', 'width', 'height', 'barMaxWidth', 'barWidth', 'gridSize'];

export const OVERTIME_OPTION = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '未超时',
    value: 1
  },
  {
    label: '已超时',
    value: 2
  }
];

export const URGE_FLAG_OPTION = [
  {
    label: '全部',
    value: 0
  },
  {
    label: '紧急',
    value: 2
  },
  {
    label: '一般',
    value: 1
  }
];

export const TIME_RANGE_OPTION = [
  {
    label: '年度',
    value: 1,
  },
  {
    label: '季度',
    value: 2,
  },
  {
    label: '月度',
    value: 3,
  },
];

export const DAY_RANGE_OPTION = [
  {
    label: '本日',
    value: 1
  },
  {
    label: '本周',
    value: 2
  },
  {
    label: '本月',
    value: 3
  },
  {
    label: '本季度',
    value: 5
  },
  {
    label: '本年',
    value: 4
  }
];

export const PRE_TYPE_OPTION = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '重复诉求事件',
    value: 1
  },
  {
    label: '即将超期预警',
    value: 2
  },
];

export const SEARCH_RESULT_TYPE_OPTION = [
  {
    label: '全部结果',
    value: 1
  },
  {
    label: '事件标题',
    value: 2
  },
  {
    label: '事件地点',
    value: 3
  }
];

export const SEARCH_SOURCE_TYPE_OPTION = [
  {
    label: '全部结果',
    value: '',
    prop: ''
  },
  {
    label: '三小场所',
    value: 1,
    prop: 'sanxiao'
  },
  {
    label: '商业枢纽',
    value: 2,
    prop: 'business'
  },
  {
    label: '交通枢纽',
    value: 3,
    prop: 'traffic'
  },
  {
    label: '医疗机构',
    value: 4,
    prop: 'hospital'
  },
  {
    label: '学校',
    value: 5,
    prop: 'school'
  },
  {
    label: '酒店宾馆',
    value: 6,
    prop: 'hotel'
  },
  {
    label: '物资保障',
    value: 7,
    prop: 'supply'
  },
];

export const SERCH_MODE_OPTION = [
  {
    label: '事件搜索',
    value: 'searchEvent'
  },
  {
    label: '历史相似',
    value: 'searchSimilar'
  },
  {
    label: '资源搜索',
    value: 'searchSource'
  },
  {
    label: '视频搜索',
    value: 'searchVideo'
  },
];

export const EVENT_STATUS_OPTION = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '待调度',
    value: 2
  },
  {
    label: '异常',
    value: 9
  }
];

export const streetLocation = {
  '510681003': [104.3, 30.99], // 金雁街道
  '510681001': [104.28, 30.98], // 雒城街道
  '510681002': [104.26, 30.95], // 汉州街道
  '510681101': [104.34, 30.93], // 三水镇
  '510681102': [104.41, 31.0], // 连山镇
  '510681103': [104.22, 31.05], // 高坪镇
  '510681105': [104.22, 30.91], // 向阳镇
  '510681106': [104.34, 31.05], // 小汉镇
  '510681107': [104.28, 31.13], // 金轮镇
  '510681114': [104.34, 30.99], // 金鱼镇
  '510681116': [104.28, 31.05], // 南丰镇
  '510681117': [104.2, 30.96] // 三星堆镇
};

// 事件总线code
export const EVENT_PLARFORM_CODE = '100';

// 地图展示热力图模式
export const MAP_HEAT = 'HEAT';
// 地图展示打点模式
export const MAP_POINT = 'POINT';
// 聚合打点模式
export const MAP_AGGRE = 'AGGRE';

// 默认时间选择
export const DEFAULT_SET_TIME = {
  year: new Date().getFullYear() + '',
  quarter: '',
  month: (new Date().getMonth() + 1 + '').padStart(2, '0'),
};

export const EMPTY_STRING = '--';

export const EVENT_ICON_SIZE = 0.3;
export const EVENT_ICON_SIZE_FOCUS = 0.4;

export const RESOURCE_TYPE = {
  SANXIAO: '1',
  BUSINESS: '2',
  TRAFFIC: '3',
  HOSPITAL: '4',
  SCHOOL: '5',
  HOTEL: '6',
  SUPPLY: '7',
};

export const RECT_TYPE = {
  BIG: '大网格',
  MID: '中网格',
  SM: '小网格'
};
