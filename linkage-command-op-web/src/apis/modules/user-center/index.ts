import { requestHelper } from "@/apis/base/mapper-helper";
import { GlobalAPI } from "@/common";
import {
  IpostOrgTreeOrgSpace,
  IpostAreaTreeAreaSpace,
  IgetFindOrgTreeSpace,
  IgetFindUserListByOrgIdSpace,
  IgetFindUserListByOrgIdsSpace,
  IgetAreaTreeSpace,
  IpostFindResourceTypeAttrPageSpace
} from "./model";

/**
 * 数据访问，此类代码生成器生成
 */
class UserCenterApi {
  data2Mock: boolean = false;

  // 行政区划树|行政区划树-sso-行政区划
  postAreaTreeByCode(level: string|number, pid: string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/sso/area/list`;
    return requestHelper.postRequestData<IpostAreaTreeAreaSpace.Model>(url, 'e43bcd29-b634-41f2-89fb-77924d2a0cd9', this.data2Mock, {level, pid});
  }
  getAreaTree(rootCode: string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/area/tree?rootCode=${rootCode}`;
    return requestHelper.getRequestData<IgetAreaTreeSpace.Model>(url, 'e43bcd29-b634-41f2-89fb-77924d2a0cd9', this.data2Mock);
  }
  // 部门树-用户中心相关接口
  getFindOrgTree() {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_SWAN_COMMAND_SYSTEM}/userCenter/findOrgTree`;
    return requestHelper.getRequestData<IgetFindOrgTreeSpace.Model>(url, '06cacd2d-1c19-4a12-a7d9-757c5220a9fa', this.data2Mock);
  }

  // 查询部门下人员-用户中心相关接口
  getFindUserListByOrgId(orgId:string, haveChild = false) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_SWAN_COMMAND_SYSTEM}/userCenter/findUserListByOrgId?orgId=${orgId}&haveChild=${haveChild}`;
    return requestHelper.getRequestData<IgetFindUserListByOrgIdSpace.Model>(url, 'b175076d-60c1-4e4a-929b-0bb699553f39', this.data2Mock);
  }

  // 查询多个部门下人员-用户中心相关接口
  getFindUserListByOrgIds(orgIds:string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_SWAN_COMMAND_SYSTEM}/userCenter/findUserListByOrgIds?orgIds=${orgIds}`;
    return requestHelper.getRequestData<IgetFindUserListByOrgIdsSpace.Model>(url, 'c3f458b1-f72d-468c-95e9-6341d7c8ad68', this.data2Mock);
  }

  // 查找组织机构下的人
  postPageUser(params: { orgId: string, userName: string }) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/sso/user/findUserList`;
    return requestHelper.postRequestData<any>(url, 'd99fe0a7-f41f-43e7-ad8b-b75e1c0dfc52', this.data2Mock, params);
  }

    // 应急资源-专家表-列表|应急资源-专家表-列表-应急资源-专家表 （新）
    postfindResourceMainPage(params: any) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/resource/findResourceMainPage`;
      return requestHelper.postRequestData<any>(url, '12b7056a-0a4e-4eee-ba7a-13f1987fd870', this.data2Mock, params);
    }

     // 资源类型属性-列表|资源类型属性-列表-资源类型属性
    postFindResourceTypeAttrPage(params: IpostFindResourceTypeAttrPageSpace.RequestParams) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/resource/findResourceTypeAttrPage`;
      return requestHelper.postRequestData<IpostFindResourceTypeAttrPageSpace.Model>(url, '0b33f853-57ce-4295-9863-1a0f6b14bb51', this.data2Mock, params);
    }
}
export const apiUserCenterObj = new UserCenterApi();
