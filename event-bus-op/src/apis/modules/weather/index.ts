import { requestHelper } from "@/apis/base/mapper-helper";
import { IgetLatestSpace } from './model';
import { GlobalAPI } from '@/common';
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = GlobalAPI.config.API_PREFIX_LINKAGE_OP || 'swan-gateway/linkage-command-op-server';

/**
 * 数据访问，此类代码生成器生成
 */
class HefengWeatherApi {
  data2Mock: boolean = false;
  
  // 获取最新天气信息|获取最新天气信息-天气
  getLatest(areaCode:string) {
      const url = `${API_DOMAIN}${API_PREFIX}/weather/latest?areaCode=${areaCode}`;
      return requestHelper.getRequestData<IgetLatestSpace.Model>(url, 'cf5121a0-3db3-45a7-83f9-aceaa50c1acb', this.data2Mock);
  }
}
export const apiHefengWeatherObj = new HefengWeatherApi();