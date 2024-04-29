import { requestHelper } from "@/apis/base/mapper-helper";
import { IpostResourceDetailSpace, IlistSpace, IpostDotRadiusStatByCoordinateSpace, IpostVideoDetailSpace, IResourcelistSpace, IpostVideoRadiusQuerySpace, IpostResourceRadiusQuerySpace, IResourcelistPageSpace, IlistPageSpace } from './model';
import { GlobalAPI } from '@/common';
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = GlobalAPI.config.API_PREFIX_OP;

/**
 * 数据访问，此类代码生成器生成
 */
class EventResourcesApi {
  data2Mock: boolean = false;

  // 资源详情|资源详情-一张图-资源管理
  postResourceDetail(id: string) {
    const url = `${API_DOMAIN}${API_PREFIX}/resource/detail/${id}`;
    return requestHelper.postRequestData<IpostResourceDetailSpace.Model>(url, '3651a59b-5f73-4be5-ba70-b42d2e545a13', this.data2Mock, { id });
  }
  // 视频列表-地图打点|视频列表-地图打点-一张图-视频管理
  list(params: IlistSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/video/list`;
    return requestHelper.postRequestData<IlistSpace.Model>(url, '153c41e8-178f-441a-bdb3-0495efb50f65', this.data2Mock, params);
  }
  // 视频列表-地图打点|视频列表-分页-一张图-视频管理
  listPage(params: IlistSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/video/list/page`;
    return requestHelper.postRequestData<IlistPageSpace.Model>(url, '153c41e8-178f-441a-bdb3-0495efb50f65', this.data2Mock, params);
  }
  // 半径统计-事件、资源、视频数量统计|半径统计-事件、资源、视频数量统计-一张图-首页
  postDotRadiusStatByCoordinate(params: IpostDotRadiusStatByCoordinateSpace.RequestParams) {
    const url = `${API_DOMAIN}${API_PREFIX}/event/map/dot/radiusStatByCoordinate`;
    return requestHelper.postRequestData<IpostDotRadiusStatByCoordinateSpace.Model>(url, 'a839f66b-e53c-4def-920c-6e65c8b450b3', this.data2Mock, params);
}
  // 视频详情|视频详情-一张图-视频管理
  postVideoDetail(id: number) {
    const url = `${API_DOMAIN}${API_PREFIX}/video/detail/{id}`;
    return requestHelper.postRequestData<IpostVideoDetailSpace.Model>(url, '8ecf0c3c-5df0-44a5-9697-0f4af5cca4d4', this.data2Mock, { id });
  }
  // 资源列表|资源列表-一张图-资源管理
  postResourcelist(name: string, typeList: string[] | number[], pageSize?: number, pageNum?: number) {
    const url = `${API_DOMAIN}${API_PREFIX}/resource/list`;
    return requestHelper.postRequestData<IResourcelistSpace.Model>(url, 'abd68df2-8c18-435b-bfd7-6adcdff65dab', this.data2Mock, { name, typeList });
  }
  // 资源列表|资源列表-一张图-资源管理-分野
  postResourcelistPage(name: string, typeList: string[] | number[], pageSize?: number, pageNum?: number) {
    const url = `${API_DOMAIN}${API_PREFIX}/resource/list/page`;
    return requestHelper.postRequestData<IResourcelistPageSpace.Model>(url, 'abd68df2-8c18-435b-bfd7-6adcdff65dab', this.data2Mock, { name, typeList, pageSize, pageNum });
  }
  // 视频半径查询|视频半径查询-一张图-视频管理
  postVideoRadiusQuery(coordx: string, coordy: string, radius: number) {
    const url = `${API_DOMAIN}${API_PREFIX}/video/radiusQuery`;
    return requestHelper.postRequestData<IpostVideoRadiusQuerySpace.Model>(url, '33d0701d-9cf5-4f4e-a457-75e7bcea88db', this.data2Mock, { coordx, coordy, radius });
  }
  // 资源半径查询|资源半径查询-一张图-资源管理
  postResourceRadiusQuery(coordx: string, coordy: string, radius: number) {
    const url = `${API_DOMAIN}${API_PREFIX}/resource/radiusQuery`;
    return requestHelper.postRequestData<IpostResourceRadiusQuerySpace.Model>(url, '5a2fbeed-984e-41d1-8f53-5a4ac32c0980', this.data2Mock, { coordx, coordy, radius });
  }
}
export const apiEventResourcesObj = new EventResourcesApi();