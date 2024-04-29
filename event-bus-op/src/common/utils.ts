import { CommonUtils } from 'fx-front-utils';
import dayjs from 'dayjs';
import axios from 'axios';
import { GlobalAPI } from './global-api';
import { Indexable } from 'fx-front-utils';
let { MAP_CONFIG } = GlobalAPI.config;
MAP_CONFIG = typeof MAP_CONFIG === 'string' ? JSON.parse(MAP_CONFIG) : MAP_CONFIG;

export const echartsFontSize = (size: number): number | undefined => CommonUtils.echartsFontSize(size, 3456);

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
  return (format || 'yyyy-MM-dd hh:mm:ss').replace(/yyyy/g, year).replace(/MM/g, month).replace(/dd/g, day).replace(/hh/g, hours).replace(/mm/g, minutes).replace(/ss/g, seconds);
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
  return document.location.href.includes('/alarm/') ? '/alarm' : '/warning';
}

export async function getToken(appId = GlobalAPI.config.CHANGZHOU_APP_ID, appSecret = GlobalAPI.config.CHANGZHOU_APP_SECRET) {
  const url = `${GlobalAPI.config.CHANGZHOU_API_PREFIX}/auth/accesstoken/create?appId=${appId}&appSecret=${appSecret}`;
  const res = await axios.get(url);
  return res.data.access_token;
}

const textSize = {
  12: MAP_CONFIG.aggregatePointSize ? 12 * MAP_CONFIG.aggregatePointSize : 12,
  14: MAP_CONFIG.aggregatePointSize ? 14 * MAP_CONFIG.aggregatePointSize : 14,
  18: MAP_CONFIG.aggregatePointSize ? 18 * MAP_CONFIG.aggregatePointSize : 18,
  20: MAP_CONFIG.aggregatePointSize ? 20 * MAP_CONFIG.aggregatePointSize : 20,
  22: MAP_CONFIG.aggregatePointSize ? 22 * MAP_CONFIG.aggregatePointSize : 22,
};
const radius = {
  50: MAP_CONFIG.aggregatePointSize ? 50 * MAP_CONFIG.aggregatePointSize : 50,
  75: MAP_CONFIG.aggregatePointSize ? 75 * MAP_CONFIG.aggregatePointSize : 75,
  100: MAP_CONFIG.aggregatePointSize ? 100 * MAP_CONFIG.aggregatePointSize : 100,
  125: MAP_CONFIG.aggregatePointSize ? 125 * MAP_CONFIG.aggregatePointSize : 125,
  150: MAP_CONFIG.aggregatePointSize ? 150 * MAP_CONFIG.aggregatePointSize : 150
};

export function getMapIconOption(clusterPointColor: string, textColor: string = 'white') {
  return [
    { count: 50, textColor: textColor, textSize: textSize['12'], functionName: 'plusingDot', functionProps: { color: clusterPointColor, radius: radius['50'] } },
    { count: 100, textColor: textColor, textSize: textSize['14'], functionName: 'plusingDot', functionProps: { color: clusterPointColor, radius: radius['75'] } },
    { count: 200, textColor: textColor, textSize: textSize['18'], functionName: 'plusingDot', functionProps: { color: clusterPointColor, radius: radius['100'] } },
    { count: 500, textColor: textColor, textSize: textSize['20'], functionName: 'plusingDot', functionProps: { color: clusterPointColor, radius: radius['125'] } },
    { textColor: textColor, textSize: textSize['22'], functionName: 'plusingDot', functionProps: { radius: radius['150'], color: clusterPointColor } }
  ];
}

export function echartsSize(res: number) {
  const clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  if (!clientHeight) return;
  const fontSize = clientHeight / 3456;
  return Math.floor(res * fontSize);
}

// 获取路由 url 最后一级的内容，如 /a/b/c?token=123 ，则返回 c
export function getLastPath() {
  const paths = document.location.href.split('/');
  const lastPath = paths[paths.length - 1];
  if (lastPath.includes('?')) {
    return lastPath.split('?')[0];
  } else {
    return lastPath;
  }
}

// 在树中找某一个结点
export function findNode (value: string | number, key: string, tree: Indexable<any>[], childrenKey: string = 'children'): Indexable<any> | undefined {
  if (tree && tree.length) {
    let node = tree.find((item: Indexable<any>) => item[key] === value);
    if (node) {
      return node;
    } else {
      for (let i = 0; i < tree.length; i++) {
        const found = findNode(value, key, tree[i][childrenKey], childrenKey);
        if (found) {
          node = found;
          break;
        }
      }
    }
    return node;
  }
}

export const handleEmptyStr = (content: string) => {
  if (!content || content === '-') return '--';
  return content;
};

export const getQuarterAndMonthTime = (quarterAndMonthTimeObj:any) => {
  const startDayTime = '00:00:00';
  const endDayTime = '23:59:59';
  let resTime:string[] = [];
  const getTimeStr = () => {
    let res = quarterAndMonthTimeObj.year;
    for (const k in quarterAndMonthTimeObj) {
      if (
        k !== 'year' &&
      quarterAndMonthTimeObj[k as keyof typeof quarterAndMonthTimeObj]
      ) {
        res += `-${quarterAndMonthTimeObj[k as keyof typeof quarterAndMonthTimeObj]}`;
      }
    }
    return res;
  };
  const getMonthStart = (date: string): string => {
    const [year, month] = date.split('-');
    const firstDay = new Date(Number(year), Number(month) - 1, 1);
    const formattedFirstDay = formatDay(firstDay);
    return `${year}-${month}-${formattedFirstDay} ${startDayTime}`;
  };
  const getMonthEnd = (date: string): string => {
    const [year, month] = date.split('-');
    const lastDay = new Date(Number(year), Number(month), 0);
    const formattedLastDay = formatDay(lastDay);
    return `${year}-${month}-${formattedLastDay} ${endDayTime}`;
  };
  const formatDay = (date: Date): string => {
    const day = date.getDate();
    return day < 10 ? `0${day}` : `${day}`;
  };
  // 时间范围规则：
  // 1. 选择年： 年第一天 --- 年最后一天
  // 2. 选择季度： 年-季度第一天 --- 年-季度最后一天
  // 3. 选择月： 年-月第一天 --- 年-月最后一天
  const currentTime = getTimeStr();
  // 只选择了年 YYYY
  if (currentTime.length === 4) {
    resTime = [
      `${currentTime}-01-01 ${startDayTime}`,
      `${currentTime}-12-31 ${endDayTime}`,
    ];
  } else if (currentTime.length === 10 && quarterAndMonthTimeObj.month === '') {
    // 只选择了年-季度 YYYY-MM-MM => 年-开始月-结束月
    const [year, monthStart, monthEnd] = currentTime.split('-');
    resTime = [
      getMonthStart(`${year}-${monthStart}`),
      getMonthEnd(`${year}-${monthEnd}`),
    ];
  } else if (currentTime.length === 13 || currentTime.length === 7) {
    // 选择了年-季度-月 YYYY-MM-MM-MM 或 选择了年-月 YYYY-MM
    const yearMonth = currentTime.split('-');
    resTime = [
      getMonthStart(`${yearMonth[0]}-${yearMonth[yearMonth.length - 1]}`),
      getMonthEnd(`${yearMonth[0]}-${yearMonth[yearMonth.length - 1]}`),
    ];
  }
  return resTime;
};
