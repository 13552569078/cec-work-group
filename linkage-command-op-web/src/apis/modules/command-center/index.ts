import { requestHelper } from "@/apis/base/mapper-helper";
import {
  IpostDeleteStrategyCommandGroupSpace,
  IpostFindStrategyCommandGroupTreeSpace,
  IpostFindStrategyCommandUserPageSpace,
  IpostDeleteStrategyCommandUserSpace,
  IpostBatchDeleteStrategyCommandUserSpace,
  IpostBatchAddStrategyCommandUserSpace,
  IpostFindStrategyCommandUserByIdSpace,
  IpostModifyStrategyCommandUserSpace,
  IpostAddStrategyCommandUserSpace,
  IpostFindStrategyCommandOrgPageSpace,
  IpostDeleteStrategyCommandOrgSpace,
  IpostBatchDeleteStrategyCommandOrgSpace,
  IpostModifyStrategyCommandOrgRoleSpace,
  IpostAddStrategyCommandOrgSpace,
  IpostCreateMeetingVerificationSpace,
  IpostFindCommandSysCommunicationMetadataSpace,
  IpostAddStrategyCommandGroupSpace,
  IpostUpdateOriginalCommanderSpace,
  IpostFindStrategyCommandGroupPageSpace,
  IpostModifyStrategyCommandGroupSpace,
  IpostFindCommandGroupTreeByEventIdSpace,
  IpostSaveNewCommanderSpace,
  IpostModifyJobDescriptionCommandGroupSpace,
  IpostFindStrategyCommandGroupByIdSpace,
  IpostUpGradeOrDemoteCommandGroupSpace,
  IpostStrategyCommandToBeAssembledSumSpace,
  IpostStrategyCommandGroupAmountSpace,
  IpostCreateTaskAndAssembleVerificationSpace,
  IpostCreateNoticeVerificationSpace,
  IpostAddCommandCenterAssembleSpace,
  IpostFindCommandCenterAssemblePointListSpace,
} from "./model";
import { GlobalAPI } from "@/common";

/**
 * 数据访问，此类代码生成器生成
 */
class CommandCenterApi {
  data2Mock: boolean = false;

  // 指挥体系树
  postFindStrategyCommandGroupTree(params: IpostFindStrategyCommandGroupTreeSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/strategy/findStrategyCommandGroupTree`;
    return requestHelper.postRequestData<IpostFindStrategyCommandGroupTreeSpace.Model>(
      url,
      "2c7df00e-cbb8-445c-aecf-eee42dd91850",
      this.data2Mock,
      params
    );
  }
  // 指挥体系-参与人员列表
  postFindStrategyCommandUserPage(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/strategy/findStrategyCommandUserPage`;
    return requestHelper.postRequestData<IpostFindStrategyCommandUserPageSpace.Model>(url, '111e18a1-6199-4b66-ad85-9a5684c0dca7', this.data2Mock, params);
  }

  // 指挥体系-参与人员-删除
  postDeleteStrategyCommandUser(id:number) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/strategy/deleteStrategyCommandUser`;
    return requestHelper.postRequestData<IpostDeleteStrategyCommandUserSpace.Model>(url, '7aea057d-2916-450a-87c7-93fe6d7c71ba', this.data2Mock, {id});
  }

  // 指挥体系-参与人员-批量删除
  postBatchDeleteStrategyCommandUser(ids: string[]) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/strategy/batchDeleteStrategyCommandUser`;
    return requestHelper.postRequestData<IpostBatchDeleteStrategyCommandUserSpace.Model>(url, 'bba6b053-1c30-4ac5-956f-03528068c049', this.data2Mock, {ids});
  }

  // 指挥体系-参与人员-批量添加
  postBatchAddStrategyCommandUser(members:any[]) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/strategy/batchAddStrategyCommandUser`;
    return requestHelper.postRequestData<IpostBatchAddStrategyCommandUserSpace.Model>(url, '6b07ac07-2814-442c-bdae-606411ad90ad', this.data2Mock, members);
  }

  // 指挥体系-人员列表
  postFindStrategyCommandUserById(id:number|string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/strategy/findStrategyCommandUserById`;
    return requestHelper.postRequestData<IpostFindStrategyCommandUserByIdSpace.Model>(url, '1f582d02-c95b-4f30-a039-70d2c6a96425', this.data2Mock, {id});
  }

   // 指挥体系-人员修改
  postModifyStrategyCommandUser(params: IpostModifyStrategyCommandUserSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/strategy/modifyStrategyCommandUser`;
    return requestHelper.postRequestData<IpostModifyStrategyCommandUserSpace.Model>(url, '6981363a-ea2d-4928-b240-c24e21eaa6e8', this.data2Mock, params);
  }

  // 指挥体系-人员添加
  postAddStrategyCommandUser(params: IpostAddStrategyCommandUserSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/strategy/addStrategyCommandUser`;
    return requestHelper.postRequestData<IpostAddStrategyCommandUserSpace.Model>(url, '0b7cf90f-bc33-49c2-a3e7-aae8a9f1a792', this.data2Mock, params);
  }

  // 指挥体系-机构列表
  postFindStrategyCommandOrgPage(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/strategy/findStrategyCommandOrgPage`;
    return requestHelper.postRequestData<IpostFindStrategyCommandOrgPageSpace.Model>(
      url,
      "712a0811-7152-4ec9-bf02-7805e06b6446",
      this.data2Mock,
      params
    );
  }

  // 指挥体系-机构删除
  postDeleteStrategyCommandOrg(id: number) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/strategy/deleteStrategyCommandOrg`;
    return requestHelper.postRequestData<IpostDeleteStrategyCommandOrgSpace.Model>(
      url,
      "2c43406a-762e-4c53-9f9f-08dff096596d",
      this.data2Mock,
      { id }
    );
  }

  // 指挥体系-机构批量删除
  postBatchDeleteStrategyCommandOrg(ids: string[]) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/strategy/batchDeleteStrategyCommandOrg`;
    return requestHelper.postRequestData<IpostBatchDeleteStrategyCommandOrgSpace.Model>(
      url,
      "c28af67d-2350-4766-add2-d2377e11a02f",
      this.data2Mock,
      { ids }
    );
  }

   // 指挥体系机构-修改岗位职责
   postModifyStrategyCommandOrgRole(id: number, roleIds: string[], jobDescription: string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/strategy/modifyStrategyCommandOrgRole`;
    return requestHelper.postRequestData<IpostModifyStrategyCommandOrgRoleSpace.Model>(
      url,
      "56a5157f-55eb-4850-8170-5f8e7b7ed1d1",
      this.data2Mock,
      { id, roleIds, jobDescription }
    );
  }

  // 指挥体系-机构添加
  postAddStrategyCommandOrg(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/strategy/addStrategyCommandOrg`;
    return requestHelper.postRequestData<IpostAddStrategyCommandOrgSpace.Model>(
      url,
      "2862ac05-f9e7-49d3-9ee4-77ea2482933d",
      this.data2Mock,
      params
    );
  }

  // 指挥体系-快速创建会议校验
  postCreateMeetingVerification(params: { orgIds?: string[], personIds?: string[] }) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/strategy/createMeetingVerification`;
    return requestHelper.postRequestData<IpostCreateMeetingVerificationSpace.Model>(url, '1e19f4cc-62e8-4253-8d98-91d084a2cfbb', this.data2Mock, params);
  }

  // 指挥体系-人员联络通信方式
  postFindCommandSysCommunicationMetadata(type:string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_SWAN_COMMAND_SYSTEM}/commandsystem/findCommandSysCommunicationMetadata`;
    return requestHelper.postRequestData<IpostFindCommandSysCommunicationMetadataSpace.Model>(url, '8c37e8c6-a77d-4f0f-a8d3-1b4b1395473e', this.data2Mock, {type});
  }

  // 指挥中心集结表-添加|指挥中心集结表-添加-指挥中心集结表
  postAddCommandCenterAssemble(params: IpostAddCommandCenterAssembleSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/commandCenter/addCommandCenterAssemble`;
    return requestHelper.postRequestData<IpostAddCommandCenterAssembleSpace.Model>(
      url,
      "280019d7-73c1-4626-9802-b2fdcd3a5ec8",
      this.data2Mock,
      params
    );
  }

  // 指挥中心集结点表-列表|指挥中心集结点表-列表-指挥中心集结点表
  postFindCommandCenterAssemblePointList(eventInfoId: number|string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/commandCenter/findCommandCenterAssemblePointList`;
    return requestHelper.postRequestData<IpostFindCommandCenterAssemblePointListSpace.Model>(
      url,
      "7eb397af-4035-4ce3-8c22-88ac5255fd9f",
      this.data2Mock,
      { eventInfoId }
    );
  }

}
export const apiCommandCenterObj = new CommandCenterApi();
