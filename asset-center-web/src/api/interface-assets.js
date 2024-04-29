/**
 * @Description:接口接口文件
 * @Author: liugeng
 * @Date: 2021-05-08
 */
import request from '@/utils/request';
import serviceSuffix, { getProxyUrl } from './service-suffix.js'
const baseUrl = getProxyUrl(serviceSuffix.asset_center_server)

// 添加 逻辑函数
export function addFunction(data) {
  return request({
    url: baseUrl + '/api/asset/tech/function/add',
    method: 'POST',
    data
  })
}
//  修改逻辑函数
export function editFunction(data) {
  return request({
    url: baseUrl + '/api/asset/tech/function/update',
    method: 'POST',
    data
  })
}
//  逻辑函数详情
export function functionDetail(id) {
  return request({
    url: baseUrl + `/api/asset/tech/function/detail/${id}`,
    method: 'POST'
  })
}
// 添加 定时任务
export function addTask(data) {
  return request({
    url: baseUrl + '/api/asset/tech/task/add',
    method: 'POST',
    data
  })
}
//  修改定时任务
export function editTask(data) {
  return request({
    url: baseUrl + '/api/asset/tech/task/update',
    method: 'POST',
    data
  })
}
//  定时任务详情
export function taskDetail(id) {
  return request({
    url: baseUrl + `/api/asset/tech/task/detail/${id}`,
    method: 'POST'
  })
}
//  Restful接口新增修改接口
export function saveRestful(data) {
  return request({
    url: baseUrl + '/api/asset/tech/saveEditRestful',
    method: 'POST',
    data
  })
}
//  Dubbo接口新增修改-接口
export function saveDubbo(data) {
  return request({
    url: baseUrl + '/api/asset/tech/saveUpdateDubbo',
    method: 'POST',
    data
  })
}

//  Restful接口详情
export function restfulDetail(id) {
  return request({
    url: baseUrl + '/api/asset/tech/findRestfulDetail/' + id,
    method: 'POST'
  })
}
//  Dubbo接口新增修改-接口
export function dubboDetail(id) {
  return request({
    url: baseUrl + '/api/asset/tech/findDubboDetail/' + id,
    method: 'POST'
  })
}

//  解析jar包获取Dubbo服务接口信息
export function analysisJarFile(data) {
  return request({
    url: baseUrl + '/api/asset/tech/analysisJarFile',
    method: 'POST',
    data
  })
}

// 判断是dubbo接口还是Restful接
export function judgeInterfaceType(id) {
  return request({
    url: baseUrl + '/api/asset/tech/judeInterfaceType/' + id,
    method: 'POST'
  })
}

// 新增页面
export function addPage(data) {
  return request({
    url: baseUrl + '/api/asset/tech/page/add',
    method: 'POST',
    data
  })
}
// 修改页面
export function editPage(data) {
  return request({
    url: baseUrl + '/api/asset/tech/page/update',
    method: 'POST',
    data
  })
}
// 修改页面
export function pageDetail(id) {
  return request({
    url: baseUrl + '/api/asset/tech/page/detail/' + id,
    method: 'POST'
  })
}

// 获取了对象列表
export function objectList(data) {
  return request({
    url: baseUrl + '/api/asset/object/list',
    method: 'POST',
    data
  })
}

