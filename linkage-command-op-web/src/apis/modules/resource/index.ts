import { requestHelper } from "@/apis/base/mapper-helper";
import {
  IpostTypeTreeSpace,
  IpostFindResourceTypeAttrPageSpace,
  IpostPageResourceSpace,
  IpostFindResourceMainByIdSpace,
  IgetFocusGoalsStatSpace,
  IpostListResourceManagerSpace,
  IpostFindFocusGoalsPageByTypeSpace,
  IpostEmergencyStatSpace,
  IpostEmergencyPageSpace,
  IgetRefugeStatSpace,
  IpostFindResourceRefugeStatPageSpace,
  IgetEquipStatSpace,
  IpostFindResourceEquipStatPageSpace,
  IgetMaterialStatSpace,
  IpostFindResourceMaterialStatPageSpace,
} from './model';
import { GlobalAPI } from '@/common';

/**
 * 数据访问，此类代码生成器生成
 */
class ResourceApi {
  data2Mock: boolean = false;

  // 资源类型-树|资源类型-树-资源类型
  postTypeTree(onlyEnable: boolean) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/resource/typeTree?onlyEnable=${onlyEnable}`;
    return requestHelper.postRequestData<IpostTypeTreeSpace.Model>(url, '3cb6d138-05a8-48b8-b176-406e55330305', this.data2Mock);
  }
  // 资源类型属性-列表|资源类型属性-列表-资源类型属性
  postFindResourceTypeAttrPage(params: IpostFindResourceTypeAttrPageSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/resource/findResourceTypeAttrPage`;
    return requestHelper.postRequestData<IpostFindResourceTypeAttrPageSpace.Model>(url, '0b33f853-57ce-4295-9863-1a0f6b14bb51', this.data2Mock, params);
  }

  // 资源主表-主键查询|资源主表-主键查询-资源主表
  postFindResourceMainById(id:number|string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/resource/findResourceMainById`;
    return requestHelper.postRequestData<IpostFindResourceMainByIdSpace.Model>(url, '749388ee-7bd0-4656-b6fe-1f1d1a7c8305', this.data2Mock, {id});
  }

  // 应急保障资源列表详情|应急保障资源列表详情-一张图资源
  postPageResource(params: IpostPageResourceSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/picture/resource/pageResource`;
    return requestHelper.postRequestData<IpostPageResourceSpace.Model>(url, 'bcef412c-4513-4dac-b80f-8fe8293656bb', this.data2Mock, params);
  }

  // 应急资源-应急物质按照类型统计
  getEquipStat(areaCode: string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/picture/resource/equip/stat?areaCode=${areaCode}`;
    return requestHelper.getRequestData<IgetEquipStatSpace.Model>(url, '7e20a7be-5660-489c-ad5b-0615e3637b2c', this.data2Mock);
  }
   // 应急资源-物资装备类型统计列表
  postFindResourceEquipStatPage(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/picture/resource/equip/findResourceEquipStatPage`;
    return requestHelper.postRequestData<IpostFindResourceEquipStatPageSpace.Model>(url, '2180192a-aa0b-4667-8a7a-dfdb4c335632', this.data2Mock, params);
  }

  // 应急资源-物资储备库按照主管单位统计
  getMaterialStat(areaCode: string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/picture/resource/material/stat?areaCode=${areaCode}`;
    return requestHelper.getRequestData<IgetMaterialStatSpace.Model>(url, '7e20a7be-5660-489c-ad5b-0615e3637b2c', this.data2Mock);
  }
   // 应急资源-物资储备库按照主管单位统计分页列表
   postFindResourceMaterialStatPage(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/picture/resource/material/findResourceMaterialStatPage`;
    return requestHelper.postRequestData<IpostFindResourceMaterialStatPageSpace.Model>(url, '2180192a-aa0b-4667-8a7a-dfdb4c335632', this.data2Mock, params);
  }

  // 应急资源-物资储备库按照主管单位统计
  getRefugeStat(areaCode: string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/picture/resource/refuge/stat?areaCode=${areaCode}`;
    return requestHelper.getRequestData<IgetRefugeStatSpace.Model>(url, '7e20a7be-5660-489c-ad5b-0615e3637b2c', this.data2Mock);
  }
  // 应急资源-物资储备库按照主管单位统计分页列表
  postFindResourceRefugeStatPage(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/picture/resource/refuge/findRiskRefugeStatPage`;
    return requestHelper.postRequestData<IpostFindResourceRefugeStatPageSpace.Model>(url, '2180192a-aa0b-4667-8a7a-dfdb4c335632', this.data2Mock, params);
  }

  // 应急保障资源统计
  postEmergencyStat(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/picture/resource/statResource`;
    return requestHelper.postRequestData<IpostEmergencyStatSpace.Model>(url, '7e20a7be-5660-489c-ad5b-0615e3637b2c', this.data2Mock, params);
  }
  // 应急保障资源列表详情
  postEmergencyPage(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/picture/resource/pageList`;
    return requestHelper.postRequestData<IpostEmergencyPageSpace.Model>(url, '2180192a-aa0b-4667-8a7a-dfdb4c335632', this.data2Mock, params);
  }

  // 平时态重点关注目标
  getFocusGoalsStat(areaCode: string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/picture/event/findFocusGoalsStat?areaCode=${areaCode}`;
    return requestHelper.getRequestData<IgetFocusGoalsStatSpace.Model>(url, '7e20a7be-5660-489c-ad5b-0615e3637b2c', this.data2Mock);
  }
  // 应急资源-物资储备库按照主管单位统计分页列表
  postFindFocusGoalsPageByType(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/picture/event/findFocusGoalsPageByType`;
    return requestHelper.postRequestData<IpostFindFocusGoalsPageByTypeSpace.Model>(url, '2180192a-aa0b-4667-8a7a-dfdb4c335632', this.data2Mock, params);
  }

  // 应急资源-物资储备库按照主管单位统计分页列表
  postListResourceManager(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/resource/listResourceManager`;
    return requestHelper.postRequestData<IpostListResourceManagerSpace.Model>(url, '2180192a-aa0b-4667-8a7a-dfdb4c335632', this.data2Mock, params);
  }
}
export const apiResourceObj = new ResourceApi();
