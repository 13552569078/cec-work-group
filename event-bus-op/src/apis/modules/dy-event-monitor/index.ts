import { requestHelper } from "@/apis/base/mapper-helper";
import { IpostStatisticsSpace,IpostPageSpace,IpostLatestListSpace } from './model';
import { GlobalAPI } from '@/common';
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = GlobalAPI.config.API_PREFIX_OP;

/**
 * 数据访问，此类代码生成器生成
 */
class EventMonitorApi {
  data2Mock: boolean = false;
   // 事件监控-统计|事件监控-统计-一张图-首页
   postStatistics(params: IpostStatisticsSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/monitor/statistics`;
    return requestHelper.postRequestData<IpostStatisticsSpace.Model>(url, '383a4f1c-c85c-4e91-a95e-6580d03c69ef', this.data2Mock, params);
  }
  // 事件监控-事件分页列表|事件监控-事件分页列表-一张图-首页
  postPage(params: IpostPageSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/event/monitor/list/page`;
      return requestHelper.postRequestData<IpostPageSpace.Model>(url, '4684b68b-f8b3-440e-839f-355826212149', this.data2Mock, params);
  }
  // 事件监控-最新事件列表|事件监控-最新事件列表-一张图-首页
  postLatestList(params: IpostLatestListSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/event/monitor/latestList`;
      return requestHelper.postRequestData<IpostLatestListSpace.Model>(url, '383a4f1c-c85c-4e91-a95e-6580d03c69ef', this.data2Mock, params);
  }
}
export const apiEventMonitorObj = new EventMonitorApi();