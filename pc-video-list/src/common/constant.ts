/**
 * 用户授权缓存key
 */
const token = new URLSearchParams(window.location.search).get('token');
let AUTH_TOKEN: string;

if (token) {
  sessionStorage.setItem('TOKEN', token);
  AUTH_TOKEN = token as string;
} else {
  AUTH_TOKEN = sessionStorage.getItem('TOKEN') as string || '';
}

export { AUTH_TOKEN };

// 缓存前缀
export const DOMAIN = 'monitoring.warning.centre';

export const ROOT_TREE_LEVEL = 1;
export const TOP_TREE_LEVEL = 3;

export const MAX_PAGE_SIZE = 9999999;

export const RULE_TYPE_INTERZONE = 'interzone';
export const RULE_TYPE_SWITCH = 'switch';
export const RULE_TYPE_CONTAIN = 'contain';
export const RULE_TYPE_IN = 'in';
export const RULE_TYPE_NAMES = {
  [RULE_TYPE_INTERZONE]: '区间型',
  [RULE_TYPE_SWITCH]: '开关型',
  [RULE_TYPE_CONTAIN]: '包含型',
  [RULE_TYPE_IN]: '被包含型'
};
export const RULES_ARR = [
  [RULE_TYPE_INTERZONE, RULE_TYPE_NAMES[RULE_TYPE_INTERZONE], '(说明：区间型一般为数值，如液位合理区间范围为0到5000厘米)'],
  [RULE_TYPE_SWITCH, RULE_TYPE_NAMES[RULE_TYPE_SWITCH], '(说明：开关型一般只有两个值可选，如消防通道是否占用)'],
  [RULE_TYPE_CONTAIN, RULE_TYPE_NAMES[RULE_TYPE_CONTAIN], '(说明：被包含型一般为可数的选项，需从中选择，如汽车尾号限行时的尾号)'],
  [RULE_TYPE_IN, RULE_TYPE_NAMES[RULE_TYPE_IN], '(说明：包含型一般用于舆情，指特定的关键字)']
];

export const ACTION_ADD = 'add';
export const ACTION_EDIT = 'edit';
export const ACTION_DETAIL = 'detail';

// none(无区间)、gt(大于)、lt(小于)、ge(大于等于)、le(小于等于)
export const EXPRESSIONS = [
  { key: 'none', label: '无区间' },
  { key: 'gt', label: '大于' },
  { key: 'lt', label: '小于' },
  { key: 'ge', label: '大于等于' },
  { key: 'le', label: '小于等于' },
];
