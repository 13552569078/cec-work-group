import path from 'path'
import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { setToken, getToken } from '@l/utils/auth'
import getPageTitle from '@l/utils/get-page-title'

NProgress.configure({ showSpinner: false })

// const whiteList = ['/login']

router.beforeEach(async(to, from, next) => {
  NProgress.start()
  document.title = getPageTitle(to.meta.title)
  const url = new URL(window.location.href)
  var token = new URLSearchParams(url.search).get('token')
  if (to.query.token || token) {
    setToken(to.query.token || token)
    if (to.query.system) {
      store.commit('user/SET_SYSTEM_FLAG', to.query.system)
    }
  }
  if (to.query.sidebarStatus) {
    store.commit('app/TOGGLE_SIDEBAR_FALSE')
  }
  const hasToken = getToken()
  // if (hasToken) {
  // 如果用户信息不存在，需要获取用户信息
  if (!store.getters.userId && hasToken) {
    try {
      await store.dispatch('user/getUserInfo')
    } catch (e) {
      console.log(e, '---用户信息出错')
      // store.dispatch('user/resetToken', to.path)
    }
  }

  if (!store.getters.routesLoaded) {
    try {
      store.commit('route/SET_ROUTESLOADED', true)
      const powerRoutes = await store.dispatch('route/getPowerRoutes')
      const defaultRoute = powerRoutes.find(d => !d.hidden).path
      router.addRoutes(powerRoutes)
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
    const firstRoute = store.getters.routes.find(d => !d.hidden)
    const defaultOpenRoute = store.getters.routes.find(item => item.defaultOpen) || firstRoute
    if (defaultOpenRoute) {
      const defaultOpenRoutePath = getDefaultOpenRoutePath('', defaultOpenRoute)
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
  return route.path
  // if (route.children && route.children.length) {
  //   routePath = getDefaultOpenRoutePath(routePath, route.children[0])
  // }
  // return routePath
}
