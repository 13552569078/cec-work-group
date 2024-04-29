import { requestHelper } from "@/apis/base/mapper-helper";
import { IpostStatSpace , IlistSpace, IpostStatSpace2, IpostStatSpace3, IlistSpace2, IpostAnalysisSpace,IpostTop10Space ,IpostRegionSpace, IlistSpace3 } from './model';
import { GlobalAPI } from "@/common";
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = GlobalAPI.config.API_PREFIX_OP;

/**
 * 数据访问，此类代码生成器生成
 */
class RunVerviewApi {
  data2Mock: boolean = false;

  // 运行总览-接入事件统计|运行总览-接入事件统计-事件运行总览分析
  postStat(districtCode:string | number,endTime:string | number,startTime:string | number) {
      const url = `${API_DOMAIN}${API_PREFIX}/event/operation/analysis/access/events/stat`;
      return requestHelper.postRequestData<IpostStatSpace.Model>(url, '7b862c59-04ee-4998-aa5b-1fdf3cdf6b7b', this.data2Mock, {districtCode,endTime,startTime});
  }
  // 运行总览-平台流入统计|运行总览-平台流入统计-事件运行总览分析
  list(districtCode:string | number,endTime:string | number,startTime:string | number, statType:string | number) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/operation/analysis/platform/inflow/list`;
    return requestHelper.postRequestData<IlistSpace.Model>(url, '7ca4f43e-f27c-4082-9f54-0d7d185c15c9', this.data2Mock, {districtCode,endTime,startTime,statType});
  }
  // 运行总览-自处置事件统计|运行总览-自处置事件统计-事件运行总览分析
  postSelfHandleStat(districtCode:string | number,endTime:string | number,startTime:string | number) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/operation/analysis/selfHandle/events/stat`;
    return requestHelper.postRequestData<IpostStatSpace2.Model>(url, '79f3dc30-a8a0-46a2-9e33-ef08279dff1c', this.data2Mock, {districtCode,endTime,startTime});
  }
  // 运行总览-流入事件统计|运行总览-流入事件统计-事件运行总览分析
  postInflowStat(districtCode:string | number,endTime:string | number,startTime:string | number) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/operation/analysis/inflow/events/stat`;
    return requestHelper.postRequestData<IpostStatSpace3.Model>(url, '48ac54d1-93f4-49a9-bca0-6cb9057bdd75', this.data2Mock, {districtCode,endTime,startTime});
  }
  // 运行总览-流入事件近六个月事件数量|运行总览-流入事件近六个月事件数量-事件运行总览分析
  postEventslist(districtCode:string | number,endTime:string | number,startTime:string | number) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/operation/analysis/inflow/events/list`;
    return requestHelper.postRequestData<IlistSpace2.Model>(url, 'e52aeee4-b91a-4364-b962-1d53e59fbcb5', this.data2Mock, {districtCode,endTime,startTime});
  }
  // 运行总览-运行统计-趋势分析|运行总览-运行统计-趋势分析-事件运行总览分析
  postAnalysis(params: any) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/operation/analysis/stat/trend/analysis`;
    return requestHelper.postRequestData<IpostAnalysisSpace.Model>(url, '2ddb3e28-93f5-4b99-8eb6-c9e44080313c', this.data2Mock, params);
  }
  // 运行总览-运行统计-事件类型top10|运行总览-运行统计-事件类型top10-事件运行总览分析
  postTop10(params: any) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/operation/analysis/stat/event/type/top10`;
    return requestHelper.postRequestData<IpostTop10Space.Model>(url, '112bbcb3-d12a-4602-9565-77e5196e5cb4', this.data2Mock, params);
  }
  // 运行总览-运行统计-流入类型|运行总览-运行统计-流入类型-事件运行总览分析
  postRegion(params: any) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/operation/analysis/stat/event/region`;
    return requestHelper.postRequestData<IpostRegionSpace.Model>(url, '84d17313-b129-4800-bd98-c06e6a3b183b', this.data2Mock, params);
  }
    // 运行总览-运行总览-事件列表|运行总览-运行总览-事件列表-事件运行总览分析
  postEventlist(params: any) {
      const url = `${API_DOMAIN}${API_PREFIX}/event/operation/analysis/stat/event/list`;
      return requestHelper.postRequestData<IlistSpace.Model>(url, 'de60ad65-1107-49d5-a12e-f1ea5dbdc586', this.data2Mock, params);
  }

}
export const apiRunVerviewObj = new RunVerviewApi();
