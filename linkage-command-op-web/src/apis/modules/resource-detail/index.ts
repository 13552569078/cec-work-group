import { requestHelper } from "@/apis/base/mapper-helper";
import { IpostFindResourceEquipListSpace, IpostFindEquipByReserveIdSpace } from './model';
import { GlobalAPI } from '@/common';

class ResourceDetailApi {
  data2Mock: boolean = false;

  // 资源主表-列表|资源主表-列表-资源主表
  postFindEquipByReserveId(reserveId:number|string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/resource/findEquipByReserveId?reserveId=${reserveId}`;
    return requestHelper.postRequestData<IpostFindEquipByReserveIdSpace.Model>(url, '63ad5020-4170-4b22-ae54-6b330b62f95c', this.data2Mock, );
  }
  // 应急资源-救援队伍-主键查询|应急资源-救援队伍-主键查询-应急资源-救援队伍
  postFindResourceTeamById(id:string) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/resource/findResourceTeamById`;
      return requestHelper.postRequestData<any>(url, 'd2ec166d-e720-4e09-bb43-3b95d763f3c1', this.data2Mock, {id});
  }
  // 应急资源-物资储备库表-主键查询|应急资源-物资储备库表-主键查询-应急资源-应急装备库
  postFindResourceMaterialById(id:string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/resource/findResourceMaterialById`;
    return requestHelper.postRequestData<any>(url, '19df50b8-23dc-41e5-a0b0-2c3e593d930b', this.data2Mock, {id});
  }
  // 应急资源-物资装备-主键查询|应急资源-物资装备-主键查询-应急资源-物资装备
  postFindResourceEquipById(id:string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/resource/findResourceEquipById`;
    return requestHelper.postRequestData<any>(url, '5334ccab-6371-483c-909a-56d00e998563', this.data2Mock, {id});
  }
  // 应急资源-专家表-主键查询|应急资源-专家表-主键查询-应急资源-专家表
  postFindResourceExpertById(id:string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/resource/findResourceExpertById`;
    return requestHelper.postRequestData<any>(url, '4407fa83-e098-4f62-b3a0-f77f92c440fa', this.data2Mock, {id});
  }
  // 应急资源-运输车辆-主键查询|应急资源-运输车辆-主键查询-应急资源-运输车辆
  postFindResourceCarrierById(id:number) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/resource/findResourceCarrierById`;
    return requestHelper.postRequestData<any>(url, 'a38d6513-1fcc-4bf3-b43c-1af7a1604e39', this.data2Mock, {id});
  }
  // 应急资源-机构-主键查询|应急资源-机构-主键查询-应急资源-机构
  postFindResourceOrgById(id:number) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/resource/findResourceOrgById`;
    return requestHelper.postRequestData<any>(url, '28e4de17-0a16-4d7b-8877-707b7b9864bf', this.data2Mock, {id});
  }
  // 应急资源-企业-主键查询|应急资源-企业-主键查询-应急资源-企业
  postFindResourceEnterpriseById(id:number) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/resource/findResourceEnterpriseById`;
    return requestHelper.postRequestData<any>(url, '3d806b3e-f482-4958-816f-c10dc9f44fce', this.data2Mock, {id});
  }
  // 风险隐患-避难场所-主键查询|风险隐患-避难场所-主键查询-风险隐患-避难场所
  postFindRiskRefugeById(id:string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/risk/findRiskRefugeById`;
    return requestHelper.postRequestData<any>(url, 'f795e13b-0e87-40bb-b9f5-a1de4f007c2f', this.data2Mock, {id});
  }

  // 风险隐患-地质灾害隐患点-主键查询|风险隐患-地质灾害隐患点-主键查询-风险隐患-地质灾害隐患点
  postFindRiskGeologyDisasterById(id:string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/risk/findRiskGeologyDisasterById`;
    return requestHelper.postRequestData<any>(url, '7aab8346-48c1-49a9-8244-7abdc02d290e', this.data2Mock, {id});
  }
  // 风险隐患-水旱灾害风险区-主键查询|风险隐患-水旱灾害风险区-主键查询-风险隐患-水旱灾害风险区
  postFindRiskWaterDisasterById(id:string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/risk/findRiskWaterDisasterById`;
    return requestHelper.postRequestData<any>(url, '405f3bfc-585f-48d1-ac0c-c0b40d4b77a7', this.data2Mock, {id});
  }
  // 风险隐患-危化企业-主键查询|风险隐患-危化企业-主键查询-风险隐患-危化企业
  postFindRiskChemicalCompanyById(id:string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/risk/findRiskChemicalCompanyById`;
    return requestHelper.postRequestData<any>(url, '4ce97690-7c65-4df0-a932-aa129276f017', this.data2Mock, {id});
  }
  // 风险隐患-城市易涝点-主键查询|风险隐患-城市易涝点-主键查询-风险隐患-城市易涝点
  postFindRiskWaterloggedPlaceById(id:string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/risk/findRiskWaterloggedPlaceById`;
    return requestHelper.postRequestData<any>(url, 'c3c1c7b5-d271-4982-9695-f31cbfb480b2', this.data2Mock, {id});
  }
  // 风险隐患-重大危险源-主键查询|风险隐患-重大危险源-主键查询-风险隐患-重大危险源
  postFindRiskHazardById(id:string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/risk/findRiskHazardById`;
    return requestHelper.postRequestData<any>(url, 'f9dd5bb3-9bd8-40e0-99f5-5a3ea708cb36', this.data2Mock, {id});
  }
  // 水库
  postFindRiskReservoirById(id:string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/risk/findRiskReservoirById`;
    return requestHelper.postRequestData<any>(url, 'f9dd5bb3-9bd8-40e0-99f5-5a3ea708cb36', this.data2Mock, {id});
  }
  // 交通枢纽
  postFindProtectTrafficById(id:string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/protect/findProtectTrafficById`;
    return requestHelper.postRequestData<any>(url, 'f9dd5bb3-9bd8-40e0-99f5-5a3ea708cb36', this.data2Mock, {id});
  }
  // 人员密集场所
  postFindProtectLargeMarketById(id:string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/protect/findProtectLargeMarketById`;
    return requestHelper.postRequestData<any>(url, 'b2516a8c-b7fa-473d-b095-a26c1fc9cfbd', this.data2Mock, {id});
  }
  // 学校
  postFindProtectSchoolById(id:string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/protect/findProtectSchoolById`;
    return requestHelper.postRequestData<any>(url, '3738e9af-5dd2-4485-b172-7c10867cdd42', this.data2Mock, {id});
  }
  // 医疗机构
  postFindProtectMedicalInstitutionById(id:string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/protect/findProtectMedicalInstitutionById`;
    return requestHelper.postRequestData<any>(url, 'efb7b7f1-4e33-4026-aaea-18f19062987d', this.data2Mock, {id});
  }
  // 重大基础设施
  postFindProtectBaseFacilitiesById(id:string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/protect/findProtectBaseFacilitiesById`;
    return requestHelper.postRequestData<any>(url, '351d0e79-32d0-46f9-afc7-8cbd25efc7c0', this.data2Mock, {id});
  }
  // 应急资源-物资装备-列表|应急资源-物资装备-列表-应急资源-物资装备
  postFindResourceEquipList(params: { teamId?:string,reserveId?:string, strategyId?:string }) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/resource/findResourceEquipList`;
    return requestHelper.postRequestData<IpostFindResourceEquipListSpace.Model>(url, '0dc39d73-9af8-469e-a4fc-9238b2eae3fa', this.data2Mock, params);
  }
}
export const apiResourceDetailObj = new ResourceDetailApi();
export type ApiKeys = Exclude<keyof ResourceDetailApi, 'data2Mock' | 'postFindResourceEquipList'>
