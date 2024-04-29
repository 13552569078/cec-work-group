import { requestHelper } from "@/apis/base/mapper-helper";
import { IpostAddCertPlottingIconPlottingSpace, IpostModifyCertPlottingIconPlottingSpace, IpostFindCertPlottingIconPagePlottingSpace, IpostFindCertPlottingIconByIdPlottingSpace, IpostDeleteCertPlottingIconPlottingSpace, IpostTreePlottingSpace } from "./model";
import { GlobalAPI } from "@/common";


/**
 * 数据访问，此类代码生成器生成
 */
class PlotIconApi {
  data2Mock: boolean = false;

  // 地图标绘图标-添加|地图标绘图标-添加-地图标绘图标
  postAddCertPlottingIconPlotting(params: IpostAddCertPlottingIconPlottingSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/addCertPlottingIcon`;
    return requestHelper.postRequestData<IpostAddCertPlottingIconPlottingSpace.Model>(url, "e65ce06c-4300-4d7c-9069-361d3459dde7", this.data2Mock, params);
  }
  // 地图标绘图标-修改|地图标绘图标-修改-地图标绘图标
  postModifyCertPlottingIconPlotting(params: IpostModifyCertPlottingIconPlottingSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/modifyCertPlottingIcon`;
    return requestHelper.postRequestData<IpostModifyCertPlottingIconPlottingSpace.Model>(url, "0f3f47ac-e36b-4cad-a5d5-d9ea13eb4597", this.data2Mock, params);
  }
  // 地图标绘图标-列表|地图标绘图标-列表-地图标绘图标
  postFindCertPlottingIconPagePlotting(params: IpostFindCertPlottingIconPagePlottingSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/findCertPlottingIconPage`;
    return requestHelper.postRequestData<IpostFindCertPlottingIconPagePlottingSpace.Model>(url, "c0d6e751-75ba-45f1-8bed-5f3287341614", this.data2Mock, params);
  }
  // 地图标绘图标-主键查询|地图标绘图标-主键查询-地图标绘图标
  postFindCertPlottingIconByIdPlotting(id:number) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/findCertPlottingIconById`;
    return requestHelper.postRequestData<IpostFindCertPlottingIconByIdPlottingSpace.Model>(url, "8b759af6-9081-4fab-8433-8ac3ceb2e917", this.data2Mock, { id });
  }
  // 地图标绘图标-删除|地图标绘图标-删除-地图标绘图标
  postDeleteCertPlottingIconPlotting(id:number) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/deleteCertPlottingIcon`;
    return requestHelper.postRequestData<IpostDeleteCertPlottingIconPlottingSpace.Model>(url, "38a10ebe-42f5-489b-b56f-385ea33aeb40", this.data2Mock, { id });
  }
  // 地图标绘图标-树|地图标绘图标-树-地图标绘图标
  postTreePlotting(rootId:string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/tree/${rootId}`;
    return requestHelper.postRequestData<IpostTreePlottingSpace.Model>(url, "8e212321-8441-453e-8a14-de068adf1621", this.data2Mock, {});
  }
}
export const apiPlotIconObj = new PlotIconApi();
