const EVENT_HANDLING = 'WAITING_HANDLING,HANDLING';
const EVENT_FINISHED = 'FINISHED';
const DATA_RESOURCE_EVENT = [EVENT_HANDLING, EVENT_FINISHED];
const EVENT_STATES = [
  { label: '处置中', value: EVENT_HANDLING.split(',')[1] },
  { label: '待处置', value: EVENT_HANDLING.split(',')[0] },
  { label: '已办结', value: EVENT_FINISHED },
];
const EVENT_STATES_MAP = EVENT_STATES.reduce((prev, cur) => {
  prev[cur.value] = cur.label;
  return prev;
}, {} as Record<string, string>);

const BASIC_CARD = { value: 'BASE', label: '基础信息' };
const PERSON_INJURY_CARD = { value: 'PERSON_INJURY', label: '人员伤亡' };
const LOSS_CARD = { value: 'LOSS', label: '损失' };
const EVENT_ELEMENT_CARDS = [BASIC_CARD, PERSON_INJURY_CARD, LOSS_CARD];

const EVENT_TEXT_IDX = 1;
const EVENT_NUM_IDX = 0;
const EVENT_TEXT_IDX_LONG = 200;

export { EVENT_TEXT_IDX_LONG, EVENT_TEXT_IDX, EVENT_NUM_IDX, BASIC_CARD, PERSON_INJURY_CARD, LOSS_CARD, EVENT_ELEMENT_CARDS };

export const EVENT_LEVEL = [
  { value: 'EventLevel_1', label: '特别重大' },
  { value: 'EventLevel_2', label: '重大' },
  { value: 'EventLevel_3', label: '较大' },
  { value: 'EventLevel_4', label: '一般' },
  { value: '', label: '其他' },
];

export const RESPONSE_LEVEL_COLOR = {
  'Ⅰ级': '#FD6161',
  'Ⅱ级': '#FD892F',
  'Ⅲ级': '#FFEA44',
  'Ⅳ级': '#00A3FF',
};

export { EVENT_HANDLING, EVENT_FINISHED, EVENT_STATES, EVENT_STATES_MAP, DATA_RESOURCE_EVENT };
