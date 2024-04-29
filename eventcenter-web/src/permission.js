import path from 'path'
import router from './router'
import store from './store'
import { Message } from 'ccxd-ux'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, setToken, clearLocalStorage } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
const qs = require('qs')

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist
// let firstLoad = true
const hasToken = getToken()

// 先解析从其他平台跳转过来的 token
function matchToken() {
  const url = window.location.href
  const params = qs.parse(url.split('?')[1])
  if (params.token) {
    setToken(params.token)
    store.commit('user/SET_TOKEN', params.token)
  }
  if (params.appCode) {
    store.commit('user/SET_APPCODE', params.appCode)
  }
}

matchToken()

// 社会治理判断是否跳转统一登陆
function verifyToSSo() {
  if (!hasToken || hasToken === 'underfined') {
    const { origin, pathname } = window.location
    const loginSuccessUrl = encodeURIComponent(`${origin}${pathname}#/empty-role`)
    const redirect_url = `${origin}/api/gateway/login/oauth2/authorization?registrationId=${window.GLOBAL_CONFIG.clientId}&loginSuccessUrl=${loginSuccessUrl}`
    window.location.href = redirect_url
  }
}

window.GLOBAL_CONFIG.isShzl && verifyToSSo()

router.beforeEach(async(to, _from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // 如果用户信息不存在，需要获取用户信息
      const hasProfile = store.getters.profile && store.getters.profile.id

      // 如果没有获取到全局的配置，则重新获取全局配置
      const hasConfig = !!store.getters.getConfig

      if (hasProfile && hasConfig) {
        next()
      } else {
        try {
          if (!hasConfig) {
            await store.dispatch('app/getConfig')
          }
          if (!hasProfile) {
            await store.dispatch('user/getInfo')
            await store.dispatch('user/getMenus') // 获取菜单
            await store.dispatch('user/getAppInfo') // 获取该应用信息
            await store.dispatch('user/getSpeTypeDictsFromBs')// 获取专项类型树
            await store.dispatch('user/getDictsFromBs')
            await store.dispatch('route/getPowerRoutes') // 处理动态权限菜单
            router.addRoutes(store.state.route.dynamicRoutes) // 添加动态路由
          }

          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          // noticeMessage(to, { method: 'logout' })
          if (window.embed) {
            window?.$wujie?.props?.method?.logout?.()
            next('/')
          } else {
            next(`/login?redirect=${to.path}`)
          }
          NProgress.done()
        }
        // 如果是/，则默认所属权限菜单的第一个页面路由，匹配不到，则跳转去权限页面
        const menuList = store.state.route.menuList
        if (to.path === '/' && menuList.length > 0) {
          const defaultOpenRoutePath = getDefaultOpenRoutePath('', menuList[0])
          // 如果发现第一个应用找到的页面是目录或菜单路径是空，则跳转 404 页面
          if (defaultOpenRoutePath.indexOf('.') > -1) {
            next('/404')
          } else {
            next(defaultOpenRoutePath)
          }
          return
        }
        if (to.path.indexOf('external-page') > -1) {
          next(to)
        }
      }
    }
  } else {
    /* has no token*/
    console.log('$wujie?.props?.method?.logout--notoken')
    clearLocalStorage()
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      // noticeMessage(to, { method: 'logout' })
      console.log('$wujie?.props?.method?.logout')
      window?.$wujie?.props?.method?.logout()
      if (window.embed) {
        console.log('window.embed', window.embed)
        next('/')
      } else {
        // 跳转本平台的登陆页面
        next(`/login?redirect=${to.path}`)
      }
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

function getDefaultOpenRoutePath(routePath, route) {
  routePath = path.resolve(routePath, route.path)
  if (route?.children?.length) {
    routePath = getDefaultOpenRoutePath(routePath, route.children[0])
  }
  return routePath
}
