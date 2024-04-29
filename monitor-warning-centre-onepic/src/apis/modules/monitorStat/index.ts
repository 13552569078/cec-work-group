import { requestHelper } from "@/apis/base/mapper-helper";
import { IgetFindAlarmDistributionSpace, IgetFindRegionAlarmJudgeSpace, IgetListTimeTrendVOsSpace, IgetFindRegionAlarmInfoSpace, IgetFindMonitorResourceUseSpace, IgetListTrendVOsSpace, IgetFindMonitorEventOverViewSpace, IgetFindRegionAlarmHandleSpace, IgetListMonitorEventStatisticsesSpace } from './model';
import { GlobalAPI } from '@/common';
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = GlobalAPI.config.API_PREFIX_CENTRE_CONFIG;

/**
 * 数据访问，此类代码生成器生成
 */
class EventStatApi {
  data2Mock: boolean = false;

  // 查询报警分布|查询报警分布-监测预警事件统计API
  getFindAlarmDistribution (params: IgetFindAlarmDistributionSpace.RequestParams) {
    const { useFor, statisticsTypeCode, startTime, endTime, regionId } = params;
    const url = `${API_DOMAIN}${API_PREFIX}/monitorEventStatistics/findAlarmDistribution?useFor=${useFor}&statisticsTypeCode=${statisticsTypeCode}&startTime=${startTime}&endTime=${endTime}&regionId=${regionId}`;
    return requestHelper.getRequestData<IgetFindAlarmDistributionSpace.Model>(url, '483929bd-bbb3-4788-9dc0-a5f0aa1ff504', this.data2Mock);
  }
  // 监测主体报警研判信息统计|监测主体报警研判信息统计-监测预警事件统计API
  getFindRegionAlarmJudge (params: IgetFindRegionAlarmJudgeSpace.RequestParams) {
    const { useFor, statisticsTypeCode, startTime, endTime, regionId } = params;
    const url = `${API_DOMAIN}${API_PREFIX}/monitorEventStatistics/findRegionAlarmJudge?useFor=${useFor}&statisticsTypeCode=${statisticsTypeCode}&startTime=${startTime}&endTime=${endTime}&regionId=${regionId}`;
    return requestHelper.getRequestData<IgetFindRegionAlarmJudgeSpace.Model>(url, '14030c11-d901-4c95-9fe7-4ca369cbe495', this.data2Mock);
  }
  // 监测中心-按照时段统计|监测中心-按照时段统计-监测预警事件统计API
  getListTimeTrendVOs (params: IgetListTimeTrendVOsSpace.RequestParams) {
    const { useFor, statisticsTypeCode, startTime, endTime, regionId } = params;
    const url = `${API_DOMAIN}${API_PREFIX}/monitorEventStatistics/ListTimeTrendVOs?useFor=${useFor}&statisticsTypeCode=${statisticsTypeCode}&startTime=${startTime}&endTime=${endTime}&regionId=${regionId}`;
    return requestHelper.getRequestData<IgetListTimeTrendVOsSpace.Model>(url, '0f8c9392-b459-4540-898e-be2cdd2d322e', this.data2Mock);
  }
  // 监测主体报警信息统计|监测主体报警信息统计-监测预警事件统计API
  getFindRegionAlarmInfo (params: IgetFindRegionAlarmInfoSpace.RequestParams) {
    const { useFor, statisticsTypeCode, startTime, endTime, regionId } = params;
    const url = `${API_DOMAIN}${API_PREFIX}/monitorEventStatistics/findRegionAlarmInfo?useFor=${useFor}&statisticsTypeCode=${statisticsTypeCode}&startTime=${startTime}&endTime=${endTime}&regionId=${regionId}`;
    return requestHelper.getRequestData<IgetFindRegionAlarmInfoSpace.Model>(url, 'dd112679-1f13-4c4d-bf70-4334f22f209f', this.data2Mock);
  }
  // 获取资源投入信息|获取资源投入信息-监测预警事件统计API
  getFindMonitorResourceUse (useFor: number) {
    const url = `${API_DOMAIN}${API_PREFIX}/monitorEventStatistics/findMonitorResourceUse?useFor=${useFor}`;
    return requestHelper.getRequestData<IgetFindMonitorResourceUseSpace.Model>(url, 'ed7b7b79-2c71-43a1-be80-f6934fa0508d', this.data2Mock);
  }
  // 监测中心-统计趋势|监测中心-统计趋势-监测预警事件统计API
  getListTrendVOs (params: IgetListTrendVOsSpace.RequestParams) {
    const { statisticsTypeCode, startTime, endTime, regionId } = params;
    const url = `${API_DOMAIN}${API_PREFIX}/monitorEventStatistics/ListTrendVOs?statisticsTypeCode=${statisticsTypeCode}&startTime=${startTime}&endTime=${endTime}&regionId=${regionId}`;
    return requestHelper.getRequestData<IgetListTrendVOsSpace.Model>(url, '947ba795-7cff-4b7b-bc04-dfb809164ffe', this.data2Mock);
  }
  // 查询今日概况统计信息|查询今日概况统计信息-监测预警事件统计API
  getFindMonitorEventOverView (params: IgetFindMonitorEventOverViewSpace.RequestParams) {
    const { useFor, accessNumber, alarmNumber, judgeNumber, autoFinishNumber, eventCenterFinishNumber } = params;
    const url = `${API_DOMAIN}${API_PREFIX}/monitorEventStatistics/findMonitorEventOverView?useFor=${useFor}&accessNumber=${accessNumber}&alarmNumber=${alarmNumber}&judgeNumber=${judgeNumber}&autoFinishNumber=${autoFinishNumber}&eventCenterFinishNumber=${eventCenterFinishNumber}`;
    return requestHelper.getRequestData<IgetFindMonitorEventOverViewSpace.Model>(url, '98a72b65-b475-4107-91bf-452deddc9fe2', this.data2Mock);
  }
  // 监测主体报警处置信息统计|监测主体报警处置信息统计-监测预警事件统计API
  getFindRegionAlarmHandle (params: IgetFindRegionAlarmHandleSpace.RequestParams) {
    const { useFor, statisticsTypeCode, startTime, endTime, regionId } = params;
    const url = `${API_DOMAIN}${API_PREFIX}/monitorEventStatistics/findRegionAlarmHandle?useFor=${useFor}&statisticsTypeCode=${statisticsTypeCode}&startTime=${startTime}&endTime=${endTime}&regionId=${regionId}`;
    return requestHelper.getRequestData<IgetFindRegionAlarmHandleSpace.Model>(url, '4bacea11-5cc6-43ce-8085-2846761793c6', this.data2Mock);
  }
  // 按报警等级-事件类型-主体类型分类统计事件|按报警等级-事件类型-主体类型分类统计事件-监测预警事件统计API
  getListMonitorEventStatisticses (params: IgetListMonitorEventStatisticsesSpace.RequestParams) {
    const { useFor, statisticsTypeCode, startTime, endTime, regionId } = params;
    const url = `${API_DOMAIN}${API_PREFIX}/monitorEventStatistics/listMonitorEventStatisticses?useFor=${useFor}&statisticsTypeCode=${statisticsTypeCode}&startTime=${startTime}&endTime=${endTime}&regionId=${regionId}`;
    return requestHelper.getRequestData<IgetListMonitorEventStatisticsesSpace.Model>(url, '19783461-521e-4186-af98-c95ae2fda704', this.data2Mock);
  }

  Run (methodName: string, params: any) {
    let result: any = new Promise(() => ({ data: {} }));
    switch (methodName) {

      case "getFindAlarmDistribution":
        result = this.getFindAlarmDistribution(params as IgetFindAlarmDistributionSpace.RequestParams);
        break;

      case "getFindRegionAlarmJudge":
        result = this.getFindRegionAlarmJudge(params as IgetFindRegionAlarmJudgeSpace.RequestParams);
        break;

      case "getListTimeTrendVOs":
        result = this.getListTimeTrendVOs(params as IgetListTimeTrendVOsSpace.RequestParams);
        break;

      case "getFindRegionAlarmInfo":
        result = this.getFindRegionAlarmInfo(params as IgetFindRegionAlarmInfoSpace.RequestParams);
        break;

      case "getFindMonitorResourceUse":
        {
          const { useFor } = params;
          result = this.getFindMonitorResourceUse(useFor);
        }
        break;

      case "getListTrendVOs":
        result = this.getListTrendVOs(params as IgetListTrendVOsSpace.RequestParams);
        break;

      case "getFindMonitorEventOverView":
        result = this.getFindMonitorEventOverView(params as IgetFindMonitorEventOverViewSpace.RequestParams);
        break;

      case "getFindRegionAlarmHandle":
        result = this.getFindRegionAlarmHandle(params as IgetFindRegionAlarmHandleSpace.RequestParams);
        break;

      case "getListMonitorEventStatisticses":
        result = this.getListMonitorEventStatisticses(params as IgetListMonitorEventStatisticsesSpace.RequestParams);
        break;

      default:
        break;
    }
    return result;
  }
}
export const apiEventStatObj = new EventStatApi();