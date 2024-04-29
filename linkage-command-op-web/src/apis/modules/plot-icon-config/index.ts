import { requestHelper } from "@/apis/base/mapper-helper";
/* eslint-disable */
import { IpostFindCertPlottingIconByIdSpace,IpostModifyCertPlottingIconSpace, IpostCatalogTreeSpace,IpostFindCertPlottingIconPageSpace,IpostFindCertPlottingIconListInCatagorySpace,IpostUpdateStatusSpace,IpostTopicsSpace,IpostDeleteCertPlottingIconSpace,IpostTreeSpace,IpostAddCertPlottingIconSpace } from './model';
import { GlobalAPI } from "@/common";

/**
 * 数据访问，此类代码生成器生成
 */
class PlottingIconConfigApi {
  data2Mock: boolean = false;

  // 地图标绘图标-主键查询|地图标绘图标-主键查询-地图标绘图标
  postFindCertPlottingIconById(id:number) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/findCertPlottingIconById`;
      return requestHelper.postRequestData<IpostFindCertPlottingIconByIdSpace.Model>(url, '34e6f364-bd5a-4388-88a3-9cf98bb88b9e', this.data2Mock, {id});
  }
  // 地图标绘图标-修改|地图标绘图标-修改-地图标绘图标
  postModifyCertPlottingIcon(params: IpostModifyCertPlottingIconSpace.RequestParams) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/modifyCertPlottingIcon`;
      return requestHelper.postRequestData<IpostModifyCertPlottingIconSpace.Model>(url, 'a9dd5e81-e167-41b9-abad-28430bb43cbe', this.data2Mock, params);
  }
  // 地图标绘图标-分类树|地图标绘图标-分类树-地图标绘图标
  postCatalogTree(rootId:string) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/catalogTree/${rootId}`;
      return requestHelper.postRequestData<IpostCatalogTreeSpace.Model>(url, '96b2a908-a886-400e-9eb9-c45ddbb8e479', this.data2Mock, {rootId});
  }
  // 地图标绘图标-分页列表|地图标绘图标-分页列表-地图标绘图标
  postFindCertPlottingIconPage(params: IpostFindCertPlottingIconPageSpace.RequestParams) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/findCertPlottingIconPage`;
      return requestHelper.postRequestData<IpostFindCertPlottingIconPageSpace.Model>(url, '452b3a57-2baf-49d4-90f2-81207635f51e', this.data2Mock, params);
  }
  // 地图标绘图标-查询指定分类下的图标|地图标绘图标-查询指定分类下的图标-地图标绘图标
  postFindCertPlottingIconListInCatagory(catagoryId:number, certPlottingIconPageParam: {}) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/findCertPlottingIconListInCatagory/${catagoryId}`;
      return requestHelper.postRequestData<IpostFindCertPlottingIconListInCatagorySpace.Model>(url, 'efd6846f-18a9-4f9e-84c0-af1344886c2b', this.data2Mock, certPlottingIconPageParam);
  }
  // 地图标绘图标-批量修改状态|地图标绘图标-批量修改状态-地图标绘图标
  postUpdateStatus(status:string, integers: any) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/updateStatus/${status}`;
      return requestHelper.postRequestData(url, '485a1e95-1614-4a3e-aeab-a27496c717d6', this.data2Mock, integers);
  }
  // 地图标绘图标-专题列表|地图标绘图标-专题列表-地图标绘图标
  postTopics() {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/topics`;
      return requestHelper.postRequestData<IpostTopicsSpace.Model>(url, 'af09c852-1098-48ca-b6cc-2dd0afdb12dd', this.data2Mock, {});
  }
  // 地图标绘图标-删除|地图标绘图标-删除-地图标绘图标
  postDeleteCertPlottingIcon(ids:[]) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/deleteCertPlottingIcon`;
      return requestHelper.postRequestData<IpostDeleteCertPlottingIconSpace.Model>(url, '8c1280de-7b6d-4459-9e7a-4b51169c399f', this.data2Mock, {ids});
  }
  // 地图标绘图标-树|地图标绘图标-树-地图标绘图标
  postTree(rootId:number) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/tree/{rootId}`;
      return requestHelper.postRequestData<IpostTreeSpace.Model>(url, '9a104ff4-f7a3-4eb9-b660-14be3e886a6d', this.data2Mock, {rootId});
  }
  // 地图标绘图标-添加|地图标绘图标-添加-地图标绘图标
  postAddCertPlottingIcon(params: IpostAddCertPlottingIconSpace.RequestParams[]) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/addCertPlottingIcon`;
      return requestHelper.postRequestData<IpostAddCertPlottingIconSpace.Model>(url, '1970c690-b089-4cce-9327-4730d49ca907', this.data2Mock, params);
  }
}
export const apiPlottingIconConfigObj = new PlottingIconConfigApi();
