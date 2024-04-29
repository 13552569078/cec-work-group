/**
 * @Description: 算法模型注册
 * @Author: zhangsen
 * @Date: 2020-11-13
 */
import request from '@/utils/request';
import serviceSuffix, { getProxyUrl } from './service-suffix.js'
const baseURL = getProxyUrl(serviceSuffix.asset_center_server)

// 算法管理-注册算法
export const addAlgo = params => request.post(baseURL + '/api/asset/tech/algo/add', params);

// 算法管理-修改算法
export const updateAlgo = params => request.post(baseURL + '/api/asset/tech/algo/update', params);

// 算法管理-算法详情
export const fetchAlgoDetail = id => request.post(baseURL + `/api/asset/tech/algo/detail/${id}`);

// 算法管理-删除算法/接口/页面
export const deleteAlgo = id => request.post(baseURL + `/api/asset/tech/delete/${id}`);

// 资源名称校验
export const assetCodeExistcodeExist = data => request.post(baseURL + '/api/asset/codeExist', data)

// 算法管理-校验名称
export const existAlgoCode = data => request.post(baseURL + '/api/asset/tech/algo/code/exist', data);

