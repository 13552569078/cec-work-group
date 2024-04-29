/**
 * @Description: 运营中心的审核相关接口
 * @Author: zs
 * @Date: 2022-01-21
 */
import request from '@/utils/request'
import { getProxyUrl } from './service-suffix.js'

const baseUrl = getProxyUrl('asset_shop_manage_server')

// 审核列表
export function applyList(data) {
  return request({
    url: baseUrl + '/api/operation/apply/list',
    method: 'POST',
    data
  })
}
// 接口资产 审核列表[V3.16.0U]
export function applyAuditList(data) {
  return request({
    url: baseUrl + '/api/shop/apply/audit/list',
    method: 'POST',
    data
  })
}

// 查询关联接口资源详情[v3.16.0A]
export function packApiDetail(applyId) {
  return request({
    url: baseUrl + `/api/operation/apply/pack/api/detail/${applyId}`,
    method: 'GET'
  })
}
// 查询关联接口资源详情[v3.17.0A]
export function packSupportappDetail(applyId) {
  return request({
    url: baseUrl + `/api/operation/apply/pack/supportApp/detail/${applyId}`,
    method: 'GET'
  })
}
// 查询关联接口资源详情[v3.16.0A]
export function apiPublishDetail(packVersionId) {
  return request({
    url: baseUrl + `/api/shop/publish/pack/api/detail/${packVersionId}`,
    method: 'GET'
  })
}
// 查询关联接口资源详情[v3.16.0A]
export function supportappPublishDetail(packVersionId) {
  return request({
    url: baseUrl + `/api/shop/publish/pack/supportApp/detail/${packVersionId}`,
    method: 'GET'
  })
}
// 申请单详情[V3.16.0A]
export function applyDetail(applyId) {
  return request({
    url: baseUrl + `/api/operation/apply/detail/${applyId}`,
    method: 'GET'
  })
}
// 申请单详情[V3.16.0A]
export function applyDetailShop(applyId) {
  return request({
    url: baseUrl + `/api/shop/apply/detail/${applyId}`,
    method: 'GET'
  })
}
// 申请单详情[V3.16.0A]
export function applyUpdateDifference(applyId) {
  return request({
    url: baseUrl + `/api/operation/apply/update/difference/${applyId}`,
    method: 'GET'
  })
}

// 查询审核关联上架资源详情
export function applyPackDetail(id) {
  return request({
    url: baseUrl + `/api/operation/apply/pack/detail/${id}`,
    method: 'GET'
  })
}
// 查询审核关联上架资源详情 - 应用
export function applyPackDetailApp(id) {
  return request({
    url: baseUrl + `/api/operation/apply/pack/app/detail/${id}`,
    method: 'GET'
  })
}

// 审核处理
export function applyHandle(data) {
  return request({
    url: baseUrl + `/api/operation/apply/handle`,
    method: 'POST',
    data
  })
}
// 审核处理
export function shopApplyHandle(data) {
  return request({
    url: baseUrl + `/api/shop/apply/handle`,
    method: 'POST',
    data
  })
}

// 申请单的审核历史列表
export function applyLog(id) {
  return request({
    url: baseUrl + `/api/operation/apply/log?applyId=${id}`,
    method: 'GET'
  })
}
// 申请单的审核历史列表
export function shopApplyLog(id) {
  return request({
    url: baseUrl + `/api/shop/apply/log?applyId=${id}`,
    method: 'GET'
  })
}
// 同步中枢接口资源
export const packAsyncApi = (params) => request.post(`${baseUrl}/api/shop/pack/sync/api`, params)
// 资源申请 应用 详情
export const queryPackDetailApp = params => request.get(`${baseUrl}/api/shop/publish/pack/app/detail/${params.packVersionId}`)
// 资源申请 资源 详情
export const queryPackDetailAsset = packVersionId => request.get(`${baseUrl}/api/shop/publish/pack/detail/${packVersionId}`)
