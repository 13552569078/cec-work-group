import { requestHelper } from "@/apis/base/mapper-helper";
import { IpostGetUserInfoSsoSpace, IpostLogoutSsoSpace  } from './model';
import { GlobalAPI } from "@/common";

/**
 * 数据访问，此类代码生成器生成
 */
class UserApi {
  data2Mock: boolean = false;

  // 获取当前登录用户的信息|获取当前登录用户的信息-用户信息
  postGetUserInfoSso() {
    const url = `${GlobalAPI.config.SWAN_UCENTER_URL}/sso/getUserInfo`;
    return requestHelper.postRequestData<IpostGetUserInfoSsoSpace.Model>(url, 'cffa44b2-4632-4795-a65a-cd763e0520bf', this.data2Mock, {});
  }
  // 用户退出|用户退出-用户登录
  postLogoutSso(token:string) {
    const url = `${GlobalAPI.config.SWAN_UCENTER_URL}/sso/logout?token=${token}`;
    return requestHelper.postRequestData<IpostLogoutSsoSpace.Model>(url, '4e7626ba-d527-40a2-a24f-227345613561', this.data2Mock);
  }

  Run(methodName: string, params: any) {
    let result: any = new Promise(() => ({ data: {} }));
    switch (methodName) {

      case "postGetUserInfoSso":
        result = this.postGetUserInfoSso();
        break;
      case "postLogoutSso":
        const { token } = params;
      result = this.postLogoutSso(token);
      break;
      default:
        break;
    }
    return result;
  }
}
export const apiUserInfoObj = new UserApi();
