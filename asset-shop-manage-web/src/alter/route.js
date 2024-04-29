
// import powerData from './demo-data/demo-power-data' // 动态路由的模拟数据
import { configInfo, getUserPermissions } from '@/api/index' // 动态路由的获取接口

// 预制的系统路由
import { getRouteList } from '@/router/system'
import { redirectTo404Route } from '@/router'

// 请求动态路由数据
export async function getPowerList() {
  try {
    const sysConfigInfo = await configInfo()
    let powerList = []
    let routes = getRouteList()
    // 4中模式情况下，只有默认情况才读取路由权限
    if (sysConfigInfo.data.sysType === 1) {
      powerList = await getUserPermissions()
      powerList = powerList.data ? JSON.parse(powerList.data) : []
      let menuItems = []
      powerList.filter(d => {
        if (d.resourceType === 'menuHead' && d.menuItems) {
          menuItems = d.menuItems
          return true
        }
        return false
      })
      routes = analysisPowerToRoutes(menuItems, redirectTo404Route)
    }
    return routes
  } catch (e) {
    throw Error(e)
  }
}

/**
 * 解析权限列表为动态路由
 * @param {Array} powerList
 * @param {Object} redirectTo404Route
 * @returns 动态生成的路由表
 */
function analysisPowerToRoutes(powerList, redirectTo404Route) {
  const sysRouters = getRouteList()
  let routes = []
  // 对比配置的动态路由表，对预制的系统路由表进行删减，配置覆盖
  routes = makeSysRoutes(sysRouters, powerList)
  routes.push(redirectTo404Route)
  return routes
}

function makeSysRoutes(arr, arr_2) {
  const _arr = []
  if (!Array.isArray(arr) || !Array.isArray(arr_2)) {
    return _arr
  }
  arr.map(item => {
    const arr_item = arr_2.find(d => d.menuId === item.navCode)
    if (arr_item) {
      item.meta.title = arr_item.navName || item.meta.title || ''
      item.meta.icon = arr_item.icon || item.meta.icon || ''

      if (Array.isArray(item.children)) {
        if (Array.isArray(arr_item.subMenus) && arr_item.subMenus.length) {
          item.children = makeSysRoutes(item.children, arr_item.subMenus)
        }
        if (item.children[0] && item.redirect) {
          item.redirect = `${item.path}/${item.children[0].path}`
        }
      }
      _arr.push(item)
    } else if (item.path === '') {
      _arr.push(item)
    }
  })
  return _arr
}

