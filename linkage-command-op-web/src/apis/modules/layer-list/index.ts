import { requestHelper } from "@/apis/base/mapper-helper";
import {
  IpostModifyCertPlottingLayerPlottingSpace,
  IpostAddCertPlottingLayerPlottingSpace,
  IpostUpdateShowPlottingSpace,
  IpostFindCertPlottingLayerByIdPlottingSpace,
  IpostSyncViewPlottingSpace,
  IpostUpdateSortPlottingSpace,
  IpostLayerListPlottingSpace,
  IpostDeleteCertPlottingLayerPlottingSpace,
  IpostLayerListSpace,
  IpostDeleteCertPlottingLayerSpace,
  IpostLayerListOnePicSpace,
} from "./model";
import { GlobalAPI } from "@/common";

/**
 * 数据访问，此类代码生成器生成
 */
class LayerListApi {
  data2Mock: boolean = false;

  // 图层-修改名称|图层-修改名称-图层信息表
  postModifyCertPlottingLayerPlotting(resourceId?: string, id?: string | number, layerName?: string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/modifyCertPlottingLayer`;
    return requestHelper.postRequestData<IpostModifyCertPlottingLayerPlottingSpace.Model>(url, "42a32023-75c8-4201-9e51-662408ac2c71", this.data2Mock, { resourceId, id, layerName });
  }
  // 图层-添加|图层-添加-图层信息表
  postAddCertPlottingLayerPlotting(resourceId: string, layerName: string, layerType: string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/addCertPlottingLayer`;
    return requestHelper.postRequestData<IpostAddCertPlottingLayerPlottingSpace.Model>(url, "bb1eb880-4976-4137-b1ee-02fa82c28e51", this.data2Mock, { resourceId, layerName, layerType });
  }
  // 图层-显隐修改|图层-显隐修改-图层信息表
  postUpdateShowPlotting(id: number, hasShow: number) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/updateShow`;
    return requestHelper.postRequestData<IpostUpdateShowPlottingSpace.Model>(url, "08c7531b-8b98-4559-a1fb-702aecf7ce79", this.data2Mock, { id, hasShow });
  }
  // 图层-查询图层详情|图层-查询图层详情-图层信息表
  postFindCertPlottingLayerByIdPlotting(id?: number | string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/findCertPlottingLayerById`;
    return requestHelper.postRequestData<IpostFindCertPlottingLayerByIdPlottingSpace.Model>(url, "4e584d16-e069-4268-82f7-c5492bcf945f", this.data2Mock, { id });
  }
  // 图层-同步视野|图层-同步视野-图层信息表
  postSyncViewPlotting(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/syncView`;
    return requestHelper.postRequestData<IpostSyncViewPlottingSpace.Model>(url, "936929a8-d542-4c12-96d2-abe7f37511e7", this.data2Mock, params);
  }
  // 图层-顺序修改|图层-顺序修改-图层信息表
  postUpdateSortPlotting(layerId: number, sort: number) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/updateSort`;
    return requestHelper.postRequestData<IpostUpdateSortPlottingSpace.Model>(url, "267e2795-e32b-4782-8bc1-703b4dcd0bca", this.data2Mock, { layerId, sort });
  }
  // 图层-图层列表|图层-图层列表-图层信息表
  postLayerListPlotting(params: IpostLayerListSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/layerList`;
    return requestHelper.postRequestData<IpostLayerListSpace.Model>(url, '4412bd89-dac5-46e5-b362-0baa52a87b5a', this.data2Mock, params);
  }
  // 图层-删除|图层-删除-图层信息表
  postDeleteCertPlottingLayerPlotting(ids?: string[]) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/deleteCertPlottingLayer`;
    return requestHelper.postRequestData<IpostDeleteCertPlottingLayerSpace.Model>(url, "e934ef1e-9c47-4f19-81e9-ca14625362e9", this.data2Mock, { ids });
  }
  // 图层-加入|图层-加入-图层信息表
  postJoinCertPlottingLayerPlotting(id?: string | number) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/join`;
    return requestHelper.postRequestData<any>(url, "e934ef1e-9c47-4f19-81e9-ca14625362e9", this.data2Mock, { id });
  }
  // 一张图标绘列表
  postLayerListOnePic(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/layerListOnePic`;
    return requestHelper.postRequestData<IpostLayerListOnePicSpace.Model>(url, "e934ef1e-9c47-4f19-81e9-ca14625362e9", this.data2Mock, params);
  }
  // 一张图标绘列表
  postAddCertPlottingLayerOnePic(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/addCertPlottingLayerOnePic`;
    return requestHelper.postRequestData<any>(url, "e934ef1e-9c47-4f19-81e9-ca14625362e9", this.data2Mock, params);
  }
}
export const apiLayerListObj = new LayerListApi();
