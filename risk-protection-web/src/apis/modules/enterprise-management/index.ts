import { requestHelper } from "@/apis/base/mapper-helper";
import { GlobalAPI } from "@/common";
import { IpostFindCompanyByIdSpace,IpostAddCompanySpace,IpostModifyCompanySpace,IpostFindCompanyPageSpace,IpostDeleteCompanySpace } from './model';
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = GlobalAPI.config.API_RISK_PROTECTION_SERVER;

/**
 * 数据访问，此类代码生成器生成
 */
class EnterpriseManagementApi {
  data2Mock: boolean = false;
  
  // 企业信息-主键查询|企业信息-主键查询-企业信息
  postFindCompanyById(id:string) {
      const url = `${API_DOMAIN}${API_PREFIX}/company/findCompanyById`;
      return requestHelper.postRequestData<IpostFindCompanyByIdSpace.Model>(url, '3d26a752-7a5c-4e66-8092-bb84b0025768', this.data2Mock, {id});
  }
  // 企业信息-添加|企业信息-添加-企业信息
  postAddCompany(params: IpostAddCompanySpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/company/addCompany`;
      return requestHelper.postRequestData<IpostAddCompanySpace.Model>(url, '1de913ad-fa77-46d3-8cc5-fe8a09abcdd7', this.data2Mock, params);
  }
  // 企业信息-修改|企业信息-修改-企业信息
  postModifyCompany(params: IpostModifyCompanySpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/company/modifyCompany`;
      return requestHelper.postRequestData<IpostModifyCompanySpace.Model>(url, '4268baef-a122-4484-a118-57277797f720', this.data2Mock, params);
  }
  // 企业信息-列表|企业信息-列表-企业信息
  postFindCompanyPage(params: IpostFindCompanyPageSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/company/findCompanyPage`;
      return requestHelper.postRequestData<IpostFindCompanyPageSpace.Model>(url, '114e24c9-eff3-4619-930c-ebc5bf1ac8c7', this.data2Mock, params);
  }
  // 企业信息-删除|企业信息-删除-企业信息
  postDeleteCompany(id:string) {
      const url = `${API_DOMAIN}${API_PREFIX}/company/deleteCompany`;
      return requestHelper.postRequestData<IpostDeleteCompanySpace.Model>(url, '7451bb3a-a201-4cc4-ad10-752c06d7ed8a', this.data2Mock, {id});
  }
}
export const apiEnterpriseManagementObj = new EnterpriseManagementApi();