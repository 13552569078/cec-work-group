import { requestHelper } from "@/apis/base/mapper-helper";
import {
  IpostFindEventFixedDeviceListSpace,
  IpostFindVideoPreviewUrlSpace,
  IpostFindEventFixedDeviceTreeSpace,
} from './model';
import { GlobalAPI } from '@/common';

/**
 * 数据访问，此类代码生成器生成
 */
class FixedVideoApi {
  data2Mock: boolean = false;

  postFindEventFixedDeviceList(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/wartime/findEventFixedDeviceList`;
    return requestHelper.postRequestData<IpostFindEventFixedDeviceListSpace.Model>(url, '5ef35fef-1b7c-4341-ae9f-e30043fa46b3', this.data2Mock, params);
  }

  postFindEventFixedDeviceTree(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/wartime/findEventFixedDeviceTree`;
    return requestHelper.postRequestData<IpostFindEventFixedDeviceTreeSpace.Model>(url, '5ef35fef-1b7c-4341-ae9f-e30043fa46b3', this.data2Mock, params);
  }

  postFindVideoPreviewUrl(params: string[]) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/video/findVideoPreviewUrl`;
    return requestHelper.postRequestData<IpostFindVideoPreviewUrlSpace.Model>(url, '5ef35fef-1b7c-4341-ae9f-e30043fa46b3', this.data2Mock, params);
  }

}
export const apiFixedVideoObj = new FixedVideoApi();
