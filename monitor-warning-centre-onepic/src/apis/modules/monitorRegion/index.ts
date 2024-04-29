import { requestHelper } from '@/apis/base/mapper-helper';
import { IgetRegionListSpace, IpostUpdateSpace, IpostUpdateGisOutlineSpace, IgetRegionSimpleListSpace, IgetOutlineSpace, IaddSpace, IpostPageSpace, IdeleteMSpace, IgetMonitorRegionSpace } from './model';
import { GlobalAPI } from '@/common';
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = GlobalAPI.config.API_PREFIX_CENTRE_CONFIG;

/**
 * 数据访问，此类代码生成器生成
 */
class MonitorRegionApi {
  data2Mock: boolean = false;

  // 监测点-监测主体列表|监测点-监测主体列表-监测主体
  getRegionList () {
    const url = `${API_DOMAIN}${API_PREFIX}/monitorRegion/regionList`;
    return requestHelper.getRequestData<IgetRegionListSpace.Model>(url, '9c38401b-b11d-43ef-814c-18ef0241657b', this.data2Mock);
  }
  // 监测主体-修改|监测主体-修改-监测主体
  postUpdate (params: IpostUpdateSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/monitorRegion/update`;
    return requestHelper.postRequestData<IpostUpdateSpace.Model>(url, '85174823-9dad-403d-8f76-b937a71a6421', this.data2Mock, params);
  }
  // 监测主体-更新轮廓信息|监测主体-更新轮廓信息-监测主体
  postUpdateGisOutline (regionId: number, gisOutlineList: []) {
    const url = `${API_DOMAIN}${API_PREFIX}/monitorRegion/updateGisOutline`;
    return requestHelper.postRequestData<IpostUpdateGisOutlineSpace.Model>(url, 'd8275a43-9023-4779-bbfd-e0f655672274', this.data2Mock, { regionId, gisOutlineList });
  }
  // 监测主体下拉框列表|监测主体下拉框列表-监测主体
  getRegionSimpleList (regionName: string) {
    const url = `${API_DOMAIN}${API_PREFIX}/monitorRegion/regionSimpleList?regionName=${regionName}`;
    return requestHelper.getRequestData<IgetRegionSimpleListSpace.Model>(url, '6a729a8b-903e-4990-83c4-a442fee9e8e0', this.data2Mock);
  }
  // 监测主体-主体轮廓|监测主体-主体轮廓-监测主体
  getOutline (regionId: number) {
    const url = `${API_DOMAIN}${API_PREFIX}/monitorRegion/outline/${regionId}`;
    return requestHelper.getRequestData<IgetOutlineSpace.Model>(url, 'bfde49c4-b137-464e-8489-be7e2b0308c1', this.data2Mock);
  }
  // 监测主体-新增|监测主体-新增-监测主体
  add (params: IaddSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/monitorRegion/add`;
    return requestHelper.postRequestData<IaddSpace.Model>(url, '57e3ffa8-4140-42f5-850b-f9b81e57a740', this.data2Mock, params);
  }
  // 监测主体-分页查询|监测主体-分页查询-监测主体
  postPage (params: IpostPageSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/monitorRegion/page`;
    return requestHelper.postRequestData<IpostPageSpace.Model>(url, '6bdc933b-831d-4d5a-8fce-91b9b3adac8e', this.data2Mock, params);
  }
  // 监测主体-删除|监测主体-删除-监测主体
  deleteM (id: number) {
    const url = `${API_DOMAIN}${API_PREFIX}/monitorRegion/delete/${id}`;
    return requestHelper.deleteRequestData<IdeleteMSpace.Model>(url, 'c360b3e0-6684-4f6a-aca9-ceebfd680fc9', this.data2Mock);
  }
  // 监测主体-明细|监测主体-明细-监测主体
  getMonitorRegion (id: number|string) {
    const url = `${API_DOMAIN}${API_PREFIX}/monitorRegion/${id}`;
    return requestHelper.getRequestData<IgetMonitorRegionSpace.Model>(url, 'bf10b8c7-68d5-4311-b2c6-5f1990627125', this.data2Mock);
  }

  Run (methodName: string, params: any) {
    let result: any = new Promise(() => ({ data: {} }));
    switch (methodName) {

      case 'getRegionList':
        result = this.getRegionList();
        break;

      case 'postUpdate':
        result = this.postUpdate(params as IpostUpdateSpace.RequestParams);
        break;

      case 'postUpdateGisOutline':
        {
          const { regionId, gisOutlineList } = params;
          result = this.postUpdateGisOutline(regionId, gisOutlineList);
        }
        break;

      case 'getRegionSimpleList':
        {
          const { regionName } = params;
          result = this.getRegionSimpleList(regionName);
        }
        break;

      case 'getOutline':
        {
          const { regionId } = params;
          result = this.getOutline(regionId);
        }
        break;

      case 'add':
        result = this.add(params as IaddSpace.RequestParams);
        break;

      case 'postPage':
        result = this.postPage(params as IpostPageSpace.RequestParams);
        break;

      case 'deleteM':
        {
          const { id } = params;
          result = this.deleteM(id);
        }
        break;

      case 'getMonitorRegion':
        {
          const { id } = params;
          result = this.getMonitorRegion(id);
        }
        break;

      default:
        break;
    }
    return result;
  }
}
export const apiMonitorRegionObj = new MonitorRegionApi();
