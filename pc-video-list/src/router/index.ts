import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Layout from '@/layout/layout.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/landing/fx',
  },
  {
    path: '/landing',
    name: 'landingPage',
    component: Layout,
    children: [
      {
        path: 'fx',
        name: 'Fx',
        component: () => import('@/views/landing/fx.vue'),
        meta: {
          hiddenSubHeader: true,
        }
      },
      {
        path: 'yl',
        name: 'Yl',
        component: () => import('@/views/landing/yl.vue'),
        meta: {
          hiddenSubHeader: true,
        }
      },
      {
        path: 'xf',
        name: 'Xf',
        component: () => import('@/views/landing/xf.vue'),
        meta: {
          hiddenSubHeader: true,
        }
      }
    ],
    meta: {
      icon: 'FillSet',
      onlyOne: true,
      sort: 0,
      menu: true,
      title: '菜单一'
    }
  },
];

const router = createRouter({
  history: createWebHashHistory(`/${process.env.PROD_PREFIX}`),
  routes,
});

export default router;
