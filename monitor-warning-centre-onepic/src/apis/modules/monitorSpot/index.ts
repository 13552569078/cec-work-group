import { requestHelper } from '@/apis/base/mapper-helper';
import { IgetMonitorPointSpace, IdeleteMSpace, IgetUpdateSpace, IgetPageSpace, IaddSpace } from './model';
import { GlobalAPI } from '@/common';
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = GlobalAPI.config.API_PREFIX_CENTRE_CONFIG;

/**
 * 数据访问，此类代码生成器生成
 */
class MonitorSpotApi {
  data2Mock: boolean = false;

  // 监测点-明细|监测点-明细-监测点
  getMonitorPoint (id: number) {
    const url = `${API_DOMAIN}${API_PREFIX}/monitorPoint/${id}`;
    return requestHelper.getRequestData<IgetMonitorPointSpace.Model>(url, '5793c729-e5e1-4dd6-a5aa-e0115e2b42a4', this.data2Mock);
  }
  // 监测点-删除|监测点-删除-监测点
  deleteM (id: number) {
    const url = `${API_DOMAIN}${API_PREFIX}/monitorPoint/delete/${id}`;
    return requestHelper.deleteRequestData<IdeleteMSpace.Model>(url, 'b3f72844-f9c0-4063-93fa-32d50510c5a6', this.data2Mock);
  }
  // 监测点-修改|监测点-修改-监测点
  getUpdate (params: IgetUpdateSpace.RequestParams) {
    const { id, regionId, pointName, eventTypeCode, address, longitude, latitude, description, monitorUnitId, warningUnitId, equipIdList } = params;
    const url = `${API_DOMAIN}${API_PREFIX}/monitorPoint/update?id=${id}&regionId=${regionId}&pointName=${pointName}&eventTypeCode=${eventTypeCode}&address=${address}&longitude=${longitude}&latitude=${latitude}&description=${description}&monitorUnitId=${monitorUnitId}&warningUnitId=${warningUnitId}&equipIdList=${equipIdList}`;
    return requestHelper.getRequestData<IgetUpdateSpace.Model>(url, '732ecb63-f962-4afb-9dab-590aa22c1cd7', this.data2Mock);
  }
  // 监测点-分页查询|监测点-分页查询-监测点
  getPage (params: IgetPageSpace.RequestParams) {
    const { currentPage, pageSize, regionId, regionTypeCode } = params;
    const url = `${API_DOMAIN}${API_PREFIX}/monitorPoint/page?currentPage=${currentPage}&pageSize=${pageSize}&regionId=${regionId}&regionTypeCode=${regionTypeCode}`;
    return requestHelper.getRequestData<IgetPageSpace.Model>(url, '145085b1-b333-42a0-8a1a-ce134a025ad0', this.data2Mock);
  }
  // 监测点-新增|监测点-新增-监测点
  add (params: IaddSpace.RequestParams) {
    const { id, regionId, pointName, eventTypeCode, address, longitude, latitude, description, monitorUnitId, warningUnitId, equipIdList } = params;
    const url = `${API_DOMAIN}${API_PREFIX}/monitorPoint/add?id=${id}&regionId=${regionId}&pointName=${pointName}&eventTypeCode=${eventTypeCode}&address=${address}&longitude=${longitude}&latitude=${latitude}&description=${description}&monitorUnitId=${monitorUnitId}&warningUnitId=${warningUnitId}&equipIdList=${equipIdList}`;
    return requestHelper.getRequestData<IaddSpace.Model>(url, 'a3eae8aa-108b-43e6-8c19-940fe3ad26e0', this.data2Mock);
  }

  Run (methodName: string, params: any) {
    let result: any = new Promise(() => ({ data: {} }));
    switch (methodName) {

      case 'getMonitorPoint':
        {
          const { id } = params;
          result = this.getMonitorPoint(id);
        }
        break;

      case 'deleteM':
        {
          const { id } = params;
          result = this.deleteM(id);
        }
        break;

      case 'getUpdate':
        result = this.getUpdate(params as IgetUpdateSpace.RequestParams);
        break;

      case 'getPage':
        result = this.getPage(params as IgetPageSpace.RequestParams);
        break;

      case 'add':
        result = this.add(params as IaddSpace.RequestParams);
        break;

      default:
        break;
    }
    return result;
  }
}
export const apiMonitorSpotObj = new MonitorSpotApi();
