
import { getUserPermissions } from '@/api/user' // 动态路由的获取接口
import { redirectTo404Route } from '@/router'

// 预制的系统路由
import sysRouters from '@/router/system'

// 请求动态路由数据
export async function getPowerList() {
  try {
    let powerList = await getUserPermissions()
    powerList = powerList.data ? JSON.parse(powerList.data) : []
    let menuItems = []
    powerList.filter(d => {
      if (d.resourceType === 'menuHead' && d.menuItems) {
        menuItems = d.menuItems
        return true
      }
      return false
    })
    const routes = analysisPowerToRoutes(menuItems, redirectTo404Route)
    formatUserPermissions(powerList)
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
    const arr_item = arr_2.find(i => i.menuId === item.navCode)
    if (arr_item) {
      item.meta.title = arr_item.navName || item.meta.title || ''
      item.meta.icon = arr_item.icon || item.meta.icon || ''

      if (Array.isArray(item.children)) {
        if (Array.isArray(arr_item.subMenus) && arr_item.subMenus.length) {
          item.children = makeSysRoutes(item.children, arr_item.subMenus)
        }
      }
      _arr.push(item)
    } else if (!item.navCode) {
      _arr.push(item)
    }
  })
  return _arr
}

/** 保存权限信息 */
function formatUserPermissions(arr) {
  const map = {}
  const flat = (arr) => {
    arr.forEach(d => {
      map[d.menuId] = d
      if (d.subMenus) {
        flat(d.subMenus)
      }
    })
  }
  arr.forEach(d => {
    if (d.resourceId === 'userGroup') {
      map.userGroup = d
    } else if (d.menuItems) {
      flat(d.menuItems)
    }
  })
  Object.keys(map).map(key => {
    const item = map[key]
    if (item.permissions && item.permissions.length) {
      // user_edit顺序不一定在edit之后
      const permissionsObj = {}
      item.permissions.forEach(_item => {
        if (_item.indexOf('user_') !== -1) {
          const k = _item.replaceAll('user_', '')
          permissionsObj[k] = permissionsObj[k] ? permissionsObj[k] : {
            key: k,
            user: true
          }
        } else {
          permissionsObj[_item] = {
            key: _item,
            user: false
          }
        }
      })
      console.log(Object.values(permissionsObj), key, 'Object.values(permissionsObj)')
      item.permissions = Object.values(permissionsObj)
    }
  })
  window.userPermissions = map
}

