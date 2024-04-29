import { requestHelper } from "@/apis/base/mapper-helper";
import {
  IpostEventSrcSpace,
  IgetRepeatEventSpace,
  IpostSearchSpace,
  IpostTopicRankSpace,
  IlistSpace,
  IpostTopicEventListSpace,
  IpostEventKeywordListSpace,
  IpostKeywordEventListSpace,
  IpostOverviewSpace,
  IpostRecommendSpace,
  IpostTopicTrendSpace,
  IpostVideoMapPointSpace
} from "./model";
import { GlobalAPI } from "@/common";
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = GlobalAPI.config.API_PREFIX_OP;

/**
 * 数据访问，此类代码生成器生成
 */
class EventAnalysisApi {
  data2Mock: boolean = false;

  // 事件源监督|事件源监督-监督分析
  postEventSrc(endTime: any, startTime: any) {
    const url = `${API_DOMAIN}${API_PREFIX}/surveAnalysis/eventSrc`;
    return requestHelper.postRequestData<IpostEventSrcSpace.Model>(
      url,
      "833c345d-1cf3-4503-83dd-ed54cb0e9276",
      this.data2Mock,
      { endTime, startTime }
    );
  }
  // 预警监督-重复诉求事件对比|预警监督-重复诉求事件对比-一张图-预警监督
  getRepeatEvent(id: number | string) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/supervision/repeatEvent/${id}`;
    return requestHelper.getRequestData<IgetRepeatEventSpace.Model>(
      url,
      "8ab5d9b1-ee8f-44e0-a9a3-5352d64f2079",
      this.data2Mock
    );
  }
  // 预警监督-历史相似事件搜索|预警监督-历史相似事件搜索-一张图-预警监督
  postSearch(params: IpostSearchSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/supervision/similar/search`;
    return requestHelper.postRequestData<IpostSearchSpace.Model>(
      url,
      "e8f29092-3afd-4a94-a22a-3a668c11fbc5",
      this.data2Mock,
      params
    );
  }
  // 预警监督-话题下拉列表|预警监督-话题下拉列表-一张图-预警监督
  getTopicList() {
    const url = `${API_DOMAIN}${API_PREFIX}/event/supervision/topic/list`;
    return requestHelper.getRequestData<any>(
      url,
      "8ab5d9b1-ee8f-44e0-a9a3-5352d64f2079",
      this.data2Mock
    );
  }
  // 话题排名|话题排名-监督分析
  postTopicRank(endTime: any, platformCode: string, startTime: any) {
    const url = `${API_DOMAIN}${API_PREFIX}/surveAnalysis/topicRank`;
    return requestHelper.postRequestData<IpostTopicRankSpace.Model>(
      url,
      "60c38705-c4f3-44b0-97b2-4619ec4ee296",
      this.data2Mock,
      { endTime, platformCode, startTime }
    );
  }
  // 预警监督-列表|预警监督-列表-一张图-预警监督
  list(params: IlistSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/supervision/page/list`;
    return requestHelper.postRequestData<IlistSpace.Model>(
      url,
      "aedb8703-6a78-41d0-990f-ec1f3a0373f4",
      this.data2Mock,
      params
    );
  }
  // 话题事件关系图谱|话题事件关系图谱-监督分析
  postTopicEventList(params: any) {
    const url = `${API_DOMAIN}${API_PREFIX}/surveAnalysis/topicEventList`;
    return requestHelper.postRequestData<IpostTopicEventListSpace.Model>(
      url,
      "87b9aa83-1000-4452-af49-02bedceea061",
      this.data2Mock,
      params
    );
  }
  // 事件关键字列表|事件关键字列表-监督分析
  postEventKeywordList(id: number | string) {
    const url = `${API_DOMAIN}${API_PREFIX}/surveAnalysis/eventKeywordList/${id}`;
    return requestHelper.postRequestData<IpostEventKeywordListSpace.Model>(
      url,
      "22bd4b5e-9c80-4fff-9d95-c4d3dccf018b",
      this.data2Mock,
      { id }
    );
  }
  // 关键字事件列表|关键字事件列表-监督分析
  postKeywordEventList(params: IpostKeywordEventListSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/surveAnalysis/keywordEventList`;
    return requestHelper.postRequestData<IpostKeywordEventListSpace.Model>(
      url,
      "c3811cba-4f58-4ae0-b5b6-aadfb7e4b8a0",
      this.data2Mock,
      params
    );
  }
  // 预警监督-统计|预警监督-统计-一张图-预警监督
  postOverview(params: IpostOverviewSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/supervision/overview`;
    return requestHelper.postRequestData<IpostOverviewSpace.Model>(
      url,
      "4b6fee0c-2cd3-4975-8d58-6801f40956b1",
      this.data2Mock,
      params
    );
  }
  // 预警监督-相似事件推荐(top10)|预警监督-相似事件推荐(top10)-一张图-预警监督
  postRecommend(params: IpostRecommendSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/supervision/similar/recommend`;
    return requestHelper.postRequestData<IpostRecommendSpace.Model>(
      url,
      "692cadf9-5fcb-4d0f-b445-aa56cb07fdce",
      this.data2Mock,
      params
    );
  }
  // 话题趋势|话题趋势-监督分析
  postTopicTrend(platformCode: string, timeDimension: any, endTime: any, startTime: any) {
    const url = `${API_DOMAIN}${API_PREFIX}/surveAnalysis/topicTrend`;
    return requestHelper.postRequestData<IpostTopicTrendSpace.Model>(
      url,
      "483cc17a-eb54-4bc2-8d1f-54aa355a9e51",
      this.data2Mock,
      { platformCode, timeDimension, endTime, startTime }
    );
  }

  // 视频点位
  postVideoMapPoint() {
    const url = `${API_DOMAIN}${API_PREFIX}/video/mapPoint`;
    return requestHelper.postRequestData<IpostVideoMapPointSpace.Model>(
      url,
      "483cc17a-eb54-4bc2-8d1f-54aa355a9e52",
      this.data2Mock
    );
  }

  // 视频点位播放流
  getVideoUrl(channelId: string) {
    const url = `${API_DOMAIN}${API_PREFIX}/video/uri?channelId=${channelId}&scheme=HLS_HTTPS`;
    return requestHelper.getRequestData(
      url,
      "483cc17a-eb54-4bc2-8d1f-54aa355a9e53",
      this.data2Mock
    );
  }
}
export const apiEventAnalysisObj = new EventAnalysisApi();
