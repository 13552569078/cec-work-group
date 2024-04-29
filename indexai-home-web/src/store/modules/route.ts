import { defineStore } from 'pinia'
import { store } from '/@/store'
import constantRoutes from '/@/router/modules/routers'
import { RouteRecordRaw } from 'vue-router'
import Layout from '/@/layout/index.vue'
import ExternalPage from '/@/views/external-page/index.vue'
import Demo from '/@/views/demo/index.vue'
import Dashboard from '/@/views/dashboard/index.vue'
import { useUserStoreWithOut } from '/@/store/modules/user'
import { isExternal } from '/@/utils/validate'
import { notFound } from '/@/router/modules/error'
const userStore = useUserStoreWithOut()

interface RouterState {
  routes: Array<RouteRecordRaw>
  routesLoaded: boolean
}

export const useRouteStore = defineStore('route', {
  state: (): RouterState => {
    return {
      routes: constantRoutes,
      routesLoaded: false
    }
  },
  getters: {
    getRoutes: (state: RouterState) => state.routes,
    getRoutesLoaded: (state: RouterState) => state.routesLoaded
  },
  actions: {
    async getPowerRoutes() {
      const powerList = userStore.getMenudatas
      const powerRoutes = defaultSettings.menuDataFromInterface
        ? analysisPowerToRoutes(powerList)
        : mockRoutes(powerList)
      if (powerRoutes.length > 0) powerRoutes[0].defaultOpen = true // 默认打开第一个
      powerRoutes.push(notFound) // 必须放在最后一个
      this.routes = powerRoutes
      const menuList = defaultSettings.menuDataFromInterface
        ? analysisPowerToMenus(powerList)
        : powerList
      this.routesLoaded = true
      userStore.setMenu(menuList)
      console.log('menudatas', powerRoutes)
      return powerRoutes
    }
  }
})
// Need to be used outside the setup
export function useRouteStoreWithOut() {
  return useRouteStore(store)
}
/**
 * 解析权限列表为动态路由
 * @param {Array} powerList
 * @returns 动态生成的路由表
 */
function analysisPowerToRoutes(powerList: any) {
  const res = [] as any

  function analysisHelper(powerList: any) {
    for (let i = 0; i < powerList.length; i++) {
      const power = powerList[i]
      if (!power.children || !power.children.length) {
        const external = isExternal(power.path)
        if (external && power.isFrame === 1) continue // 新标签打开的无需路由
        if (!power.path) continue // 未配置地址无法匹配路由
        if (external) {
          // 处理内嵌打开路由
          res.push({
            path: `/external-page${power.id}`,
            component: Layout,
            meta: { title: '', icon: power.icon },
            children: [
              {
                path: '',
                component: ExternalPage,
                meta: {
                  title: power.name,
                  icon: power.icon,
                  externalPath: power.path
                }
              }
            ]
          })
        } else {
          // 处理自有内容路由
          const paths = power.path.split('/')
          if (paths.length !== 3) {
            console.error('路由地址配置错误 -> ', power.path)
            continue
          }
          const firstLevel = `/${paths[1]}`
          const secondLevel = paths[2]
          constantRoutes.forEach((route) => {
            if (route.path === firstLevel) {
              if (!route.children) return // 无子路由
              const matchedSecondLevel = route.children.find(
                (item) => item.path === secondLevel
              ) as any
              if (!matchedSecondLevel) return // 未匹配到子路由
              const existRoute = res.find((item: any) => item.path === firstLevel) // 查看一级路由是否已存在
              const target = existRoute || Object.assign({}, route, { children: [] })
              target.children.push(matchedSecondLevel)
              if (matchedSecondLevel.dependency && matchedSecondLevel.dependency.length) {
                // 存在依赖路由
                matchedSecondLevel.dependency.forEach((dep: any) => {
                  if (dep.includes('/')) {
                    // 跨级路由依赖 (目前仅能处理跨级一级路由, 如果需要匹配跨级路由的子路由, 这里需要扩展)
                    if (res.find((item: any) => item.path === dep)) return // 结果中已存在, 不需要往下处理
                    res.push(constantRoutes.find((item) => item.path === dep))
                  } else {
                    if (target.children.find((child: any) => child.path === dep)) return // 该依赖路由已经被添加
                    target.children.push(route.children.find((item) => item.path === dep)) // 添加依赖
                  }
                })
              }
              !existRoute && res.push(target)
            }
          })
        }
      } else {
        analysisHelper(power.children)
      }
    }
  }
  analysisHelper(powerList)
  return res
}

function mockRoutes(powerList: any) {
  const res = [] as any
  function analysisHelper2(powerList: any) {
    for (let i = 0; i < powerList.length; i++) {
      const power = powerList[i]
      if (!power.children || !power.children.length) {
        const componentId = power.api ? Dashboard : Demo
        // 处理自有内容路由
        const paths = power.path.split('/')
        paths.splice(0, 1)
        if (paths.length == 1) {
          res.push({
            path: power.url,
            name: power.name,
            component: Layout,
            meta: { title: power.title, icon: power.icon },
            children: [
              {
                path: '',
                name: power.name,
                component: componentId,
                meta: {
                  title: power.title,
                  icon: power.icon,
                  api: power.api,
                  externalPath: power.path
                }
              }
            ]
          })
        } else if (paths.length == 2) {
          const target = res.filter((e: any) => e.path === `/${paths[0]}`)[0]
          target.children.push({
            path: power.url,
            name: power.name,
            component: componentId,
            meta: {
              title: power.title,
              icon: power.icon,
              activeMenu: power.url,
              api: power.api
            }
          })
        } else if (paths.length == 3) {
          const target = res.filter((e: any) => e.path === `/${paths[0]}`)[0]
          const t = target.children.filter((e: any) => e.path === `/${paths[0]}/${paths[1]}`)[0]
          t.children.push({
            path: power.url,
            name: power.name,
            component: componentId,
            meta: {
              title: power.title,
              icon: power.icon,
              activeMenu: power.url,
              api: power.api
            }
          })
        }
      } else {
        // 处理自有内容路由
        const paths = power.path.split('/')
        paths.splice(0, 1)
        if (paths.length > 1) {
          const target = res.filter((e: any) => e.path === `/${paths[0]}`)[0]
          target.children.push({
            path: power.url,
            name: power.name,
            component: Demo,
            redirect: power.children[0].url,
            meta: {
              title: power.title,
              icon: power.icon
            },
            children: []
          })
        } else {
          res.push({
            path: power.url,
            name: power.name,
            component: Layout,
            meta: { title: power.title, icon: power.icon },
            redirect: power.children[0].url,
            children: []
          })
        }

        analysisHelper2(power.children)
      }
    }
  }
  analysisHelper2(powerList)
  console.log('res', res)
  return res
}

/**
 * 解析权限列表为菜单渲染项
 * @param {Array} powerList
 * @returns 动态生成的菜单
 */
function analysisPowerToMenus(powerList: any) {
  const routes = powerList.map((power: any) => {
    if (!power.children || !power.children.length) {
      const external = isExternal(power.path)
      if (external && power.isFrame === 1) {
        // 新标签打开
        return {
          url: power.path || power.url,
          name: power.name,
          icon: power.icon,
          iconActive: power.icon ? power.icon + '-hover' : ''
        }
      } else {
        // 内嵌打开或者平台自有内容
        const path = external ? `/external-page${power.id}` : power.path || `/external${power.id}`
        return {
          url: path,
          name: power.name,
          icon: power.icon,
          iconActive: power.icon ? power.icon + '-hover' : '',
          externalPath: external ? power.path : '',
          children: []
        }
      }
    } else {
      return {
        url: power.path || `/external${power.id}`,
        name: power.name,
        icon: power.icon,
        iconActive: power.icon ? power.icon + '-hover' : '',
        children: analysisPowerToMenus(power.children)
      }
    }
  })

  return routes
}
