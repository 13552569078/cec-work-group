import { requestHelper } from "@/apis/base/mapper-helper";
import { IgetFindEventTypeIndexUnitListSpace, IpostEventIndexSortSpace, IpostFindEventTypeIndexListSpace, IpostFindEventTypeIndexByIdSpace } from './model';
import { GlobalAPI } from '@/common';

/**
 * 数据访问，此类代码生成器生成
 */
class EventElementApi {
  data2Mock: boolean = false;

  // 事件类型指标管理-排序
  postEventIndexSort(params: any) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/sort`;
      return requestHelper.postRequestData<IpostEventIndexSortSpace.Model>(url, '3c80669c-5fd8-426d-b1c6-3d6231be67eb', this.data2Mock, params);
  }

  postModifyEventTypeIndex(params: any) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/modifyEventTypeIndex`;
      return requestHelper.postRequestData<IpostEventIndexSortSpace.Model>(url, 'da05c22f-9e7d-4ec6-8cd2-b70afbf155ac', this.data2Mock, params);
  }

  postFindEventTypeIndexList(params: any) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/findEventTypeIndexList`;
      return requestHelper.postRequestData<IpostFindEventTypeIndexListSpace.Model>(url, 'a9dca2ca-1807-4c92-bd71-1084b1733ab5', this.data2Mock, params);
  }

  postFindEventTypeIndexById(id: any) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/findEventTypeIndexById`;
      return requestHelper.postRequestData<IpostFindEventTypeIndexByIdSpace.Model>(url, 'c3b4766f-926f-41b6-934f-bfcf1f72fe06', this.data2Mock, {id});
  }

  postDeleteEventTypeIndex(id: any) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/deleteEventTypeIndex`;
      return requestHelper.postRequestData<IpostEventIndexSortSpace.Model>(url, '40ec40d0-6667-49e0-aed2-274b3007b0fd', this.data2Mock, {id});
  }

  postAddEventTypeIndex(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/addEventTypeIndex`;
    return requestHelper.postRequestData<IpostEventIndexSortSpace.Model>(url, '76c73cd7-1f51-406c-b2c8-4872d777bf82', this.data2Mock, params);
  }

  getFindEventTypeIndexUnitList() {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/findEventTypeIndexUnitList`;
    return requestHelper.getRequestData<IgetFindEventTypeIndexUnitListSpace.Model>(url, '76c73cd7-1f51-406c-b2c8-4872d777bf82', this.data2Mock);
  }

}
export const apiEventElementObj = new EventElementApi();
