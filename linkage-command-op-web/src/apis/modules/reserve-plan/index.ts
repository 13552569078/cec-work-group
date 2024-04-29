import { requestHelper } from "@/apis/base/mapper-helper";
import {
  IpostPlanTypeSpace,
  IpostFindReservePlanByIdSpace,
  IpostDeleteReservePlanCatalogSpace,
  IpostAddReservePlanCatalogSpace,
  IpostAddReservePlanSpace,
  IpostFindPlanFileByIdSpace,
  IpostModifyReservePlanSpace,
  IpostFindReservePlanCatalogPageSpace,
  IpostPlanLevelSpace,
  IpostModifyPlanFileSpace,
  IpostFindReservePlanCatalogByIdSpace,
  IpostDeleteReservePlanSpace,
  IpostFindReservePlanPageSpace,
  IpostDeletePlanFileSpace,
  IpostAddPlanFileSpace,
  IpostModifyReservePlanCatalogSpace,
  IpostFindPlanFilePageSpace,
} from "./model";
import { GlobalAPI } from "@/common";


/**
 * 数据访问，此类代码生成器生成
 */
class ReservePlanManageApi {
  data2Mock: boolean = false;

  // 预案管理-预案类型下拉选择|预案管理-预案类型下拉选择-预案管理
  postPlanType() {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/reservePlan/planType`;
    return requestHelper.postRequestData<IpostPlanTypeSpace.Model>(
      url,
      "f73e0042-679b-41c1-8277-096aa328c654",
      this.data2Mock,
      {}
    );
  }
  // 预案管理-根据事件ID查询|预案管理-主键查询-预案管理
  postFindReservePlanByEventId(eventId: number | string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/reservePlan/findReservePlanByEventId`;
    return requestHelper.postRequestData<IpostFindReservePlanByIdSpace.Model>(
      url,
      "97acc5fe-6d4e-452d-9254-488b1321321398f0",
      this.data2Mock,
      { eventId }
    );
  }
  // 预案管理-主键查询|预案管理-主键查询-预案管理
  postFindReservePlanById(id: number | string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/reservePlan/findReservePlanById`;
    return requestHelper.postRequestData<IpostFindReservePlanByIdSpace.Model>(
      url,
      "97acc5fe-6d4e-452d-9254-488b165598f0",
      this.data2Mock,
      { id }
    );
  }
  // 预案管理目录-删除|预案管理目录-删除-预案管理目录
  postDeleteReservePlanCatalog(id: number | string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/planCatalog/deleteReservePlanCatalog`;
    return requestHelper.postRequestData<IpostDeleteReservePlanCatalogSpace.Model>(
      url,
      "142c040f-84a6-47fe-8e09-657163950eaf",
      this.data2Mock,
      { id }
    );
  }
  // 预案管理目录-添加|预案管理目录-添加-预案管理目录
  postAddReservePlanCatalog(params: IpostAddReservePlanCatalogSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/planCatalog/addReservePlanCatalog`;
    return requestHelper.postRequestData<IpostAddReservePlanCatalogSpace.Model>(
      url,
      "66ebb050-aee5-48a0-8e48-ae69afc61ec3",
      this.data2Mock,
      params
    );
  }
  // 预案管理-添加|预案管理-添加-预案管理
  postAddReservePlan(params: IpostAddReservePlanSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/reservePlan/addReservePlan`;
    return requestHelper.postRequestData<IpostAddReservePlanSpace.Model>(
      url,
      "c8701663-d89d-4329-9dab-bb4614e04d33",
      this.data2Mock,
      params
    );
  }
  // 预案文件-主键查询|预案文件-主键查询-预案文件
  postFindPlanFileById(id: number | string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/plan/findPlanFileById`;
    return requestHelper.postRequestData<IpostFindPlanFileByIdSpace.Model>(
      url,
      "99f48856-5182-4431-9d2e-3cf643542f14",
      this.data2Mock,
      { id }
    );
  }
  // 预案管理-修改|预案管理-修改-预案管理
  postModifyReservePlan(params: IpostModifyReservePlanSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/reservePlan/modifyReservePlan`;
    return requestHelper.postRequestData<IpostModifyReservePlanSpace.Model>(
      url,
      "710d2018-0cf4-4ae4-8af8-782326f9fc8d",
      this.data2Mock,
      params
    );
  }
  // 预案管理目录-列表|预案管理目录-列表-预案管理目录
  postFindReservePlanCatalogPage(params: IpostFindReservePlanCatalogPageSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/picture/event/findPictureReservePlanPage`;
    return requestHelper.postRequestData<IpostFindReservePlanCatalogPageSpace.Model>(
      url,
      "a32b97ed-1798-4071-9971-9bdb8f4fb66e",
      this.data2Mock,
      params
    );
  }
  // 预案管理-预案等级下拉选择|预案管理-预案等级下拉选择-预案管理
  postPlanLevel() {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/reservePlan/planLevel`;
    return requestHelper.postRequestData<IpostPlanLevelSpace.Model>(
      url,
      "60302505-9b9e-45e1-a380-994ea667fe3f",
      this.data2Mock,
      {}
    );
  }
  // 预案文件-修改|预案文件-修改-预案文件
  postModifyPlanFile(params: IpostModifyPlanFileSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/plan/modifyPlanFile`;
    return requestHelper.postRequestData<IpostModifyPlanFileSpace.Model>(
      url,
      "f9292102-5511-4ad7-8e82-0772a5f20c15",
      this.data2Mock,
      params
    );
  }
  // 预案管理目录-树|预案管理目录-主键查询-树
  postFindReservePlanCatalogTree(planId: number | string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/planCatalog/findReservePlanCatalogTree`;
    return requestHelper.postRequestData<IpostFindReservePlanCatalogByIdSpace.Model>(
      url,
      "7960a9b1-4523-4771-b0ee-1848c41e394c",
      this.data2Mock,
      { planId }
    );
  }
  // 预案管理-删除|预案管理-删除-预案管理
  postDeleteReservePlan(id: number | string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/reservePlan/deleteReservePlan`;
    return requestHelper.postRequestData<IpostDeleteReservePlanSpace.Model>(
      url,
      "b66c34e3-345b-4bee-87df-14d82d2d69ee",
      this.data2Mock,
      { id }
    );
  }
  // 预案管理-列表|预案管理-列表-预案管理
  postFindReservePlanPage(params: IpostFindReservePlanPageSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/reservePlan/findReservePlanPage`;
    return requestHelper.postRequestData<IpostFindReservePlanPageSpace.Model>(
      url,
      "e144fcdc-0961-4177-baa4-d9a836ca7c39",
      this.data2Mock,
      params
    );
  }
  // 预案文件-删除|预案文件-删除-预案文件
  postDeletePlanFile(id: number | string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/plan/deletePlanFile`;
    return requestHelper.postRequestData<IpostDeletePlanFileSpace.Model>(
      url,
      "1817d568-1097-455b-89e6-9fdf63c672ff",
      this.data2Mock,
      { id }
    );
  }
  // 预案文件-添加|预案文件-添加-预案文件
  postAddPlanFile(params: IpostAddPlanFileSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/plan/addPlanFile`;
    return requestHelper.postRequestData<IpostAddPlanFileSpace.Model>(
      url,
      "2edc354b-9c67-4bcc-9ebc-38c365160628",
      this.data2Mock,
      params
    );
  }
  // 预案管理目录-修改|预案管理目录-修改-预案管理目录
  postModifyReservePlanCatalog(params: IpostModifyReservePlanCatalogSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/planCatalog/modifyReservePlanCatalog`;
    return requestHelper.postRequestData<IpostModifyReservePlanCatalogSpace.Model>(
      url,
      "3cb8f929-a2ac-47f4-9c08-1bad39a6ff08",
      this.data2Mock,
      params
    );
  }
  // 预案文件-列表|预案文件-列表-预案文件
  postFindPlanFilePage(params: IpostFindPlanFilePageSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/plan/findPlanFilePage`;
    return requestHelper.postRequestData<IpostFindPlanFilePageSpace.Model>(
      url,
      "b680d1df-ae7d-4cb1-a9c5-93f3a528f196",
      this.data2Mock,
      params
    );
  }

  postModifyStrategyReservePlan(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/strategy/modifyStrategyReservePlan`;
    return requestHelper.postRequestData<any>(
      url,
      "b680d1df-ae7d-4cb1-a9c5-93f3a528f196",
      this.data2Mock,
      params
    );
  }

  postFindStrategyReservePlanById(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/strategy/findStrategyReservePlanById`;
    return requestHelper.postRequestData<any>(
      url,
      "b680d1df-ae7d-4cb1-a9c5-93f3a528f196",
      this.data2Mock,
      params
    );
  }
}
export const apiReservePlanManageObj = new ReservePlanManageApi();
