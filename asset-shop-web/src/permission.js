import path from 'path'
import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { setToken, getToken } from '@l/utils/auth'
import getPageTitle from '@l/utils/get-page-title'
// import settings from './settings'

NProgress.configure({ showSpinner: false })

// const whiteList = ['/login']

router.beforeEach(async(to, from, next) => {
  NProgress.start()
  document.title = getPageTitle()
  if (to.query.token) {
    setToken(to.query.token)
    if (to.query.system) {
      store.commit('user/SET_SYSTEM_FLAG', to.query.system)
    }
  }
  if (to.query.sidebarStatus) {
    store.commit('app/TOGGLE_SIDEBAR_FALSE')
  }
  const hasToken = getToken() || to.query.token
  const isformPortal = sessionStorage.getItem('token-fx-web')
  const isformAssetCenter = sessionStorage.getItem('token-asset-center')
  if ((isformPortal || isformAssetCenter) && !hasToken) {
    store.dispatch('user/resetToken', to.path)
    return
  }
  // 如果用户信息不存在，需要获取用户信息
  if (!store.getters.userId && hasToken) {
    try {
      await store.dispatch('user/getUserInfo')
    } catch (e) {
      console.log(e, '---用户信息出错')
      return
      // store.dispatch('user/resetToken', to.path)
    }
  }

  if (!store.getters.routesLoaded) {
    try {
      store.commit('route/SET_ROUTESLOADED', true)
      const powerRoutes = await store.dispatch('route/getPowerRoutes')
      const defaultRoute = powerRoutes.find(d => !d.hidden).path
      router.addRoutes(powerRoutes)
      console.log(to.path === '/' ? defaultRoute : to.path, '-----00000---topath')
      next({
        ...to,
        path: to.path === '/' ? defaultRoute : to.path,
        replace: true
      })
    } catch (e) {
      console.log(e, '---动态路由出错')
    }
  }
  // 如果是/，则跳转到第一个导航的路由defaultOpen
  if (to.path === '/') {
    let defaultOpenRoute = store.getters.routes.find(item => item.defaultOpen)
    if (!defaultOpenRoute) {
      const path = store.getters.routes
      defaultOpenRoute = path.find(d => !d.hidden)
    }
    if (defaultOpenRoute) {
      const defaultOpenRoutePath = getDefaultOpenRoutePath('', defaultOpenRoute)
      console.log(defaultOpenRoutePath, '-----defaultOpenRoutePath----')
      next(defaultOpenRoutePath)
      NProgress.done()
      return
    }
  }
  next()

  NProgress.done()
})

router.afterEach(() => {
  NProgress.done()
})

function getDefaultOpenRoutePath(routePath, route) {
  routePath = path.resolve(routePath, route.path)
  if (route.children && route.children.length) {
    routePath = getDefaultOpenRoutePath(routePath, route.children[0])
  }
  return routePath
}
