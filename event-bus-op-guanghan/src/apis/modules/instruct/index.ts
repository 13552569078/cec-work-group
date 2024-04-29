import { requestHelper } from "@/apis/base/mapper-helper";
import { IpostSendSpace,IpostReceiveSpace,IpostHistorySpace,IgetCommandSpace,IpostReplySpace } from './model';
import { GlobalAPI } from '@/common';
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = GlobalAPI.config.API_PREFIX_OP;

/**
 * 数据访问，此类代码生成器生成
 */
class InstructApi {
  data2Mock: boolean = false;

  // 下发指令|下发指令-一张图-指令接口
  postSend(params: IpostSendSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/command/send`;
      return requestHelper.postRequestData<IpostSendSpace.Model>(url, 'dfad9800-b35d-4c43-82c8-25eb0a6dde69', this.data2Mock, params);
  }
  // 指令接收|指令接收-一张图-指令接口
  postReceive(params: IpostReceiveSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/command/receive`;
      return requestHelper.postRequestData<IpostReceiveSpace.Model>(url, 'b1d7c45e-7792-453b-a663-bfcabbe35f3b', this.data2Mock, params);
  }
  // 指令历史|指令历史-一张图-指令接口
  postHistory(params: IpostHistorySpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/command/history`;
      return requestHelper.postRequestData<IpostHistorySpace.Model>(url, '011fbf4a-87f4-4b80-9928-cd39c32c7501', this.data2Mock, params);
  }
  // 指令详情|指令详情-一张图-指令接口
  getCommand(id:string) {
      const url = `${API_DOMAIN}${API_PREFIX}/command/${id}`;
      return requestHelper.getRequestData<IgetCommandSpace.Model>(url, '1ba339df-dd65-409b-bf2d-a329a45205c7', this.data2Mock);
  }
  // 指令反馈|指令反馈-一张图-指令接口
  postReply(id:number,mediaList:any[],replyContent:string) {
      const url = `${API_DOMAIN}${API_PREFIX}/command/reply`;
      return requestHelper.postRequestData<IpostReplySpace.Model>(url, '69a464f1-535e-440e-9c30-e2862d4c65d2', this.data2Mock, {id,mediaList,replyContent});
  }
}
export const apiInstructObj = new InstructApi();
