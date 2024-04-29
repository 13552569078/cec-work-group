import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import 'nprogress/css/nprogress.css' // 进度条样式
// import { createRouterGuards } from './router-guards'
import shared from './modules/shared'
import { errorRoutes } from './modules/error'
// import Layout from '/@/layout/index.vue'
import { App } from 'vue'

export const constantRoutes: Array<RouteRecordRaw> = [
  // {
  //   path: '/',
  //   component: Layout,
  //   children: [
  //     {
  //       // 默认页面, 无权限路由时展示
  //       path: '',
  //       name: 'default',
  //       component: () => import('/@/views/default/index.vue'),
  //       meta: { title: '无内容', icon: '' }
  //     }
  //   ]
  // },
  {
    path: '/',
    name: 'home',
    component: () => import('/@/views/home/index.vue'),
    meta: { title: '首页', icon: '' }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('/@/views/dashboard/index.vue'),
    meta: { title: '工作台', icon: '' }
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('/@/views/search/list/index.vue'),
    meta: { title: '搜索', icon: '' }
  },
  {
    path: '/search/detail',
    name: 'searchDetail',
    component: () => import('/@/views/search/detail/index.vue'),
    meta: { title: '详情', icon: '' }
  },
  ...shared, //无授权可访问的路由
  errorRoutes //错误反馈路由
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes: constantRoutes,
  // 保证每次路由跳转后的页面都到指定位置或者顶端
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export function setupRouter(app: App) {
  app.use(router)
  // createRouterGuards(router)
}
export default router
