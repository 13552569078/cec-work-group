/* eslint-disable import/no-dynamic-require */
import { dateFormat } from '@/common/utils';

const useIcon = () => {
  /**
   * 获取天气Icon图片
   * @param {code} [String] 天气code
   * @param {time} [String] 时间 用于判断属于白天 or 夜间返回不同icon类型 6:00-18:00为白天，否则夜间
   * @param {type} [String] 指定icon类型 d: 白天 n: 夜间 默认为""
   */
  const getWeatherIcon = (code?: string, time?: string, type: string = '') => {
    let flag = type;
    if (time) {
      const hour = Number(dateFormat(new Date(time), 'hh'));
      // d: 白天 n: 夜间
      flag = hour >= 6 && hour <= 18 ? 'd' : 'n';
    }
    let result = 'icon_' + code;
    // let result = "icon_01d";
    if (code === '00' || code === '01' || code === '03') {
      result += flag;
    }
    return require(`@/assets/images/natureDisaster/weather/weather-icon/${result}.png`);
  };

  // 引入table icon
  const getTabaleIconSrc = (name: number) => {
    return require(`@/assets/images/natureDisaster/weather/table_icon_${name}.png`);
  };
  return {
    getWeatherIcon,
    getTabaleIconSrc
  };
};
export default useIcon;
