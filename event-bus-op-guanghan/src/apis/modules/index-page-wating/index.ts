import { requestHelper } from "@/apis/base/mapper-helper";
import { IpostTimeAnalysisSpace,IpostUrgentRateSpace,IpostOverviewSpace,IpostPageSpace,IpostPlatformSpace,IpostHotEventSpace,IpostUrgentListSpace } from './model';
import { GlobalAPI } from '@/common';
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = GlobalAPI.config.API_PREFIX_OP;

/**
 * 数据访问，此类代码生成器生成
 */
class IndexPageWaitingApi {
  data2Mock: boolean = false;

  // 调度用时|调度用时-一张图-待调度
  postTimeAnalysis(params: IpostTimeAnalysisSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/event/preDispatche/timeAnalysis`;
      return requestHelper.postRequestData<IpostTimeAnalysisSpace.Model>(url, '9a60c368-7d02-4e26-a02b-d74896f5e014', this.data2Mock, params);
  }
  // 紧急事件占比|紧急事件占比-一张图-待调度
  postUrgentRate(params: IpostUrgentRateSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/event/preDispatche/urgentRate`;
      return requestHelper.postRequestData<IpostUrgentRateSpace.Model>(url, '3dca3740-4b01-4fd2-85fd-61c8a3629b7a', this.data2Mock, params);
  }
  // 事件统计|事件统计-一张图-待调度
  postOverview(params: IpostOverviewSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/event/preDispatche/overview`;
      return requestHelper.postRequestData<IpostOverviewSpace.Model>(url, 'db0713a6-8fcd-4538-970a-509849a65fbc', this.data2Mock, params);
  }
  // 事件列表-分页|事件列表-分页-一张图-待调度
  postPage(params: IpostPageSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/event/preDispatche/list/page`;
      return requestHelper.postRequestData<IpostPageSpace.Model>(url, '604f49c3-158e-45e1-8bab-922683f34030', this.data2Mock, params);
  }
  // 事件来源|事件来源-一张图-待调度
  postPlatform(params: IpostPlatformSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/event/preDispatche/platform`;
      return requestHelper.postRequestData<IpostPlatformSpace.Model>(url, '230e9604-5e05-4533-bf23-28a8d92130a1', this.data2Mock, params);
  }
  // 待调度-高频事件|待调度-高频事件-一张图-待调度
  postHotEvent(params: IpostHotEventSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/preDispatche/hotEvent`;
    return requestHelper.postRequestData<IpostHotEventSpace.Model>(url, 'b3fdc02b-476a-4728-9944-06eeac6560ec', this.data2Mock, params);
}
  // 紧急事件-简列|紧急事件-简列-一张图-待调度
  postUrgentList(params: IpostUrgentListSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/event/preDispatche/urgentList`;
      return requestHelper.postRequestData<IpostUrgentListSpace.Model>(url, '18dffe33-0eca-40f9-8f6c-9c4f3b1b13cd', this.data2Mock, params);
  }
}
export const apiIndexPageWaitingObj = new IndexPageWaitingApi();
