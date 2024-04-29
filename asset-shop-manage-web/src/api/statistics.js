/**
 * @Description: 运营统计相关接口
 * @Author: zs
 * @Date: 2022-01-21
 */
import request from '@/utils/request'
import { getProxyUrl } from './service-suffix.js'

const baseUrl = getProxyUrl('asset_shop_manage_server')

// 总览
export const queryOverview = (params) => request.get(`${baseUrl}/api/operation/statistics/overview`, { params })
// 应用分析
export const queryAppAnalysis = (params) => request.get(`${baseUrl}/api/operation/statistics/app/analysis`, { params })
// 资源分析
export const queryAssetAnalysis = (params) => request.get(`${baseUrl}/api/operation/statistics/asset/analysis`, { params })
// 场景分析
export const querySceneAnalysis = (params) => request.get(`${baseUrl}/api/operation/statistics/scene/analysis`, { params })
// 下载量排行
export const queryTopAnalysis = (params) => request.get(`${baseUrl}/api/operation/statistics/top/analysis`, { params })
// 上架分析
export const queryPublicAnalysis = (params) => request.get(`${baseUrl}/api/operation/statistics/apply/analysis`, { params })
