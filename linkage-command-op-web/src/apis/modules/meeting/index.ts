import { requestHelper } from '@/apis/base/mapper-helper'
import { IpostAddMeetingMeetingSpace } from './model'
import { GlobalAPI } from '@/common'

/**
 * 数据访问，此类代码生成器生成
 */
class MeetingApi {
  data2Mock = false;

  // 第一版有:添加会议|第一版有:添加会议-会议
  postAddMeeting(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_PRODUCT_MEETING}/rzt/meeting/addMeeting`
    return requestHelper.postRequestData<IpostAddMeetingMeetingSpace.Model>(url, '98ef70d2-76dc-4c8a-9a9f-fb768b893a5e', this.data2Mock, params)
  }
}
export const apiMeetingObj = new MeetingApi()
