import { requestHelper } from "@/apis/base/mapper-helper";
import { IgetTreeSpace,IpostUsersSpace } from './model';
import { GlobalAPI } from '@/common';
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = GlobalAPI.config.API_PREFIX_OP;

/**
 * 数据访问，此类代码生成器生成
 */
class EventDetailApi {
  data2Mock: boolean = false;
  
  // 组织机构树|组织机构树-一张图-公用接口
  getTree() {
      const url = `${API_DOMAIN}${API_PREFIX}/event/common/org/tree`;
      return requestHelper.getRequestData<IgetTreeSpace.Model>(url, '1f1a6c02-6f01-4bb2-ae39-3d083c5e1578', this.data2Mock);
  }
  // 组织机构-用户信息|组织机构-用户信息-一张图-公用接口
  postUsers(orgId:number,pageNum:number,pageSize:number) {
      const url = `${API_DOMAIN}${API_PREFIX}/event/common/org/users`;
      return requestHelper.postRequestData<IpostUsersSpace.Model>(url, '0b1ba7ae-5dda-459f-9d73-cb109a50e76f', this.data2Mock, {orgId,pageNum,pageSize});
  }
}
export const apiEventDetailObj = new EventDetailApi();