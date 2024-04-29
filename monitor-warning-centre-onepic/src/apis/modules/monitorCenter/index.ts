import { requestHelper } from "@/apis/base/mapper-helper";
import { IgetFindAccessDatePageSpace, IgetFindMonitorDataPageSpace, IgetListMonitorPointTreeVOsSpace,IgetListMonitorEventMapsSpace,IgetListMonitorPointMapVOsSpace,IgetFindCurrentWarningNumberSpace,IgetListMonitorIotEquipsSpace,IgetListMonitorFactorDataListSpace,IgetFindMonitorEventDetailSpace,IgetFindMonitorEventPointSpace,IgetListRegionTypeListVOsSpace,IgetListMonitorEquipListMapVOsSpace,IgetFindWarningInfoListPageSpace,IgetListMonitorVideosSpace,IgetListMonitorDataListSpace,IgetListMonitorRegionMapVOsSpace,IgetListWarningInfoListVOsSpace,IgetListEventTypeListVOsSpace } from './model';
import { GlobalAPI } from '@/common';
import {point} from "@hongtu-next/util";
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = GlobalAPI.config.API_PREFIX_CENTRE_CONFIG;


/**
 * 数据访问，此类代码生成器生成
 */
class MonitorCenterApi {
  data2Mock: boolean = false;

  // 查询监测点树|查询监测点树-监测-预警中心API
  getListMonitorPointTreeVOs(useFor:number,regionTypeCodeList: string[],eventTypeCodeList: string[]) {
      const url = `${API_DOMAIN}${API_PREFIX}/monitor/listMonitorPointTreeVOs?regionTypeCodeList=${regionTypeCodeList}&eventTypeCodeList=${eventTypeCodeList}`;
      return requestHelper.getRequestData<IgetListMonitorPointTreeVOsSpace.Model>(url, 'e47d2955-6080-4a0c-8f04-7742ee4d75a5', this.data2Mock);
  }
  // 查询监测事件打点信息|查询监测事件打点信息-监测-预警中心API
  getListMonitorEventMaps(params = {
    regionTypeCodeList: '',
    eventTypeCodeList: '',
    monitorRegionId: ''
  }) {
      const { regionTypeCodeList,eventTypeCodeList,monitorRegionId} = params;
      const url = `${API_DOMAIN}${API_PREFIX}/monitor/listMonitorEventMaps?regionTypeCodeList=${regionTypeCodeList}&eventTypeCodeList=${eventTypeCodeList}&monitorRegionId=${monitorRegionId}`;
      return requestHelper.getRequestData<IgetListMonitorEventMapsSpace.Model>(url, '9d84e9dc-c394-4a7e-9a88-19debf0d1e96', this.data2Mock);
  }
  // 查询监测点打点信息|查询监测点打点信息-监测-预警中心API
  getListMonitorPointMapVOs(params: IgetListMonitorPointMapVOsSpace.RequestParams) {
      const {useFor,regionTypeCodeList,eventTypeCodeList,monitorRegionId} = params;
      const url = `${API_DOMAIN}${API_PREFIX}/monitor/listMonitorPointMapVOs?useFor=${useFor}&regionTypeCodeList=${regionTypeCodeList}&eventTypeCodeList=${eventTypeCodeList}&monitorRegionId=${monitorRegionId}`;
      return requestHelper.getRequestData<IgetListMonitorPointMapVOsSpace.Model>(url, '3ec16f06-a295-4c6e-93fb-ffa5b7b99c7c', this.data2Mock);
  }
  // 获取当前报警数|获取当前报警数-监测-预警中心API
  getFindCurrentWarningNumber(useFor?:number) {
      const url = `${API_DOMAIN}${API_PREFIX}/monitor/findCurrentWarningNumber?useFor=${useFor}`;
      return requestHelper.getRequestData<IgetFindCurrentWarningNumberSpace.Model>(url, '9af82b23-da35-44fd-b709-d70e2dec1c2f', this.data2Mock);
  }
  // 查询物联设备列表|查询物联设备列表-监测-预警中心API
  getListMonitorIotEquips(useFor:number,regionTypeCodeList:[],eventTypeCodeList:[]) {
      const url = `${API_DOMAIN}${API_PREFIX}/monitor/listMonitorIotEquips?useFor=${useFor}&regionTypeCodeList=${regionTypeCodeList}&eventTypeCodeList=${eventTypeCodeList}`;
      return requestHelper.getRequestData<IgetListMonitorIotEquipsSpace.Model>(url, '4d4988ec-ef5f-4039-916d-4bf3b04ba7ff', this.data2Mock);
  }
  // 查询监测事件的监测数据(图形展示)|查询监测事件的监测数据(图形展示)-监测-预警中心API
  getListMonitorFactorDataList(params: IgetListMonitorFactorDataListSpace.RequestParams) {
      const {currentPage,pageSize,useFor,eventId,startTime,endTime, pointId} = params;
      const url = `${API_DOMAIN}${API_PREFIX}/accessData/listUnitIntervalAlarmMonitorData?currentPage=${currentPage}&pageSize=${pageSize}&eventId=${eventId}&startTime=${startTime}&endTime=${endTime}&pointId=${pointId}`;
      return requestHelper.getRequestData<IgetListMonitorFactorDataListSpace.Model>(url, '6e7cbaab-0071-4d90-abb6-305ba8640895', this.data2Mock);
  }
  // 查询监测事件详情|查询监测事件详情-监测-预警中心API
  getFindMonitorEventDetail(eventId:string) {
      const url = `${API_DOMAIN}${API_PREFIX}/monitor/findMonitorEventDetail?eventId=${eventId}`;
      return requestHelper.getRequestData<IgetFindMonitorEventDetailSpace.Model>(url, '88f95543-f139-4ff1-b535-e8eb6a507486', this.data2Mock);
  }
  // 查询监测事件的监测点信息|查询监测事件的监测点信息-监测-预警中心API TODO 等待替换
  getFindMonitorEventPoint(eventId:string, pointId: string) {
      const url = `${API_DOMAIN}${API_PREFIX}/monitor/findMonitorEventPoint?eventId=${eventId}&pointId=${pointId}`;
      return requestHelper.getRequestData<IgetFindMonitorEventPointSpace.Model>(url, 'f3ac40f6-cf45-4ff9-83a9-af5a5484a891', this.data2Mock);
  }
  // 监测布控-查询监测主体类型列表|监测布控-查询监测主体类型列表-监测-预警中心API
  getListRegionTypeListVOs(useFor?:number) {
      const url = `${API_DOMAIN}${API_PREFIX}/monitor/listRegionTypeListVOs?useFor=${useFor}`;
      return requestHelper.getRequestData<IgetListRegionTypeListVOsSpace.Model>(url, 'bb902fc5-661f-4cc2-b864-31397a9ee7da', this.data2Mock);
  }
  // 查询监测点设备列表|查询监测点设备列表-监测-预警中心API
  getListMonitorEquipListMapVOs(monitorPointId:string, useFor?:number,) {
      const url = `${API_DOMAIN}${API_PREFIX}/monitor/listMonitorEquipListMapVOs?useFor=${useFor}&monitorPointId=${monitorPointId}`;
      return requestHelper.getRequestData<IgetListMonitorEquipListMapVOsSpace.Model>(url, '0f242ddf-8cd2-4212-b434-69f9eb8a7b0e', this.data2Mock);
  }
  // 查询报警信息列表|查询报警信息列表-监测-预警中心API
  getFindWarningInfoListPage(params: IgetFindWarningInfoListPageSpace.RequestParams) {
      const {currentPage,pageSize,useFor,eventTitle,eventTypeCode,regionId,eventLevelCode} = params;
      const url = `${API_DOMAIN}${API_PREFIX}/monitor/findWarningInfoListPage?currentPage=${currentPage}&pageSize=${pageSize}&eventTitle=${eventTitle}&eventTypeCode=${eventTypeCode}&regionId=${regionId}&eventLevelCode=${eventLevelCode}`;
      return requestHelper.getRequestData<IgetFindWarningInfoListPageSpace.Model>(url, '69b05fad-44fa-4445-aa32-482a9f0c0afd', this.data2Mock);
  }
  // 查询视频设备列表|查询视频设备列表-监测-预警中心API
  getListMonitorVideos(useFor:number,regionTypeCodeList:[],eventTypeCodeList:[]) {
      const url = `${API_DOMAIN}${API_PREFIX}/monitor/listMonitorVideos?useFor=${useFor}&regionTypeCodeList=${regionTypeCodeList}&eventTypeCodeList=${eventTypeCodeList}`;
      return requestHelper.getRequestData<IgetListMonitorVideosSpace.Model>(url, 'f900e0d0-16b4-47a4-9730-6ead4962df73', this.data2Mock);
  }
  // 查询监测事件的监测数据(列表展示)|查询监测事件的监测数据(列表展示)-监测-预警中心API
  getListMonitorDataList(params: IgetListMonitorDataListSpace.RequestParams) {
      const {currentPage,pageSize,useFor,eventId,startTime,endTime, pointId} = params;
      const url = `${API_DOMAIN}${API_PREFIX}/monitor/listMonitorDataList?currentPage=${currentPage}&pageSize=${pageSize}&eventId=${eventId}&startTime=${startTime}&endTime=${endTime}&pointId=${pointId}`;
      return requestHelper.getRequestData<IgetListMonitorDataListSpace.Model>(url, '51f1f9a9-00b8-490a-840c-701805b1b027', this.data2Mock);
  }
  // 查询监测数据列表|查询监测数据列表-AccessDataController
  getFindMonitorDataPage(params: IgetFindAccessDatePageSpace.RequestParams) {
    const { currentPage, pageSize, monitorPointId, startTime, endTime, eventId } = params;
    let url = "";
    if(startTime){
      url = `${API_DOMAIN}${API_PREFIX}/accessData/findMonitorDataPage?currentPage=${currentPage}&pageSize=${pageSize}&monitorPointId=${monitorPointId}&eventId=${eventId}&startTime=${startTime}&endTime=${endTime}`;
    } else {
      url = `${API_DOMAIN}${API_PREFIX}/accessData/findMonitorDataPage?currentPage=${currentPage}&pageSize=${pageSize}&monitorPointId=${monitorPointId}&eventId=${eventId}`;
    }
    return requestHelper.getRequestData<IgetFindMonitorDataPageSpace.Model>(url, 'd9269ff9-15a9-47e1-8b6b-264e06258605', this.data2Mock);
  }
  // 查询监测主体打点信息|查询监测主体打点信息-监测-预警中心API
  getListMonitorRegionMapVOs(params: IgetListMonitorRegionMapVOsSpace.RequestParams) {
      const {useFor,regionTypeCodeList,eventTypeCodeList,monitorRegionId} = params;
      const url = `${API_DOMAIN}${API_PREFIX}/monitor/listMonitorRegionMapVOs?useFor=${useFor}&regionTypeCodeList=${regionTypeCodeList}&eventTypeCodeList=${eventTypeCodeList}&monitorRegionId=${monitorRegionId}`;
      return requestHelper.getRequestData<IgetListMonitorRegionMapVOsSpace.Model>(url, 'd41be3d2-9829-4620-990d-7234c53bbe93', this.data2Mock);
  }
  // 当前topX报警列表|当前topX报警列表-监测-预警中心API
  getListWarningInfoListVOs(useFor?:number) {
      const url = `${API_DOMAIN}${API_PREFIX}/monitor/listWarningInfoListVOs?useFor=${useFor}`;
      return requestHelper.getRequestData<IgetListWarningInfoListVOsSpace.Model>(url, 'a94f94d9-2b7c-41ca-ba08-b64d003847a8', this.data2Mock);
  }
  // 监测布控-查询事件类型列表|监测布控-查询事件类型列表-监测-预警中心API
  getListEventTypeListVOs(regionTypeCode: string, useFor?:number) {
      const url = `${API_DOMAIN}${API_PREFIX}/monitor/listEventTypeListVOs?useFor=${useFor}&regionTypeCodeList=${regionTypeCode}`;
      return requestHelper.getRequestData<IgetListEventTypeListVOsSpace.Model>(url, 'c86b8915-37ce-4d2d-8949-46da22ba5f23', this.data2Mock);
  }

}
export const apiMonitorCenterObj = new MonitorCenterApi();
