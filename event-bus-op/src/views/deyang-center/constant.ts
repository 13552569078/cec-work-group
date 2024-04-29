import { Indexable } from 'fx-front-utils';

const ALL = '';
const UNSUBMIT = '0';
const UNVERIFY = '1';
const WAITING = '2';
const PENDING = '3';
const UNCLOSE = '4';
const FINISHED = '5';
const CANCEL = '6';
const REJECT = '7';
const SELF_HANDLE = '-1'; // 自处置事件，后端并没有这个状态，仅用于前端筛选地图打点

const SHOW_CAMERA = 'show-camera';

const EVENT_STATUS_MAPPER = {
  [UNSUBMIT]: '待提交',
  [UNVERIFY]: '待审核',
  [WAITING]: '待调度',
  [PENDING]: '处置中',
  [UNCLOSE]: '待结案',
  [FINISHED]: '已办结',
  [CANCEL]: '已作废',
  [REJECT]: '审核驳回'
};

const EVENT_STATUS_CLASS = {
  '0': 'unsubmit',
  '1': 'unverify',
  '2': 'waiting',
  '3': 'pending',
  '4': 'unclose',
  '5': 'finished',
  '6': 'cancel',
  '7': 'reject'
};

// tabs list
const EVENT_LIST_TABS: Indexable<any> = {
  [ALL]: [
    {
      label: '流入事件',
      value: 'manual',
      numName: 'eventNum'
    },
    {
      label: '流入待办事件',
      value: 'manualPending',
      numName: 'handEventNum'
    },
    {
      label: '自处置事件',
      value: 'selfHandling',
      numName: 'selfEventNum'
    }
  ],
  [WAITING]: [
    {
      label: '待调度',
      value: 'wating',
      numName: 'watingNum'
    }
  ],
  [PENDING]: [
    {
      label: '处置中',
      value: 'pending',
      numName: 'pendingNum'
    },
    {
      label: '异常',
      value: 'warning',
      numName: 'warningNum'
    }
  ],
  [FINISHED]: [
    {
      label: '已办结',
      value: 'finished',
      numName: 'finishedNum'
    }
  ]
};

// origin-event-list tabs
const EVENT_ORIGIN_TABS = ['manual', 'wating', 'pending', 'finished'];

// 默认高亮tabs
const DEFAULT_TAB: Indexable<string> = {
  [ALL]: 'manual',
  [WAITING]: 'wating',
  [PENDING]: 'pending',
  [FINISHED]: 'finished'
};

export { ALL, UNSUBMIT, UNVERIFY, WAITING, PENDING, UNCLOSE, FINISHED, CANCEL, REJECT, EVENT_STATUS_MAPPER, SHOW_CAMERA, EVENT_STATUS_CLASS, SELF_HANDLE, EVENT_LIST_TABS, EVENT_ORIGIN_TABS, DEFAULT_TAB };
