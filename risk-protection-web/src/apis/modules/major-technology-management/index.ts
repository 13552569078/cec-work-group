import { requestHelper } from '@/apis/base/mapper-helper';
import { IpostFindTechnologyPageSpace,IpostModifyTechnologySpace,IpostFindTechnologyByIdSpace,IpostDeleteTechnologySpace,IpostAddTechnologySpace } from './model';
import { GlobalAPI } from '@/common';
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = GlobalAPI.config.API_RISK_PROTECTION_SERVER;

/**
 * 数据访问，此类代码生成器生成
 */
class TechnologyManagementApi {
  data2Mock: boolean = false;
  
  // 重点工艺-列表|重点工艺-列表-重点工艺
  postFindTechnologyPage(params: IpostFindTechnologyPageSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/technology/findTechnologyPage`;
      return requestHelper.postRequestData<IpostFindTechnologyPageSpace.Model>(url, 'b9c7749d-b947-44f8-a927-b0a8864d5442', this.data2Mock, params);
  }
  // 重点工艺-修改|重点工艺-修改-重点工艺
  postModifyTechnology(params: IpostModifyTechnologySpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/technology/modifyTechnology`;
      return requestHelper.postRequestData<IpostModifyTechnologySpace.Model>(url, '3011d4f7-e9e8-499f-924e-72ed5d58c1c5', this.data2Mock, params);
  }
  // 重点工艺-主键查询|重点工艺-主键查询-重点工艺
  postFindTechnologyById(id:string) {
      const url = `${API_DOMAIN}${API_PREFIX}/technology/findTechnologyById`;
      return requestHelper.postRequestData<IpostFindTechnologyByIdSpace.Model>(url, '40182bae-8df6-419f-8dc1-9119e249086f', this.data2Mock, {id});
  }
  // 重点工艺-删除|重点工艺-删除-重点工艺
  postDeleteTechnology(id:string) {
      const url = `${API_DOMAIN}${API_PREFIX}/technology/deleteTechnology`;
      return requestHelper.postRequestData<IpostDeleteTechnologySpace.Model>(url, '7fcc08f9-127a-438d-9855-eed1a693d951', this.data2Mock, {id});
  }
  // 重点工艺-添加|重点工艺-添加-重点工艺
  postAddTechnology(params: IpostAddTechnologySpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/technology/addTechnology`;
      return requestHelper.postRequestData<IpostAddTechnologySpace.Model>(url, '5e297bcf-dbad-42ec-b6b0-459f1acd3d3c', this.data2Mock, params);
  }
}
export const apiTechnologyManagementObj = new TechnologyManagementApi();