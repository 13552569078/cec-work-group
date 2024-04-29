/*
 * @Author: dingli
 * @Date: 2022-1-25
 * @Description: 商城相关接口
 */
import request from '@/utils/request'
import serviceSuffix, { getProxyUrl } from './service-suffix.js'
const baseURL = getProxyUrl(serviceSuffix.asset_shop_server)
const assetCenterURL = getProxyUrl(serviceSuffix.asset_center_server)
const ssoURL = getProxyUrl(serviceSuffix.sso_uc)

// 获取公共配置信息
export const configInfo = params => request.get(`${baseURL}/api/sys/config/info`, { params })
// 路由菜单权限接口
export const getUserPermissions = (params) => request.get(ssoURL + '/permission/v1/user/getUserPermissions', { params })
// export const getUserPermissions = () => new Promise(resolve => {
//   const data = require('../../public/static/permission.json')
//   resolve({ data: JSON.stringify(data) })
// })

// 商城-首页列表
export const queryPublishList = params => request.post(`${baseURL}/api/shop/publish/pack/list`, params)
// 商城-首页列表
export const queryPublishListApp = params => request.post(`${baseURL}/api/shop/publish/pack/app/list`, params)
// 申请单详情[v3.15.0A]
export const applyDetail = params => request.get(`${baseURL}/api/shop/apply/detail/${params.applyId}`, params)
// 申请单详情[v3.30.1]
export const applyDetailByAssetinfo = params => request.get(`${baseURL}/api/shop/apply/last/detailByPvId`, { params })
// 接口名称: 注册应用列表[3.21.0A]
export const appRegistList = params => request.post(`${baseURL}/api/shop/pack/app/userRegister/list`, params)
// 修改申请单授权信息
export const authorizeUpdate = data => request.post(`${baseURL}/api/shop/apply/app/authorize/update`, data)
// 详情 资源
export const queryPublishDetail = packVersionId => request.get(`${baseURL}/api/shop/publish/pack/detail/${packVersionId}`)
// 详情 应用
export const queryPublishDetailApp = params => request.get(`${baseURL}/api/shop/publish/pack/app/detail/${params.packVersionId}`, { params })
// 详情 接口
export const queryPublishDetailApi = params => request.get(`${baseURL}/api/shop/publish/pack/api/detail/${params.packVersionId}`, { params })
// 商城-下载、更新
export const downloadPack = params => request.post(`${baseURL}/api/shop/publish/pack/download`, params)
// 标签树 1场景、2标签
export const queryTagTree = params => request.get(`${baseURL}/api/operation/tag/tree`, { params })
// 生效规则列表
export const queryRuleList = params => request.get(`${baseURL}/api/operation/rule/valid/list`, { params })
// 版本历史接口
export const queryVersionLog = params => request.get(`${baseURL}/api/shop/pack/version/log/list`, { params })
// 版本历史状态变更列表
export const queryVersionLogStatus = params => request.get(`${baseURL}/api/shop/pack/version/log/status/list`, { params })
// 上下架管理列表
export const queryPackList = params => request.get(`${baseURL}/api/shop/pack/list`, { params })
// 上下架管理列表 - 应用
export const queryAppPackList = params => request.get(`${baseURL}/api/shop/pack/app/list`, { params })
// 上下架管理-展示版本信息
export const queryVersion = params => request.get(`${baseURL}/api/shop/pack/version/show`, { params })
// 上下架管理-解析资源包
export const parsePack = params => request.post(`${baseURL}/api/shop/pack/parse`, params)
// 上下架管理-新增
export const createPack = params => request.post(`${baseURL}/api/shop/pack/add`, params)
// 上下架管理-编辑
export const updatePack = params => request.post(`${baseURL}/api/shop/pack/update`, params)
// 上下架管理-删除
export const deletePack = params => request.post(`${baseURL}/api/shop/pack/delete`, params)
// 上下架管理-详情
export const queryPackDetail = packVersionId => request.get(`${baseURL}/api/shop/pack/detail/${packVersionId}`)
// 上下架管理-改变状态
export const changeStatus = params => request.post(`${baseURL}/api/shop/pack/changeStatus`, params)
// 申请列表[v3.8.0C]
export const applyUserList = params => request.post(`${baseURL}/api/shop/apply/user/list`, params)
// 审核列表[v3.8.0C]
export const applyAuditList = params => request.post(`${baseURL}/api/shop/apply/audit/list`, params)
// 审核处理[v3.8.0C]
export const applyHandle = params => request.post(`${baseURL}/api/shop/apply/handle`, params)
// 审核历史列表[v3.8.0C]
export const applyLog = params => request.get(`${baseURL}/api/shop/apply/log`, { params })
// 当前用户对资源的审核历史列表[v3.8.0C]
export const applyUserLog = params => request.get(`${baseURL}/api/shop/apply/user/log`, { params })
// 订阅接口资源
export const subscribe = params => request.post(`${baseURL}/api/shop/publish/pack/subscribe/api`, params)
// 数字资源
export const packAppApply = params => request.post(`${baseURL}/api/shop/pack/app/apply`, params)
// 查询申请单授权信息
export const getApplyAuthorizeByApplyId = params => request.get(`${baseURL}/api/shop/apply/authorize`, { params })
// 查询申请资源授权信息
export const getApplyAuthorizeByAppInfo = params => request.get(`${baseURL}/api/shop/apply/app/authorize`, { params })
// 已打包资源列表
export const packedAssetList = params => request.get(`${baseURL}/api/shop/pack/assetCenter/assetList`, { params })
// 关联应用列表
export const relationAppList = params => {
  // 仅部署 门户+运营 屏蔽掉开发中心的接口
  if (window.__systemConfig && +window.__systemConfig.deployType === 2) {
    return new Promise(resolve => resolve({ data: [] }))
  }
  return request.post(`${assetCenterURL}/api/open/app/relation/list`, params)
}
// 获取版本号列表
export const deployVersionList = params => {
  // 仅部署 门户+运营 屏蔽掉开发中心的接口
  if (window.__systemConfig && +window.__systemConfig.deployType === 2) {
    return new Promise(resolve => resolve({ data: [] }))
  }
  return request.post(`${assetCenterURL}/api/open/app/deployVersion/list`, params)
}
// 判断是否打包
export const validateAppPack = params => {
  // 仅部署 门户+运营 屏蔽掉开发中心的接口
  if (window.__systemConfig && +window.__systemConfig.deployType === 2) {
    return new Promise(resolve => resolve({ data: null }))
  }
  return request.post(`${assetCenterURL}/api/open/app/simpleDetail`, params)
}
// 上下架管理-新增-应用
export const createPackApp = params => request.post(`${baseURL}/api/shop/pack/app/add`, params)
// 上下架管理-编辑-应用
export const updatePackApp = params => request.post(`${baseURL}/api/shop/pack/app/update`, params)
// 上下架管理-删除-应用
export const deletePackApp = packVersionId => request.post(`${baseURL}/api/shop/pack/app/delete/${packVersionId}`)
// 上下架管理-改变状态-应用
export const changeStatusApp = params => request.post(`${baseURL}/api/shop/pack/app/changeStatus`, params)
// 上下架管理-详情-应用
export const queryPackDetailApp = params => request.get(`${baseURL}/api/shop/pack/app/detail/${params.packVersionId}`)
// 上下架管理-下架申请-应用
export const unpackApplyApp = params => request.post(`${baseURL}/api/shop/pack/app/unpack/apply`, params)
// 获取租户下所有部门
export const allTenantOrganizations = params => request.get(`${ssoURL}/permission/v2/organizations/selectAllTenantOrg`)
// 获取租户内的联系人，可根据部门id进行筛选
export const userInfoByTenant = params => request.get(`${ssoURL}/permission/v1/employee/selectUserByTenant`, { params })
// 来源应用列表，接口编目使用
export const packAppSimpleList = params => request.get(`${baseURL}/api/shop/pack/app/simple/list`, { params })

// 编目-接口-列表
export const queryApiPackList = params => request.get(`${baseURL}/api/shop/pack/api/list`, { params })
// 中枢未上架接口列表
export const queryApimList = params => request.get(`${baseURL}/api/shop/pack/api/apim/list`, { params })
// 中枢接口详情
export const queryApimInfo = bizCode => request.get(`${baseURL}/api/shop/pack/api/apim/detail/${bizCode}`)
// 接口编目 新增
export const createPackApi = params => request.post(`${baseURL}/api/shop/pack/api/add`, params)
// 接口编目 编辑
export const updatePackApi = params => request.post(`${baseURL}/api/shop/pack/api/update`, params)
// 接口编目 删除
export const deletePackApi = packVersionId => request.post(`${baseURL}/api/shop/pack/api/delete/${packVersionId}`)
// 接口编目 改变状态
export const changeStatusApi = params => request.post(`${baseURL}/api/shop/pack/api/changeStatus`, params)
// 接口编目 详情
export const queryPackDetailApi = params => request.get(`${baseURL}/api/shop/pack/api/detail/${params.packVersionId}`)
// 接口编目 查询 中枢接口最新版本信息
export const checkLastVersion = bizCode => request.get(`${baseURL}/api/shop/pack/api/apim/lastVersion/${bizCode}`)
// 接口编目 更新接口版本接口
export const updatedApiVersion = params => request.post(`${baseURL}/api/shop/pack/api/updateNewestApi`, params)
// 接口编目 新增活跃态接口资源
export const addActive = params => request.post(`${baseURL}/api/shop/pack/api/add/active`, params)
// 接口订阅  申请资源主体列表
export const subcribeAppList = params => request.get(`${baseURL}/api/shop/pack/app/subcribe/list`, { params })
// 我的订阅 列表
export const querySubcribeList = params => request.post(`${baseURL}/api/shop/apply/subcribe/list`, params)
// 我的订阅 升级日志
export const subcribeUpgradeLog = params => request.get(`${baseURL}/api/shop/apply/subcribe/upgrade/log`, { params })

// 编目 列表 公共
export const queryPackListCommon = params => request.get(`${baseURL}/api/shop/pack/common/list`, { params })
// 编目 删除 公共
export const deletePackCommon = packVersionId => request.post(`${baseURL}/api/shop/pack/common/delete/${packVersionId}`)
// 编目 修改状态 公共
export const changeStatusCommon = params => request.post(`${baseURL}/api/shop/pack/common/changeStatus`, params)
// 编目 新增活跃态数据 公共
export const createActiveCommon = params => request.post(`${baseURL}/api/shop/pack/common/add/active`, params)
// 编目 校验编目最新版本校验 公共
export const checkNewestVersionCommon = packVersionId => request.get(`${baseURL}/api/shop/pack/common/check/newestVersion?packVersionId=${packVersionId}`)
// 编目 更新至最新编目信息 公共
export const updateNewestVersionCommon = params => request.post(`${baseURL}/api/shop/pack/common/updateNewestVersion`, params)
// 编目 下架申请 公共
export const unpackApplyCommon = params => request.post(`${baseURL}/api/shop/pack/common/unpack/apply`, params)
// 接口编目 支撑应用 新增
export const createPackSupportApp = params => request.post(`${baseURL}/api/shop/pack/supportApp/add`, params)
// 接口编目 支撑应用 编辑
export const updatePackSupportApp = params => request.post(`${baseURL}/api/shop/pack/supportApp/update`, params)
// 接口编目 支撑应用 详情
export const queryPackDetailSupportApp = params => request.get(`${baseURL}/api/shop/pack/supportApp/detail/${params.packVersionId}`)
// 接口编目 支撑应用 详情 已发布
export const queryPublishDetailSupportApp = params => request.get(`${baseURL}/api/shop/publish/pack/supportApp/detail/${params.packVersionId}`)
// 给他人的评价-已评价 列表
export const appraiseSendList = params => request.post(`${baseURL}/api/shop/appraise/send/list`, params)
// 我收到的评价 列表
export const appraiseReceiveList = params => request.post(`${baseURL}/api/shop/appraise/receive/list`, params)
// 评价
export const appraiseAdd = params => request.post(`${baseURL}/api/shop/appraise/add`, params)
// 资源评价列表
export const assetAppraiseList = params => request.post(`${baseURL}/api/shop/appraise/asset/list`, params)
// 评价详情
export const appraiseDetail = id => request.get(`${baseURL}/api/shop/appraise/detail/${id}`)
// 回复评价
export const appraiseReply = params => request.post(`${baseURL}/api/shop/appraise/reply`, params)
// 购物车 新增
export const queryShopCarAdd = params => request.post(`${baseURL}/api/shop/cart/add`, params)
// 购物车 数量
export const queryShopCarCount = () => request.get(`${baseURL}/api/shop/cart/count`)
// 购物车 列表
export const queryShopCarList = () => request.get(`${baseURL}/api/shop/cart/list`)
// 购物车 清空
export const queryShopCarClear = params => request.post(`${baseURL}/api/shop/cart/clear`, params)
// 购物车 删除
export const delShopCar = id => request.post(`${baseURL}/api/shop/cart/del/${id}`)
// 购物车 下一步校验
export const carCheck = params => request.post(`${baseURL}/api/shop/cart/check`, params)
// 购物车 提交申请单
export const shopCarSubmit = params => request.post(`${baseURL}/api/shop/cart/submit`, params)
