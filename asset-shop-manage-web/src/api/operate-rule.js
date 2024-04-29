/**
 * @Description: 运营规则配置
 * @Author:
 * @Date:
 */
import request from '@/utils/request'
import { getProxyUrl } from './service-suffix.js'

const baseUrl = getProxyUrl('asset_shop_manage_server')

// 运营规则配置-列表
export const operationRuleList = (params) => request.get(`${baseUrl}/api/operation/rule/list`, { params })

// 删除
export const deleteOperationRule = (id) => request.post(`${baseUrl}/api/operation/rule/delete/${id}`)
// 停用/启用
export const changeRuleStatus = (id, params) => request.post(`${baseUrl}/api/operation/rule/changeStatus/${id}`, params)
// 生效目标列表
export const operationRuleObjects = (params) => request.get(`${baseUrl}/api/operation/rule/objects`, { params })
// 已上架模板列表
export const shopPublicList = (params) => request.post(`${baseUrl}/api/shop/publish/pack/simple/list`, params)
// 校验 展示内容、规则优先级 是否重复
export const validatorRepeat = params => request.post(`${baseUrl}/api/operation/rule/checkContent`, params)
// 规则详情
export const operationRuleDetail = (id) => request.post(`${baseUrl}/api/operation/rule/detail/${id}`)
// 添加/编辑
export const operationRuleCreate = params => request.post(`${baseUrl}/api/operation/rule/saveOrEdit`, params)
