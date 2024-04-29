/**
 * @Description:标签管理
 * @Author: liugeng
 * @Date: 2021-05-10
 */
import request from '@/utils/request';
import serviceSuffix, { getProxyUrl } from './service-suffix.js'
const baseUrl = getProxyUrl(serviceSuffix.asset_center_server)

// 标签分组
export function getRootTag(data) {
  return request({
    url: baseUrl + '/api/scene/root',
    method: 'GET',
    data
  })
}

// 分组下标签
export function getTagList(data) {
  return request({
    url: baseUrl + '/api/scene/tree',
    method: 'POST',
    data
  })
}

// 标签新增
export function addTag(data) {
  return request({
    url: baseUrl + '/api/scene/add',
    method: 'POST',
    data
  })
}

// 标签编辑
export function editTag(data) {
  return request({
    url: baseUrl + '/api/scene/update',
    method: 'POST',
    data
  })
}

// 标签编辑
export function delTag(id) {
  return request({
    url: baseUrl + '/api/scene/delete/' + id,
    method: 'POST'
  })
}
