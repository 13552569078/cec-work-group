import { requestHelper } from '@/apis/base/mapper-helper';
import { IlistSpace, IpostUpdateSpace, IdeleteMSpace, IaddSpace } from './model';
import { GlobalAPI } from '@/common';
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = GlobalAPI.config.API_PREFIX_CENTRE_CONFIG;

/**
 * 数据访问，此类代码生成器生成
 */
class MonitorRegionTypeApi {
  data2Mock: boolean = false;

  // 监测主体类型-列表|监测主体类型-列表-监测主体类型
  list () {
    const url = `${API_DOMAIN}${API_PREFIX}/monitorRegionType/list`;
    return requestHelper.getRequestData<IlistSpace.Model>(url, '637f67b3-3237-44df-a70f-3d80e1b0e4ba', this.data2Mock);
  }
  // 监测主体类型-修改|监测主体类型-修改-监测主体类型
  postUpdate (id: number, regionTypeName: string, description: string) {
    const url = `${API_DOMAIN}${API_PREFIX}/monitorRegionType/update`;
    return requestHelper.postRequestData<IpostUpdateSpace.Model>(url, '6f9de44c-486c-47c8-8993-a854896f15cb', this.data2Mock, { id, regionTypeName, description });
  }
  // 监测主体类型-删除|监测主体类型-删除-监测主体类型
  deleteM (id: number) {
    const url = `${API_DOMAIN}${API_PREFIX}/monitorRegionType/delete/${id}`;
    return requestHelper.deleteRequestData<IdeleteMSpace.Model>(url, '29bbf2a2-fc38-4bb3-ba89-792332f7902d', this.data2Mock);
  }
  // 监测主体类型-新增|监测主体类型-新增-监测主体类型
  add (id: number, regionTypeName: string, description: string) {
    const url = `${API_DOMAIN}${API_PREFIX}/monitorRegionType/add`;
    return requestHelper.postRequestData<IaddSpace.Model>(url, 'da32f5cc-964e-4cd3-9787-3710c41811d8', this.data2Mock, { id, regionTypeName, description });
  }

  Run (methodName: string, params: any) {
    let result: any = new Promise(() => ({ data: {} }));
    switch (methodName) {

      case 'list':
        result = this.list();
        break;

      case 'postUpdate':
        {
          const { id, regionTypeName, description } = params;
          result = this.postUpdate(id, regionTypeName, description);
        }
        break;

      case 'deleteM':
        {
          const { id } = params;
          result = this.deleteM(id);
        }
        break;

      case 'add':
        {
          const { id, regionTypeName, description } = params;
          result = this.add(id, regionTypeName, description);
        }
        break;

      default:
        break;
    }
    return result;
  }
}
export const apiMonitorRegionTypeObj = new MonitorRegionTypeApi();