import { requestHelper } from "@/apis/base/mapper-helper";
import { IpostPlatformStatSpace, IpostEndStatSpace, IpostHandleTimeSpace, IpostOverTimeStatSpace, IpostEndListPageSpace, IpostCollaborativeDestStatSpace, IpostCollDisposalRateSpace, IpostCollaborativeObjectStatSpace, IpostReceiveStatSpace, IpostHandleEfficientSpace } from './model';
import { GlobalAPI } from '@/common';
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = GlobalAPI.config.API_PREFIX_OP;

/**
 * 数据访问，此类代码生成器生成
 */
class IndexPageFinishedApi {
  data2Mock: boolean = false;

  // 已办结-高频事件处置超时统计|已办结-高频事件处置超时统计-一张图-处置完成
  postOverTimeStat (params: IpostOverTimeStatSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/end/highFreq/disposal/overTime/stat`;
    return requestHelper.postRequestData<IpostOverTimeStatSpace.Model>(url, 'e919b659-155c-4dd9-b95e-73a5ccd6438c', this.data2Mock, params);
  }
  // 已办结-事件列表|已办结-事件列表-一张图-处置完成
  postEndListPage (params: IpostEndListPageSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/end/list/page`;
    return requestHelper.postRequestData<IpostEndListPageSpace.Model>(url, 'db6a9639-4c77-4328-ac5f-5dab1463269d', this.data2Mock, params);
  }
  // 已办结-处置用时统计|已办结-处置用时统计-一张图-处置完成
  postHandleTime (params: IpostHandleTimeSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/end/handleTime`;
    return requestHelper.postRequestData<IpostHandleTimeSpace.Model>(url, '17817d33-0bec-4a59-8464-8723fa6ff5ca', this.data2Mock, params);
  }
  // 已办结-跨部门协同处置事件占比|已办结-跨部门协同处置事件占比-一张图-处置完成
  postCollDisposalRate (params: IpostCollDisposalRateSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/end/collDisposal/rate`;
    return requestHelper.postRequestData<IpostCollDisposalRateSpace.Model>(url, '91f08b37-b07c-4cbe-a975-c6696bda06a8', this.data2Mock, params);
  }
  // 已办结-协同事件去向统计|已办结-协同事件去向统计-一张图-处置完成
  postCollaborativeDestStat (params: IpostCollaborativeDestStatSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/end/collaborative/dest/stat`;
    return requestHelper.postRequestData<IpostCollaborativeDestStatSpace.Model>(url, 'b1f96e94-c972-4957-a852-b347ae602d72', this.data2Mock, params);
  }
  // 已办结-协同对象统计|已办结-协同对象统计-一张图-处置完成
  postCollaborativeObjectStat (params: IpostCollaborativeObjectStatSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/end/collaborative/object/stat`;
    return requestHelper.postRequestData<IpostCollaborativeObjectStatSpace.Model>(url, '49aa0e18-11a7-470f-885a-9ed033b52b6f', this.data2Mock, params);
  }
  // 已办结-事件统计|已办结-事件统计-一张图-处置完成
  postEndStat (params: IpostEndStatSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/end/stat`;
    return requestHelper.postRequestData<IpostEndStatSpace.Model>(url, 'e2b70b1b-1b18-4a30-81b3-5a9ffbc6b900', this.data2Mock, params);
  }
  // 已办结-高频事件接收量统计|已办结-高频事件接收量统计-一张图-处置完成
  postReceiveStat (params: IpostReceiveStatSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/end/highFreq/receive/stat`;
    return requestHelper.postRequestData<IpostReceiveStatSpace.Model>(url, 'd03ce812-6533-4de9-b800-b6d096662b81', this.data2Mock, params);
  }
  // 已办结-处置效率统计|已办结-处置效率统计-一张图-处置完成
  postHandleEfficient (params: IpostHandleEfficientSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/end/handleEfficient`;
    return requestHelper.postRequestData<IpostHandleEfficientSpace.Model>(url, '0d913f47-4684-414f-a889-4e6681430b6e', this.data2Mock, params);
  }
  // 已办结-办理平台统计|已办结-办理平台统计-一张图-处置完成
  postPlatformStat (params: IpostPlatformStatSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/end/platform/stat`;
    return requestHelper.postRequestData<IpostPlatformStatSpace.Model>(url, '5271f723-c79c-4cb4-abab-9c1bebc4d7b7', this.data2Mock, params);
  }
}
export const apiIndexPageFinishedObj = new IndexPageFinishedApi();
