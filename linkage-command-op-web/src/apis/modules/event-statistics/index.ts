import { requestHelper } from "@/apis/base/mapper-helper";
import { IpostTopEventTypesSpace, IgetEventOverviewSpace,IpostStatEventNumByDateSpace,IpostStatEventNumByTypeSpace } from './model';
import { GlobalAPI } from '@/common';

/**
 * 数据访问，此类代码生成器生成
 */
class EventStatisticsApi {
  data2Mock: boolean = false;

  // 事件统计-概览|事件统计-概览-一张图-事件
  postEventOverview(params: any) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/picture/event/eventOverview`;
      return requestHelper.postRequestData<IgetEventOverviewSpace.Model>(url, 'afef881d-e8e8-451e-aae7-2ec75b0ff536', this.data2Mock,params);
  }
  // 事件统计-趋势分析|事件统计-趋势分析-一张图-事件
  postStatEventNumByDate(params: any) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/picture/event/statEventNumByDate`;
      return requestHelper.postRequestData<IpostStatEventNumByDateSpace.Model>(url, '6ae5d8be-bf41-4e5e-b50e-d5a53695d408', this.data2Mock, params);
  }
  // 事件统计-高发事件|事件统计-高发事件-一张图-事件
  postStatEventNumByType(params: any) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/picture/event/statEventNumByType`;
      return requestHelper.postRequestData<IpostStatEventNumByTypeSpace.Model>(url, '0ab581bb-98fd-4445-9d88-3a40e5fbf80e', this.data2Mock, params);
  }
  // 事件统计-概览|事件统计-概览-一张图-事件
  postTopEventTypes(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/picture/event/topEventTypes`;
    return requestHelper.postRequestData<IpostTopEventTypesSpace.Model>(url, 'afef881d-e8e8-451e-aae7-2ec75b0ff536', this.data2Mock,params);
}
}
export const apiEventStatisticsObj = new EventStatisticsApi();
