import { requestHelper } from '@/apis/base/mapper-helper';
import { IpostFindControlledChemicalsPageSpace,IpostModifyControlledChemicalsSpace,IpostDeleteControlledChemicalsSpace,IpostAddControlledChemicalsSpace,IpostFindControlledChemicalsByIdSpace } from './model';
import { GlobalAPI } from '@/common';
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = GlobalAPI.config.API_RISK_PROTECTION_SERVER;

/**
 * 数据访问，此类代码生成器生成
 */
class ControlledChemicalsManagementApi {
  data2Mock: boolean = false;
  
  // 重点监管化学品-列表|重点监管化学品-列表-重点监管化学品
  postFindControlledChemicalsPage(params: IpostFindControlledChemicalsPageSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/chemical/findControlledChemicalsPage`;
      return requestHelper.postRequestData<IpostFindControlledChemicalsPageSpace.Model>(url, '970a4340-d42a-4825-8d76-d38b444b0d2c', this.data2Mock, params);
  }
  // 重点监管化学品-修改|重点监管化学品-修改-重点监管化学品
  postModifyControlledChemicals(params: IpostModifyControlledChemicalsSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/chemical/modifyControlledChemicals`;
      return requestHelper.postRequestData<IpostModifyControlledChemicalsSpace.Model>(url, 'c6ffed05-0cad-4e86-8ed0-0206a7df60cf', this.data2Mock, params);
  }
  // 重点监管化学品-删除|重点监管化学品-删除-重点监管化学品
  postDeleteControlledChemicals(id:string) {
      const url = `${API_DOMAIN}${API_PREFIX}/chemical/deleteControlledChemicals`;
      return requestHelper.postRequestData<IpostDeleteControlledChemicalsSpace.Model>(url, '546fdf1d-9c0e-40f8-8a71-74c95fa4f65d', this.data2Mock, {id});
  }
  // 重点监管化学品-添加|重点监管化学品-添加-重点监管化学品
  postAddControlledChemicals(params: IpostAddControlledChemicalsSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/chemical/addControlledChemicals`;
      return requestHelper.postRequestData<IpostAddControlledChemicalsSpace.Model>(url, '1e07d03c-81e0-4bb7-bee4-f2bf250f64a2', this.data2Mock, params);
  }
  // 重点监管化学品-主键查询|重点监管化学品-主键查询-重点监管化学品
  postFindControlledChemicalsById(id:string) {
      const url = `${API_DOMAIN}${API_PREFIX}/chemical/findControlledChemicalsById`;
      return requestHelper.postRequestData<IpostFindControlledChemicalsByIdSpace.Model>(url, 'e42a63c1-7824-41c5-81f5-16a88b2f52bd', this.data2Mock, {id});
  }
}
export const apiControlledChemicalsManagementObj = new ControlledChemicalsManagementApi();