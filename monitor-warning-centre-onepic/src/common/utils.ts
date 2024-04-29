import { CommonUtils } from 'fx-front-utils';
import dayjs from 'dayjs';

export const echartsFontSize = (size: number): number | undefined => CommonUtils.echartsFontSize(size, 1080);

export function dateFormat(date: Date, format?: string): string {
  const year = `${date.getFullYear()}`;
  let month = `${date.getMonth() + 1}`;
  if (month.length === 1) {
    month = `0${month}`;
  }
  let day = `${date.getDate()}`;
  if (day.length === 1) {
    day = `0${day}`;
  }
  let hours = `${date.getHours()}`;
  if (hours.length === 1) {
    hours = `0${hours}`;
  }
  let minutes = `${date.getMinutes()}`;
  if (minutes.length === 1) {
    minutes = `0${minutes}`;
  }
  let seconds = `${date.getSeconds()}`;
  if (seconds.length === 1) {
    seconds = `0${seconds}`;
  }
  return (format || 'yyyy-MM-dd hh:mm:ss')
    .replace(/yyyy/g, year)
    .replace(/MM/g, month)
    .replace(/dd/g, day)
    .replace(/hh/g, hours)
    .replace(/mm/g, minutes)
    .replace(/ss/g, seconds);
}

/**
 * 获取近多少天，至当天结束（23:59:59）
 * @param number
 */
export function getDaysBetween(number: number) {
  let day1 = '';
  let day2 = '';
  const oneDay = 24 * 60 * 60 * 1000;
  const endTime = new Date(new Date().toLocaleDateString()).getTime() + oneDay - 1;
  day1 = dayjs(endTime).format('YYYY-MM-DD HH:mm:ss');
  const startTime = new Date(new Date().toLocaleDateString()).getTime() + oneDay - number * oneDay;
  day2 = dayjs(startTime).format('YYYY-MM-DD HH:mm:ss');
  return { startTime: day2, endTime: day1 };
}

export function getUrlPrefix() {
  return document.location.href.includes('/monitor/') ? '/monitor' : '/warning';
}
