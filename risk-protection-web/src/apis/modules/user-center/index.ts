import { requestHelper } from "@/apis/base/mapper-helper";
import { GlobalAPI } from "@/common";
import { IpostOrgTreeOrgSpace, IpostAreaTreeAreaSpace } from "./model";

const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = GlobalAPI.config.API_PREFIX_OP_SERVER;

/**
 * 数据访问，此类代码生成器生成
 */
class SwanApi {
  data2Mock: boolean = false;

  // 行政区划树|行政区划树-sso-行政区划
  postAreaTreeByCode(level: string|number, pid: string) {
    const url = `${API_DOMAIN}${API_PREFIX}/sso/area/list`;
    return requestHelper.postRequestData<IpostAreaTreeAreaSpace.Model>(url, 'e43bcd29-b634-41f2-89fb-77924d2a0cd9', this.data2Mock, {level, pid});
  }
}
export const apiUserCenterObj = new SwanApi();
