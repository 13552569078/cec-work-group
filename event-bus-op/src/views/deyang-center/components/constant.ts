export const PLATFORM_DEFAULT = '全部平台';

// 1:流入类型、2:事件状态、3:自处置事件类型
export const DEMENSION_FLOW = '1';
export const DEMENSION_IN = '2';
export const DEMENSION_SELF = '3';

// 平台流入统计
export const FLOW_LIU_RU_LIANG = '1';
export const FLOW_BAN_JIE_LIANG = '2';
export const FLOW_CHAO_SHI_LIANG = '3';
export const FLOW_LIU_RU_LIANG_NAME = '流入量';
export const FLOW_BAN_JIE_LIANG_NAME = '办结量';
export const FLOW_CHAO_SHI_LIANG_NAME = '超时量';

// 接入事件统计
export const IN_NUM = '1';
export const IN_UN_NUM = '2';
export const IN_OVER_NUM = '3';
export const IN_DONE_NUM = '4';
export const IN_DONE_OVER_NUM = '5';
export const IN_NUM_NAME = '接入事件';
export const IN_UN_NUM_NAME = '正常未办';
export const IN_OVER_NUM_NAME = '超时未办';
export const IN_DONE_NUM_NAME = '正常办结';
export const IN_DONE_OVER_NUM_NAME = '超时办结';

// 自处置事件统计
export const SELF_NUM = '1';
export const SELF_DONE = '2';
export const SELF_OVER_DONE = '3';
export const SELF_NUM_NAME = '自处置事件';
export const SELF_DONE_NAME = '自处置办结';
export const SELF_OVER_DONE_NAME = '自处置超时';
export const SELF_NAME_MAP = {
  SELF_NUM: SELF_NUM_NAME,
  SELF_DONE: SELF_DONE_NAME,
  SELF_OVER_DONE: SELF_OVER_DONE_NAME
};
