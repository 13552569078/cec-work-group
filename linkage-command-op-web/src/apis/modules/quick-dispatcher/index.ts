import { requestHelper } from "@/apis/base/mapper-helper";
import { IpostMessageSpace,IpostTaskSpace } from './model';
import { GlobalAPI } from '@/common';

/**
 * 数据访问，此类代码生成器生成
 */
class QuickDispatcherApi {
  data2Mock: boolean = false;

  // 快速创建-通知|快速创建-通知-快速创建
  postMessage(params: any) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/news/quick/message`;
      return requestHelper.postRequestData<IpostMessageSpace.Model>(url, '36ceb04c-fa1f-47d1-8c80-7fc051bce443', this.data2Mock, params);
  }
  // 快速创建-通知|快速创建-通知-批量
  postBatchMessage(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/news/quick/batchMessage`;
    return requestHelper.postRequestData<IpostMessageSpace.Model>(url, '36ceb04c-fa1f-47d1-8c80-7fc051bce443', this.data2Mock, params);
  }
  // 快速创建-任务|快速创建-任务-快速创建
  postTask(params: any) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/news/quick/task`;
      return requestHelper.postRequestData<IpostTaskSpace.Model>(url, 'f9889cc3-8ad6-4b55-96de-e72aa220422e', this.data2Mock, params);
  }
}
export const apiQuickDispatcherObj = new QuickDispatcherApi();
