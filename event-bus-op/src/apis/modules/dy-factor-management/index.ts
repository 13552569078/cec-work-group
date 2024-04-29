import { requestHelper } from "@/apis/base/mapper-helper";
import { IgetBusEventTypeAnalysisSpace,IgetBusEventTypeCardSpace,IpostAcrossEventSpySpace,IgetOtherEventTypeAnalysisSpace,IgetOtherEventSystemListSpace,IgetEventTypeAnalysisSpace, IgetEventStatusAnalysisSpace, IpostAcrossEventSpyPageSpace } from './model';
import { GlobalAPI } from "@/common";
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = GlobalAPI.config.API_PREFIX_OP;

/**
 * 数据访问，此类代码生成器生成
 */
class FactorManagementApi {
  data2Mock: boolean = false;

  // 事项要素分析-统一事项类目统计|事项要素分析-统一事项类目统计-一张图-首页
  getBusEventTypeAnalysis() {
      const url = `${API_DOMAIN}${API_PREFIX}/event/map/busEventTypeAnalysis`;
      return requestHelper.getRequestData<IgetBusEventTypeAnalysisSpace.Model>(url, 'fd1f383c-3c7e-4c16-abee-ce3ddf0d5f13', this.data2Mock);
  }
  // 事项要素分析-统一事项类目卡片|事项要素分析-统一事项类目卡片-一张图-首页
  getBusEventTypeCard() {
      const url = `${API_DOMAIN}${API_PREFIX}/event/map/busEventTypeCard`;
      return requestHelper.getRequestData<IgetBusEventTypeCardSpace.Model>(url, '25165299-c80c-474e-93a4-5f0c66d92f1b', this.data2Mock);
  }
  // 事项要素分析-跨部门事项运行监控|事项要素分析-跨部门事项运行监控-一张图-首页
  postAcrossEventSpy(district:string,startTime:string,endTime:string) {
      const url = `${API_DOMAIN}${API_PREFIX}/event/map/acrossEventSpy`;
      return requestHelper.postRequestData<IpostAcrossEventSpySpace.Model>(url, '3406d6b9-b5ec-4187-abe4-0193cd68f00f', this.data2Mock, {district,startTime,endTime});
  }
  // 事项要素分析-流入事项类目统计|事项要素分析-流入事项类目统计-一张图-首页
  getOtherEventTypeAnalysis() {
      const url = `${API_DOMAIN}${API_PREFIX}/event/map/otherEventTypeAnalysis`;
      return requestHelper.getRequestData<IgetOtherEventTypeAnalysisSpace.Model>(url, '3fb2a2ae-55d3-4935-8745-e632f2d409c4', this.data2Mock);
  }
  // 事项要素分析-流入事项系统列表|事项要素分析-流入事项系统列表-一张图-首页
  getOtherEventSystemList() {
      const url = `${API_DOMAIN}${API_PREFIX}/event/map/otherEventSystemList`;
      return requestHelper.getRequestData<IgetOtherEventSystemListSpace.Model>(url, '64154a85-26a1-4d03-a4e4-d04c161147b6', this.data2Mock);
  }
  // 事项要素分析-事项类型统计|事项要素分析-事项类型统计-一张图-首页
  getEventTypeAnalysis() {
      const url = `${API_DOMAIN}${API_PREFIX}/event/map/eventTypeAnalysis`;
      return requestHelper.getRequestData<IgetEventTypeAnalysisSpace.Model>(url, '3c17db11-a396-4343-81b3-8695e9ec1ae0', this.data2Mock);
  }
  // 事件状态统计|事件状态统计-一张图-首页
  getEventStatusAnalysis(district:string,startTime:string,endTime:string) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/map/eventStatusAnalysis`;
    return requestHelper.postRequestData<IgetEventStatusAnalysisSpace.Model>(url, 'af598c94-4f0e-4c44-ae11-1e192d2bc97b', this.data2Mock,{district,startTime,endTime});
 }
 // 事项要素分析-跨部门事项运行监控(分页)|事项要素分析-跨部门事项运行监控(分页)-一张图-首页
 postAcrossEventSpyPage(district:any,endTime:string,pageNum:number,pageSize:number,startTime:string) {
  const url = `${API_DOMAIN}${API_PREFIX}/event/map/acrossEventSpyPage`;
  return requestHelper.postRequestData<IpostAcrossEventSpyPageSpace.Model>(url, '3000b3ad-00f2-42f1-aeb2-7cb2f3f2a8fe', this.data2Mock, {district,endTime,pageNum,pageSize,startTime});
}
}
export const apiFactorManagementObj = new FactorManagementApi();
