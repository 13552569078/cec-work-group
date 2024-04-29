import { requestHelper } from "@/apis/base/mapper-helper";
import { IpostPlatformSpace, IgetOverviewSpace, IgetPageSpace, IlistSpace, IDotlistSpace, IpostKeywordsSpace, IgetKeywordsSpace, IpostEventsSpace, IgetHandleSpace, IgetQoqAnalysisSpace, IgetEventNumAnalysisSpace, IgetDetailSpace, IlistSpaceHot, IBufferSearchSpace,IpostRealTimeSpace, SituationAnalysis, surveAnalysis } from './model';
import { GlobalAPI } from '@/common';
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = GlobalAPI.config.API_PREFIX_OP;

/**
 * 数据访问，此类代码生成器生成
 */
class IndexPageApi {
  data2Mock: boolean = false;

  // 平台统计|平台统计-一张图-首页
  postPlatform (params: IpostPlatformSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/statistics/platform`;
    return requestHelper.postRequestData<IpostPlatformSpace.Model>(url, 'b6e19172-4d8f-476e-b1c1-e9f210ec13c1', this.data2Mock, params);
  }
  // 首页-事件统计|首页-事件统计-首页
  getOverview (params: IgetOverviewSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/statistics/overview`;
    return requestHelper.postRequestData<IgetOverviewSpace.Model>(url, '02f39b53-a518-4610-aecb-10e1193f2256', this.data2Mock, params);
  }
  // 事件列表|事件列表-首页
  getPage (params: IgetPageSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/list/page`;
    return requestHelper.postRequestData<IgetPageSpace.Model>(url, 'f33fecaf-4d29-4e63-b492-dfe96444099b', this.data2Mock, params);
  }
  // 地图打点-街道事件聚合|地图打点-街道事件聚合-首页
  daggregationList (params: IlistSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/common/map/aggregation`;
    return requestHelper.postRequestData<IgetHandleSpace.Model>(url, '02f39b53-a518-4610-aecb-10e1193f2256', this.data2Mock, params);
  }
  // 高频事件|高频事件-一张图-首页
  postEvents (params: IpostEventsSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/hot/events`;
    return requestHelper.postRequestData<IpostEventsSpace.Model>(url, '86428a96-9559-4767-af3f-ade0eaad1210', this.data2Mock, params);
  }
  // 办理统计|办理统计-首页
  getHandle (params: IgetHandleSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/statistics/handle`;
    return requestHelper.postRequestData<IgetHandleSpace.Model>(url, '02f39b53-a518-4610-aecb-10e1193f2256', this.data2Mock, params);
  }
  // 地图打点-街道范围事件列表|地图打点-街道范围事件列表-首页
  dotList (params: IDotlistSpace.RequestParams) {
    const { districtCode, endTime, eventStatus, overtimeFlag, platformCode, startTime } = params;
    const url = `${API_DOMAIN}${API_PREFIX}/event/map/dot/list?districtCode=${districtCode}&endTime=${endTime}&eventStatus=${eventStatus}&overtimeFlag=${overtimeFlag}&platformCode=${platformCode}&startTime=${startTime}`;
    return requestHelper.getRequestData<IlistSpace.Model>(url, '73e62432-5553-4645-818e-efe3f9965f8d', this.data2Mock);
  }
  // 趋势分析-环比分析|趋势分析-环比分析-首页
  getQoqAnalysis (params: IgetQoqAnalysisSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/trend/qoqAnalysis`;
    return requestHelper.postRequestData<IgetQoqAnalysisSpace.Model>(url, '0a787437-c4da-4920-831e-0391684c1c0f', this.data2Mock, params);
  }
  // 趋势分析-事件量分析|趋势分析-事件量分析-首页
  getEventNumAnalysis (params: IgetEventNumAnalysisSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/trend/eventNumAnalysis`;
    return requestHelper.postRequestData<IgetEventNumAnalysisSpace.Model>(url, '93d0dfd5-a749-4218-a155-ef6d531fcc27', this.data2Mock, params);
  }
  // 事件详情|事件详情-首页
  getDetail (id: number | string) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/detail/${id}`;
    return requestHelper.getRequestData<IgetDetailSpace.Model>(url, '31bb2119-a40d-4cbe-8ed0-18f2926506ae', this.data2Mock);
  }
  // 高频热词列表-top10|高频热词列表-top10-一张图-首页
  list (endTime: string, startTime: string) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/hot/list`;
    return requestHelper.postRequestData<IlistSpaceHot.Model>(url, 'cfd4134f-cc02-4749-805a-43fe9369f84c', this.data2Mock, { endTime, startTime });
  }
  // 高频热词|高频热词-一张图-首页
  postKeywords (endTime: string, startTime: string) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/hot/keywords`;
    return requestHelper.postRequestData<IpostKeywordsSpace.Model>(url, 'e3c561b3-1554-4287-9024-59cb87086944', this.data2Mock, { endTime, startTime });
  }
  // 缓冲区查询
  bufferSearch(params: IBufferSearchSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/map/dot/eventListByCoordinate`;
    return requestHelper.postRequestData<IBufferSearchSpace.Model>(url, 'e3c561b3-1554-4287-9024-59cb87086944', this.data2Mock, params);
  }
  // 实时事件列表|实时事件列表-一张图-首页
  postRealTime(params: IpostRealTimeSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/list/realTime`;
    return requestHelper.postRequestData<IpostRealTimeSpace.Model>(url, '13bd08d1-8994-4be8-bcf9-f6d2bf20582d', this.data2Mock, params);
  }
  // 态势分析-事件区域分析
  situationAnalysisArea(params: SituationAnalysis.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/situation/analysis/area`;
    return requestHelper.postRequestData<SituationAnalysis.Model>(url, '13bd08d1-8994-4be8-bcf9-f6d2bf20582d', this.data2Mock, params);
  }
  // 态势分析-高频事件分析
  situationAnalysisFrequent(params: SituationAnalysis.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/situation/analysis/high/frequency`;
    return requestHelper.postRequestData<SituationAnalysis.Model>(url, '13bd08d1-8994-4be8-bcf9-f6d2bf20582d', this.data2Mock, params);
  }
  // 态势分析-高频热词
  situationAnalysisKeywords(params: IpostKeywordsSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/situation/analysis/keywords/hot`;
    return requestHelper.postRequestData<IpostKeywordsSpace.Model>(url, '13bd08d1-8994-4be8-bcf9-f6d2bf20582d', this.data2Mock, params);
  }
  // 态势分析-事件性质分析-紧急事件
  situationAnalysisNatureUrgent(params: SituationAnalysis.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/situation/analysis/nature/urgent`;
    return requestHelper.postRequestData<SituationAnalysis.Model>(url, '13bd08d1-8994-4be8-bcf9-f6d2bf20582d', this.data2Mock, params);
  }
  // 态势分析-事件性质分析-来源事件
  situationAnalysisNatureSource(params: SituationAnalysis.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/situation/analysis/nature/source`;
    return requestHelper.postRequestData<SituationAnalysis.Model>(url, '13bd08d1-8994-4be8-bcf9-f6d2bf20582d', this.data2Mock, params);
  }
  // 态势分析-态势统计-来源事件
  situationAnalysisStatEventSource(params: SituationAnalysis.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/situation/analysis/stat/event/source`;
    return requestHelper.postRequestData<SituationAnalysis.Model>(url, '13bd08d1-8994-4be8-bcf9-f6d2bf20582d', this.data2Mock, params);
  }
  // 态势分析-态势统计-事件列表
  situationAnalysisStatEventList(params: SituationAnalysis.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/situation/analysis/stat/event/list`;
    return requestHelper.postRequestData<SituationAnalysis.Model>(url, '13bd08d1-8994-4be8-bcf9-f6d2bf20582d', this.data2Mock, params);
  }
  // 态势分析-态势统计-流入类型
  situationAnalysisStatInflow(params: SituationAnalysis.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/situation/analysis/stat/inflow/type`;
    return requestHelper.postRequestData<SituationAnalysis.Model>(url, '13bd08d1-8994-4be8-bcf9-f6d2bf20582d', this.data2Mock, params);
  }
  // 态势分析-态势统计-趋势分析
  situationAnalysisStatTrend(params: SituationAnalysis.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/situation/analysis/stat/trend/analysis`;
    return requestHelper.postRequestData<SituationAnalysis.Model>(url, '13bd08d1-8994-4be8-bcf9-f6d2bf20582d', this.data2Mock, params);
  }
  // 监督分析-话题最多、最快
  surveAnalysisTopicMax(params: surveAnalysis.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/surveAnalysis/statistics`;
    return requestHelper.postRequestData<surveAnalysis.TopicMaxModel>(url, '13bd08d1-8994-4be8-bcf9-f6d2bf20582d', this.data2Mock, params);
  }
  // 监督分析-话题列表
  surveAnalysisTopicList(params: surveAnalysis.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/surveAnalysis/topicList`;
    return requestHelper.postRequestData<surveAnalysis.Model>(url, '13bd08d1-8994-4be8-bcf9-f6d2bf20582d', this.data2Mock, params);
  }
  // 监督分析-话题趋势
  surveAnalysisTopicTrend(params: surveAnalysis.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/surveAnalysis/topicTrend6Months`;
    return requestHelper.postRequestData<surveAnalysis.Model>(url, '13bd08d1-8994-4be8-bcf9-f6d2bf20582d', this.data2Mock, params);
  }
  // 监督分析-重复事件预警统计
  surveAnalysisEventRmvDupStatistics(params: surveAnalysis.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/surveAnalysis/eventRmvDup/statistics`;
    return requestHelper.postRequestData<surveAnalysis.RepeatStaticsModel>(url, '13bd08d1-8994-4be8-bcf9-f6d2bf20582d', this.data2Mock, params);
  }
  // 监督分析-重复事件来源列表
  surveAnalysisEventRmvDupPlatformSrcList(params: surveAnalysis.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/surveAnalysis/eventRmvDup/platformSrcList`;
    return requestHelper.postRequestData<surveAnalysis.Model>(url, '13bd08d1-8994-4be8-bcf9-f6d2bf20582d', this.data2Mock, params);
  }
}
export const apiIndexPageObj = new IndexPageApi();
