import { requestHelper } from "@/apis/base/mapper-helper";
import { GlobalAPI } from "@/common";
import {
  IpostEventAssembleStatSpace,
  IpostAddCommandCenterAssemblePointSpace,
  IpostFindCommandCenterAssemblePointListSpace,
  IpostFindCommandCenterAssemblePageSpace,
  IpostCancelCommandCenterAssembleSpace,
  IpostWhetherAssemblePointSpace,
  IpostAddCommandCenterAssembleSpace,
  IpostAssembleSuperviseSpace,
  IpostGetEventPersonDetailSpace,
  IpostModifyCommandCenterAssemblePointSpace,
  IpostDeleteCommandCenterAssemblePointSpace,
  IpostEventAssembleUserStatDetailSpace,
} from './model';

/**
 * 数据访问，此类代码生成器生成
 */
class SitePersonnelApi {
  data2Mock: boolean = false;

  // 事件集结统计|事件集结统计-指挥中心集结指令表
  postEventAssembleStat(eventInfoId:string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/commandCenter/eventAssembleStat`;
    return requestHelper.postRequestData<IpostEventAssembleStatSpace.Model>(url, '8847f8e1-b561-48c2-b7cf-4219b4e29087', this.data2Mock, {eventInfoId});
  }

  // 指挥中心集结点表-添加|指挥中心集结点表-添加-指挥中心集结点表
  postAddCommandCenterAssemblePoint(params: IpostAddCommandCenterAssemblePointSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/commandCenter/addCommandCenterAssemblePoint`;
    return requestHelper.postRequestData<IpostAddCommandCenterAssemblePointSpace.Model>(
      url,
      "a732bbb2-9408-4d8d-a311-203b732b4cce",
      this.data2Mock,
      params
    );
  }
  // 指挥中心集结点表-修改|指挥中心集结点表-修改-指挥中心集结点表
  postModifyCommandCenterAssemblePoint(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/commandCenter/modifyCommandCenterAssemblePoint`;
    return requestHelper.postRequestData<IpostModifyCommandCenterAssemblePointSpace.Model>(
      url,
      "e7c3ce0f-c73d-4bb7-8fde-7bb029e49401",
      this.data2Mock,
      params
    );
  }
  // 指挥中心集结点表-列表|指挥中心集结点表-列表-指挥中心集结点表
  postFindCommandCenterAssemblePointList(eventInfoId: number|string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/commandCenter/findCommandCenterAssemblePointList`;
    return requestHelper.postRequestData<IpostFindCommandCenterAssemblePointListSpace.Model>(
      url,
      "7eb397af-4035-4ce3-8c22-88ac5255fd9f",
      this.data2Mock,
      { eventInfoId }
    );
  }

  postEventAssembleUserStatDetail(eventInfoId: number|string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/commandCenter/eventAssembleUserStatDetail`;
    return requestHelper.postRequestData<IpostEventAssembleUserStatDetailSpace.Model>(
      url,
      "7eb397af-4035-4ce3-8c22-88ac5255fd9f",
      this.data2Mock,
      { eventInfoId }
    );
  }



  // 指挥中心集结表-列表|指挥中心集结表-列表-指挥中心集结表
  postFindCommandCenterAssemblePage(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/commandCenter/findCommandCenterAssemblePage`;
    return requestHelper.postRequestData<IpostFindCommandCenterAssemblePageSpace.Model>(
      url,
      "d43d15d4-1a86-4c37-a76e-3388bd09e948",
      this.data2Mock,
      params
    );
  }

  // 指挥中心集结点表-删除|指挥中心集结点表-删除-指挥中心集结点表
  postDeleteCommandCenterAssemblePoint(id: number|string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/commandCenter/deleteCommandCenterAssemblePoint`;
    return requestHelper.postRequestData<IpostDeleteCommandCenterAssemblePointSpace.Model>(
      url,
      "07f2f177-ea8d-4e0b-aa4b-8e05feb5aefc",
      this.data2Mock,
      { id }
    );
  }

  // 指挥中心集结表-撤销指令|指挥中心集结表-撤销指令-指挥中心集结表
  postCancelCommandCenterAssemble(id: number|string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/commandCenter/cancelCommandCenterAssemble`;
    return requestHelper.postRequestData<IpostCancelCommandCenterAssembleSpace.Model>(
      url,
      "d32317fb-6c74-4838-97d9-79785f7de731",
      this.data2Mock,
      { id }
    );
  }

  // 指挥中心集结表-判断是否已经有集结点|指挥中心集结表-判断是否已经有集结点-指挥中心集结点表
  postWhetherAssemblePoint(eventInfoId: number | string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/commandCenter/whetherAssemblePoint`;
    return requestHelper.postRequestData<IpostWhetherAssemblePointSpace.Model>(
      url,
      "ef44de8d-dba1-40ef-8ec0-2c6bbe423210",
      this.data2Mock,
      { eventInfoId }
    );
  }

  // 指挥中心集结表-添加|指挥中心集结表-添加-指挥中心集结表
  postAddCommandCenterAssemble(params: IpostAddCommandCenterAssembleSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/commandCenter/addCommandCenterAssemble`;
    return requestHelper.postRequestData<IpostAddCommandCenterAssembleSpace.Model>(
      url,
      "280019d7-73c1-4626-9802-b2fdcd3a5ec8",
      this.data2Mock,
      params
    );
  }

  // 用户位置-一张图现场用户详情|用户位置-一张图现场用户详情-用户位置
  postGetEventPersonDetail(userId:string, eventId:string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/commandCenter/getEventPersonDetail`;
    return requestHelper.postRequestData<IpostGetEventPersonDetailSpace.Model>(url, '09a44f40-e653-49df-be32-73d52b7ac725', this.data2Mock, {userId,eventId});
  }

}
export const apiSitePersonnelObj = new SitePersonnelApi();
