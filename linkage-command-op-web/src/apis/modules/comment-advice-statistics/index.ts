import { requestHelper } from "@/apis/base/mapper-helper";
import { IpostDeleteLeaderInstructionSpace,IpostDeleteDepartmentAdviceSpace,IpostAddDepartmentAdviceSpace,IpostDeleteExpertAdviceSpace,IpostFindExpertAdviceByIdSpace,IpostFindDepartmentAdvicePageSpace,IpostFindLeaderInstructionPageSpace,IpostModifyDepartmentAdviceSpace,IpostAddExpertAdviceSpace,IpostFindExpertAdvicePageSpace,IpostFindDepartmentAdviceByIdSpace,IpostAddLeaderInstructionSpace,IpostModifyLeaderInstructionSpace,IpostModifyExpertAdviceSpace,IpostFindLeaderInstructionByIdSpace } from './model';
import { GlobalAPI } from '@/common';


/**
 * 数据访问，此类代码生成器生成
 */
class CommentAdviceStatisticsApi {
  data2Mock: boolean = false;

  // 部门建议表-删除|部门建议表-删除-部门建议表
  postDeleteDepartmentAdvice(id:number) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/deleteDepartmentAdvice`;
      return requestHelper.postRequestData<IpostDeleteDepartmentAdviceSpace.Model>(url, 'a2685fd7-af5e-4c63-9b9e-e230cc9f8841', this.data2Mock, {id});
  }
  // 部门建议表-添加|部门建议表-添加-部门建议表
  postAddDepartmentAdvice(params: IpostAddDepartmentAdviceSpace.RequestParams) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/addDepartmentAdvice`;
      return requestHelper.postRequestData<IpostAddDepartmentAdviceSpace.Model>(url, '11652c1a-b9cb-47c2-84e1-7d3abec89374', this.data2Mock, params);
  }
  // 部门建议表-列表|部门建议表-列表-部门建议表
  postFindDepartmentAdvicePage(params: IpostFindDepartmentAdvicePageSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/findDepartmentAdvicePage`;
    return requestHelper.postRequestData<IpostFindDepartmentAdvicePageSpace.Model>(url, 'da93f16d-28f9-4ece-8646-6bcfad21e02c', this.data2Mock, params);
  }
  // 部门建议表-修改|部门建议表-修改-部门建议表
  postModifyDepartmentAdvice(params: IpostModifyDepartmentAdviceSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/modifyDepartmentAdvice`;
    return requestHelper.postRequestData<IpostModifyDepartmentAdviceSpace.Model>(url, '67debd5e-37ff-4295-90e7-617e5b79faad', this.data2Mock, params);
  }
  // 部门建议表-主键查询|部门建议表-主键查询-部门建议表
  postFindDepartmentAdviceById(id:number) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/findDepartmentAdviceById`;
    return requestHelper.postRequestData<IpostFindDepartmentAdviceByIdSpace.Model>(url, '67820f0d-5ce0-4341-bddc-e7e414ec57a2', this.data2Mock, {id});
  }

  // 专家建议表-删除|专家建议表-删除-专家建议表
  postDeleteExpertAdvice(id:number) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/deleteExpertAdvice`;
      return requestHelper.postRequestData<IpostDeleteExpertAdviceSpace.Model>(url, 'be085c13-18f2-417d-840e-9519efea4cf4', this.data2Mock, {id});
  }
  // 专家建议表-主键查询|专家建议表-主键查询-专家建议表
  postFindExpertAdviceById(id:number) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/findExpertAdviceById`;
      return requestHelper.postRequestData<IpostFindExpertAdviceByIdSpace.Model>(url, '9ee77ee6-d171-4b4d-b9e6-70e350227edf', this.data2Mock, {id});
  }
  // 专家建议表-添加|专家建议表-添加-专家建议表
  postAddExpertAdvice(params: IpostAddExpertAdviceSpace.RequestParams) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/addExpertAdvice`;
      return requestHelper.postRequestData<IpostAddExpertAdviceSpace.Model>(url, 'f8bd1657-f8a6-4cea-84be-942f0560da01', this.data2Mock, params);
  }
  // 专家建议表-列表|专家建议表-列表-专家建议表
  postFindExpertAdvicePage(params: IpostFindExpertAdvicePageSpace.RequestParams) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/findExpertAdvicePage`;
      return requestHelper.postRequestData<IpostFindExpertAdvicePageSpace.Model>(url, 'e0e53828-3653-4e62-8637-a438a978bd8e', this.data2Mock, params);
  }
  // 专家建议表-修改|专家建议表-修改-专家建议表
  postModifyExpertAdvice(params: IpostModifyExpertAdviceSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/modifyExpertAdvice`;
    return requestHelper.postRequestData<IpostModifyExpertAdviceSpace.Model>(url, '5a85b9df-12ac-4ac3-9f29-69d2df316e98', this.data2Mock, params);
  }

  // 领导批示表-删除|领导批示表-删除-领导批示表
  postDeleteLeaderInstruction(id:number) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/deleteLeaderInstruction`;
    return requestHelper.postRequestData<IpostDeleteLeaderInstructionSpace.Model>(url, '85182594-7285-433b-80d7-b13fa70d55b4', this.data2Mock, {id});
  }
  // 领导批示表-列表|领导批示表-列表-领导批示表
  postFindLeaderInstructionPage(params: IpostFindLeaderInstructionPageSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/findLeaderInstructionPage`;
    return requestHelper.postRequestData<IpostFindLeaderInstructionPageSpace.Model>(url, '5f4564bc-3d7c-43aa-9c65-c178c261fadc', this.data2Mock, params);
  }
  // 领导批示表-添加|领导批示表-添加-领导批示表
  postAddLeaderInstruction(params: IpostAddLeaderInstructionSpace.RequestParams) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/addLeaderInstruction`;
      return requestHelper.postRequestData<IpostAddLeaderInstructionSpace.Model>(url, '6eacdf85-2fa3-428f-b3b1-7d3d70a6ec9d', this.data2Mock, params);
  }
  // 领导批示表-修改|领导批示表-修改-领导批示表
  postModifyLeaderInstruction(params: IpostModifyLeaderInstructionSpace.RequestParams) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/modifyLeaderInstruction`;
      return requestHelper.postRequestData<IpostModifyLeaderInstructionSpace.Model>(url, '8523260a-0636-4e1f-a9e7-43b8ec3ea4d0', this.data2Mock, params);
  }

  // 领导批示表-主键查询|领导批示表-主键查询-领导批示表
  postFindLeaderInstructionById(id:number) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/event/findLeaderInstructionById`;
      return requestHelper.postRequestData<IpostFindLeaderInstructionByIdSpace.Model>(url, '3fcd58c6-7039-4903-be4d-4a0d1c3698d8', this.data2Mock, {id});
  }
}
export const apiCommentAdviceStatisticsObj: CommentAdviceStatisticsApi & Record<string, any> = new CommentAdviceStatisticsApi();
