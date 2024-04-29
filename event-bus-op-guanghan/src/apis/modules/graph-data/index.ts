import { requestHelper } from "@/apis/base/mapper-helper";
import { IgetLineDataSpace, IgetEventTypeConfigListDataSpace } from './model';
import { GlobalAPI } from '@/common';
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = GlobalAPI.config.API_PREFIX_OP;

/**
 * 数据访问，此类代码生成器生成
 */
class EventGraphApi {
  data2Mock: boolean = false;
  // 点击线获取系统信息
  getLineData(params: IgetLineDataSpace.RequestParams) {
    const { originatorSysCode, receiveSysCode, pageSize, pageNum } = params;
    const url = `${API_DOMAIN}${API_PREFIX}/bus/eventTypeConfig/fromAndTo?originatorSysCode=${originatorSysCode}&receiveSysCode=${receiveSysCode}&pageNum=${pageNum}&pageSize=${pageSize}`;
    return requestHelper.getRequestData<IgetLineDataSpace.Model>(url, '1ba339df-dd65-409b-bf2d-a329a45205c7', this.data2Mock);
  }
  // 获取事件地图配置
  getEventTypeConfigListData(params: IgetEventTypeConfigListDataSpace.RequestParams) {
    const { originatorSysCode, originalValue } = params;
    const url = `${API_DOMAIN}${API_PREFIX}/bus/eventTypeConfig/list?originatorSysCode=${originatorSysCode}&originalValue=${originalValue}`;
    return requestHelper.getRequestData<IgetEventTypeConfigListDataSpace.Model>(url, '1ba339df-dd65-409b-bf2d-a329a45205c7', this.data2Mock);
  }
}
export const apiEventGraphDataObj = new EventGraphApi();
