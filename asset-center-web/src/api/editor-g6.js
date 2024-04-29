/**
 * @Description: g6流程编辑器使用接口
 * @Author: zhangsen
 * @Date: 2021-05-06
 */

import request from '@/utils/request';
import serviceSuffix, { getProxyUrl } from './service-suffix.js'
const BASE_URL = getProxyUrl(serviceSuffix.asset_center_server)

// 模型数据详情
export function getModelDataDetail(id) {
  return request({
    url: BASE_URL + `/api/asset/object/detail/${id}`,
    method: 'get'
  })
}

// 基础模型表结构  modelId modelType
export function getBasicModelColumnList(data) {
  return request({
    url: BASE_URL + '/api/asset/stats/modelResultStructure/result/columnList',
    method: 'post',
    data
  })
}

// 研判模型结构  modelId modelType
export function getJudgeModeColumnResultList(data) {
  return request({
    url: BASE_URL + '/api/asset/stats/modelResultStructure/result/columnResultList',
    method: 'post',
    data
  })
}

// 查看研判模型
export const getJudgeModelDetailById = (id) => request({
  url: BASE_URL + '/api/asset/stats/model/detail/' + id,
  method: 'post'
})

// 模型数据专题树
export function getModelDataTree() {
  return request({
    url: BASE_URL + '/api/asset/object/list',
    method: 'post'
  })
}

// 基础模型专题树
export function getBasicModelTree() {
  return request({
    url: BASE_URL + '/api/asset/stats/basicModel/list/nonPage',
    method: 'post'
  })
}

// 研判模型专题树
export function getJudgeModelTree() {
  return request({
    url: BASE_URL + '/api/asset/stats/model/list/nonPage',
    method: 'post'
  })
}

// 启用算法模型列表（不分页）
export function fetchAlgoListNopage(data) {
  return request({
    url: BASE_URL + '/api/asset/tech/algo/list/nopage',
    method: 'post',
    data
  })
}

// 算法管理-算法详情
export function fetchAlgoDetail(id) {
  return request({
    url: BASE_URL + `/api/asset/tech/algo/detail/${id}`,
    method: 'post'
  })
}
