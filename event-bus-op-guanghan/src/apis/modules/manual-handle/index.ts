import { requestHelper } from '@/apis/base/mapper-helper';
import { IgetListSpace } from './model';
import { GlobalAPI } from '@/common';
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = GlobalAPI.config.API_PREFIX_OP;

/**
 * 数据访问，此类代码生成器生成
 */
class ManualHanleApi {
  data2Mock = false;
  // 手动流转列表
  screenList (params: IgetListSpace.RequestParams) {
    const { eventState, pageNum, createBeginTime, createEndTime, district, platformSrc, pageSize } = params;
    const url = `${API_DOMAIN}${API_PREFIX}/tcEvent/manager/manualEventListForScreen?eventState=${eventState}&pageNum=${pageNum}&createBeginTime=${createBeginTime}&createEndTime=${createEndTime}&district=${district}&platformSrc=${platformSrc}&pageSize=${pageSize}`;
    return requestHelper.getRequestData<IgetListSpace.Model>(url, '98ef70d2-76dc-4c8a-9a9f-fb768b893a5e', this.data2Mock)
  }

  list (params: IgetListSpace.RequestParams) {
    const { eventState, pageNum } = params;
    const url = `${API_DOMAIN}${API_PREFIX}/tcEvent/manager/manualEventList?eventState=${eventState}&pageNum=${pageNum}`;
    return requestHelper.getRequestData<IgetListSpace.Model>(url, '98ef70d2-76dc-4c8a-9a9f-fb768b893a5e', this.data2Mock)
  }
  detail (id:string) {
    const url = `${API_DOMAIN}${API_PREFIX}/tcEvent/${id}`;
    return requestHelper.getRequestData<any>(url, '98ef70d2-76dc-4c8a-9a9f-fb768b893a5e', this.data2Mock)
  }
  postManualHandleUpdate(params: any) {
    const url = `${API_DOMAIN}${API_PREFIX}/tcEvent/manualHandle`;
    return requestHelper.postRequestData<any>(url, 'dfad9800-b35d-4c43-82c8-25eb0a6dde69', this.data2Mock, params);
  }
  selectMinByPlatFrom(params: any){
    const { platformSrc, sysFlag, type } = params;
    const url = `${API_DOMAIN}${API_PREFIX}/eventType/selectMinByPlatFrom?platformSrc=${platformSrc}&sysFlag=${sysFlag}&type=${type}`;
    return requestHelper.getRequestData<any>(url, '98ef70d2-76dc-4c8a-9a9f-fb768b893a5e', this.data2Mock)
  }
  getTcDictDataZiDian(params: any){
    const { dictType } = params;
    const url = `${API_DOMAIN}${API_PREFIX}/tcDictData?dictType=${dictType}`;
    return requestHelper.getRequestData<any>(url, '98ef70d2-76dc-4c8a-9a9f-fb768b893a5e', this.data2Mock)
  }
  getTcDictDataZiDianAll(params: any){
    const { dictType } = params;
    const url = `${API_DOMAIN}${API_PREFIX}/tcDictData/all?dictType=${dictType}`;
    return requestHelper.getRequestData<any>(url, '98ef70d2-76dc-4c8a-9a9f-fb768b893a5e', this.data2Mock)
  }
  postManualHandleSubmit(params: any) {
    const url = `${API_DOMAIN}${API_PREFIX}/tcEvent/manager/manual/add`;
    return requestHelper.postRequestData<any>(url, 'dfad9800-b35d-4c43-82c8-25eb0a6dde69', this.data2Mock, params);
  }
}
export const apiManualHanleObj = new ManualHanleApi()
