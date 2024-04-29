import Vue from 'vue'
import Router from 'vue-router'
import settings from '@/settings'
import store from '@/store'
import sysRouters from '@/router/system'

import { miniLayout, message } from '@l'

import { getUrlSearch } from '@l/utils'
import MediumLayout from '@/components/layout/medium-layout.vue'

if (getUrlSearch('debug') || sessionStorage.getItem('debug')) {
  window.debug = true
  sessionStorage.setItem('debug', '1')
}

Vue.use(Router)

/**
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * 重要说明：当前文件定义的是默认路由，业务系统的路由请在 src/router/system.js 中编写
 */
const constantRoutes = [
  // 注意：第一个必须写login路由
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: MediumLayout,
    hidden: true
  },
  {
    path: '/message',
    component: miniLayout,
    meta: { title: '消息列表' },
    hidden: true,
    children: [{
      path: '',
      meta: { title: '消息列表' },
      component: message
    }]
  }
]

// 如果不开启消息功能，需去除相应路由
if (!settings.useMsg) {
  const msgIndex = constantRoutes.findIndex(item => item.path === '/message')
  constantRoutes.splice(msgIndex, 1)
}

// 注意：最后一个必须写跳转404路由
const redirectTo404Route = { path: '*', redirect: '/404', hidden: true, default: true }

if (!settings.dynamicRouter) {
  // 非动态路由逻辑
  constantRoutes.pop()
  constantRoutes.push(...sysRouters)
  constantRoutes.push(redirectTo404Route)
}

export { constantRoutes, redirectTo404Route }

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  store.commit('route/RESET_ROUTES')
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
