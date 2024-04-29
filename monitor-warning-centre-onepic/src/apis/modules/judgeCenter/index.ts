import { requestHelper } from "@/apis/base/mapper-helper";
import { IgetListRegionTimeTrendVOsSpace,IgetFindTodayJudgeVOSpace,IgetListRegionTrendVOsSpace,IgetFindManualUnJudgeEventNumSpace,IgetRegionSimpleListSpace,IgetFindJudgeOverviewVOSpace,IpostAddJudgeInfoSpace,IgetListManualUnJudgeEventTypeVOsSpace,IgetListTimeJudgeTypeVOsSpace,IgetListTimeJudgeResultVOsSpace,IgetListManualUnJudgeObjectTypeVOsSpace,IgetFindManualUnJudgeEventPageSpace } from './model';
import { GlobalAPI } from '@/common';
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = GlobalAPI.config.API_PREFIX_CENTRE_CONFIG;

/**
 * 数据访问，此类代码生成器生成
 */
class JudgeCenterApi {
  data2Mock: boolean = false;

  // 研判-按照时段统计|研判-按照时段统计-研判中心API
  getListRegionTimeTrendVOs(params: IgetListRegionTimeTrendVOsSpace.RequestParams) {
    const {startTime,endTime,monitorRegionId} = params;
    const url = `${API_DOMAIN}${API_PREFIX}/dataJudge/ListRegionTimeTrendVOs?startTime=${startTime}&endTime=${endTime}&monitorRegionId=${monitorRegionId}`;
    return requestHelper.getRequestData<IgetListRegionTimeTrendVOsSpace.Model>(url, 'd4f4c8b9-82d1-4fdb-bb5a-6a67c0f4a400', this.data2Mock);
  }
  // 研判结果-今日研判|研判结果-今日研判-研判中心API
  getFindTodayJudgeVO(useFor?:number) {
    const url = `${API_DOMAIN}${API_PREFIX}/dataJudge/findTodayJudgeVO?useFor=${useFor}`;
    return requestHelper.getRequestData<IgetFindTodayJudgeVOSpace.Model>(url, '8218fa24-994c-4d63-a7ba-7754e384dfb0', this.data2Mock);
  }
  // 研判-统计趋势|研判-统计趋势-研判中心API
  getListRegionTrendVOs(params: IgetListRegionTrendVOsSpace.RequestParams) {
    const {startTime,endTime,monitorRegionId} = params;
    const url = `${API_DOMAIN}${API_PREFIX}/dataJudge/ListRegionTrendVOs?startTime=${startTime}&endTime=${endTime}&monitorRegionId=${monitorRegionId}`;
    return requestHelper.getRequestData<IgetListRegionTrendVOsSpace.Model>(url, '1371b33a-d798-4881-a452-89ed72cbcda8', this.data2Mock);
  }
  // 待人工研判报警总数|待人工研判报警总数-研判中心API
  getFindManualUnJudgeEventNum(useFor?:number) {
    const url = `${API_DOMAIN}${API_PREFIX}/dataJudge/findManualUnJudgeEventNum?useFor=${useFor}`;
    return requestHelper.getRequestData<IgetFindManualUnJudgeEventNumSpace.Model>(url, '8e657c65-6b21-468b-a07a-e6e730e8ceaa', this.data2Mock);
  }
  // 监测主体下拉框列表|监测主体下拉框列表-监测主体
  getRegionSimpleList(regionName:string) {
    const url = `${API_DOMAIN}${API_PREFIX}/monitorRegion/regionSimpleList?regionName=${regionName}`;
    return requestHelper.getRequestData<IgetRegionSimpleListSpace.Model>(url, '1519f177-b07b-468b-ab6e-92c136417b82', this.data2Mock);
  }
  // 研判-当日概览|研判-当日概览-研判中心API
  getFindJudgeOverviewVO(useFor?:number) {
    const url = `${API_DOMAIN}${API_PREFIX}/dataJudge/findJudgeOverviewVO?useFor=${useFor}`;
    return requestHelper.getRequestData<IgetFindJudgeOverviewVOSpace.Model>(url, 'cbb3a75a-e3c6-438c-846c-2ad2cc168785', this.data2Mock);
  }
  // 研判保存接口|研判保存接口-研判中心API
  postAddJudgeInfo(params: IpostAddJudgeInfoSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/dataJudge/addJudgeInfo`;
    return requestHelper.postRequestData<IpostAddJudgeInfoSpace.Model>(url, '222e960d-d856-4941-a47f-af94656fa3da', this.data2Mock, params);
  }
  // 待人工研判报警信息-按报警类型分|待人工研判报警信息-按报警类型分-研判中心API
  getListManualUnJudgeEventTypeVOs(useFor?:number) {
    const url = `${API_DOMAIN}${API_PREFIX}/dataJudge/listManualUnJudgeEventTypeVOs?useFor=${useFor}`;
    return requestHelper.getRequestData<IgetListManualUnJudgeEventTypeVOsSpace.Model>(url, '2ed3f96c-9bc8-4cc0-a8f6-2cf642349cc5', this.data2Mock);
  }
  // 近期研判结果统计-按研判方式|近期研判结果统计-按研判方式-研判中心API
  getListTimeJudgeTypeVOs(useFor:number,startTime:string,endTime:string) {
    const url = `${API_DOMAIN}${API_PREFIX}/dataJudge/listTimeJudgeTypeVOs?useFor=${useFor}&startTime=${startTime}&endTime=${endTime}`;
    return requestHelper.getRequestData<IgetListTimeJudgeTypeVOsSpace.Model>(url, 'bb4ec65d-2e26-47d2-8bce-866f12e0c3da', this.data2Mock);
  }
  // 近期研判结果统计-按研判结果|近期研判结果统计-按研判结果-研判中心API
  getListTimeJudgeResultVOs(useFor:number,startTime:string,endTime:string) {
    const url = `${API_DOMAIN}${API_PREFIX}/dataJudge/listTimeJudgeResultVOs?useFor=${useFor}&startTime=${startTime}&endTime=${endTime}`;
    return requestHelper.getRequestData<IgetListTimeJudgeResultVOsSpace.Model>(url, 'cecf0e6b-2326-4122-8b00-32cf96c10f08', this.data2Mock);
  }
  // 待人工研判报警信息-按监测主体类型分|待人工研判报警信息-按监测主体类型分-研判中心API
  getListManualUnJudgeObjectTypeVOs(useFor?:number) {
    const url = `${API_DOMAIN}${API_PREFIX}/dataJudge/listManualUnJudgeObjectTypeVOs?useFor=${useFor}`;
    return requestHelper.getRequestData<IgetListManualUnJudgeObjectTypeVOsSpace.Model>(url, 'b3ea7f94-e012-4491-b2a1-286969a38e34', this.data2Mock);
  }
  // 待研判列表(分页)|待研判列表(分页)-研判中心API
  getFindManualUnJudgeEventPage(params: IgetFindManualUnJudgeEventPageSpace.RequestParams) {
    const {currentPage,pageSize,useFor,eventTypeCode,eventLevelCode,monitorRegionId,startTime,endTime} = params;
    const url = `${API_DOMAIN}${API_PREFIX}/dataJudge/findManualUnJudgeEventPage?currentPage=${currentPage}&pageSize=${pageSize}&eventTypeCode=${eventTypeCode}&eventLevelCode=${eventLevelCode}&monitorRegionId=${monitorRegionId}&startTime=${startTime}&endTime=${endTime}`;
    return requestHelper.getRequestData<IgetFindManualUnJudgeEventPageSpace.Model>(url, '3f0886dc-a208-4060-82be-abff407143ff', this.data2Mock);
  }

  Run(methodName: string, params: any) {
    let result:any = new Promise(() => ({ data: {} }));
    switch (methodName) {

      case "getListRegionTimeTrendVOs":
        result = this.getListRegionTimeTrendVOs(params as IgetListRegionTimeTrendVOsSpace.RequestParams);
        break;

      case "getFindTodayJudgeVO":
      {
        const { useFor } = params;
        result = this.getFindTodayJudgeVO(useFor);
      }
        break;

      case "getListRegionTrendVOs":
        result = this.getListRegionTrendVOs(params as IgetListRegionTrendVOsSpace.RequestParams);
        break;

      case "getFindManualUnJudgeEventNum":
      {
        const { useFor } = params;
        result = this.getFindManualUnJudgeEventNum(useFor);
      }
        break;

      case "getRegionSimpleList":
      {
        const { regionName } = params;
        result = this.getRegionSimpleList(regionName);
      }
        break;

      case "getFindJudgeOverviewVO":
      {
        const { useFor } = params;
        result = this.getFindJudgeOverviewVO(useFor);
      }
        break;

      case "postAddJudgeInfo":
        result = this.postAddJudgeInfo(params as IpostAddJudgeInfoSpace.RequestParams);
        break;

      case "getListManualUnJudgeEventTypeVOs":
      {
        const { useFor } = params;
        result = this.getListManualUnJudgeEventTypeVOs(useFor);
      }
        break;

      case "getListTimeJudgeTypeVOs":
      {
        const { useFor,startTime,endTime } = params;
        result = this.getListTimeJudgeTypeVOs(useFor,startTime,endTime);
      }
        break;

      case "getListTimeJudgeResultVOs":
      {
        const { useFor,startTime,endTime } = params;
        result = this.getListTimeJudgeResultVOs(useFor,startTime,endTime);
      }
        break;

      case "getListManualUnJudgeObjectTypeVOs":
      {
        const { useFor } = params;
        result = this.getListManualUnJudgeObjectTypeVOs(useFor);
      }
        break;

      case "getFindManualUnJudgeEventPage":
        result = this.getFindManualUnJudgeEventPage(params as IgetFindManualUnJudgeEventPageSpace.RequestParams);
        break;

      default:
        break;
    }
    return result;
  }
}
export const apiJudgeCenterObj = new JudgeCenterApi();
