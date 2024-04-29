import { requestHelper } from "@/apis/base/mapper-helper";
import { IpostReceiveStatSpace, IlistSpace, IpostOverTimeStatSpace, IpostCollDisposalRateSpace, IpostEmergencyRateSpace, IpostEmergencyAssignedDestStatSpace, IpostCollaborativeDestStatSpace, IpostAssignedDestStatSpace, IpostHandlingListPageSpace, IpostAbnormalListPageSpace, IpostStatSpace, IpostHandlingStatSpace } from './model';
import { GlobalAPI } from '@/common';
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = GlobalAPI.config.API_PREFIX_OP;

/**
 * 数据访问，此类代码生成器生成
 */
class IndexPagePendingApi {
  data2Mock: boolean = false;

  // 处置中-高频事件处置超时统计|处置中-高频事件处置超时统计-一张图-处置中
  postOverTimeStat (params: IpostOverTimeStatSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/handling/highFreq/disposal/overTime/stat`;
    return requestHelper.postRequestData<IpostOverTimeStatSpace.Model>(url, 'de2002bb-8f2a-4bc7-8ecd-84c5277549c7', this.data2Mock, params);
  }
  // 处置中-事件列表|处置中-事件列表-一张图-处置中
  postHandlingListPage (params: IpostHandlingListPageSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/handling/list/page`;
    return requestHelper.postRequestData<IpostHandlingListPageSpace.Model>(url, '180332e5-6175-4ee0-b213-705734758d0e', this.data2Mock, params);
  }
  // 处置中-高频事件接收量统计|处置中-高频事件接收量统计-一张图-处置中
  postReceiveStat (params: IpostReceiveStatSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/handling/highFreq/receive/stat`;
    return requestHelper.postRequestData<IpostReceiveStatSpace.Model>(url, '72b8f20c-7a14-4f95-81a3-ac057e82734c', this.data2Mock, params);
  }
  // 处置中-协同对象统计|处置中-协同对象统计-一张图-处置中
  postHandlingStat (params: IpostHandlingStatSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/handling/collaborative/object/stat`;
    return requestHelper.postRequestData<IpostHandlingStatSpace.Model>(url, 'd92237b1-ae14-4687-a59c-8743427531cb', this.data2Mock, params);
  }
  // 处置中-紧急事件列表|处置中-紧急事件列表-一张图-处置中
  list (params: IlistSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/handling/emergency/list`;
    return requestHelper.postRequestData<IlistSpace.Model>(url, '2a206316-afae-457b-a932-243dc51f3c9b', this.data2Mock, params);
  }
  // 处置中-跨部门协同处置事件占比|处置中-跨部门协同处置事件占比-一张图-处置中
  postCollDisposalRate (params: IpostCollDisposalRateSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/handling/collDisposal/rate`;
    return requestHelper.postRequestData<IpostCollDisposalRateSpace.Model>(url, '6ad57339-2713-4048-8c9a-b1867886e0b9', this.data2Mock, params);
  }
  // 处置中-协同事件去向统计|处置中-协同事件去向统计-一张图-处置中
  postCollaborativeDestStat (params: IpostCollaborativeDestStatSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/handling/collaborative/dest/stat`;
    return requestHelper.postRequestData<IpostCollaborativeDestStatSpace.Model>(url, '41233288-e09c-4d8c-95f2-5e3b720559ef', this.data2Mock, params);
  }
  // 处置中-交办去向统计|处置中-交办去向统计-一张图-处置中
  postAssignedDestStat (params: IpostAssignedDestStatSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/handling/assignedDest/stat`;
    return requestHelper.postRequestData<IpostAssignedDestStatSpace.Model>(url, '0d4140ff-52dc-4736-b646-5caaf0ecc6a7', this.data2Mock, params);
  }
  // 处置中-紧急事件去向统计|处置中-紧急事件去向统计-一张图-处置中
  postEmergencyAssignedDestStat (params: IpostEmergencyAssignedDestStatSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/handling/emergency/assignedDest/stat`;
    return requestHelper.postRequestData<IpostEmergencyAssignedDestStatSpace.Model>(url, '81901f3e-d0ab-4a5c-af9b-f987c3c03ffc', this.data2Mock, params);
  }
  // 处置中-事件统计|处置中-事件统计-一张图-处置中
  postStat (params: IpostStatSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/handling/stat`;
    return requestHelper.postRequestData<IpostStatSpace.Model>(url, '423cf411-70d1-4142-a1c4-fe7a57e017ef', this.data2Mock, params);
  }
  // 处置中-异常事件列表|处置中-异常事件列表-一张图-处置中
  postAbnormalListPage (params: IpostAbnormalListPageSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/handling/abnormal/list/page`;
    return requestHelper.postRequestData<IpostAbnormalListPageSpace.Model>(url, '3c79f29e-3e89-4383-b40b-52430d75ef9a', this.data2Mock, params);
  }
  // 处置中-紧急事件占比|处置中-紧急事件占比-一张图-处置中
  postEmergencyRate (params: IpostEmergencyRateSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/handling/emergency/rate`;
    return requestHelper.postRequestData<IpostEmergencyRateSpace.Model>(url, 'f83afa68-03d4-49d8-873d-293b6e0cceb8', this.data2Mock, params);
  }
}
export const apiIndexPagePendingObj = new IndexPagePendingApi();