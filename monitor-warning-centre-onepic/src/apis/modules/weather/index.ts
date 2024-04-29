import { requestHelper } from "@/apis/base/mapper-helper";
import { IpostGetHourlyFcstsSpace,IpostGetDailyFcstsSpace,IgetGetAlertsWeatherAreCodeSpace,IgetGetNowCastingSpace,IgetGetIntelligentWeatherSpace,IgetGetLocationAreacodeSpace,IpostGetThHoursSpace,IgetGetAlertsWeatherSpace } from './model';
import { GlobalAPI } from '@/common';
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = GlobalAPI.config.API_PREFIX_WEATHER;

/**
 * 数据访问，此类代码生成器生成
 */
class WeatherApi {
  data2Mock: boolean = false;
  
  // 逐小时预报|逐小时预报-天气服务api
  postGetHourlyFcsts(lonlat:string,hours:number) {
      const url = `${API_DOMAIN}${API_PREFIX}/weather/getHourlyFcsts`;
      return requestHelper.postRequestData<IpostGetHourlyFcstsSpace.Model>(url, 'a16eb7db-b8b3-4219-bad3-13fe4d9b2d61', this.data2Mock, {lonlat,hours});
  }
  // 逐日天气|逐日天气-天气服务api
  postGetDailyFcsts(lonlat:string,days:number) {
      const url = `${API_DOMAIN}${API_PREFIX}/weather/getDailyFcsts`;
      return requestHelper.postRequestData<IpostGetDailyFcstsSpace.Model>(url, '719c071d-85b1-4b6a-8c96-06dad7257b7b', this.data2Mock, {lonlat,days});
  }
  // 天气预警|天气预警-天气服务api
  getGetAlertsWeatherAreCode(areCode:string) {
      const url = `${API_DOMAIN}${API_PREFIX}/weather/getAlertsWeatherAreCode?areCode=${areCode}`;
      return requestHelper.getRequestData<IgetGetAlertsWeatherAreCodeSpace.Model>(url, '6896f07a-bd26-4d75-9d40-d55e6f8744fa', this.data2Mock);
  }
  // 逐日天气|逐日天气-天气服务api
  getGetNowCasting(lonlat:string) {
      const url = `${API_DOMAIN}${API_PREFIX}/weather/getNowCasting?lonlat=${lonlat}`;
      return requestHelper.getRequestData<IgetGetNowCastingSpace.Model>(url, 'f27b8302-7b83-4081-8d23-95e3378e9c48', this.data2Mock);
  }
  // 智能天气|智能天气-天气服务api
  getGetIntelligentWeather(lonlat:string) {
      const url = `${API_DOMAIN}${API_PREFIX}/weather/getIntelligentWeather?lonlat=${lonlat}`;
      return requestHelper.getRequestData<IgetGetIntelligentWeatherSpace.Model>(url, '109bb4bf-0fff-474a-868b-3d9115ebc5cc', this.data2Mock);
  }
  // 根据经纬度|根据经纬度-天气服务api
  getGetLocationAreacode(lonlat:string) {
      const url = `${API_DOMAIN}${API_PREFIX}/weather/getLocationAreacode?lonlat=${lonlat}`;
      return requestHelper.getRequestData<IgetGetLocationAreacodeSpace.Model>(url, 'fe336bcb-31f1-448b-93f1-948bef51638c', this.data2Mock);
  }
  // 逐小时预报|逐小时预报-天气服务api
  postGetThHours(lonlat:string,hours:number) {
      const url = `${API_DOMAIN}${API_PREFIX}/weather/getThHours`;
      return requestHelper.postRequestData<IpostGetThHoursSpace.Model>(url, '3c37fc9e-cafb-4afd-abf2-62d1a210d19a', this.data2Mock, {lonlat,hours});
  }
  // 报警天气|报警天气-天气服务api
  getGetAlertsWeather(lonlat:string) {
      const url = `${API_DOMAIN}${API_PREFIX}/weather/getAlertsWeather?lonlat=${lonlat}`;
      return requestHelper.getRequestData<IgetGetAlertsWeatherSpace.Model>(url, '0b4b1375-b481-4078-b716-a6a63c272c67', this.data2Mock);
  }

  Run(methodName: string, params: any) {
    let result:any = new Promise(() => ({ data: {} }));
    switch (methodName) {
      
    case "postGetHourlyFcsts":
      {
        const { lonlat,hours } = params;
        result = this.postGetHourlyFcsts(lonlat,hours);
      }
      break;

    case "postGetDailyFcsts":
      {
        const { lonlat,days } = params;
        result = this.postGetDailyFcsts(lonlat,days);
      }
      break;

    case "getGetAlertsWeatherAreCode":
      {
        const { areCode } = params;
        result = this.getGetAlertsWeatherAreCode(areCode);
      }
      break;

    case "getGetNowCasting":
      {
        const { lonlat } = params;
        result = this.getGetNowCasting(lonlat);
      }
      break;

    case "getGetIntelligentWeather":
      {
        const { lonlat } = params;
        result = this.getGetIntelligentWeather(lonlat);
      }
      break;

    case "getGetLocationAreacode":
      {
        const { lonlat } = params;
        result = this.getGetLocationAreacode(lonlat);
      }
      break;

    case "postGetThHours":
      {
        const { lonlat,hours } = params;
        result = this.postGetThHours(lonlat,hours);
      }
      break;

    case "getGetAlertsWeather":
      {
        const { lonlat } = params;
        result = this.getGetAlertsWeather(lonlat);
      }
      break;

      default:
        break;
    }
    return result;
  }
}
export const apiWeatherObj = new WeatherApi();