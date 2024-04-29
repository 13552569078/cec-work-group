import { requestHelper } from "@/apis/base/mapper-helper";
import { IpostModifyCertPlottingMarkPlottingSpace, IpostFindCertPlottingMarkByIdPlottingSpace, IpostAddCertPlottingMarkPlottingSpace, IpostDeleteCertPlottingMarkPlottingSpace, IpostFindCertPlottingMarkPagePlottingSpace } from "./model";
import { GlobalAPI } from "@/common";

/**
 * 数据访问，此类代码生成器生成
 */
class PlotInfoListApi {
  data2Mock: boolean = false;

  // 标注信息表-修改|标注信息表-修改-标注信息表
  postModifyCertPlottingMarkPlotting(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/modifyCertPlottingMark`;
    return requestHelper.postRequestData<IpostModifyCertPlottingMarkPlottingSpace.Model>(url, "3ec80364-49eb-493b-b6de-049f97372e44", this.data2Mock, params);
  }
  // 标注信息表-主键查询|标注信息表-主键查询-标注信息表
  postFindCertPlottingMarkByIdPlotting(id:number) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/findCertPlottingMarkById`;
    return requestHelper.postRequestData<IpostFindCertPlottingMarkByIdPlottingSpace.Model>(url, "21f56902-e6aa-4ca1-8b8a-4cbbf0679f9e", this.data2Mock, { id });
  }
  // 标注信息表-添加|标注信息表-添加-标注信息表
  postAddCertPlottingMarkPlotting(params: IpostAddCertPlottingMarkPlottingSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/addCertPlottingMark`;
    return requestHelper.postRequestData<IpostAddCertPlottingMarkPlottingSpace.Model>(url, "f36eb812-5f95-4506-8ade-f4d2db7f44dd", this.data2Mock, params);
  }
  // 标注信息表-删除|标注信息表-删除-标注信息表
  postDeleteCertPlottingMarkPlotting(id:string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/deleteCertPlottingMark`;
    return requestHelper.postRequestData<IpostDeleteCertPlottingMarkPlottingSpace.Model>(url, "78075fa2-9d28-4a9f-8b2d-9b92a6323d1e", this.data2Mock, { id });
  }
  // 标注信息表-列表|标注信息表-列表-标注信息表
  postFindCertPlottingMarkPagePlotting(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/findCertPlottingMarkPage`;
    return requestHelper.postRequestData<IpostFindCertPlottingMarkPagePlottingSpace.Model>(url, "3afbafef-d41d-45e1-bc8d-0abcee70ece4", this.data2Mock, params);
  }
}
export const apiPlotInfoListObj = new PlotInfoListApi();
