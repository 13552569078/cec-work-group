import { requestHelper } from "@/apis/base/mapper-helper";
import { GlobalAPI } from '@/common';
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = ''
// const API_PREFIX = GlobalAPI.config.API_PREFIX_EVENT_HANDLE_STRATEGY;

/**
 * 数据访问，此类代码生成器生成
 */
class HomePageApi {
  data2Mock: boolean = false;
  // 事件首页-资源统计*
  getStatEventResource() {
    const url = `${API_DOMAIN}${API_PREFIX}/api/lc-home/event/statEventResource`;
    return requestHelper.getRequestData<any>(url, '0170a3ed-f32e-4995-9fe5-e7880c6548d2', this.data2Mock);
  }
  // 事件首页-事件列表*
  getEventList() {
    const url = `${API_DOMAIN}${API_PREFIX}/api/lc-home/event/eventList`;
    return requestHelper.getRequestData<any>(url, '0170a3ed-f32e-4995-9fe5-e7880c6548d2', this.data2Mock);
  }
  // 事件首页-事件占比*
  getStatEventRatioByLevel() {
    const url = `${API_DOMAIN}${API_PREFIX}/api/lc-home/event/statEventRatioByLevel`;
    return requestHelper.getRequestData<any>(url, '0170a3ed-f32e-4995-9fe5-e7880c6548d2', this.data2Mock);
  }
  // 事件首页-事件top5 *
  getStatEventTopByType() {
    const url = `${API_DOMAIN}${API_PREFIX}/api/lc-home/event/statEventTopByType`;
    return requestHelper.getRequestData<any>(url, '0170a3ed-f32e-4995-9fe5-e7880c6548d2', this.data2Mock);
  }
  // 事件首页-事件趋势 *
  getStatEventTrendByLevel() {
    const url = `${API_DOMAIN}${API_PREFIX}/api/lc-home/event/statEventTrendByLevel`;
    return requestHelper.getRequestData<any>(url, '0170a3ed-f32e-4995-9fe5-e7880c6548d2', this.data2Mock);
  }
  // 事件首页-最近会议列表 *
  getMeetingList() {
    const url = `${API_DOMAIN}${API_PREFIX}/api/lc-home/event/meetingList`;
    return requestHelper.getRequestData<any>(url, '0170a3ed-f32e-4995-9fe5-e7880c6548d2', this.data2Mock);
  }
  // 事件首页-任务统计*
  getStatTask() {
    const url = `${API_DOMAIN}${API_PREFIX}/api/lc-home/event/statTask`;
    return requestHelper.getRequestData<any>(url, '0170a3ed-f32e-4995-9fe5-e7880c6548d2', this.data2Mock);
  }
  // 事件首页-策略统计*
  getStatEventStrategy() {
    const url = `${API_DOMAIN}${API_PREFIX}/api/lc-home/event/statEventStrategy`;
    return requestHelper.getRequestData<any>(url, '0170a3ed-f32e-4995-9fe5-e7880c6548d2', this.data2Mock);
  }
  // 事件首页-指挥体系统计*
  getStatEventCommand() {
    const url = `${API_DOMAIN}${API_PREFIX}/api/lc-home/event/statEventCommand`;
    return requestHelper.getRequestData<any>(url, '0170a3ed-f32e-4995-9fe5-e7880c6548d2', this.data2Mock);
  }
  // 事件首页-知识库统计
  getStatEventKnowledge() {
    const url = `${API_DOMAIN}${API_PREFIX}/api/lc-home/event/statEventKnowledge`;
    return requestHelper.getRequestData<any>(url, '0170a3ed-f32e-4995-9fe5-e7880c6548d2', this.data2Mock);
  }
}
export const apiHomePageApiObj = new HomePageApi();