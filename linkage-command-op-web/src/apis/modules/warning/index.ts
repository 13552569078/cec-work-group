import { requestHelper } from "@/apis/base/mapper-helper";
import {
  IpostFindWarningPageSpace,
} from './model';
import { GlobalAPI } from '@/common';

/**
 * 数据访问，此类代码生成器生成
 */
class WarningApi {
  data2Mock: boolean = false;

  postFindWarningPage(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/warning/findWarningPage`;
    return requestHelper.postRequestData<IpostFindWarningPageSpace.Model>(url, '5ef35fef-1b7c-4341-ae9f-e30043fa46b3', this.data2Mock, params);
  }

}
export const apiWarningObj = new WarningApi();
