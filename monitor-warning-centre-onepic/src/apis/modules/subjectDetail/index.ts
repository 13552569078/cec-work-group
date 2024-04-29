import { requestHelper } from "@/apis/base/mapper-helper";
import { IgetMonitorRegionSpace, IgetFindMonitorEventPointSpace } from './model';
import { GlobalAPI } from '@/common';
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = GlobalAPI.config.API_PREFIX_CENTRE_CONFIG;

/**
 * 数据访问，此类代码生成器生成
 */
class SubjectApi {
  data2Mock: boolean = false;


  // 查询监测事件的监测点信息|查询监测事件的监测点信息-AccessDataController
  getFindMonitorEventPoint(eventId:number|string,pointId:number|string,useFor:number|String) {
    const url = `${API_DOMAIN}${API_PREFIX}/accessData/findMonitorEventPoint?eventId=${eventId}&pointId=${pointId}&useFor=${useFor}`;
    return requestHelper.getRequestData<IgetFindMonitorEventPointSpace.Model>(url, 'b8c0ac43-640e-4aa8-ab92-ea4427c24e0b', this.data2Mock);
  }

  // 监测主体-明细|监测主体-明细-监测主体
  getMonitorRegion(id:string) {
      const url = `${API_DOMAIN}${API_PREFIX}/monitorRegion/${id}`;
      return requestHelper.getRequestData<IgetMonitorRegionSpace.Model>(url, '8ba2c6a6-d726-4dd8-b805-4f3f230d79a1', this.data2Mock);
  }

  Run(methodName: string, params: any) {
    let result:any = new Promise(() => ({ data: {} }));
    switch (methodName) {

    case "getMonitorRegion":
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
export const apiSubjectObj = new SubjectApi();
