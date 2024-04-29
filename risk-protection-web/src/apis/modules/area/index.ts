import { requestHelper } from "@/apis/base/mapper-helper";
import { IlistSpace,IpostFindCommunityByAreaCodeSpace } from './model';
import { GlobalAPI } from '@/common';
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = GlobalAPI.config.API_RISK_PROTECTION_SERVER;

/**
 * 数据访问，此类代码生成器生成
 */
class AreaCodeApi {
  data2Mock: boolean = false;
  
  // 行政区划列表|行政区划列表-行政区划
  list() {
    const url = `${API_DOMAIN}${API_PREFIX}/area/list`;
    return requestHelper.getRequestData<IlistSpace.Model>(url, '6bf49ad9-b2d0-4aed-b21f-3d66bc37e884', this.data2Mock);
  }
  // 行政区划列表|行政区划列表-行政区划
  allList() {
    const url = `${API_DOMAIN}${API_PREFIX}/area/all`;
    return requestHelper.getRequestData<IlistSpace.Model>(url, '6bf49ad9-b2d0-4aed-b21f-3d66bc37e884', this.data2Mock);
  }
  // 社区（行政村）列表|社区（行政村）列表-社区（行政村）减灾能力
  postFindCommunityByAreaCode(areaCode:string) {
    const url = `${API_DOMAIN}${API_PREFIX}/disater/findCommunityByAreaCode/${areaCode}`;
    return requestHelper.postRequestData<IpostFindCommunityByAreaCodeSpace.Model>(url, 'dce1e6f3-3368-43ee-acdc-d34020ce38d1', this.data2Mock, {areaCode});
   }
}
export const apiAreaCodeObj = new AreaCodeApi();