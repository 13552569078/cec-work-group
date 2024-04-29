import { requestHelper } from "@/apis/base/mapper-helper";
import {  IpostAddEventInfoSpace,  IpostModifyEventInfoSpace,IpostEventTypeTree } from './model';
import { GlobalAPI } from '@/common';

/**
 * 数据访问，此类代码生成器生成
 */
class CreateEventApi {
    data2Mock: boolean = false;
    getEventLevels() {
        const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/eventLevels`;
        return requestHelper.getRequestData<any>(url, '94e03607-d80e-4ad7-918b-1f11500f1b6f', this.data2Mock);
    }
    // 新增事件|新增事件-事件列表
    postAddEventInfo(params: IpostAddEventInfoSpace.RequestParams) {
        const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/addEventInfo`;
        return requestHelper.postRequestData<IpostAddEventInfoSpace.Model>(url, '63b4e860-e507-4805-bff5-d298ad9b5284', this.data2Mock, params);
    }
    // // 修改事件|修改事件-事件列表
    postModifyEventInfo(params: any) {
        const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/modifyEventInfo`;
        return requestHelper.postRequestData<IpostModifyEventInfoSpace.Model>(url, '9208b743-e4d2-4a85-975b-308139155ccf', this.data2Mock, params);
    }
  // 事件中心-查询事件详情|事件中心-查询事件详情-事件中心
  postFindEventTypeTree() {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/wartime/findEventTypeTree`;
    return requestHelper.postRequestData<IpostEventTypeTree.Model>(url, '095e668d-cc98-47d0-bd71-135176da9cf5', this.data2Mock);
}
}
export const apiCreateEventObj = new CreateEventApi();
