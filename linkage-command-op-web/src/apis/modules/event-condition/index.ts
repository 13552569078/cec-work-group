import { requestHelper } from "@/apis/base/mapper-helper";
import { IpostFindEventDynamicsByIdSpace, IpostFindEventDetailByIdSpace, IpostFindEventListSpace,IpostEventTypeTree ,IpostListForDataViewSpace, IpostModifyEventInfoSpace } from './model';
import { GlobalAPI } from '@/common';

/**
 * 数据访问，此类代码生成器生成
 */
class EventConditionApi {
  data2Mock: boolean = false;

  // 查询事件详情
  getEventDetailById(eventId: string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/${eventId}`;
    return requestHelper.getRequestData<IpostFindEventDetailByIdSpace.Model>(url, 'c0790b2c-4c9f-4423-a067-54e6bef8312d', this.data2Mock);
  }

  // 修改事件
  postModifyEventInfo(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/modifyEventInfo`;
    return requestHelper.postRequestData<IpostModifyEventInfoSpace.Model>(url, '9208b743-e4d2-4a85-975b-308139155ccf', this.data2Mock, params);
  }

  // 事件列表
  postFindEventList(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/wartime/findEventList`;
    return requestHelper.postRequestData<IpostFindEventListSpace.Model>(url, '21f322ca-9f28-47ba-bbbe-4b0ba694f1ab', this.data2Mock, params);
  }

  // 事件类型
  postFindEventTypeTree() {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/wartime/findEventTypeTree`;
    return requestHelper.postRequestData<IpostEventTypeTree.Model>(url, '095e668d-cc98-47d0-bd71-135176da9cf5', this.data2Mock);
  }
  // 事件类型new
  getEventTypeTree() {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/eventTypeTree`;
    return requestHelper.getRequestData<IpostEventTypeTree.Model>(url, '095e668d-cc98-47d0-bd71-135176da9cf5', this.data2Mock);
  }

  // 动态列表-一张图|动态列表-一张图-动态信息
  postListForDataView(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/news/listForDataView`;
    return requestHelper.postRequestData<IpostListForDataViewSpace.Model>(url, '7d689c22-8f73-4573-a67a-c0f7c1ed5c53', this.data2Mock, params);
  }

}
export const apiEventConditionObj = new EventConditionApi();
