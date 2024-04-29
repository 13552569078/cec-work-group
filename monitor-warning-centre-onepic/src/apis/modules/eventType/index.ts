import { requestHelper } from '@/apis/base/mapper-helper';
import { IgetListEventTypeListVOsEventTypeSpace } from './model';
import { GlobalAPI } from '@/common';
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = '/swan-pre-warning-web';

/**
 * 数据访问，此类代码生成器生成
 */
class EventTypeApi {
  data2Mock: boolean = false;
  // 查询事件类型列表（下拉框）|查询事件类型列表（下拉框）-EventTypeController
  getListEventTypeListVOsEventType () {
    const url = `${API_DOMAIN}${API_PREFIX}/eventType/listEventTypeListVOs`;
    return requestHelper.getRequestData<IgetListEventTypeListVOsEventTypeSpace.Model>(url, '45e85eb2-bf16-4352-a034-fa8d6f3257d5', this.data2Mock);
  }
}
export const apiEventTypeObj = new EventTypeApi();