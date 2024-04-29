/**
 * @Description:标签管理
 * @Author: liugeng
 * @Date: 2021-05-10
 */
import request from '@/utils/request'
import { getProxyUrl } from './service-suffix.js'

const baseUrl = getProxyUrl('asset_shop_manage_server')

// 标签分组
export function getRootTag(params) {
  return request({
    url: baseUrl + '/api/operation/tag/root',
    method: 'GET',
    params: params
  })
}

// 分组下标签
export function getTagList(params) {
  return request({
    url: baseUrl + '/api/operation/tag/tree',
    method: 'GET',
    params: params
  })
}

// 标签新增
export function addTag(data) {
  return request({
    url: baseUrl + '/api/operation/tag/add',
    method: 'POST',
    data
  })
}

// 标签编辑
export function editTag(data) {
  return request({
    url: baseUrl + '/api/operation/tag/update',
    method: 'POST',
    data
  })
}

// 标签删除
export function delTag(id) {
  return request({
    url: baseUrl + '/api/operation/tag/delete/' + id,
    method: 'POST'
  })
}
