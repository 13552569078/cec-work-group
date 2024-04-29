import { constantRoutes } from '@/router'
import rootStore from '@/store'
import Layout from '@/layout'
import { isExternal } from '@/utils/validate'
import ExternalPage from '@/components/external-page'

const state = {
  dynamicRoutes: [], // 动态菜单, 需要添加到路由的部分
  menuList: [], // 菜单渲染项
  powerMap: new Map()
}
const mutations = {
  RESET_ROUTES(state) {
    state.dynamicRoutes = []
  },
  SET_POWER_ROUTES(state, dynamicRoutes) {
    const res = dynamicRoutes || []
    res.push({ path: '*', redirect: '/', hidden: true }) // 404跳转路由必须放在最后一个
    state.dynamicRoutes = res
  },
  SET_POWERMAP(state, map) {
    state.powerMap = map || new Map()
  },
  SET_MENU_LIST(state, val) {
    state.menuList = val
  }
}

const actions = {
  async getPowerRoutes({ commit }) {
    // 处理用户权限菜单, 接口获取
    try {
      const powerList = rootStore.state.user.powerList
      // 对权限内资源池进行扁平化处理
      const powerMap = flatterToMap(powerList)
      const powerRoutes = analysisPowerToRoutes(powerMap)
      const menuList = analysisPowerToMenus(powerList)

      commit('SET_POWERMAP', powerMap)
      commit('SET_POWER_ROUTES', powerRoutes)
      commit('SET_MENU_LIST', menuList)
    } catch (error) {
      console.warn('getPowerRoutes--error==', error)
    }
  }
}

/**
 * 对权限内资源池进行扁平化处理
 * key 命名规则：appCode + path
 * @param {Array} powerList
 * @returns 所有菜单 Map 对象池
 */
function flatterToMap(powerList) {
  const appCode = rootStore.state.user.appCode
  // 第一级别是应用，有 code 编码，其他子节点没有，所以要记录 code, 通过应用级别拼接当前应用 key, appCode%local%
  const map = new Map()
  function flatter(powerList) {
    for (const power of powerList) {
      if (power.children?.length > 0) {
        flatter(power.children)
      } else {
        // 只对有 appCode 应用进行设置, 资源池只记录菜单权限
        if (power.path && power.type === 'M') {
          let mapKey = ''
          const tempArr = power.path.split('/#/')
          const isZhili = tempArr.length > 1 && tempArr[0].replace('/', '')
          // 分三种情况，1、纯粹外链，通过判断 http?s 协议头；2、判断社会治理内嵌，通过 appCode/#/ 判断；3、其他情况是本地、
          if (isExternal(power.path)) {
            // TODO: 如果不同应用使用相同的 path, 需要在此添加逻辑，避免资源池资源丢失
            mapKey = power.path
          } else if (isZhili) {
            mapKey = power.path
          } else {
            mapKey = `${appCode}%local%${power.path}`
          }
          map.set(mapKey, power)
        }
      }
    }
  }
  flatter(powerList)
  return map
}

/**
 * 解析权限列表为动态路由
 * @param {Array} powerMap
 * @returns 动态生成的路由表
 */
function analysisPowerToRoutes(powerMap) {
  const appCode = rootStore.state.user.appCode
  const externalRoutes = [] // 嵌入该工程内部的路由信息

  // 本地静态路由表全量添加，补充需要内嵌到该平台下的第三方页面路由信息
  function recursion(dynamicRoutes, fatherNode) {
    for (const route of dynamicRoutes) {
      route.fullPath = ((fatherNode.path || '') + '/' + route.path).replace('//', '/')
      // 匹配远程路由信息，把远程的名称和 icon 覆盖本地
      const originMatchKey = `${appCode}/#/${route.fullPath}`
      const localMatchKey = `${appCode}%local%${route.fullPath}`
      if (powerMap.has(originMatchKey) || powerMap.has(localMatchKey)) {
        // 把服务器的icon， meta 信息覆盖本地originMatchKey
        const originRoute = powerMap.get(originMatchKey) || powerMap.get(localMatchKey)
        // console.log('originRoute----', originRoute);
        route.meta.title = originRoute.name
        route.meta.icon = originRoute.icon
      }
      if (route?.children?.length > 0) {
        recursion(route.children, route)
      }
    }
  }
  recursion(constantRoutes, {})
  // 搜集外链 及社会治理内嵌路由
  for (const mapKey of powerMap.keys()) {
    // if (isExternal(mapKey)) continue
    const tempArr = mapKey.split('/#/')
    const isZhili = tempArr.length > 1 && tempArr[0].replace('/', '')
    if (isZhili || isExternal(mapKey)) {
      const route = powerMap.get(mapKey)
      externalRoutes.push({
        path: `/external-page${route.id}`,
        component: Layout,
        meta: { title: route.name, icon: route.icon },
        children: [{
          path: '',
          component: ExternalPage,
          meta: {
            title: route.name,
            icon: route.icon,
            externalPath: isExternal(mapKey) ? route.path : (window.location.origin + route.path)
          }
        }]
      })
    }
  }
  console.log('externalRoutes==', externalRoutes)
  // 路由合并
  return [].concat(constantRoutes, externalRoutes)
}

/**
 * 解析权限列表为菜单渲染项
 * @param {Array} powerList
 * @returns 动态生成的菜单
 */
function analysisPowerToMenus(powerList) {
  const routes = powerList.map((power, index) => {
    // 添加默认 icon
    if (!power.icon) {
      power.icon = 'menu-svg-quanjing'
    }
    if (!power.children || !power.children.length) {
      const external = isExternal(power.path)
      if (external) {
        // 新标签打开
        return {
          path: power.isFrame === 0 ? `/external-page${power.id}` : power.path,
          meta: {
            title: power.name,
            icon: power.icon,
            externalPath: power.path
          }
        }
      } else {
        const tempArr = power.path.split('/#/')
        const isZhili = tempArr.length > 1 && tempArr[0].replace('/', '')
        const path = power.path || `/external${index}.${power.type}.${power.id}`
        const menuObj = {
          path,
          meta: {
            title: power.name,
            icon: power.icon,
            externalPath: path
          }
        }
        if (isZhili && power.type === 'M') {
          menuObj.path = `/external-page${power.id}`
          menuObj.meta.externalPath = window.location.origin + power.path
        }
        return menuObj
      }
    } else {
      return {
        path: power.path || `/external${index}.D.${power.id}`,
        name: power.name,
        meta: { title: power.name, icon: power.icon },
        alwaysShow: true,
        children: analysisPowerToMenus(power.children)
      }
    }
  })
  return routes
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
