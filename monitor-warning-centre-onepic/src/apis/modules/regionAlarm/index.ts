import { requestHelper } from "@/apis/base/mapper-helper";
import { IgetFindRegionMonitorControlSpace,IgetListRegionEventTypeEquipTreesSpace,IgetFindRegionAlarmJudgeSpace,IgetFindRegionAlarmInfoSpace,IgetListRegionEquipTreesSpace,IgetFindRegionAlarmHandleSpace,IgetListCurrentWarningInfoListVOsSpace,IgetFindRegionMonitorPointDetailSpace,IgetFindCurrentWarningInfoListPageSpace,IgetListMonitorEventMapsSpace,IgetFindCurrentWarningNumberSpace,IgetFindCurrentRegionAlarmInfoSpace,IgetFindRegionAccessDataSpace } from './model';
import { GlobalAPI } from '@/common';
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = GlobalAPI.config.API_PREFIX_CENTRE_CONFIG;

/**
 * 数据访问，此类代码生成器生成
 */
class RegionAlarmApi {
  data2Mock: boolean = false;

  // 查询监测主体的监测布控|查询监测主体的监测布控-监测主体报警预警信息API
  getFindRegionMonitorControl(regionId:number) {
      const url = `${API_DOMAIN}${API_PREFIX}/regionAlarm/findRegionMonitorControl?regionId=${regionId}`;
      return requestHelper.getRequestData<IgetFindRegionMonitorControlSpace.Model>(url, '156e5cec-333d-47dd-8abd-c1bcd08b2367', this.data2Mock);
  }
  // 查询设备树(按监测类型分类)|查询设备树(按监测类型分类)-监测主体报警预警信息API
  getListRegionEventTypeEquipTrees(equipName:string,regionId:number|string) {
      const url = `${API_DOMAIN}${API_PREFIX}/regionAlarm/listRegionEventTypeEquipTrees?equipName=${equipName}&regionId=${regionId}`;
      return requestHelper.getRequestData<IgetListRegionEventTypeEquipTreesSpace.Model>(url, '0114ab59-d25e-48d9-8a6a-ec19d8966a55', this.data2Mock);
  }
  // 监测主体报警研判信息统计|监测主体报警研判信息统计-监测预警事件统计API
  getFindRegionAlarmJudge(params: IgetFindRegionAlarmJudgeSpace.RequestParams) {
      const {statisticsTypeCode,startTime,endTime,regionId} = params;
      const url = `${API_DOMAIN}${API_PREFIX}/monitorEventStatistics/findRegionAlarmJudge?statisticsTypeCode=${statisticsTypeCode}&startTime=${startTime}&endTime=${endTime}&regionId=${regionId}`;
      return requestHelper.getRequestData<IgetFindRegionAlarmJudgeSpace.Model>(url, '6145f8e0-4856-4ac8-bc3f-4d514c5ec571', this.data2Mock);
  }
  // 监测主体报警信息统计|监测主体报警信息统计-监测预警事件统计API
  getFindRegionAlarmInfo(params: IgetFindRegionAlarmInfoSpace.RequestParams) {
      const {statisticsTypeCode,startTime,endTime,regionId} = params;
      const url = `${API_DOMAIN}${API_PREFIX}/monitorEventStatistics/findRegionAlarmInfo?statisticsTypeCode=${statisticsTypeCode}&startTime=${startTime}&endTime=${endTime}&regionId=${regionId}`;
      return requestHelper.getRequestData<IgetFindRegionAlarmInfoSpace.Model>(url, '2ed26c0f-a32e-4dab-b96b-09403fd506d0', this.data2Mock);
  }
  // 查询设备树(按设备类型)|查询设备树(按设备类型)-监测主体报警预警信息API
  getListRegionEquipTrees(equipName:string,regionId:number) {
      const url = `${API_DOMAIN}${API_PREFIX}/regionAlarm/listRegionEquipTrees?equipName=${equipName}&regionId=${regionId}`;
      return requestHelper.getRequestData<IgetListRegionEquipTreesSpace.Model>(url, 'b2f9fee1-0574-4e82-8536-676c1d09f1e7', this.data2Mock);
  }
  // 监测主体报警处置信息统计|监测主体报警处置信息统计-监测预警事件统计API
  getFindRegionAlarmHandle(params: IgetFindRegionAlarmHandleSpace.RequestParams) {
      const {statisticsTypeCode,startTime,endTime,regionId} = params;
      const url = `${API_DOMAIN}${API_PREFIX}/monitorEventStatistics/findRegionAlarmHandle?statisticsTypeCode=${statisticsTypeCode}&startTime=${startTime}&endTime=${endTime}&regionId=${regionId}`;
      return requestHelper.getRequestData<IgetFindRegionAlarmHandleSpace.Model>(url, 'b1d96a1a-69bf-4fe0-ac9e-458709487714', this.data2Mock);
  }
  // 当前监测主体报警topX列表|当前监测主体报警topX列表-监测主体报警预警信息API
  getListCurrentWarningInfoListVOs(regionId:number) {
      const url = `${API_DOMAIN}${API_PREFIX}/regionAlarm/listCurrentWarningInfoListVOs?regionId=${regionId}`;
      return requestHelper.getRequestData<IgetListCurrentWarningInfoListVOsSpace.Model>(url, '4e7870a9-c20d-4281-a18f-de1a478eeca6', this.data2Mock);
  }
  // 统计监测点详情|统计监测点详情-监测主体报警预警信息API
  getFindRegionMonitorPointDetail(monitorPointId:number) {
      const url = `${API_DOMAIN}${API_PREFIX}/regionAlarm/findRegionMonitorPointDetail?monitorPointId=${monitorPointId}`;
      return requestHelper.getRequestData<IgetFindRegionMonitorPointDetailSpace.Model>(url, 'c4fb4975-4fb6-4eff-a29e-7029b76e5ccb', this.data2Mock);
  }
  // 查询当前主体报警列表(分页)|查询当前主体报警列表(分页)-监测主体报警预警信息API
  getFindCurrentWarningInfoListPage(params: IgetFindCurrentWarningInfoListPageSpace.RequestParams) {
      const {currentPage,pageSize,eventTitle,eventTypeCode,regionId,eventLevelCode} = params;
      const url = `${API_DOMAIN}${API_PREFIX}/regionAlarm/findCurrentWarningInfoListPage?currentPage=${currentPage}&pageSize=${pageSize}&eventTitle=${eventTitle}&eventTypeCode=${eventTypeCode}&regionId=${regionId}&eventLevelCode=${eventLevelCode}`;
      return requestHelper.getRequestData<IgetFindCurrentWarningInfoListPageSpace.Model>(url, 'c5d48bbf-b490-4f9d-89f9-eff385d2cbe0', this.data2Mock);
  }
  // 查询监测事件打点信息|查询监测事件打点信息-监测主体报警预警信息API
  getListMonitorEventMaps(params: IgetListMonitorEventMapsSpace.RequestParams) {
      const {regionTypeCodeList,eventTypeCodeList,monitorRegionId} = params;
      const url = `${API_DOMAIN}${API_PREFIX}/regionAlarm/listMonitorEventMaps?regionTypeCodeList=${regionTypeCodeList}&eventTypeCodeList=${eventTypeCodeList}&monitorRegionId=${monitorRegionId}`;
      return requestHelper.getRequestData<IgetListMonitorEventMapsSpace.Model>(url, '98684979-26ee-4c83-b172-4594fdce729c', this.data2Mock);
  }
  // 当前监测主体报警数|当前监测主体报警数-监测主体报警预警信息API
  getFindCurrentWarningNumber(regionId:number) {
      const url = `${API_DOMAIN}${API_PREFIX}/regionAlarm/findCurrentWarningNumber?regionId=${regionId}`;
      return requestHelper.getRequestData<IgetFindCurrentWarningNumberSpace.Model>(url, '1f7bb84f-16ea-48cb-8a6c-7329a6544e37', this.data2Mock);
  }
  // 查询当前报警统计信息|查询当前报警统计信息-监测主体报警预警信息API
  getFindCurrentRegionAlarmInfo(params: IgetFindCurrentRegionAlarmInfoSpace.RequestParams) {
      const {statisticsTypeCode,startTime,endTime,regionId} = params;
      const url = `${API_DOMAIN}${API_PREFIX}/regionAlarm/findCurrentRegionAlarmInfo?statisticsTypeCode=${statisticsTypeCode}&startTime=${startTime}&endTime=${endTime}&regionId=${regionId}`;
      return requestHelper.getRequestData<IgetFindCurrentRegionAlarmInfoSpace.Model>(url, 'f956b840-46e8-4547-83a5-81810c3dd3bb', this.data2Mock);
  }
  // 统计监测主体下的接入数据|统计监测主体下的接入数据-监测主体报警预警信息API
  getFindRegionAccessData(params: IgetFindRegionAccessDataSpace.RequestParams) {
      const {statisticsTypeCode,startTime,endTime,regionId} = params;
      const url = `${API_DOMAIN}${API_PREFIX}/regionAlarm/findRegionAccessData?statisticsTypeCode=${statisticsTypeCode}&startTime=${startTime}&endTime=${endTime}&regionId=${regionId}`;
      return requestHelper.getRequestData<IgetFindRegionAccessDataSpace.Model>(url, 'fce3a6f0-1d1e-4a08-b4e8-1b3c8ffe7257', this.data2Mock);
  }
}
export const apiRegionAlarmObj = new RegionAlarmApi();
