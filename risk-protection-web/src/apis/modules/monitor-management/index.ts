import { requestHelper } from '@/apis/base/mapper-helper';
import { IpostFindMonitorInfoPageSpace } from './model';
import { GlobalAPI } from '@/common';
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = GlobalAPI.config.API_RISK_PROTECTION_SERVER;

/**
 * 数据访问，此类代码生成器生成
 */
class MonitorManagementApi {
  data2Mock: boolean = false;
  
  // 监控信息-列表|监控信息-列表-监控信息
  postFindMonitorInfoPage(params: IpostFindMonitorInfoPageSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/monitor/findMonitorInfoPage`;
      return requestHelper.postRequestData<IpostFindMonitorInfoPageSpace.Model>(url, 'b34335d1-7fe3-4b93-be06-87a5d2a5b7ba', this.data2Mock, params);
  }
}
export const apiMonitorManagementObj = new MonitorManagementApi();