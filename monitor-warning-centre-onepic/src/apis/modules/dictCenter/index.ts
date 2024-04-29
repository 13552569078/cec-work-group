import { requestHelper } from "@/apis/base/mapper-helper";
import { IgetListDictCustomVOsSpace,IgetListEventTypeListVOsSpace,IgetListEventLevelVOsSpace } from './model';
import { GlobalAPI } from '@/common';
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = GlobalAPI.config.API_PREFIX_CENTRE_CONFIG;

/**
 * 数据访问，此类代码生成器生成
 */
class DictCenterApi {
  data2Mock: boolean = false;

  // 查询字典列表|查询字典列表-DictController
  getListDictCustomVOs(typeCodeList:string) {
    const url = `${API_DOMAIN}${API_PREFIX}/dict/listDictCustomVOs?typeCodeList=${typeCodeList}`;
    return requestHelper.getRequestData<IgetListDictCustomVOsSpace.Model>(url, '643672ab-246b-4b49-a155-f3fe4a3da7fc', this.data2Mock);
  }
  // 查询事件类型列表（下拉框）|查询事件类型列表（下拉框）-EventTypeController
  getListEventTypeListVOs() {
    const url = `${API_DOMAIN}${API_PREFIX}/eventType/listEventTypeListVOs`;
    return requestHelper.getRequestData<IgetListEventTypeListVOsSpace.Model>(url, 'afa36675-e395-4310-b31b-5b98ce7b5463', this.data2Mock);
  }
  // 研判-事件等级下拉框接口|研判-事件等级下拉框接口-研判中心API
  getListEventLevelVOs(eventTypeCode:string) {
    const url = `${API_DOMAIN}${API_PREFIX}/dataJudge/ListEventLevelVOs?eventTypeCode=${eventTypeCode}`;
    return requestHelper.getRequestData<IgetListEventLevelVOsSpace.Model>(url, '1e5116aa-d788-4930-b1f3-ea60b7c7b096', this.data2Mock);
  }

  Run(methodName: string, params: any) {
    let result:any = new Promise(() => ({ data: {} }));
    switch (methodName) {

      case "getListDictCustomVOs":
      {
        const { typeCodeList } = params;
        result = this.getListDictCustomVOs(typeCodeList);
      }
        break;

      case "getListEventTypeListVOs":
        result = this.getListEventTypeListVOs();
        break;

      case "getListEventLevelVOs":
      {
        const { eventTypeCode } = params;
        result = this.getListEventLevelVOs(eventTypeCode);
      }
        break;

      default:
        break;
    }
    return result;
  }
}
export const apiDictCenterObj = new DictCenterApi();
