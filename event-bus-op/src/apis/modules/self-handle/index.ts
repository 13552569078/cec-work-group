import { requestHelper } from '@/apis/base/mapper-helper';
import { IgetListSpace, IpostEventCountStatSpace } from './model';
import { GlobalAPI } from '@/common';
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = GlobalAPI.config.API_PREFIX_OP;

/**
 * 数据访问，此类代码生成器生成
 */
class ManualHanleApi {
  data2Mock = false;
  // 自处置列表
  list (params: IgetListSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/api/self/event/list`;
    return requestHelper.postRequestData<IgetListSpace.Model>(url, '98ef70d2-76dc-4c8a-9a9f-fb768b893a5e', this.data2Mock, params)
  }
  detail (id:string) {
    const url = `${API_DOMAIN}${API_PREFIX}/api/self/event/${id}`;
    return requestHelper.getRequestData<any>(url, '98ef70d2-76dc-4c8a-9a9f-fb768b893a5e', this.data2Mock)
  }
  cardNumStat (params: IgetListSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/api/self/event/eventListStat`;
    return requestHelper.postRequestData<IgetListSpace.Model>(url, '98ef70d2-76dc-4c8a-9a9f-fb768b893a5e', this.data2Mock, params)
  }
  eventCountStat (params: IgetListSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/handling/eventCountStat`;
    return requestHelper.postRequestData<IpostEventCountStatSpace.Model>(url, '98ef70d2-76dc-4c8a-9a9f-fb768b893a5e', this.data2Mock, params)
  }
}
export const apiSelfHanleObj = new ManualHanleApi()
