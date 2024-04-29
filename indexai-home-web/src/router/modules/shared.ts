import { RouteRecordRaw } from 'vue-router'
import Layout from '/@/layout/index.vue'
/**
 * 不需要授权就可以访问的页面
 */
const routes: Array<RouteRecordRaw> = [
  // {
  //   path: '/login',
  //   name: 'login',
  //   component: () => import('/@/views/login/index.vue')
  // },
  {
    path: '/redirect',
    name: 'Redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('/@/views/redirect/index.vue')
      }
    ]
  }
]

export default routes
