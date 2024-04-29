import { requestHelper } from "@/apis/base/mapper-helper";
import { IpostModifySummaryReportSpace, IpostFindknowledgeListSpace, IpostRunEventResponseCaseSpace, IpostFindUserByOrgIdSpace, IpostFindEventResponseByIdSpace, IpostFindOrgTreeSpace, IpostFindEmeKnowledgeListSpace, IpostFindMeasuresAndSuggestionsListSpace, IpostFinishEventResponseCaseSpace, IpostFindEventInfoStrategyListSpace, IpostChangeEventInfoStrategySpace } from './model';
import { GlobalAPI } from '@/common';

/**
 * 数据访问，此类代码生成器生成
 */
class EventResponseApi {
  data2Mock: boolean = false;

  // 事件办结
  postFinishEventInfo(id: string) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/finishEventInfo`;
      return requestHelper.postRequestData<any>(url, '980f98b8-b065-4b05-a47f-84801d740ccf', this.data2Mock, { id });
  }

  // 启动响应
  postRunEventResponseCase(params: IpostRunEventResponseCaseSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}/${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/startEventInfoResponse`;
    return requestHelper.postRequestData<IpostRunEventResponseCaseSpace.Model>(url, 'cb672a74-79b8-4770-a375-63f6d80bfcf7', this.data2Mock, params);
  }

  // 查询事件响应
  postFindEventResponseByIdNew(eventInfoId: string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/findEventInfoResponseMap`;
    return requestHelper.postRequestData<IpostFindEventResponseByIdSpace.Model>(url, 'b095ae2c-98f8-49b4-a19a-5ac6d6462622', this.data2Mock, { eventInfoId });
  }

  // 结束响应
  postFinishEventResponseCaseNew(eventInfoId: string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/finishEventInfoResponse`;
    return requestHelper.postRequestData<IpostFinishEventResponseCaseSpace.Model>(url, '145817d0-3b47-4957-92c6-cd8be868560e', this.data2Mock, { eventInfoId });
  }
  // 策略列表
  postFindEventInfoStrategyList(eventInfoId:any, name: string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/findEventInfoStrategyList`;
    return requestHelper.postRequestData<IpostFindEventInfoStrategyListSpace.Model>(url, '3c80669c-5fd8-426d-b1c6-3d6231be67eb', this.data2Mock, {eventInfoId, name});
  }

  // 切换事件策略
  postChangeEventInfoStrategy(eventInfoId:any,strategyInfoId:any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/changeEventInfoStrategy`;
    return requestHelper.postRequestData<IpostChangeEventInfoStrategySpace.Model>(url, 'a9dca2ca-1807-4c92-bd71-1084b1733ab5', this.data2Mock, {eventInfoId,strategyInfoId});
  }

  // 切换事件策略
  postModifySummaryReport(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/modifySummaryReport`;
    return requestHelper.postRequestData<IpostModifySummaryReportSpace.Model>(url, 'a9dca2ca-1807-4c92-bd71-1084b1733ab5', this.data2Mock, params);
  }
  // 切换事件策略
  postFindSummaryReportById(id:any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/findSummaryReportById`;
    return requestHelper.postRequestData<IpostModifySummaryReportSpace.Model>(url, 'a9dca2ca-1807-4c92-bd71-1084b1733ab5', this.data2Mock, { id });
  }
  // 切换事件策略
  getSummaryDownloadUrl(id:any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/summary/download?id=${id}`;
    return url
  }
}
export const apiEventResponseObj = new EventResponseApi();
