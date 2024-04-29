import { requestHelper } from "@/apis/base/mapper-helper";
import { IpostFindLogListPlottingSpace, IpostFindCertPlottingLogPagePlottingSpace } from "./model";
import { GlobalAPI } from "@/common";

/**
 * 数据访问，此类代码生成器生成
 */
class PlotHistoryListApi {
  data2Mock: boolean = false;

  // 标绘记录-列表查询|标绘记录-列表查询-标绘记录表
  postFindLogListPlotting(layerId: string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/findLogList`;
    return requestHelper.postRequestData<IpostFindLogListPlottingSpace.Model>(url, "f929992d-1bc1-4400-be92-59d34872907c", this.data2Mock, { layerId });
  }
  // 标绘记录表-列表|标绘记录表-列表-标绘记录表
  postFindCertPlottingLogPagePlotting(params: IpostFindCertPlottingLogPagePlottingSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PLOTTING}/plotting/findCertPlottingLogPage`;
    return requestHelper.postRequestData<IpostFindCertPlottingLogPagePlottingSpace.Model>(url, "153121cf-27a0-45ca-9827-41c8d383205c", this.data2Mock, params);
  }
}
export const apiPlotHistoryListObj = new PlotHistoryListApi();
