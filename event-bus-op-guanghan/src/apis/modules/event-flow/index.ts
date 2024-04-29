import { requestHelper } from "@/apis/base/mapper-helper";
import { IpostPlatformAndEventStatisticsSpace,IpostPlatformStatisticsSpace,IpostPlatformHandleAnalysisSpace,IpostPlatformOverviewSpace } from './model';
import { GlobalAPI } from '@/common';
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = GlobalAPI.config.API_PREFIX_OP;
/**
 * 数据访问，此类代码生成器生成
 */
class Event_flowApi {
  data2Mock: boolean = false;

  // 事件流转-平台和事件汇聚统计|事件流转-平台和事件汇聚统计-一张图-事件流转
  postPlatformAndEventStatistics(district:number,endTime:string,startTime:string) {
      const url = `${API_DOMAIN}${API_PREFIX}/event/flow/platformAndEventStatistics`;
      return requestHelper.postRequestData<IpostPlatformAndEventStatisticsSpace.Model>(url, 'b84d8db7-92a6-44a4-8d26-d85ddbc2b1dd', this.data2Mock, {district,endTime,startTime});
  }
  // 事件流转-平台统计|事件流转-平台统计-一张图-事件流转
  postPlatformStatistics(district:number,endTime:string,startTime:string) {
      const url = `${API_DOMAIN}${API_PREFIX}/event/flow/platformStatistics`;
      return requestHelper.postRequestData<IpostPlatformStatisticsSpace.Model>(url, 'dbac61e6-baa4-450c-9022-ffdc343a94bc', this.data2Mock, {district,endTime,startTime});
  }
  // 事件流转-平台处置分析|事件流转-平台处置分析-一张图-事件流转
  postPlatformHandleAnalysis(params: IpostPlatformHandleAnalysisSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/event/flow/platformHandleAnalysis`;
      return requestHelper.postRequestData<IpostPlatformHandleAnalysisSpace.Model>(url, 'c83d761d-fbc3-4826-ade5-4b2be2447fa5', this.data2Mock, params);
  }
  // 事件流转-平台总览|事件流转-平台总览-一张图-事件流转
  postPlatformOverview(params: IpostPlatformOverviewSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/event/flow/platformOverview`;
      return requestHelper.postRequestData<IpostPlatformOverviewSpace.Model>(url, 'a11876a7-f9e6-4b1b-aff9-45ba86ec6067', this.data2Mock, params);
  }
}
export const apiEventFlowObj = new Event_flowApi();
