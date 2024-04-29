import { requestHelper } from "@/apis/base/mapper-helper";
import { IpostFindDisasterGovernmentManagementPlanPageSpace, IpostFindDisasterGovernmentManagementByIdSpace, IpostFindDisasterTownsIndicatorStatisticsByIdSpace, IpostFindDisasterTownsIndicatorStatisticsPageSpace, IpostFindDisasterIndicatorStatisticsByIdSpace, IpostFindDisasterIndicatorStatisticsPageSpace, IpostFindDisasterSocietyReductionByIdSpace, IpostFindDisasterSocietyReductionPageSpace, IpostFindDisasterChemicalIndustrialParkByIdSpace, IpostFindDisasterChemicalIndustrialParkPageSpace, IpostFindDisasterSocialStadiumPageSpace,IpostFindDisasterCommunityReductionPageSpace,IpostDeleteDisasterTownshipReductionSpace,IpostFindDisasterHistoryByIdSpace,IpostAddDisasterLargeMarketSpace,IpostDeleteDisasterSocialWelfareSpace,IpostModifyDisasterSocialStadiumSpace,IpostModifyDisasterCommunityReductionSpace,IpostFindDisasterSocialWelfareByIdSpace,IpostFindDisasterStarHotelPageSpace,IpostAddDisasterCommunityReductionSpace,IpostFindDisasterStarHotelByIdSpace,IpostDeleteDisasterHistorySpace,IpostDeleteDisasterLargeMarketSpace,IpostAddDisasterGateStationSpace,IpostFindDisasterGateStationByIdSpace,IpostFindDisasterSocialStadiumByIdSpace,IpostAddDisasterSocialWelfareSpace,IpostAddDisasterStarHotelSpace,IpostModifyDisasterLargeMarketSpace,IpostAddDisasterRiverSpace,IpostFindDisasterLargeMarketPageSpace,IpostFindDisasterLargeMarketByIdSpace,IpostDeleteDisasterGateStationSpace,IpostDeleteDisasterPublicPlaceSpace,IpostFindDisasterGateStationPageSpace,IpostModifyDisasterSocialWelfareSpace,IpostModifyDisasterGateStationSpace,IpostDeleteDisasterStarHotelSpace,IpostAddDisasterHistorySpace,IpostDeleteDisasterCommunityReductionSpace,IpostFindDisasterTownshipReductionPageSpace,IpostAddDisasterTownshipReductionSpace,IpostFindDisasterPublicPlaceByIdSpace,IpostAddDisasterSocialStadiumSpace,IpostFindDisasterSocialWelfarePageSpace,IpostFindDisasterPublicPlacePageSpace,IpostModifyDisasterStarHotelSpace,IpostFindDisasterTownshipReductionByIdSpace,IpostModifyDisasterRiverSpace,IpostModifyDisasterTownshipReductionSpace,IpostModifyDisasterHistorySpace,IpostFindDisasterHistoryPageSpace,IpostDeleteDisasterSocialStadiumSpace,IpostFindDisasterRiverByIdSpace,IpostModifyDisasterPublicPlaceSpace,IpostFindDisasterCommunityReductionByIdSpace,IpostAddDisasterPublicPlaceSpace,IpostDeleteDisasterRiverSpace,IpostFindDisasterRiverPageSpace, IpostFindDisasterGovernmentManagementPageSpace } from './model';
import { GlobalAPI } from '@/common';
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = GlobalAPI.config.API_RISK_PROTECTION_SERVER;

/**
 * 数据访问，此类代码生成器生成
 */
class BasicInformationApi {
  data2Mock: boolean = false;

  // 体育场馆-列表|体育场馆-列表-体育场馆
  postFindDisasterSocialStadiumPage(params: IpostFindDisasterSocialStadiumPageSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/findDisasterSocialStadiumPage`;
      return requestHelper.postRequestData<IpostFindDisasterSocialStadiumPageSpace.Model>(url, 'c39731fa-e106-4ee7-82d7-703bc2c62aa7', this.data2Mock, params);
  }
  // 社区（行政村）减灾能力-列表|社区（行政村）减灾能力-列表-社区（行政村）减灾能力
  postFindDisasterCommunityReductionPage(params: IpostFindDisasterCommunityReductionPageSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/findDisasterCommunityReductionPage`;
      return requestHelper.postRequestData<IpostFindDisasterCommunityReductionPageSpace.Model>(url, '6b9da61b-bf68-44f1-88b5-31e41d69eaf0', this.data2Mock, params);
  }
  // 乡镇减灾能力-删除|乡镇减灾能力-删除-乡镇减灾能力
  postDeleteDisasterTownshipReduction(id:string[]) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/deleteDisasterTownshipReduction`;
      return requestHelper.postRequestData<IpostDeleteDisasterTownshipReductionSpace.Model>(url, 'd888e586-9f0b-476a-b7c7-583576bac9a1', this.data2Mock, {id});
  }
  // 历史灾情表-主键查询|历史灾情表-主键查询-历史灾情表
  postFindDisasterHistoryById(id:string) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/findDisasterHistoryById`;
      return requestHelper.postRequestData<IpostFindDisasterHistoryByIdSpace.Model>(url, '3e7c8a33-2cc9-4f52-a3f7-5c0304151932', this.data2Mock, {id});
  }
  // 大型商场-添加|大型商场-添加-大型商场
  postAddDisasterLargeMarket(params: IpostAddDisasterLargeMarketSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/addDisasterLargeMarket`;
      return requestHelper.postRequestData<IpostAddDisasterLargeMarketSpace.Model>(url, 'bfa1427e-955f-48cb-93f8-5d8c163e037b', this.data2Mock, params);
  }
  // 社会福利机构-删除|社会福利机构-删除-社会福利机构
  postDeleteDisasterSocialWelfare(id:string[]) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/deleteDisasterSocialWelfare`;
      return requestHelper.postRequestData<IpostDeleteDisasterSocialWelfareSpace.Model>(url, 'bd73b2a8-1864-4cc2-9b2a-2edb00ad604f', this.data2Mock, {id});
  }
  // 体育场馆-修改|体育场馆-修改-体育场馆
  postModifyDisasterSocialStadium(params: IpostModifyDisasterSocialStadiumSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/modifyDisasterSocialStadium`;
      return requestHelper.postRequestData<IpostModifyDisasterSocialStadiumSpace.Model>(url, '8e48c9dd-b98a-42f4-8d78-83d140f495a6', this.data2Mock, params);
  }
  // 社区（行政村）减灾能力-修改|社区（行政村）减灾能力-修改-社区（行政村）减灾能力
  postModifyDisasterCommunityReduction(params: IpostModifyDisasterCommunityReductionSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/modifyDisasterCommunityReduction`;
      return requestHelper.postRequestData<IpostModifyDisasterCommunityReductionSpace.Model>(url, '30afbd76-5ce0-4cfd-a5d9-bce5c5aee431', this.data2Mock, params);
  }
  // 社会福利机构-主键查询|社会福利机构-主键查询-社会福利机构
  postFindDisasterSocialWelfareById(id:string) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/findDisasterSocialWelfareById`;
      return requestHelper.postRequestData<IpostFindDisasterSocialWelfareByIdSpace.Model>(url, '1a5c02df-09c6-4094-a3e6-358099d0a6ea', this.data2Mock, {id});
  }
  // 星级饭店-列表|星级饭店-列表-星级饭店
  postFindDisasterStarHotelPage(params: IpostFindDisasterStarHotelPageSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/findDisasterStarHotelPage`;
      return requestHelper.postRequestData<IpostFindDisasterStarHotelPageSpace.Model>(url, 'aabcaae9-b0e0-4025-80e3-4b922c367055', this.data2Mock, params);
  }
  // 社区（行政村）减灾能力-添加|社区（行政村）减灾能力-添加-社区（行政村）减灾能力
  postAddDisasterCommunityReduction(params: IpostAddDisasterCommunityReductionSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/addDisasterCommunityReduction`;
      return requestHelper.postRequestData<IpostAddDisasterCommunityReductionSpace.Model>(url, '51acf63a-350a-4b7d-904a-93dd3c9b01c4', this.data2Mock, params);
  }
  // 星级饭店-主键查询|星级饭店-主键查询-星级饭店
  postFindDisasterStarHotelById(id:string) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/findDisasterStarHotelById`;
      return requestHelper.postRequestData<IpostFindDisasterStarHotelByIdSpace.Model>(url, '24066c59-72ce-4d7d-b1de-b3f7457d28f5', this.data2Mock, {id});
  }
  // 历史灾情表-删除|历史灾情表-删除-历史灾情表
  postDeleteDisasterHistory(id:string[]) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/deleteDisasterHistory`;
      return requestHelper.postRequestData<IpostDeleteDisasterHistorySpace.Model>(url, '95019ada-915f-4bf8-8df0-11c5ec3f4e07', this.data2Mock, {id});
  }
  // 大型商场-删除|大型商场-删除-大型商场
  postDeleteDisasterLargeMarket(id:string[]) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/deleteDisasterLargeMarket`;
      return requestHelper.postRequestData<IpostDeleteDisasterLargeMarketSpace.Model>(url, '0bbf0d57-2c4f-4692-b3b4-7431e8fb29a3', this.data2Mock, {id});
  }
  // 闸站-添加|闸站-添加-闸站
  postAddDisasterGateStation(params: IpostAddDisasterGateStationSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/addDisasterGateStation`;
      return requestHelper.postRequestData<IpostAddDisasterGateStationSpace.Model>(url, '9b0efe88-9c33-4a81-8693-8df216b397e1', this.data2Mock, params);
  }
  // 闸站-主键查询|闸站-主键查询-闸站
  postFindDisasterGateStationById(id:string) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/findDisasterGateStationById`;
      return requestHelper.postRequestData<IpostFindDisasterGateStationByIdSpace.Model>(url, 'db0a89ee-ff07-4691-89f8-5bb484adae9d', this.data2Mock, {id});
  }
  // 体育场馆-主键查询|体育场馆-主键查询-体育场馆
  postFindDisasterSocialStadiumById(id:string) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/findDisasterSocialStadiumById`;
      return requestHelper.postRequestData<IpostFindDisasterSocialStadiumByIdSpace.Model>(url, '17b69653-b9af-4d24-a933-366494304c4a', this.data2Mock, {id});
  }
  // 社会福利机构-添加|社会福利机构-添加-社会福利机构
  postAddDisasterSocialWelfare(params: IpostAddDisasterSocialWelfareSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/addDisasterSocialWelfare`;
      return requestHelper.postRequestData<IpostAddDisasterSocialWelfareSpace.Model>(url, '05d5a1a9-5390-4928-a867-5aa438582f12', this.data2Mock, params);
  }
  // 星级饭店-添加|星级饭店-添加-星级饭店
  postAddDisasterStarHotel(params: IpostAddDisasterStarHotelSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/addDisasterStarHotel`;
      return requestHelper.postRequestData<IpostAddDisasterStarHotelSpace.Model>(url, '1be4883b-963f-4c6e-95e7-52ff308b15d1', this.data2Mock, params);
  }
  // 大型商场-修改|大型商场-修改-大型商场
  postModifyDisasterLargeMarket(params: IpostModifyDisasterLargeMarketSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/modifyDisasterLargeMarket`;
      return requestHelper.postRequestData<IpostModifyDisasterLargeMarketSpace.Model>(url, '7846dced-7400-4488-af5c-3f42ffa5fa74', this.data2Mock, params);
  }
  // 河流信息-添加|河流信息-添加-河流信息
  postAddDisasterRiver(params: IpostAddDisasterRiverSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/addDisasterRiver`;
      return requestHelper.postRequestData<IpostAddDisasterRiverSpace.Model>(url, '3023d7b3-6421-48ca-928b-f0ff4342c47e', this.data2Mock, params);
  }
  // 大型商场-列表|大型商场-列表-大型商场
  postFindDisasterLargeMarketPage(params: IpostFindDisasterLargeMarketPageSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/findDisasterLargeMarketPage`;
      return requestHelper.postRequestData<IpostFindDisasterLargeMarketPageSpace.Model>(url, '1fd5af66-2b08-4615-b5a5-8d560b5ffb17', this.data2Mock, params);
  }
  // 大型商场-主键查询|大型商场-主键查询-大型商场
  postFindDisasterLargeMarketById(id:string) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/findDisasterLargeMarketById`;
      return requestHelper.postRequestData<IpostFindDisasterLargeMarketByIdSpace.Model>(url, 'ba4314f3-d24b-4e9a-8da1-504f99b45a9b', this.data2Mock, {id});
  }
  // 闸站-删除|闸站-删除-闸站
  postDeleteDisasterGateStation(id:string[]) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/deleteDisasterGateStation`;
      return requestHelper.postRequestData<IpostDeleteDisasterGateStationSpace.Model>(url, 'c666f9b3-2674-41d0-9213-c3238f858180', this.data2Mock, {id});
  }
  // 公共文化场所-删除|公共文化场所-删除-公共文化场所
  postDeleteDisasterPublicPlace(id:string[]) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/deleteDisasterPublicPlace`;
      return requestHelper.postRequestData<IpostDeleteDisasterPublicPlaceSpace.Model>(url, '8e64d1a6-ee45-496b-9b54-57922546e730', this.data2Mock, {id});
  }
  // 闸站-列表|闸站-列表-闸站 !
  postFindDisasterGateStationPage(params: IpostFindDisasterGateStationPageSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/findDisasterGateStationPage`;
      return requestHelper.postRequestData<IpostFindDisasterGateStationPageSpace.Model>(url, 'f183876b-ffce-433c-8286-2619ab573313', this.data2Mock, params);
  }
  // 社会福利机构-修改|社会福利机构-修改-社会福利机构
  postModifyDisasterSocialWelfare(params: IpostModifyDisasterSocialWelfareSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/modifyDisasterSocialWelfare`;
      return requestHelper.postRequestData<IpostModifyDisasterSocialWelfareSpace.Model>(url, 'd574b63d-75b6-484b-ad5e-f1b7697432f2', this.data2Mock, params);
  }
  // 闸站-修改|闸站-修改-闸站
  postModifyDisasterGateStation(params: IpostModifyDisasterGateStationSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/modifyDisasterGateStation`;
      return requestHelper.postRequestData<IpostModifyDisasterGateStationSpace.Model>(url, '25b53978-af16-43c1-ba8f-e20676f39435', this.data2Mock, params);
  }
  // 星级饭店-删除|星级饭店-删除-星级饭店
  postDeleteDisasterStarHotel(id:string[]) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/deleteDisasterStarHotel`;
      return requestHelper.postRequestData<IpostDeleteDisasterStarHotelSpace.Model>(url, '68483171-a79e-4d20-acf0-452a4cdfe1af', this.data2Mock, {id});
  }
  // 历史灾情表-添加|历史灾情表-添加-历史灾情表
  postAddDisasterHistory(params: IpostAddDisasterHistorySpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/addDisasterHistory`;
      return requestHelper.postRequestData<IpostAddDisasterHistorySpace.Model>(url, '6c07c9e3-2844-4902-b463-febc07aec218', this.data2Mock, params);
  }
  // 社区（行政村）减灾能力-删除|社区（行政村）减灾能力-删除-社区（行政村）减灾能力
  postDeleteDisasterCommunityReduction(id:string[]) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/deleteDisasterCommunityReduction`;
      return requestHelper.postRequestData<IpostDeleteDisasterCommunityReductionSpace.Model>(url, 'b3b30004-06c3-4a2d-bace-17755291ab45', this.data2Mock, {id});
  }
  // 乡镇减灾能力-列表|乡镇减灾能力-列表-乡镇减灾能力
  postFindDisasterTownshipReductionPage(params: IpostFindDisasterTownshipReductionPageSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/findDisasterTownshipReductionPage`;
      return requestHelper.postRequestData<IpostFindDisasterTownshipReductionPageSpace.Model>(url, '5c1a468d-034e-45dd-a624-09f3f38665c5', this.data2Mock, params);
  }
  // 乡镇减灾能力-添加|乡镇减灾能力-添加-乡镇减灾能力
  postAddDisasterTownshipReduction(params: IpostAddDisasterTownshipReductionSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/addDisasterTownshipReduction`;
      return requestHelper.postRequestData<IpostAddDisasterTownshipReductionSpace.Model>(url, '60ca454b-ab0e-4bdf-9cee-9d20c94b5d2c', this.data2Mock, params);
  }
  // 公共文化场所-主键查询|公共文化场所-主键查询-公共文化场所
  postFindDisasterPublicPlaceById(id:string) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/findDisasterPublicPlaceById`;
      return requestHelper.postRequestData<IpostFindDisasterPublicPlaceByIdSpace.Model>(url, '699a5ee6-1ab4-4036-9d9a-919ec649bc49', this.data2Mock, {id});
  }
  // 体育场馆-添加|体育场馆-添加-体育场馆
  postAddDisasterSocialStadium(params: IpostAddDisasterSocialStadiumSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/addDisasterSocialStadium`;
      return requestHelper.postRequestData<IpostAddDisasterSocialStadiumSpace.Model>(url, '069fe886-a4a0-416d-b2a8-7c02d09270df', this.data2Mock, params);
  }
  // 社会福利机构-列表|社会福利机构-列表-社会福利机构
  postFindDisasterSocialWelfarePage(params: IpostFindDisasterSocialWelfarePageSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/findDisasterSocialWelfarePage`;
      return requestHelper.postRequestData<IpostFindDisasterSocialWelfarePageSpace.Model>(url, 'bb927dbd-de3f-4b2f-a8dc-458557fbe216', this.data2Mock, params);
  }
  // 公共文化场所-列表|公共文化场所-列表-公共文化场所
  postFindDisasterPublicPlacePage(params: IpostFindDisasterPublicPlacePageSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/findDisasterPublicPlacePage`;
      return requestHelper.postRequestData<IpostFindDisasterPublicPlacePageSpace.Model>(url, '71f658e1-3398-4d86-af7a-b065f5dc227a', this.data2Mock, params);
  }
  // 星级饭店-修改|星级饭店-修改-星级饭店
  postModifyDisasterStarHotel(params: IpostModifyDisasterStarHotelSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/modifyDisasterStarHotel`;
      return requestHelper.postRequestData<IpostModifyDisasterStarHotelSpace.Model>(url, 'ae72d996-a76a-40c9-a498-ee752eba75fb', this.data2Mock, params);
  }
  // 乡镇减灾能力-主键查询|乡镇减灾能力-主键查询-乡镇减灾能力
  postFindDisasterTownshipReductionById(id:string) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/findDisasterTownshipReductionById`;
      return requestHelper.postRequestData<IpostFindDisasterTownshipReductionByIdSpace.Model>(url, 'cae5fbfd-22fe-4438-87f8-9b3cee98b8e1', this.data2Mock, {id});
  }
  // 河流信息-修改|河流信息-修改-河流信息
  postModifyDisasterRiver(params: IpostModifyDisasterRiverSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/modifyDisasterRiver`;
      return requestHelper.postRequestData<IpostModifyDisasterRiverSpace.Model>(url, '311770e5-7f67-48e4-8951-a8e504279c47', this.data2Mock, params);
  }
  // 乡镇减灾能力-修改|乡镇减灾能力-修改-乡镇减灾能力
  postModifyDisasterTownshipReduction(params: IpostModifyDisasterTownshipReductionSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/modifyDisasterTownshipReduction`;
      return requestHelper.postRequestData<IpostModifyDisasterTownshipReductionSpace.Model>(url, '1aa5ea6b-44c1-4ae7-b53d-7c3135478afc', this.data2Mock, params);
  }
  // 历史灾情表-修改|历史灾情表-修改-历史灾情表
  postModifyDisasterHistory(params: IpostModifyDisasterHistorySpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/modifyDisasterHistory`;
      return requestHelper.postRequestData<IpostModifyDisasterHistorySpace.Model>(url, '155a862c-7ae8-4c90-bed7-20fb130f2bc0', this.data2Mock, params);
  }
  // 历史灾情表-列表|历史灾情表-列表-历史灾情表
  postFindDisasterHistoryPage(params: IpostFindDisasterHistoryPageSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/findDisasterHistoryPage`;
      return requestHelper.postRequestData<IpostFindDisasterHistoryPageSpace.Model>(url, '613b151f-17c7-4d21-9da0-c1e29d1dedb0', this.data2Mock, params);
  }
  // 体育场馆-删除|体育场馆-删除-体育场馆
  postDeleteDisasterSocialStadium(id:string[]) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/deleteDisasterSocialStadium`;
      return requestHelper.postRequestData<IpostDeleteDisasterSocialStadiumSpace.Model>(url, 'a1165211-8687-42c7-9005-274ca26f0680', this.data2Mock, {id});
  }
  // 河流信息-主键查询|河流信息-主键查询-河流信息
  postFindDisasterRiverById(id:string) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/findDisasterRiverById`;
      return requestHelper.postRequestData<IpostFindDisasterRiverByIdSpace.Model>(url, '6b000823-d356-4553-aead-e703d41ecedb', this.data2Mock, {id});
  }
  // 公共文化场所-修改|公共文化场所-修改-公共文化场所
  postModifyDisasterPublicPlace(params: IpostModifyDisasterPublicPlaceSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/modifyDisasterPublicPlace`;
      return requestHelper.postRequestData<IpostModifyDisasterPublicPlaceSpace.Model>(url, '8bce2e76-6fd0-4a7b-bc10-824ab9925c57', this.data2Mock, params);
  }
  // 社区（行政村）减灾能力-主键查询|社区（行政村）减灾能力-主键查询-社区（行政村）减灾能力
  postFindDisasterCommunityReductionById(id:string) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/findDisasterCommunityReductionById`;
      return requestHelper.postRequestData<IpostFindDisasterCommunityReductionByIdSpace.Model>(url, '18739b7c-b44f-4523-a8a9-4870cc9c2900', this.data2Mock, {id});
  }
  // 公共文化场所-添加|公共文化场所-添加-公共文化场所
  postAddDisasterPublicPlace(params: IpostAddDisasterPublicPlaceSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/addDisasterPublicPlace`;
      return requestHelper.postRequestData<IpostAddDisasterPublicPlaceSpace.Model>(url, '90412061-06e4-47d1-8ee8-a46268cbf51f', this.data2Mock, params);
  }
  // 河流信息-删除|河流信息-删除-河流信息
  postDeleteDisasterRiver(id:string[]) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/deleteDisasterRiver`;
      return requestHelper.postRequestData<IpostDeleteDisasterRiverSpace.Model>(url, '681c7d78-9a49-46a7-b36a-4bb66b71988c', this.data2Mock, {id});
  }
  // 河流信息-列表|河流信息-列表-河流信息
  postFindDisasterRiverPage(params: IpostFindDisasterRiverPageSpace.RequestParams) {
      const url = `${API_DOMAIN}${API_PREFIX}/disater/findDisasterRiverPage`;
      return requestHelper.postRequestData<IpostFindDisasterRiverPageSpace.Model>(url, '7762d2a4-8c6a-4bac-b3c1-cb5b67d9e251', this.data2Mock, params);
  }
  //公共文化场所管理-社会信用统一代码查重
  getCheckDisasterPublicPlace(socialCreditCode:string){
    const url = `${API_DOMAIN}${API_PREFIX}/disater/public/checkSocialCreditCode/${socialCreditCode}`;
    return requestHelper.getRequestData<any>(url, '6bf49ad9-b2d0-4aed-b21f-3d66bc37e884', this.data2Mock);
  }
  //公共文化场所管理-导出
  getExportDisasterPublicPlace(){
    const url = `${API_DOMAIN}${API_PREFIX}/disater/public/download`;
    return requestHelper.getRequestData<any>(url, '6bf49ad9-b2d0-4aed-b21f-3d66bc37e884', this.data2Mock);
  }
  //星级酒店-社会信用统一代码查重
  getCheckDisasterStarHotel(socialCreditCode:string){
    const url = `${API_DOMAIN}${API_PREFIX}/disater/hotel/checkSocialCreditCode/${socialCreditCode}`;
    return requestHelper.getRequestData<any>(url, '6bf49ad9-b2d0-4aed-b21f-3d66bc37e884', this.data2Mock);
  }
  //星级酒店-导出
  getExportDisasterStarHotel(){
    const url = `${API_DOMAIN}${API_PREFIX}/disater/hotel/download`;
    return requestHelper.getRequestData<any>(url, '6bf49ad9-b2d0-4aed-b21f-3d66bc37e884', this.data2Mock);
  }
   //大型商场管理管理-社会信用统一代码查重
   getCheckDisasterLargeMarket(socialCreditCode:string){
    const url = `${API_DOMAIN}${API_PREFIX}/disater/largeMarket/checkSocialCreditCode/${socialCreditCode}`;
    return requestHelper.getRequestData<any>(url, '6bf49ad9-b2d0-4aed-b21f-3d66bc37e884', this.data2Mock);
  }
  //大型商场管理管理-导出
  getExportDisasterLargeMarket(){
    const url = `${API_DOMAIN}${API_PREFIX}/disater/largeMarket/download`;
    return requestHelper.getRequestData<any>(url, '6bf49ad9-b2d0-4aed-b21f-3d66bc37e884', this.data2Mock);
  }
   //社会福利机构管理-社会信用统一代码查重
   getCheckDisasterSocialWelfare(socialCreditCode:string){
    const url = `${API_DOMAIN}${API_PREFIX}/disater/welfare/checkSocialCreditCode/${socialCreditCode}`;
    return requestHelper.getRequestData<any>(url, '6bf49ad9-b2d0-4aed-b21f-3d66bc37e884', this.data2Mock);
  }
  //社会福利机构管理-导出
  getExportDisasterSocialWelfare(){
    const url = `${API_DOMAIN}${API_PREFIX}/disater/welfare/download`;
    return requestHelper.getRequestData<any>(url, '6bf49ad9-b2d0-4aed-b21f-3d66bc37e884', this.data2Mock);
  }
  //体育场馆管理-社会信用统一代码查重
  getCheckDisasterSocialStadium(socialCreditCode:string){
    const url = `${API_DOMAIN}${API_PREFIX}/disater/stadium/checkSocialCreditCode/${socialCreditCode}`;
    return requestHelper.getRequestData<any>(url, '6bf49ad9-b2d0-4aed-b21f-3d66bc37e884', this.data2Mock);
  }
  //体育场馆管理-导出
  getExportDisasterSocialStadium(){
    const url = `${API_DOMAIN}${API_PREFIX}/disater/stadium/download`;
    return requestHelper.getRequestData<any>(url, '6bf49ad9-b2d0-4aed-b21f-3d66bc37e884', this.data2Mock);
  }
   //乡镇减灾能力-导出
   getExportDisasterTownshipReduction(){
    const url = `${API_DOMAIN}${API_PREFIX}/disater/township/download`;
    return requestHelper.getRequestData<any>(url, '6bf49ad9-b2d0-4aed-b21f-3d66bc37e884', this.data2Mock);
  }
   //社区(行政村)减灾能力-导出
   getExportDisasterCommunityReduction(){
    const url = `${API_DOMAIN}${API_PREFIX}/disater/community/download`;
    return requestHelper.getRequestData<any>(url, '6bf49ad9-b2d0-4aed-b21f-3d66bc37e884', this.data2Mock);
  }
   //历史灾情管理-导出
   getExportDisasterHistory(){
    const url = `${API_DOMAIN}${API_PREFIX}/disater/history/download`;
    return requestHelper.getRequestData<any>(url, '6bf49ad9-b2d0-4aed-b21f-3d66bc37e884', this.data2Mock);
  }
   //河流信息管理-导出
   getExportDisasterRiver(){
    const url = `${API_DOMAIN}${API_PREFIX}/disater/river/download`;
    return requestHelper.getRequestData<any>(url, '6bf49ad9-b2d0-4aed-b21f-3d66bc37e884', this.data2Mock);
  }
//闸站信息管理-导出
  getExportDisasterGateStation(){
    const url = `${API_DOMAIN}${API_PREFIX}/disater/gateStation/download`;
    return requestHelper.getRequestData<any>(url, '6bf49ad9-b2d0-4aed-b21f-3d66bc37e884', this.data2Mock);
  }


  // 化工园区-列表
  postFindDisasterChemicalIndustrialParkPage(params: any) {
    const url = `${API_DOMAIN}${API_PREFIX}/disasterChemicalIndustrialPark/findDisasterChemicalIndustrialParkPage`;
    return requestHelper.postRequestData<IpostFindDisasterChemicalIndustrialParkPageSpace.Model>(url, 'c39731fa-e106-4ee7-82d7-703bc2c62aa7', this.data2Mock, params);
  }
  // 化工园区-添加
  postAddDisasterChemicalIndustrialPark(params: any) {
    const url = `${API_DOMAIN}${API_PREFIX}/disasterChemicalIndustrialPark/addDisasterChemicalIndustrialPark`;
    return requestHelper.postRequestData<IpostAddDisasterLargeMarketSpace.Model>(url, 'bfa1427e-955f-48cb-93f8-5d8c163e037b', this.data2Mock, params);
  }
  // 化工园区-添加
  postModifyDisasterChemicalIndustrialPark(params: any) {
    const url = `${API_DOMAIN}${API_PREFIX}/disasterChemicalIndustrialPark/modifyDisasterChemicalIndustrialPark`;
    return requestHelper.postRequestData<IpostAddDisasterLargeMarketSpace.Model>(url, 'bfa1427e-955f-48cb-93f8-5d8c163e037b', this.data2Mock, params);
  }
  // 化工园区-主键查询
  postFindDisasterChemicalIndustrialParkById(id:string) {
    const url = `${API_DOMAIN}${API_PREFIX}/disasterChemicalIndustrialPark/findDisasterChemicalIndustrialParkById`;
    return requestHelper.postRequestData<IpostFindDisasterChemicalIndustrialParkByIdSpace.Model>(url, '3e7c8a33-2cc9-4f52-a3f7-5c0304151932', this.data2Mock, {id});
  }
  // 星级饭店-删除|星级饭店-删除-星级饭店
  postDeleteDisasterChemicalIndustrialPark(id:string[]) {
    const url = `${API_DOMAIN}${API_PREFIX}/disasterChemicalIndustrialPark/deleteDisasterChemicalIndustrialPark`;
    return requestHelper.postRequestData<IpostDeleteDisasterStarHotelSpace.Model>(url, '68483171-a79e-4d20-acf0-452a4cdfe1af', this.data2Mock, {id});
  }
  getExportDisasterChemicalIndustrialPark(){
    const url = `${API_DOMAIN}${API_PREFIX}/disasterChemicalIndustrialPark/download`;
    return requestHelper.getRequestData<any>(url, '6bf49ad9-b2d0-4aed-b21f-3d66bc37e884', this.data2Mock);
  }

  // 社会组织减灾能力-列表
  postFindDisasterSocietyReductionPage(params: any) {
    const url = `${API_DOMAIN}${API_PREFIX}/disasterSocietyReduction/findDisasterSocietyReductionPage`;
    return requestHelper.postRequestData<IpostFindDisasterSocietyReductionPageSpace.Model>(url, 'c39731fa-e106-4ee7-82d7-703bc2c62aa7', this.data2Mock, params);
  }
  // 社会组织减灾能力-添加
  postAddDisasterSocietyReductionk(params: any) {
    const url = `${API_DOMAIN}${API_PREFIX}/disasterSocietyReduction/addDisasterSocietyReduction`;
    return requestHelper.postRequestData<IpostAddDisasterLargeMarketSpace.Model>(url, 'bfa1427e-955f-48cb-93f8-5d8c163e037b', this.data2Mock, params);
  }
  // 社会组织减灾能力-添加
  postModifyDisasterSocietyReduction(params: any) {
    const url = `${API_DOMAIN}${API_PREFIX}/disasterSocietyReduction/modifyDisasterSocietyReduction`;
    return requestHelper.postRequestData<IpostAddDisasterLargeMarketSpace.Model>(url, 'bfa1427e-955f-48cb-93f8-5d8c163e037b', this.data2Mock, params);
  }
  // 社会组织减灾能力-主键查询
  postFindDisasterSocietyReductionById(id:string) {
    const url = `${API_DOMAIN}${API_PREFIX}/disasterSocietyReduction/findDisasterSocietyReductionById`;
    return requestHelper.postRequestData<IpostFindDisasterSocietyReductionByIdSpace.Model>(url, '3e7c8a33-2cc9-4f52-a3f7-5c0304151932', this.data2Mock, {id});
  }
  // 社会组织减灾能力-删除
  postDeleteDisasterSocietyReduction(id:string[]) {
    const url = `${API_DOMAIN}${API_PREFIX}/disasterSocietyReduction/deleteDisasterSocietyReduction`;
    return requestHelper.postRequestData<IpostDeleteDisasterStarHotelSpace.Model>(url, '68483171-a79e-4d20-acf0-452a4cdfe1af', this.data2Mock, {id});
  }
  getExportDisasterSocietyReduction(){
    const url = `${API_DOMAIN}${API_PREFIX}/disasterSocietyReduction/download`;
    return requestHelper.getRequestData<any>(url, '6bf49ad9-b2d0-4aed-b21f-3d66bc37e884', this.data2Mock);
  }
  //社会组织减灾能力-社会信用统一代码查重
  getCheckDisasterSocietyReduction(socialCreditCode:string){
    const url = `${API_DOMAIN}${API_PREFIX}/disasterSocietyReduction/checkSocialCreditCode/${socialCreditCode}`;
    return requestHelper.getRequestData<any>(url, '6bf49ad9-b2d0-4aed-b21f-3d66bc37e884', this.data2Mock);
  }

  // 县域基础指标统计-列表
  postFindDisasterIndicatorStatisticsPage(params: any) {
    const url = `${API_DOMAIN}${API_PREFIX}/disasterIndicatorStatistics/findDisasterIndicatorStatisticsPage`;
    return requestHelper.postRequestData<IpostFindDisasterIndicatorStatisticsPageSpace.Model>(url, 'c39731fa-e106-4ee7-82d7-703bc2c62aa7', this.data2Mock, params);
  }
  // 县域基础指标统计-添加
  postAddDisasterIndicatorStatistics(params: any) {
    const url = `${API_DOMAIN}${API_PREFIX}/disasterIndicatorStatistics/addDisasterIndicatorStatistics`;
    return requestHelper.postRequestData<IpostAddDisasterLargeMarketSpace.Model>(url, 'bfa1427e-955f-48cb-93f8-5d8c163e037b', this.data2Mock, params);
  }
  // 县域基础指标统计-添加
  postModifyDisasterIndicatorStatistics(params: any) {
    const url = `${API_DOMAIN}${API_PREFIX}/disasterIndicatorStatistics/modifyDisasterIndicatorStatistics`;
    return requestHelper.postRequestData<IpostAddDisasterLargeMarketSpace.Model>(url, 'bfa1427e-955f-48cb-93f8-5d8c163e037b', this.data2Mock, params);
  }
  // 县域基础指标统计-主键查询
  postFindDisasterIndicatorStatisticsById(id:string) {
    const url = `${API_DOMAIN}${API_PREFIX}/disasterIndicatorStatistics/findDisasterIndicatorStatisticsById`;
    return requestHelper.postRequestData<IpostFindDisasterIndicatorStatisticsByIdSpace.Model>(url, '3e7c8a33-2cc9-4f52-a3f7-5c0304151932', this.data2Mock, {id});
  }
  // 县域基础指标统计-删除
  postDeleteDisasterIndicatorStatistics(id:string[]) {
    const url = `${API_DOMAIN}${API_PREFIX}/disasterIndicatorStatistics/deleteDisasterIndicatorStatistics`;
    return requestHelper.postRequestData<IpostDeleteDisasterStarHotelSpace.Model>(url, '68483171-a79e-4d20-acf0-452a4cdfe1af', this.data2Mock, {id});
  }
  getExportDisasterIndicatorStatistics(){
    const url = `${API_DOMAIN}${API_PREFIX}/disasterIndicatorStatistics/download`;
    return requestHelper.getRequestData<any>(url, '6bf49ad9-b2d0-4aed-b21f-3d66bc37e884', this.data2Mock);
  }

  // 乡镇基础指标统计-列表
  postFindDisasterTownsIndicatorStatisticsPage(params: any) {
    const url = `${API_DOMAIN}${API_PREFIX}/disasterTownsIndicatorStatistics/findDisasterTownsIndicatorStatisticsPage`;
    return requestHelper.postRequestData<IpostFindDisasterTownsIndicatorStatisticsPageSpace.Model>(url, 'c39731fa-e106-4ee7-82d7-703bc2c62aa7', this.data2Mock, params);
  }
  // 乡镇基础指标统计-添加
  postAddDisasterTownsIndicatorStatistics(params: any) {
    const url = `${API_DOMAIN}${API_PREFIX}/disasterTownsIndicatorStatistics/addDisasterTownsIndicatorStatistics`;
    return requestHelper.postRequestData<IpostAddDisasterLargeMarketSpace.Model>(url, 'bfa1427e-955f-48cb-93f8-5d8c163e037b', this.data2Mock, params);
  }
  // 乡镇基础指标统计-添加
  postModifyDisasterTownsIndicatorStatistics(params: any) {
    const url = `${API_DOMAIN}${API_PREFIX}/disasterTownsIndicatorStatistics/modifyDisasterTownsIndicatorStatistics`;
    return requestHelper.postRequestData<IpostAddDisasterLargeMarketSpace.Model>(url, 'bfa1427e-955f-48cb-93f8-5d8c163e037b', this.data2Mock, params);
  }
  // 乡镇基础指标统计-主键查询
  postFindDisasterTownsIndicatorStatisticsById(id:string) {
    const url = `${API_DOMAIN}${API_PREFIX}/disasterTownsIndicatorStatistics/findDisasterTownsIndicatorStatisticsById`;
    return requestHelper.postRequestData<IpostFindDisasterTownsIndicatorStatisticsByIdSpace.Model>(url, '3e7c8a33-2cc9-4f52-a3f7-5c0304151932', this.data2Mock, {id});
  }
  // 乡镇基础指标统计-删除
  postDeleteDisasterTownsIndicatorStatistics(id:string[]) {
    const url = `${API_DOMAIN}${API_PREFIX}/disasterTownsIndicatorStatistics/deleteDisasterTownsIndicatorStatistics`;
    return requestHelper.postRequestData<IpostDeleteDisasterStarHotelSpace.Model>(url, '68483171-a79e-4d20-acf0-452a4cdfe1af', this.data2Mock, {id});
  }
  getExportDisasterTownsIndicatorStatistics(){
    const url = `${API_DOMAIN}${API_PREFIX}/disasterTownsIndicatorStatistics/download`;
    return requestHelper.getRequestData<any>(url, '6bf49ad9-b2d0-4aed-b21f-3d66bc37e884', this.data2Mock);
  }

  // 政府灾害管理能力-列表
  postFindDisasterGovernmentManagementPage(params: any) {
    const url = `${API_DOMAIN}${API_PREFIX}/disasterGovernmentManagement/findDisasterGovernmentManagementPage`;
    return requestHelper.postRequestData<IpostFindDisasterGovernmentManagementPageSpace.Model>(url, 'c39731fa-e106-4ee7-82d7-703bc2c62aa7', this.data2Mock, params);
  }
  // 政府灾害管理能力-添加
  postAddDisasterGovernmentManagement(params: any) {
    const url = `${API_DOMAIN}${API_PREFIX}/disasterGovernmentManagement/addDisasterGovernmentManagement`;
    return requestHelper.postRequestData<IpostAddDisasterLargeMarketSpace.Model>(url, 'bfa1427e-955f-48cb-93f8-5d8c163e037b', this.data2Mock, params);
  }
  // 政府灾害管理能力-添加
  postModifyDisasterGovernmentManagement(params: any) {
    const url = `${API_DOMAIN}${API_PREFIX}/disasterGovernmentManagement/modifyDisasterGovernmentManagement`;
    return requestHelper.postRequestData<IpostAddDisasterLargeMarketSpace.Model>(url, 'bfa1427e-955f-48cb-93f8-5d8c163e037b', this.data2Mock, params);
  }
  // 政府灾害管理能力-主键查询
  postFindDisasterGovernmentManagementById(id:string) {
    const url = `${API_DOMAIN}${API_PREFIX}/disasterGovernmentManagement/findDisasterGovernmentManagementById`;
    return requestHelper.postRequestData<IpostFindDisasterGovernmentManagementByIdSpace.Model>(url, '3e7c8a33-2cc9-4f52-a3f7-5c0304151932', this.data2Mock, {id});
  }
  // 政府灾害管理能力-删除
  postDeleteDisasterGovernmentManagement(id:string[]) {
    const url = `${API_DOMAIN}${API_PREFIX}/disasterGovernmentManagement/deleteDisasterGovernmentManagement`;
    return requestHelper.postRequestData<IpostDeleteDisasterStarHotelSpace.Model>(url, '68483171-a79e-4d20-acf0-452a4cdfe1af', this.data2Mock, {id});
  }
  getExportDisasterGovernmentManagement(){
    const url = `${API_DOMAIN}${API_PREFIX}/disasterGovernmentManagement/download`;
    return requestHelper.getRequestData<any>(url, '6bf49ad9-b2d0-4aed-b21f-3d66bc37e884', this.data2Mock);
  }

  // 政府灾害相关预案表-列表
  postFindDisasterGovernmentManagementPlanPage(id: string) {
    const url = `${API_DOMAIN}${API_PREFIX}/disasterGovernmentManagementPlan/findDisasterGovernmentManagementPlanPage`;
    return requestHelper.postRequestData<IpostFindDisasterGovernmentManagementPlanPageSpace.Model>(url, 'c39731fa-e106-4ee7-82d7-703bc2c62aa7', this.data2Mock, {disasterGovernmentManagementId: id});
  }
  //政府灾害相关预案表-添加
  postAddDisasterGovernmentManagementPlan(params: any) {
    const url = `${API_DOMAIN}${API_PREFIX}/disasterGovernmentManagementPlan/addDisasterGovernmentManagementPlan`;
    return requestHelper.postRequestData<IpostAddDisasterLargeMarketSpace.Model>(url, 'bfa1427e-955f-48cb-93f8-5d8c163e037b', this.data2Mock, params);
  }
}
export const apiBasicInformationObj = new BasicInformationApi();
