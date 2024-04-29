import { requestHelper } from '@/apis/base/mapper-helper';
import { GlobalAPI } from '@/common';
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_SWAN = GlobalAPI.config.API_PREFIX_SWAN_UCENTER;
import { IpostLogoutSsoSpace, IpostAreaTreeAreaSpace, IpostCheckTokenSsoSpace, IpostLoginSsoSpace, IpostGetUserInfoSsoSpace, IpostOrgTreeOrgSpace, IpostFindUserUserSpace } from './model';
console.log(API_SWAN, 'API_SWAN')

/**
 * 数据访问，此类代码生成器生成
 */
class SwanApi {
  data2Mock: boolean = false;

  // 用户退出|用户退出-用户登录
  postLogoutSso() {
    const url = `${API_DOMAIN}${API_SWAN}/sso/logout`;
    return requestHelper.postRequestData<IpostLogoutSsoSpace.Model>(url, '0614e7de-668d-45e6-aeb6-fe772c03d5e4', this.data2Mock, {});
  }
  // 行政区划树|行政区划树-sso-行政区划
  postAreaTreeArea() {
    const url = `${API_DOMAIN}${API_SWAN}/sso/area/areaTree`;
    return requestHelper.postRequestData<IpostAreaTreeAreaSpace.Model>(url, 'e43bcd29-b634-41f2-89fb-77924d2a0cd9', this.data2Mock, {});
  }
  // 校验token|校验token-用户登录
  postCheckTokenSso() {
    const url = `${API_DOMAIN}${API_SWAN}/sso/checkToken`;
    return requestHelper.postRequestData<IpostCheckTokenSsoSpace.Model>(url, '609e1018-7c83-4155-b91e-a6d9e60dc6c1', this.data2Mock, {});
  }
  // 用户登录|用户登录-用户登录
  postLoginSso(params: IpostLoginSsoSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_SWAN}/sso/login`;
    return requestHelper.postRequestData<IpostLoginSsoSpace.Model>(url, 'd99fe0a7-f41f-43e7-ad8b-b75e1c0dfc52', this.data2Mock, params);
  }
  // 获取当前登录用户的信息|获取当前登录用户的信息-用户信息
  postGetUserInfoSso(sysId?: number) {
    const url = `${API_DOMAIN}${API_SWAN}/sso/getUserInfo`;
    return requestHelper.postRequestData<IpostGetUserInfoSsoSpace.Model>(url, '952ea6a4-e888-4f3a-9b1b-f5f77a9b4205', this.data2Mock, { sysId });
  }
  // 组织机构树|组织机构树-sso-组织机构
  postOrgTreeOrg(rootId: number, userType: number, externalEntId?: number,) {
    const url = `${API_DOMAIN}${API_SWAN}/sso/org/orgTree`;
    return requestHelper.postRequestData<IpostOrgTreeOrgSpace.Model>(url, '38b8bc42-e766-4624-8b44-0410fbbc48b7', this.data2Mock, { externalEntId, rootId, userType });
  }
  // 用户列表|用户列表-用户信息
  postFindUserUser(params: IpostFindUserUserSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_SWAN}/sso/user/findUser`;
    return requestHelper.postRequestData<IpostFindUserUserSpace.Model>(url, 'd53f2250-4f46-4ad0-b626-04d003797b4a', this.data2Mock, params);
  }
  // 行政区划树|行政区划树-sso-行政区划
  postAreaTreeByCode(areaCode: string) {
    const url = `${API_DOMAIN}${API_SWAN}/sso/area/areaTreeByAreaCode`;
    return requestHelper.postRequestData<IpostAreaTreeAreaSpace.Model>(url, 'e43bcd29-b634-41f2-89fb-77924d2a0cd9', this.data2Mock, { areaCode });
  }
  // 查找组织机构下的人
  postPageUser(params: any) {
    const url = `${API_DOMAIN}${API_SWAN}/sso/user/findUserList`;
    return requestHelper.postRequestData<any>(url, 'd99fe0a7-f41f-43e7-ad8b-b75e1c0dfc52', this.data2Mock, params);
  }
  // 查找组织机构下的人
  postPageOrgList(params: any) {
    const url = `${API_DOMAIN}${API_SWAN}/sso/org/orgList`;
    return requestHelper.postRequestData<any>(url, 'd99fe0a7-f41f-43e7-ad8b-b75e1c0dfc52', this.data2Mock, params);
  }
}
export const apiSwanObj = new SwanApi();
