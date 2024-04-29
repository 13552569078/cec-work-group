
// 单位 目前仅此展示 规则报警
const SECOND = 'SECOND';
const MINUTE = 'MINUTE';
const HOUR = 'HOUR';
const DAY = 'DAY';

export const UNIT_TIME_LIST = [SECOND, MINUTE, HOUR, DAY];
export const UNIT_FREQUENCY_LIST = [SECOND, MINUTE, HOUR, DAY];

//  秒 转为对应单位时间 如 120S 2 minute
export const getSecondsToUnitTime = (data:any, unitKey: string, timeKey:string) => {
  if (data[unitKey] === MINUTE) return +data[timeKey] / 60;
  if (data[unitKey] === HOUR) return +data[timeKey] / 60 / 60;
  if (data[unitKey] === DAY) return +data[timeKey] / 60 / 60 / 24;
  return data[timeKey];
};

//  单位时间转为秒 如 2minute 120S
export const getUnitTimeToSeconds = (data:any, unitKey: string, timeKey:string) => {
  if (data[unitKey] === MINUTE) return +data[timeKey] * 60;
  if (data[unitKey] === HOUR) return +data[timeKey] * 60 * 60;
  if (data[unitKey] === DAY) return +data[timeKey] * 60 * 60 * 24;
  return data[timeKey];
};

// 今后时间不可用
export const disabledDateFuture = (time:any) => {
  return time.getTime() > Date.now(); // 今天时间之后的不能选择
};
// 今后时间不可用
export const disabledDatePass = (time:any) => {
  return time.getTime() < Date.now(); // 今天之前不能选择
};

// 日期格式
export const dateFormat = 'YYYY-MM-DD HH:mm:ss';
