function isInt(val: number) {
  return val % 1 === 0;
}

function isPositiveInt(val: number) {
  return val % 1 === 0 && val > 0;
}

function isValidName(rule: any, value: string, callback: any) {
  const reg = /[%--`~!@#$^&*()={}':;,[\].<>/?~！@#￥……&*（）——|｜{}【】‘；：”“。，、？_]+/g;
  if (reg.test(value)) {
    callback(new Error('仅可输入中文、字符、数字'));
  } else {
    callback();
  }
}

const HOUSE_UNIT: Record<number, string> = {
  1: '间',
  2: '万间',
  3: '户',
  4: '万户'
};
const FARM_UNIT: Record<number, string> = {
  1: '公顷',
  2: '亩',
  3: '平方千米',
};
const appendPeopleUnit = (num: string | number, unitType?: number) => {
  if (!num) return '-';
  if (unitType === undefined) return num + '人';
  else return num + (unitType === 1 ? '人' : '万人');
};
const appendEconomicUnit = (num: string | number, unitType?: number) => {
  if (!num) return '-';
  if (unitType === undefined) return num + '元';
  else return num + (unitType === 1 ? '万元' : '亿元');
};
const appendHouseUnit = (num: string | number, unitType: number) => {
  if (!num) return '-';
  return num + HOUSE_UNIT[unitType];
};
const appendFarmUnit = (num: string | number, unitType: number) => {
  if (!num) return '-';
  return num + FARM_UNIT[unitType];
};
const appendTimeUnit = (num: string | number, unitType: number) => {
  if (!num) return '-';
  return num + (unitType === 1 ? '小时' : '天');
};

const padding = (s: number, len: number) => {
  const absLen = Math.abs(len - (s + '').length);
  if (absLen === 0) return s;
  let returnStr = '';
  for (let i = 0; i < absLen; i++) {
    returnStr = '0' + s;
  }
  return returnStr;
};

const dateFormat = (date: any, pattern: string = 'yyyy-MM-dd HH:mm:ss') => {
  if (!date) return date;
  let reutrnDate = new Date();
  if (/^\d+$/.test(date)) {
    reutrnDate = new Date(Number(date) * 1000);
  } else if (typeof date === 'string') {
    // if(!(date instanceof Date)) return date;
    reutrnDate = new Date(date);
  } else if (date instanceof Date) {
    reutrnDate = date;
  }
  const patternArray = pattern.split(/([- :])(\1*)/g);
  const newPatternArray = patternArray.map(item => {
    if ([' ', '-', ':'].indexOf(item) === -1) {
      if (item.startsWith('y')) {
        return padding(reutrnDate.getFullYear(), item.length);
      }
      if (item.startsWith('M')) {
        return padding(reutrnDate.getMonth() + 1, item.length);
      }
      if (item.startsWith('d')) {
        return padding(reutrnDate.getDate(), item.length);
      }
      if (item.startsWith('w')) {
        return reutrnDate.getDay() + 1;
      }
      if (item.startsWith('H')) {
        return padding(reutrnDate.getHours(), item.length);
      }
      if (item.startsWith('m')) {
        return padding(reutrnDate.getMinutes(), item.length);
      }
      if (item.startsWith('s')) {
        return padding(reutrnDate.getSeconds(), item.length);
      }
    }
    return item;
  });
  return newPatternArray.join('');
};

export {
  isInt,
  isPositiveInt,
  isValidName,
  appendPeopleUnit,
  appendEconomicUnit,
  appendHouseUnit,
  appendFarmUnit,
  appendTimeUnit,
  dateFormat
};
