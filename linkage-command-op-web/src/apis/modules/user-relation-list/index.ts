import { requestHelper } from "@/apis/base/mapper-helper";
import { IpostFindUserListPlottingSpace, IpostChangeStatusListPlottingSpace, IpostSaveListPlottingSpace, IpostRemoveByUserIdsPlottingSpace } from "./model";
import { GlobalAPI } from "@/common";

/**
 * 数据访问，此类代码生成器生成
 */
class UserRelationListApi {
  data2Mock: boolean = false;

  // 人员管理-本图层人员列表|人员管理-本图层人员列表-用户图层关系表
  postFindUserListPlotting(userName: string, layerId: string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/findUserList`;
    return requestHelper.postRequestData<IpostFindUserListPlottingSpace.Model>(url, "32116658-edb7-44ac-89ea-e2e0f36c1c10", this.data2Mock, { userName, layerId });
  }
  // 协同标绘-人员管理-批量开启或关闭|协同标绘-人员管理-批量开启或关闭-用户图层关系表
  postChangeStatusListPlotting(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/changeStatusList`;
    return requestHelper.postRequestData<IpostChangeStatusListPlottingSpace.Model>(url, "465b68c4-c8e9-49f0-b3b7-c7db3a44611b", this.data2Mock, params);
  }
  // 协同标绘-人员管理-websocket剔除用户|协同标绘-人员管理-websocket剔除用户-用户图层关系表
  posRemoveWebSocketPlotting(params: IpostChangeStatusListPlottingSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/removeWebSocket`;
    return requestHelper.postRequestData<IpostChangeStatusListPlottingSpace.Model>(url, "465b68c4-c8e9-49f0-b3b7-c7db3a44611b", this.data2Mock, params);
  }
  // 协同标绘-人员管理-选人确定|协同标绘-人员管理-选人确定-用户图层关系表
  postSaveListPlotting(params: IpostSaveListPlottingSpace.RequestParams[]) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/saveList`;
    return requestHelper.postRequestData<IpostSaveListPlottingSpace.Model>(url, "dca02cdb-7c0a-40fe-b8f8-2246f09c2a91", this.data2Mock, params);
  }
  // 协同标绘-人员管理-批量删除|协同标绘-人员管理-批量删除-用户图层关系表
  postRemoveByUserIdsPlotting(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/removeByUserIds`;
    return requestHelper.postRequestData<IpostRemoveByUserIdsPlottingSpace.Model>(url, "3e319692-d727-4437-bca1-c51fd268b4fe", this.data2Mock, params);
  }
}
export const apiUserRelationListObj = new UserRelationListApi();
