/*
 * @Author: liu geng
 * @Date: 2020-08-20 14:08:37
 * @Description:指标配置管理
 */
import request from '@/utils/request'
import {
  getToken
} from '@/utils/auth'
import serviceSuffix, { getProxyUrl } from '@/api/service-suffix.js'
const dsmServer = getProxyUrl(serviceSuffix.dsm_server)
const asset_center_server = getProxyUrl(serviceSuffix.asset_center_server)
const asset_shop_server = getProxyUrl(serviceSuffix.asset_shop)
const api_indicator_platform_serve = getProxyUrl(serviceSuffix.api_indicator_platform_serve)
const fx_gateway = getProxyUrl(serviceSuffix.fx_gateway)

// 解析资源包信息（V3.6.0_A）
export const packParse = asset_center_server + '/api/asset/pack/parse'
export const packParseApp = asset_center_server + '/api/app/pack/parse'

export const login_url = `${fx_gateway}/login/oauth2/authorization?registrationId=asset-center&loginSuccessUrl=`

// 接口名称:  注册应用列表[3.15.0A]
export function registList(data) {
  // 仅部署 开发中心 屏蔽掉商城的接口
  if (window.__systemConfig && +window.__systemConfig.deployType === 1) {
    return new Promise(resolve => resolve({ data: [] }))
  }
  return request({
    url: asset_shop_server + '/api/shop/pack/app/register/list',
    method: 'POST',
    data
  })
}
// 接口名称:  注册应用列表[3.15.0A]
export function appGroupDetail(appCode) {
  return request({
    url: asset_center_server + `/api/app/group/detail/${appCode}`,
    method: 'POST'
  })
}
// 接口名称: 应用资源回流(v3.17_A)
export function backFlow(data) {
  return request({
    url: asset_center_server + '/api/app/asset/backFlow',
    method: 'POST',
    data
  })
}
// 通过id获取apilist
export function getApiList(data) {
  return request({
    url: asset_center_server + '/api/asset/sub/supportApp/apiList',
    method: 'POST',
    data
  })
}

// 导入包
export function packImport(data) {
  var bodyFormData = new FormData();
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      const element = data[key];
      bodyFormData.append(key, element)
    }
  }
  return request({
    url: asset_center_server + '/api/asset/pack/import',
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: bodyFormData
  })
}
// 接口名称: 资源被引用关系（v3.10_A）
export function assetReferenced(data) {
  return request({
    url: asset_center_server + '/api/asset/referenced',
    method: 'POST',
    data
  }).then(res => {
    res.data.list.forEach(item => {
      item.assetDesc = item.desc
      for (const key in item) {
        if (Object.hasOwnProperty.call(item, key)) {
          if (!item[key]) {
            console.log(!!item[key], key, 'item')
            item[key] = '--'
          }
        }
      }
    })
    return res
  })
}
// 接口名称: 资源被引用关系（v3.10_A）
export function upgradeLog(shopCode) {
  // 仅部署 开发中心 屏蔽掉商城的接口
  if (window.__systemConfig && +window.__systemConfig.deployType === 1) {
    return new Promise(resolve => resolve({ data: [] }))
  }
  return request({
    url: asset_shop_server + '/api/shop/apply/subcribe/upgrade/log',
    method: 'GET',
    params: { shopCode }
  })
}
// 接口名称: 支撑应用api升级日志[V3.17.0A]
export function apiUpgradeLog(data) {
  // 仅部署 开发中心 屏蔽掉商城的接口
  if (window.__systemConfig && +window.__systemConfig.deployType === 1) {
    return new Promise(resolve => resolve({ data: [] }))
  }
  return request({
    url: asset_shop_server + '/api/shop/apply/subcribe/api/upgrade/log',
    method: 'GET',
    params: data
  })
}
// 接口名称: 资源被引用关系（v3.10_A）
export function packAppDetail(packVersionId) {
  // 仅部署 开发中心 屏蔽掉商城的接口
  if (window.__systemConfig && +window.__systemConfig.deployType === 1) {
    return new Promise(resolve => resolve({ data: null }))
  }
  return request({
    url: asset_shop_server + `/api/shop/publish/pack/app/detail/${packVersionId}`,
    method: 'GET'
  })
}
// 接口名称: 批量新增监测布控资源
export function monitorControlBatchAdd(data) {
  return request({
    url: asset_center_server + '/api/asset/monitor/control/batchAdd',
    method: 'POST',
    data
  })
}
// 接口名称: 移除资源
export function monitorRemove(id) {
  return request({
    url: asset_center_server + `/api/asset/monitor/remove/${id}`,
    method: 'POST'
  })
}
// 接口名称: 监测资源分页列表
export function monitorListPage(data) {
  return request({
    url: asset_center_server + '/api/asset/monitor/list/page',
    method: 'POST',
    data
  })
}
// 接口名称: 应用关系图谱（v3.13_A）
export function appRelationGraph(data) {
  return request({
    url: asset_center_server + '/api/app/relationGraph',
    method: 'POST',
    data
  })
}
// 接口名称: 查询关联资产列表
export function monitorListRefer(data) {
  return request({
    url: asset_center_server + '/api/asset/monitor/listRefer',
    method: 'GET',
    data
  })
}
// 接口名称: 查询接口详情[3.17.0U]
export function queryApimInfo(data) {
  // 仅部署 开发中心 屏蔽掉商城的接口
  if (window.__systemConfig && +window.__systemConfig.deployType === 1) {
    return new Promise(resolve => resolve({ data: null }))
  }
  return request({
    url: asset_shop_server + '/api/shop/pack/supportApp/apim/detail',
    method: 'GET',
    params: data
  })
}
// 接口名称: 查询接口详情[3.17.0U]
export function appReleaseCheck(id) {
  return request({
    url: asset_center_server + `/api/app/releaseCheck/${id}`,
    method: 'GET'

  })
}
// 更新设计中
// 接口名称: 我的订阅资源被引用关系（v3.10_A）
export function assetMysubReferenced(data) {
  return request({
    url: asset_center_server + '/api/asset/mysub/referenced',
    method: 'POST',
    data
  })
}
// 接口名称: 查询是否有失效资源
export function checkInvalidAsset(data) {
  return request({
    url: asset_center_server + '/api/common/checkInvalidAsset',
    method: 'POST',
    data
  })
}
// 更新设计中
export function processStatusUpdate(data) {
  return request({
    url: asset_center_server + '/api/asset/process/status/update',
    method: 'POST',
    data
  })
}
// 接口名称: 基于业务编码查询资源[v3.9.1C]
export function getByBizCode(data) {
  return request({
    url: asset_shop_server + '/api/shop/pack/getByBizCode',
    method: 'GET',
    params: data
  })
}
// 接口名称: 查询稳定态资源基本信息[3.17.0C]
export function getByBasicInfo(data) {
  // 仅部署 开发中心 屏蔽掉商城的接口
  if (window.__systemConfig && +window.__systemConfig.deployType === 1) {
    return new Promise(resolve => resolve({ data: null }))
  }
  return request({
    url: asset_shop_server + '/api/shop/pack/common/basicInfo',
    method: 'GET',
    params: data
  })
}
// 接口名称: 查询稳定态资源基本信息[3.17.0C]
export function appUpdate(data) {
  return request({
    url: asset_center_server + '/api/app/update',
    method: 'POST',
    data
  })
}
// 定时任务状态修改
export function taskStatusUpdate(data) {
  return request({
    url: asset_center_server + '/api/asset/tech/task/status/update',
    method: 'POST',
    data
  })
}
// 接口名称: 解析资源包主资源引用资源信息（V3.5.0_A）
export function unpackMainReferAsset(data) {
  return request({
    url: asset_center_server + '/api/asset/unpackMainReferAsset',
    method: 'POST',
    data
  })
}
// 接口名称: 资源打包下载(v3.8.0_A)
export function assetPack(data) {
  return request({
    url: asset_center_server + '/api/asset/pack',
    method: 'POST',
    data
  })
}
// 接口名称: 已下载资源列表
export function downloadList(data) {
  // 仅部署 开发中心 屏蔽掉商城的接口
  if (window.__systemConfig && +window.__systemConfig.deployType === 1) {
    return new Promise(resolve => resolve({ data: null }))
  }
  return request({
    url: asset_shop_server + '/api/shop/publish/pack/download/list',
    method: 'POST',
    data
  })
}
// 接口名称: 已下载资源列表
export function subcribeList(data) {
  // 仅部署 开发中心 屏蔽掉商城的接口
  if (window.__systemConfig && +window.__systemConfig.deployType === 1) {
    return new Promise(resolve => resolve({ data: null }))
  }
  return request({
    url: asset_shop_server + '/api/shop/apply/subcribe/list',
    method: 'POST',
    data
  })
}
// 复制资源（V3.5.0_A）
export function assetBase(id) {
  return request({
    url: asset_center_server + `/api/asset/base/${id}`,
    method: 'GET'
  })
}
// 复制资源（V3.5.0_A）
export function applyDetail(applyId) {
  // 仅部署 开发中心 屏蔽掉商城的接口
  if (window.__systemConfig && +window.__systemConfig.deployType === 1) {
    return new Promise(resolve => resolve({ data: null }))
  }
  return request({
    url: asset_shop_server + `/api/shop/apply/detail/${applyId}`,
    method: 'GET'
  })
}
// 复制资源（V3.5.0_A）
export function assetCopy(data) {
  return request({
    url: asset_center_server + '/api/asset/copy',
    method: 'POST',
    data
  })
}
// 复制资源 公共资源
export function commonAssetCopy(data) {
  return request({
    url: asset_center_server + '/api/asset/public/copy',
    method: 'POST',
    data
  })
}
// 导入下载资源（V3.5.0_A）
export function assetImport(data) {
  return request({
    url: asset_center_server + '/api/asset/import',
    method: 'POST',
    data
  })
}
// 存储名称唯一性校验（V3.2.0_A）
export function configInfo(data) {
  return request({
    url: asset_center_server + '/api/config/info',
    method: 'POST',
    data
  })
}
// 存储名称唯一性校验（V3.2.0_A）
export function apiAssetDataCheckStoreName(data) {
  return request({
    url: asset_center_server + '/api/asset/data/checkStoreName',
    method: 'POST',
    data
  })
}
// 基于编码查询指标详情[v3.3.0C]
export function detailByCode(params) {
  return request({
    url: api_indicator_platform_serve + '/api/kpi/detailByCode',
    method: 'GET',
    params
  })
}
//  应用设置访问地址（V3.2.0_A）
export function apiAppSetAccessUrl(data) {
  return request({
    url: asset_center_server + '/api/app/setAccessUrl',
    method: 'POST',
    data
  })
}
// 引用资源分页列表（V3.1.0）
export function apiAssetListPage(data) {
  return request({
    url: asset_center_server + '/api/asset/process/asset/list/page',
    method: 'POST',
    data
  })
}
// 分页查询应用聚合列表(v3.18_A)
export function appGroupList(data) {
  return request({
    url: asset_center_server + '/api/app/group/list/page',
    method: 'POST',
    data
  })
}
// 标签树
export function tagTree(data) {
  return request({
    url: asset_center_server + '/api/tag/list',
    method: 'GET',
    data
  })
}
// 资源展示-按资源归属-组织架构树
export function deptTree(data) {
  return request({
    url: asset_center_server + '/show/deptTree',
    method: 'GET',
    data
  })
}
// 资源展示-资源关系图
export function assetRelation(data) {
  return request({
    url: asset_center_server + '/show/relation',
    method: 'POST',
    data
  })
}
// 资源展示
export function assetShowList(data) {
  return request({
    url: asset_center_server + '/show/list',
    method: 'POST',
    data
  })
}
// 数据资源列表（分页）
export function statsListPage(data) {
  return request({
    url: asset_center_server + '/api/asset/stats/list/page',
    method: 'POST',
    data
  })
}
// 数据资源删除
export function statsDelete(id) {
  return request({
    url: asset_center_server + `/api/asset/stats/delete/${id}`,
    method: 'POST'
  })
}
// 指标详情
export function kpiDetail(id) {
  return request({
    url: asset_center_server + `/api/asset/stats/kpi/detail/${id}`,
    method: 'POST'
  })
}
// 技术资源删除
export function techDelete(id) {
  return request({
    url: asset_center_server + `/api/asset/tech/delete/${id}`,
    method: 'POST'
  })
}
// 技术资源列表（分页）
export function techListPage(data) {
  return request({
    url: asset_center_server + '/api/asset/tech/list/page',
    method: 'POST',
    data
  })
}
// 技术资源列表（分页）
export function modeListPage(data) {
  return request({
    url: asset_center_server + '/api/asset/tech/list/modelAlgo/page',
    method: 'POST',
    data
  })
}
// 添加-接口（V3.0.0））
export function techInterfaceAdd(data) {
  return request({
    url: asset_center_server + '/api/asset/tech/interface/add',
    method: 'POST',
    data
  })
}
// 修改-接口（V3.8.0））
export function techInterfaceUpdate(data) {
  return request({
    url: asset_center_server + '/api/asset/tech/interface/update',
    method: 'POST',
    data
  })
}
// 详情-接口（V3.0.0）
export function techInterfaceDetail(id) {
  return request({
    url: asset_center_server + `/api/asset/tech/interface/detail/${id}`,
    method: 'POST'
  })
}
// 脚本-详情(V3.16_A)
export function techScriptDetail(id) {
  return request({
    url: asset_center_server + `/api/asset/tech/script/detail/${id}`,
    method: 'POST'
  })
}
// 脚本-详情(V3.16_A)
export function techScriptAdd(data) {
  return request({
    url: asset_center_server + '/api/asset/tech/script/add',
    method: 'POST',
    data
  })
}
// 脚本-详情(V3.16_A)
export function techScriptUpdate(data) {
  return request({
    url: asset_center_server + '/api/asset/tech/script/update',
    method: 'POST',
    data
  })
}

// 获取树(场景)
export function getTree(data) {
  return request({
    url: asset_center_server + '/api/scene/tree',
    method: 'POST',
    params: { groupType: 1 }
  })
}
// 更新树
export function updateTree(data) {
  return request({
    url: asset_center_server + '/api/scene/update',
    method: 'POST',
    data
  })
}
// 添加树
export function addTree(data) {
  return request({
    url: asset_center_server + '/api/scene/add',
    method: 'POST',
    data
  })
}

// 删除树
export function delTree(data, id) {
  return request({
    url: asset_center_server + `/api/scene/delete/${id}`,
    method: 'POST',
    data
  })
}

// 流程资源列表
export function getProcessList(data) {
  return request({
    url: asset_center_server + '/api/asset/process/list/page',
    method: 'POST',
    data
  })
}
// 接口名称: 场景树切换（v3.10_A）
export function assetChangeScene(data) {
  return request({
    url: asset_center_server + '/api/asset/changeScene',
    method: 'POST',
    data
  })
}
// 编辑流程资源
export function processUpdate(data) {
  return request({
    url: asset_center_server + '/api/asset/process/update',
    method: 'POST',
    data
  })
}
// 添加流程资源
export function processAdd(data) {
  return request({
    url: asset_center_server + '/api/asset/process/add',
    method: 'POST',
    data
  })
}

// 删除流程资源
export function processDelete(id) {
  return request({
    url: asset_center_server + `/api/asset/process/delete/${id}`,
    method: 'POST'
  })
}
// 删除私有资源
export function assetDelete(id) {
  return request({
    url: asset_center_server + `/api/asset/delete/${id}`,
    method: 'POST'
  })
}

// 流程资源详情
export const getDetail = id => request.post(`${asset_center_server}/api/asset/process/detail/${id}`)

// 获取数据模型分组
export function getModelGroup(data) {
  return request({
    url: dsmServer + '/dm/group/list',
    method: 'POST',
    data,
    headers: {
      'token': getToken()
    }
  })
}
// 获取数据模型列表
export function getModelList(data) {
  return request({
    url: dsmServer + '/dm/list',
    method: 'POST',
    data,
    headers: {
      'token': getToken()
    }
  })
}
// 获取数据模型详情
export function getModelDetail(data) {
  return request({
    url: dsmServer + '/dm',
    method: 'POST',
    data,
    headers: {
      'token': getToken()
    }
  })
}

/**
 * 复选框拉取详情接口
 */
export function getCheckboxData(apiData, data) {
  return request({
    url: asset_center_server + apiData.name,
    method: apiData.method ? apiData.method : 'POST',
    data
  })
}

// 对象资源列表（分页）
export function statsObjectList(data) {
  return request({
    url: asset_center_server + '/api/asset/object/list/page',
    method: 'POST',
    data
  })
}

// 对象资源新增
export function statsObjectNow(data) {
  return request({
    url: asset_center_server + '/api/asset/object/add',
    method: 'POST',
    data
  })
}

// 对象资源修改
export function statsObjectModification(data) {
  return request({
    url: asset_center_server + '/api/asset/object/update',
    method: 'POST',
    data
  })
}

// 对象资源删除
export function statsObjectDelete(id) {
  return request({
    url: asset_center_server + '/api/asset/object/delete/' + id,
    method: 'GET'
  })
}

// 对象资源详情
export function statsObjectDetails(id) {
  return request({
    url: asset_center_server + '/api/asset/object/detail/' + id,
    method: 'GET'
  })
}

// 数据-列表接口
export function dataAssetListApi(data) {
  return request({
    url: asset_center_server + '/api/asset/data/list/page',
    method: 'POST',
    data
  })
}
// 数据-删除
export function dataAssetDelApi(id) {
  return request({
    url: asset_center_server + `/api/asset/data/delete/${id}`,
    method: 'GET'
  })
}

// 数据-新增接口
export function dataAssetAddApi(data = {}) {
  return request({
    url: asset_center_server + '/api/asset/data/add',
    method: 'POST',
    data
  })
}

// 数据-更新接口
export function dataAssetUpdateApi(data = {}) {
  return request({
    url: asset_center_server + '/api/asset/data/update',
    method: 'POST',
    data
  })
}

// 数据-详情接口
export function dataAssetViewApi(id) {
  return request({
    url: asset_center_server + `/api/asset/data/detail/${id}`,
    method: 'GET'
  })
}
// 对象资源列表-不分页-可搜索-参数 assetName
export function obAsssetListApi(data) {
  return request({
    url: asset_center_server + '/api/asset/object/list',
    method: 'POST',
    data
  })
}
// 资源分类总计
export function dataAssetClassification(id) {
  return request({
    url: asset_center_server + `/api/asset/overview/classifyCount/${id}`,
    method: 'GET'
  })
}
// 资源月增值趋势分析
export function dataAssetIncress(id) {
  return request({
    url: asset_center_server + `/api/asset/overview/increMonth/${id}`,
    method: 'GET'
  })
}
// 高频标签分析
export function dataAssetTagsRank(id) {
  return request({
    url: asset_center_server + `/api/asset/overview/tagsRank/${id}`,
    method: 'GET'
  })
}
// 资源热门分类TOP10
export function dataAssetAssetsRank(id) {
  return request({
    url: asset_center_server + `/api/asset/overview/assetsRank/${id}`,
    method: 'GET'
  })
}
// 应用详情
export function appDetail(id) {
  return request({
    url: asset_center_server + `/api/app/detail/${id}`,
    method: 'POST'
  })
}
// 删除分组
export function groupDelete(id) {
  return request({
    url: asset_center_server + `/api/app/group/delete/${id}`,
    method: 'POST'
  })
}
// 新增分组
export function groupAdd(data) {
  return request({
    url: asset_center_server + '/api/app/group/add',
    method: 'POST',
    data
  })
}
// 编辑分组
export function groupUpdate(data) {
  return request({
    url: asset_center_server + '/api/app/group/update',
    method: 'POST',
    data
  })
}
// 移除资源
export function groupAssetRemove(data) {
  return request({
    url: asset_center_server + '/api/app/asset/remove',
    method: 'POST',
    data
  })
}
// 选择资源列表
export function assetListPage(data) {
  return request({
    url: asset_center_server + '/api/app/asset/list/page',
    method: 'POST',
    data
  })
}
// 选择资源保存
export function assetSave(data) {
  return request({
    url: asset_center_server + '/api/app/asset/save',
    method: 'POST',
    data
  })
}

// 引用列表
export function appListPage(data) {
  return request({
    url: asset_center_server + '/api/app/list/page',
    method: 'POST',
    data
  })
}
// 删除应用
export function delAppItem(id) {
  return request({
    url: asset_center_server + `/api/app/delete/${id}`,
    method: 'POST'
  })
}
// 发布应用
export function changePostStatusApp(data) {
  return request({
    url: asset_center_server + '/api/app/release',
    method: 'POST',
    data
  })
}
// 应用部署
export function appDeploy(data) {
  return request({
    url: asset_center_server + '/api/app/deploy',
    method: 'POST',
    data
  })
}
// 应用取消部署
export function appUndeploy(data) {
  return request({
    url: asset_center_server + '/api/app/undeploy',
    method: 'POST',
    data
  })
}
// 新建应用
export function addAppItem(data) {
  return request({
    url: asset_center_server + '/api/app/add',
    method: 'POST',
    data
  })
}
// 复制应用
export function copyAppItem(data) {
  return request({
    url: asset_center_server + '/api/app/copy',
    method: 'POST',
    data
  })
}
// 导入应用
export function importAppItem(data) {
  var bodyFormData = new FormData();
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      const element = data[key];
      bodyFormData.append(key, element)
    }
  }
  return request({
    url: asset_center_server + '/api/app/pack/import',
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: bodyFormData
  })
}
// 应用打包
export function packAppItem(data) {
  return request({
    url: asset_center_server + '/api/app/pack',
    method: 'POST',
    data
  })
}
// 应用名称唯一校验
export function checkAppName(appName) {
  return request({
    url: asset_center_server + '/api/app/checkName',
    method: 'POST',
    data: { appName: appName }
  })
}
// 应用编码唯一校验
export function checkAppCode(appCode) {
  return request({
    url: asset_center_server + '/api/app/checkCode',
    method: 'POST',
    data: { appCode: appCode }
  })
}
// 资源目录 资源列表
export function assetDirectoryListPage(data) {
  return request({
    url: asset_center_server + '/api/asset/directory/list/page',
    method: 'POST',
    data
  })
}
export const assetCodeExist = assetCode => request.post(asset_center_server + '/api/asset/codeExist', { assetCode })
export const assetNameExist = assetName => request.post(asset_center_server + '/api/asset/nameExist', { assetName })

// 资源发布
export function assetPost(data) {
  return request({
    url: asset_center_server + '/api/asset/release',
    method: 'POST',
    data
  })
}
// 获取部署记录列表
export const assetDeployList = params => request.get(asset_center_server + '/api/app/deploy/page', { params })
// 部署环境列表
export const deployEnvList = params => request.get(asset_center_server + '/api/deploy/env/list', { params })

export const assetDeploy = params => request.post(asset_center_server + '/api/app/deploy', params)
// 解析下载应用包
export const unpackMainReferApp = params => request.post(asset_center_server + '/api/app/pack/parseByUrl', params)
// 解析下载应用包
export const importAppByDownload = params => request.post(asset_center_server + '/api/app/pack/importByDownload', params)

export const checkNav = params => request.post(asset_center_server + '/api/app/checkNav', params)

export const appAuthorizeByCode = params => {
  // 仅部署 开发中心 屏蔽掉商城的接口
  if (window.__systemConfig && +window.__systemConfig.deployType === 1) {
    return new Promise(resolve => resolve({ data: null }))
  }
  return request.get(asset_shop_server + '/api/shop/apply/app/authorize', { params })
}

// 校验应用是否存在未授权接口
export const checkUnAuthAsset = params => request.post(asset_center_server + '/api/app/checkUnAuthAsset', params)
// 应用订阅资源列表
export const subAssetList = params => request.post(asset_center_server + '/api/app/subAsset/list/page', params)

// 应用引用资产列表
export const appReferAsset = params => request.get(asset_center_server + '/api/app/referAsset/list/page', { params })
export const openAssetList = params => request.post(`${asset_center_server}/api/open/asset/list/page`, params)
export const groupReleaseLog = appCode => request.get(`${asset_center_server}/api/app/group/releaseLog/${appCode}`)

export const openAppList = params => request.post(`${asset_center_server}/api/app/list/page`, params)
export const appsAuthorizeInfo = params => {
  // 仅部署 开发中心 屏蔽掉商城的接口
  if (window.__systemConfig && +window.__systemConfig.deployType === 1) {
    return new Promise(resolve => resolve({ data: null }))
  }
  return request.get(`${asset_shop_server}/api/shop/apply/apps/authorizeInfo`, { params })
}
// 概览-应用总览
export const overviewApp = params => request.get(asset_center_server + '/api/asset/statistic/app/overview', { params })
// 概览-组件总览
export const overviewAsset = params => request.get(asset_center_server + '/api/asset/statistic/asset/overview', { params })

export const modeList = params => request.post(`${asset_center_server}/api/asset/model/list/page`, params)

export const modeAdd = params => request.post(asset_center_server + '/api/asset/model/add', params)
export const modeDelete = id => request.post(asset_center_server + `/api/asset/model/delete/${id}`)

export const modeUpdate = params => request.post(asset_center_server + '/api/asset/model/update', params)

export const modeDetail = id => request.get(asset_center_server + `/api/asset/model/detail/${id}`)
export const newestVersion = params => request.get(asset_center_server + '/api/asset/newest/version', { params })

// 公共资源库列表
export const commonAssetList = params => request.post(asset_center_server + '/api/asset/public/list/page', params)
// 共享
export const assetShare = params => request.post(asset_center_server + '/api/asset/share', params)

// 应用部署信息对比
export const appDeployCompare = params => request.post(asset_center_server + '/api/app/deploy/compare', params)
// 对象字段映射表(V3.20.3A)
export const appDeployModelColumns = params => request.post(asset_center_server + '/api/app/deploy/model/columns', params)
