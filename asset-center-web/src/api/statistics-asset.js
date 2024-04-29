/**
 * @Description: 资源管理中心
 * @Author: 丁利
 * @Date: 2021-5-7
 */
import request from '@/utils/request';
import serviceSuffix, { getProxyUrl } from './service-suffix.js'
const baseURL = getProxyUrl(serviceSuffix.asset_center_server)

/** -------↓↓↓↓↓↓↓↓↓↓↓↓↓↓-----模型相关接口------↓↓↓↓↓↓↓↓↓↓↓↓↓↓---------------- */

// 新增模型
export const assetStatsModelAdd = params => request.post(`${baseURL}/api/asset/stats/model/add`, params)
// 修改模型
export const assetStatsModelUpdate = params => request.post(`${baseURL}/api/asset/stats/model/update`, params)
// 模型详情
export const assetStatsModelDetail = id => request.post(`${baseURL}/api/asset/stats/model/detail/${id}`)
// 资源编码唯一性校验
export const assetCodeExist = params => request.post(`${baseURL}/api/asset/codeExist`, params)

/** ----------------基础模型/研判模型 相关接口---start------------------ */
// 校验sql
export const validateSql = params => request.post(`${baseURL}/api/asset/stats/model/operation/sql/validate`, params);
// 新增
export const addBasicModel = (params) => request.post(`${baseURL}/api/asset/stats/basicModel/add`, params);
// 编辑
export const updateBasicModel = (params) => request.post(`${baseURL}/api/asset/stats/basicModel/update`, params);
// 详情
export const getBasicModelDetail = (id) => request.post(`${baseURL}/api/asset/stats/basicModel/detail/${id}`);
// 引用模型列表
export const getReferencableModelList = (params) => request.post(`${baseURL}/api/asset/stats/basicModel/list/nonPage`, params);

// 查询列表
export const queryPage = params => request.post(`${baseURL}/api/asset/stats/basicModel/list/page`, params);

// 删除-列表item
export const delPageItem = id => request.post(`${baseURL}/api/asset/stats/basicModel/delete/${id}`);
/** ----------------基础模型相关接口---end------------------ */

// 指标新增
export const assetStatsIndexAdd = params => request.post(`${baseURL}/api/asset/stats/kpi/add`, params)

// 引用指标列表
export const getIndexTableList = (params) => request.post(`${baseURL}/api/asset/stats/kpi/list/page`, params);
// 体征列表
export const citysignsList = (params) => request.post(`${baseURL}/api/asset/data/citysigns/list/page`, params);
// 体征添加
export const citysignsAdd = (params) => request.post(`${baseURL}/api/asset/data/citysigns/add`, params);
// 体征修改
export const citysignsUpdate = (params) => request.post(`${baseURL}/api/asset/data/citysigns/update`, params);
// 体征修改
export const citysignsDetail = (id) => request.get(`${baseURL}/api/asset/data/citysigns/detail/${id}`);
// 体征删除
export const citysignsDelete = (id) => request.post(`${baseURL}/api/asset/data/citysigns/delete/${id}`);
// 新增指标列表
export const kpiAdd = (params) => request.post(`${baseURL}/api/asset/stats/kpi/add`, params);
// 编辑指标列表
export const kpiUpdate = (params) => request.post(`${baseURL}/api/asset/stats/kpi/update`, params);

export const fetchAtrPage = data => request.post(baseURL + '/api/asset/data/list/atrPage', data)

export const fetchModelPage = data => request.post(baseURL + '/api/asset/stats/model/operation/list/page', data)
