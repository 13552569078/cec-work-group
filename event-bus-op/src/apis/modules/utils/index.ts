import { requestHelper } from "@/apis/base/mapper-helper";
import { IgetDictListSpace, IgetAreaListSpace, IgetEventTypeListSpace } from './model';
import { GlobalAPI } from '@/common';
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = GlobalAPI.config.API_PREFIX_OP;

/**
 * 数据访问，此类代码生成器生成
 */
class IndexUtilsApi {
  data2Mock: boolean = false;

  // 字典
  getDictList (params: IgetDictListSpace.RequestParams) {
    const { dictType, pageSize } = params;
    const url = `${API_DOMAIN}${API_PREFIX}/tcDictData/list?dictType=${dictType}&pageSize=${pageSize || 100}`;
    return requestHelper.getRequestData<IgetDictListSpace.Model>(url, '24033041-79ef-4ef4-946b-5309ab712d08', this.data2Mock);
  }

  getAreaList () {
    const url = `${API_DOMAIN}${API_PREFIX}/event/common/area`;
    return requestHelper.getRequestData<IgetAreaListSpace.Model>(url, '24033041-79ef-4ef4-946b-5309ab712d08', this.data2Mock);
  }

  getEventTypeList (params: IgetEventTypeListSpace.RequestParams) {
    const { platform } = params;
    const url = `${API_DOMAIN}${API_PREFIX}/eventType/selectAllByPlatFrom?platformSrc=${platform}`;
    return requestHelper.getRequestData<IgetEventTypeListSpace.Model>(url, '24033041-79ef-4ef4-946b-5309ab712d08', this.data2Mock);
  }
  
}
export const apiUtilsObj = new IndexUtilsApi();