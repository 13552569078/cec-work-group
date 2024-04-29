import { requestHelper } from "@/apis/base/mapper-helper";
import {
  IpostStatResourcePageSpace,
  IpostSupportResourcePageSpace,
  IpostListEventPersonsSpace,
  IpostFindCommandCenterAssemblePointListSpace,
  IpostStatEventSurroundingResourcesSpace,
  IpostStatEventSurroundingProtectionTargetSpace,
  IpostStatEventSurroundingRiskSpace,
  IpostFindEventSurroundingResourcesSpace,
  IpostFindEventSurroundingProtectionTargetSpace,
  IpostFindEventSurroundingRiskSpace,
  IpostStatEventSurroundingItemsSpace,
} from './model';
import { GlobalAPI } from '@/common';

/**
 * 数据访问，此类代码生成器生成
 */
class DataResourceApi {
  data2Mock: boolean = false;

  // 物资保障能力列表
  postSupportResourcePage(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/picture/centerResource/supportResourcePage`;
    return requestHelper.postRequestData<IpostSupportResourcePageSpace.Model>(url, '2180192a-aa0b-4667-8a7a-dfdb4c335632', this.data2Mock, params);
  }

  // 应急保障力量列表
  postStatResourcePage(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/picture/centerResource/statResourcePage`;
    return requestHelper.postRequestData<IpostStatResourcePageSpace.Model>(url, '2180192a-aa0b-4667-8a7a-dfdb4c335632', this.data2Mock, params);
  }

  // 用户位置-一张图列表|用户位置-一张图列表-用户位置
  postListEventPersons(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/commandCenter/listEventPersons`;
    return requestHelper.postRequestData<IpostListEventPersonsSpace.Model>(url, '355401be-c3b7-4db4-8651-ec0d2dd95a36', this.data2Mock, params);
  }

  // 指挥中心集结点表-列表|指挥中心集结点表-列表-指挥中心集结点表
  postFindCommandCenterAssemblePointList(eventInfoId: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/commandCenter/findCommandCenterAssemblePointList`;
    return requestHelper.postRequestData<IpostFindCommandCenterAssemblePointListSpace.Model>(
      url,
      "7eb397af-4035-4ce3-8c22-88ac5255fd9f",
      this.data2Mock,
      { eventInfoId }
    );
  }

  // 事件中心-周边资源统计|事件中心-周边资源统计-事件中心
  postStatEventSurroundingResources(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/wartime/statEventSurroundingResources`;
    return requestHelper.postRequestData<IpostStatEventSurroundingResourcesSpace.Model>(url, '211378f0-6673-41e8-8a7d-237f4a30d4d8', this.data2Mock, params);
  }
  // 事件中心-周边资源统计|事件中心-周边资源统计-事件中心
  postStatEventSurroundingItems(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/wartime/statEventSurroundingItems`;
    return requestHelper.postRequestData<IpostStatEventSurroundingItemsSpace.Model>(url, '211378f0-6673-41e8-8a7d-237f4a30d4d8', this.data2Mock, params);
  }
  // 事件中心-周边资源列表|事件中心-周边资源列表-事件中心
  postFindEventSurroundingResources(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/wartime/findEventSurroundingResources`;
    return requestHelper.postRequestData<IpostFindEventSurroundingResourcesSpace.Model>(url, '2c0f7a76-4e31-43f1-b5d2-26c8e2e39af0', this.data2Mock, params);
  }

  // 事件中心-周边重大防护目标统计|事件中心-周边重大防护目标统计-事件中心
  postStatEventSurroundingProtectionTarget(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/wartime/statEventSurroundingProtectionTarget`;
    return requestHelper.postRequestData<IpostStatEventSurroundingProtectionTargetSpace.Model>(url, '9c2a516b-cdcb-4bc7-ad54-e3eed65400f3', this.data2Mock, params);
  }
  // 事件中心-周边重点防护目标列表|事件中心-周边重点防护目标列表-事件中心
  postFindEventSurroundingProtectionTarget(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/wartime/findEventSurroundingProtectionTarget`;
    return requestHelper.postRequestData<IpostFindEventSurroundingProtectionTargetSpace.Model>(url, '123210b3-9cb9-43bf-b294-d2cb3453e45f', this.data2Mock, params);
  }

  // 事件中心-周边重大危险源列表|事件中心-周边重大危险源列表-事件中心
  postStatEventSurroundingRisk(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/wartime/statEventSurroundingRisk`;
    return requestHelper.postRequestData<IpostStatEventSurroundingRiskSpace.Model>(url, 'e3df83a1-bfb8-4ee3-ac43-7499ef8b7151', this.data2Mock, params);
  }
  // 事件中心-周边风险隐患点列表|事件中心-周边风险隐患点列表-事件中心
  postFindEventSurroundingRisk(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/wartime/findEventSurroundingRisk`;
    return requestHelper.postRequestData<IpostFindEventSurroundingRiskSpace.Model>(url, '592f8f49-e68b-4262-8bdc-f78d5d01a43d', this.data2Mock, params);
  }

}
export const apiDataResourceObj = new DataResourceApi();
