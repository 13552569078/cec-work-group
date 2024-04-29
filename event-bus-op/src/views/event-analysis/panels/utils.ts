/*
 left1
*/
export const RANK = 'RANK';
export const TREBD = 'TREBD';
export const HEAD_TBAS = [
  {
    label: '话题排名',
    value: RANK
  },
  {
    label: '话题趋势',
    value: TREBD
  }
];

export const ALL = 'ALL';
export const CLASSIFY = 'CLASSIFY';
export const CON_TBAS = [
  {
    label: '全部话题',
    value: ALL
  },
  {
    label: '分类话题',
    value: CLASSIFY
  }
];

export const SEARCH_TIME_DEFAULT = 1;
export const SEARCH_TIME_LIST = [
  {
    label: '年',
    value: '1'
  },
  {
    label: '季度',
    value: '2'
  },
  {
    label: '月',
    value: '3'
  }
];

export const COLS = [
  {
    title: '序号',
    minWidth: '2em',
    align: 'left',
    slotName: 'tableIndex',
    fixed: 'left'
  },
  { title: '话题名称', prop: 'topicName' },
  { title: '话题数', prop: 'topicNum' },
  { title: '环比', prop: 'linkRate' }
];
