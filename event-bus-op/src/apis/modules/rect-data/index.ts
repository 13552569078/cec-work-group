import { requestHelper } from "@/apis/base/mapper-helper";
import { IgetRectDataSpace, IgetRectManagerDataSpace } from './model';
import { GlobalAPI } from '@/common';
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = GlobalAPI.config.API_PREFIX_OP;

/**
 * 数据访问，此类代码生成器生成
 */
class RectApi {
  data2Mock: boolean = false;

  // 网格信息
  getRectData(params: IgetRectDataSpace.RequestParams) {
    const { wgbm, wglx } = params;
    const url = `${API_DOMAIN}${API_PREFIX}/wangge/data?wgbm=${wgbm}&wglx=${wglx}`;
    return requestHelper.getRequestData<IgetRectDataSpace.Model>(url, '1ba339df-dd65-409b-bf2d-a329a45205c7', this.data2Mock);
  }
  // 网格员信息
  getRectManagerData(params: IgetRectManagerDataSpace.RequestParams) {
    const { wgbm, wglx, pageSize, pageNum } = params;
    const url = `${API_DOMAIN}${API_PREFIX}/wangge/wgydata?wgbm=${wgbm}&wglx=${wglx}&pageSize=${pageSize}&pageNum=${pageNum}`;
    return requestHelper.getRequestData<IgetRectDataSpace.Model>(url, '1ba339df-dd65-409b-bf2d-a329a45205c7', this.data2Mock);
  }
}
export const apiRectDataObj = new RectApi();
