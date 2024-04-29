import { requestHelper } from '@/apis/base/mapper-helper';
import { IpostFindMajorHazardByIdSpace,IpostModifyMajorHazardSpace,IpostDeleteMajorHazardSpace,IpostAddMajorHazardSpace,IpostFindMajorHazardPageSpace } from './model';
import { GlobalAPI } from '@/common';
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = GlobalAPI.config.API_RISK_PROTECTION_SERVER;

/**
 * 数据访问，此类代码生成器生成
 */
class MajorHazardManagementApi {
  data2Mock: boolean = false;
  
  // 重大危险源-主键查询|重大危险源-主键查询-重大危险源
  postFindMajorHazardById(id:string) {
      const url = `${API_DOMAIN}${API_PREFIX}/hazard/findMajorHazardById`;
      return requestHelper.postRequestData<IpostFindMajorHazardByIdSpace.Model>(url, 'cffe3c35-9bb1-43a5-be9b-349b91ae2776', this.data2Mock, {id});
  }
  // 重大危险源-修改|重大危险源-修改-重大危险源
  postModifyMajorHazard(params: IpostModifyMajorHazardSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/hazard/modifyMajorHazard`;
      return requestHelper.postRequestData<IpostModifyMajorHazardSpace.Model>(url, '1434ccf6-ef06-42a9-9048-1ae31a3d7a2a', this.data2Mock, params);
  }
  // 重大危险源-删除|重大危险源-删除-重大危险源
  postDeleteMajorHazard(id:string) {
      const url = `${API_DOMAIN}${API_PREFIX}/hazard/deleteMajorHazard`;
      return requestHelper.postRequestData<IpostDeleteMajorHazardSpace.Model>(url, 'b15defbc-44a2-4351-aaa4-33a6468d3cfb', this.data2Mock, {id});
  }
  // 重大危险源-添加|重大危险源-添加-重大危险源
  postAddMajorHazard(params: IpostAddMajorHazardSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/hazard/addMajorHazard`;
      return requestHelper.postRequestData<IpostAddMajorHazardSpace.Model>(url, '53b0a898-335f-4557-bd75-6286a8d1cb17', this.data2Mock, params);
  }
  // 重大危险源-列表|重大危险源-列表-重大危险源
  postFindMajorHazardPage(params: IpostFindMajorHazardPageSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/hazard/findMajorHazardPage`;
      return requestHelper.postRequestData<IpostFindMajorHazardPageSpace.Model>(url, '58bcacfb-980e-4fc3-bdd4-118d39740700', this.data2Mock, params);
  }
}
export const apiMajorHazardManagementObj = new MajorHazardManagementApi();