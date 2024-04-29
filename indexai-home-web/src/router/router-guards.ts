import path from 'path-browserify'
import { Router } from 'vue-router'
import { getToken, setToken } from '/@/utils/storage/auth'
import NProgress from 'nprogress' // progress bar
import { useUserStoreWithOut } from '/@/store/modules/user'
import { useRouteStoreWithOut } from '/@/store/modules/route'
import qs from 'qs'
import getPageTitle from '/@/utils/index'
NProgress.configure({ showSpinner: false })

const whiteList = ['/login'] // no redirect whitelist
// const firstLoad = true

// 先解析从其他平台跳转过来的 token
function matchToken() {
  const url = window.location.href
  const params = qs.parse(url.split('?')[1])
  if (params.token) {
    setToken(params.token as string)
  }
}

// 通知iframe 父框架1、路由信息；2、是否退出
function noticeMessage(to: any, option: any) {
  if ((window as any).embed) {
    console.log('子应用退出了1111')
    window.parent &&
      window.parent.window &&
      (window.parent.window as any).onMessageFromChild(
        {
          origin: window.location.origin,
          path: to.path,
          fullPath: to.fullPath,
          title: to.meta.title,
          pathName: window.location.pathname
        },
        option
      )
  }
}

// 路由拦截
export function createRouterGuards(router: Router) {
  // debugger
  // 如果是第三方跳转过来就更新token，否则通过登录的方式获取token
  matchToken()
  router.beforeEach(async (to, from, next) => {
    const userStore = useUserStoreWithOut()
    const routeStore = useRouteStoreWithOut()
    // start progress bar
    NProgress.start()

    // set page title
    document.title = getPageTitle(to.meta.title as string)

    // determine whether the user has logged in
    const hasToken = getToken()

    if (hasToken) {
      if (to.path === '/login') {
        // 嵌入父工程，数据交互
        if ((window as any).embed) {
          NProgress.done()
          noticeMessage(to, { method: 'logout' })
          next(false)
        } else {
          next()
        }
        next({ path: '/' })
        NProgress.done()
      } else {
        // 如果用户信息不存在，需要获取用户信息
        const hasMenus = userStore.getMenudatas.length
        if (!hasMenus) {
          try {
            await userStore.getUserInfo() // 用户信息
            const powerRoutes = await routeStore.getPowerRoutes()
            powerRoutes.forEach((r: any) => {
              router.addRoute(r) // vue-router4.0不再支持addRoutes
            })
            next({
              ...to,
              replace: true
            })
          } catch (e) {
            console.log(e, '---用户信息出错')
            userStore.resetToken(to.path)
            NProgress.done()
            return
          }
        }

        // 如果是/，则跳转到第一个导航的路由defaultOpen
        if (to.path === '/') {
          const defaultOpenRoute = routeStore.getRoutes.find((item: any) => item?.defaultOpen)
          if (defaultOpenRoute) {
            const defaultOpenRoutePath = getDefaultOpenRoutePath('', defaultOpenRoute)
            next(defaultOpenRoutePath)
            NProgress.done()
            return
          }
        }
        next()

        // // 嵌入父工程，数据交互
        // if ((window as any).embed && !firstLoad) {
        //   NProgress.done()
        //   noticeMessage(to, { method: 'addRoutes' })
        //   next(false)
        // } else {
        //   firstLoad = false
        //   next()
        // }
      }
    } else {
      /* has no token*/
      if (whiteList.indexOf(to.path) !== -1) {
        // 嵌入父工程，数据交互
        if ((window as any).embed) {
          NProgress.done()
          noticeMessage(to, { method: 'logout' })
          next(false)
        } else {
          // in the free login whitelist, go directly, 无需鉴权，可以直接访问的页面
          next()
        }
      } else {
        // other pages that do not have permission to access are redirected to the login page.
        if (to.path === 'login') {
          next()
        } else {
          next(`/login`)
        }
        NProgress.done()
      }
    }
  })

  router.afterEach(() => {
    // finish progress bar
    NProgress.done()
  })

  function getDefaultOpenRoutePath(routePath: string, route: any) {
    if (route?.meta?.activeMenu) {
      routePath = route?.meta?.activeMenu
    } else {
      routePath = path.resolve(routePath, route.path)

      if (route.children && route.children.length) {
        routePath = getDefaultOpenRoutePath(routePath, route.children[0])
      }
    }

    return routePath
  }
}
