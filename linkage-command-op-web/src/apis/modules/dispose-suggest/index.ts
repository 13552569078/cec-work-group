import { requestHelper } from "@/apis/base/mapper-helper";
import { GlobalAPI } from "@/common";
import {
  IpostFindEventSurroundingItemsSpace,
  IgetBufferSizeSpace,
  IpostFindEventPolicyDecisionPageSpace,
  IpostFindExpertAdvicePageSpace,
  IpostFindDepartmentAdvicePageSpace,
  IpostKnowledgeMSDSListSpace,
  IpostAddEventPolicyDecisionSpace,
  IpostDeleteEventPolicyDecisionSpace,
  IgetAdviceStatSpace,
} from './model';

/**
 * 数据访问，此类代码生成器生成
 */
class DisposeSuggestApi {
  data2Mock: boolean = false;

  // 辅助决策查资源、风险、防护用/api/lc-op/wartime/findEventSurroundingItems
  postFindEventSurroundingItems(params: IpostFindEventSurroundingItemsSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/wartime/findEventSurroundingItems`;
    return requestHelper.postRequestData<IpostFindEventSurroundingItemsSpace.Model>(url, '059eb061-42fd-42f6-979a-c4b313e8b238', this.data2Mock, params);
  }

  // 下拉数据-分析范围
  getBufferSize() {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/wartime/bufferSize`;
    return requestHelper.getRequestData<IgetBufferSizeSpace.Model>(url, 'b5111b2a-5841-4ddb-87c2-710a24d07a6a', this.data2Mock);
  }

  // adviceStat|adviceStat-一张图战时态接口
  getAdviceStat(eventId:string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/wartime/adviceStat?eventId=${eventId}`;
    return requestHelper.getRequestData<IgetAdviceStatSpace.Model>(url, 'd7771bed-2fe1-4df8-b3ae-b7866238756d', this.data2Mock);
  }

  // 辅助方案列表
  postFindEventPolicyDecisionPage(params: IpostFindEventPolicyDecisionPageSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/findEventPolicyDecisionPage`;
    return requestHelper.postRequestData<IpostFindEventPolicyDecisionPageSpace.Model>(url, '7cf8b784-91dd-4033-b0f4-9fe5f876073d', this.data2Mock, params);
  }

  // 事件辅助决策-添加|事件辅助决策-添加-事件辅助决策
  postAddEventPolicyDecision(params: IpostAddEventPolicyDecisionSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/addEventPolicyDecision`;
    return requestHelper.postRequestData<IpostAddEventPolicyDecisionSpace.Model>(url, '8143733e-997c-467d-85a1-bbc661f9d164', this.data2Mock, params);
  }

  // 事件辅助决策-删除|事件辅助决策-删除-事件辅助决策
  postDeleteEventPolicyDecision(id:number) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/deleteEventPolicyDecision`;
    return requestHelper.postRequestData<IpostDeleteEventPolicyDecisionSpace.Model>(url, '30f08f0a-d7eb-4608-b2fb-1e77d50a3004', this.data2Mock, {id});
  }

  // 专家建议列表
  postFindExpertAdvicePage(params: IpostFindExpertAdvicePageSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/findExpertAdvicePage`;
    return requestHelper.postRequestData<IpostFindExpertAdvicePageSpace.Model>(url, 'c57b872d-f8c5-4a25-8939-860f30d237aa', this.data2Mock, params);
  }

  // 部门建议列表
  postFindDepartmentAdvicePage(params: IpostFindDepartmentAdvicePageSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/findDepartmentAdvicePage`;
    return requestHelper.postRequestData<IpostFindDepartmentAdvicePageSpace.Model>(url, 'e2c5a792-c0eb-4628-a132-0e32cf2eb66a', this.data2Mock, params);
  }

}
export const apiDisposeSuggestObj = new DisposeSuggestApi();
