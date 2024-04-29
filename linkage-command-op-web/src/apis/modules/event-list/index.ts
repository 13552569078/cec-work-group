import { requestHelper } from "@/apis/base/mapper-helper";
import { IpostFindEventDetailByIdSpace,IpostStatEventNumSpace,IpostFindEventListSpace,IpostCreateEvent,EventInfo,IgetFindReservePlanNumber } from './model';
import { GlobalAPI } from '@/common';

/**
 * 数据访问，此类代码生成器生成
 */
class EventListApi {
  data2Mock: boolean = false;

  // 事件中心-查询事件详情|事件中心-查询事件详情-事件中心
  getFindEventDetailById(eventId: string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/${eventId}`;
    return requestHelper.getRequestData<IpostFindEventDetailByIdSpace.Model>(url, '095e668d-cc98-47d0-bd71-135176da9cf5', this.data2Mock);
  }
  // 事件中心-事件数量统计|事件中心-事件数量统计-事件中心
  postStatEventNum(params: IpostStatEventNumSpace.RequestParams) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event-center/statEventNum`;
      return requestHelper.postRequestData<IpostStatEventNumSpace.Model>(url, '4d67c8d9-912d-4f27-ab20-c70c08999fce', this.data2Mock, params);
  }
  // 事件中心-事件列表|事件中心-事件列表-事件中心
  postFindEventList(params: any) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/picture/event/findPictureEventInfoPage`;
      return requestHelper.postRequestData<IpostFindEventListSpace.Model>(url, 'e7527bac-3853-4481-89fd-72108da3cbe5', this.data2Mock, params);
  }
  // 事件中心-创建事件
  postCreateEvent(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event-center/createEvent`;
    return requestHelper.postRequestData<IpostCreateEvent.Model>(url, '095e668d-cc98-47d0-bd71-135176da9cf5', this.data2Mock, params);
  }
  //事件中心-状态统计
  postFindPictureEventInfo(params: any){
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/picture/event/findPictureEventInfo`;
    return requestHelper.postRequestData<EventInfo.Model>(url, '095e668d-cc98-47d0-bd71-135176da9cf5', this.data2Mock, params);
  }

  // 应急预案-数据总览
  getFindReservePlanStat(areaCode:string) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/picture/event/findReservePlanStat?areaCode=${areaCode}`;
      return requestHelper.getRequestData<IgetFindReservePlanNumber.Model>(url, '095e668d-cc98-47d0-bd71-135176da9cf5', this.data2Mock);
    }
}
export const apiEventListObj = new EventListApi();
