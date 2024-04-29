import { requestHelper } from "@/apis/base/mapper-helper";
import {
  IgetVideoTypeSpace,
  IgetVideoDetailTypeSpace
} from './model';
import { GlobalAPI } from '@/common';
const API_DOMAIN = GlobalAPI.config.BASE_URL_API;
const API_PREFIX = GlobalAPI.config.BASE_URL_VIDEO;

/**
 * 数据访问，此类代码生成器生成
 */
class VideoDataApi {
  data2Mock: boolean = false;

  // 防汛视频列表
  getFindVideoList(params:IgetVideoTypeSpace.RequestParams) {
    const { name, adcode, pageSize, pageNo } = params;
    const url = `${API_DOMAIN}/zdpc/swes/fx/video/deviceList?name=${name}&adcode=${adcode}&pageSize=${pageSize}&pageNo=${pageNo}`;
    return requestHelper.getRequestData<IgetVideoTypeSpace.Model>(url, '0479354a-eb9d-44be-ba10-f84f959f3508', this.data2Mock);
  }
  // 游乐视频列表
  getFindYLVideoList(params:IgetVideoTypeSpace.RequestParams) {
    const { name, adcode, pageSize, pageNo } = params;
    const url = `${API_DOMAIN}/zdpc/swes/yl/video/deviceList?name=${name}&adcode=${adcode}&pageSize=${pageSize}&pageNo=${pageNo}`;
    return requestHelper.getRequestData<IgetVideoTypeSpace.Model>(url, '0479354a-eb9d-44be-ba10-f84f959f3508', this.data2Mock);
  }
  // 消防视频列表
  getFindXFVideoList(params:IgetVideoTypeSpace.RequestParams) {
    const url = `${API_DOMAIN}/cockpit/pad/api/xf/video/deviceList`;
    return requestHelper.postRequestData<IgetVideoTypeSpace.Model>(url, '0479354a-eb9d-44be-ba10-f84f959f3508', this.data2Mock,params);
  }
  // 视频详情
  postFindVideoDetail(params:IgetVideoDetailTypeSpace.RequestParams) {
    const url = `${API_DOMAIN}/zdpc/swes/fx/video/playUrl`;
    return requestHelper.postRequestData<IgetVideoDetailTypeSpace.Model>(url, '0479354a-eb9d-44be-ba10-f84f959f3508', this.data2Mock,params);
  }
}
export const apiVideoDataObj = new VideoDataApi();
