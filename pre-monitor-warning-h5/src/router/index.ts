import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { Login } from 'fx-front-ucenter';
import Layout from '@/layout/layout.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      redirect: '/homepage',
    },
  },
  {
    path: '/homepage',
    name: 'Homepage',
    component: () => import('@/views/homepage/index.vue'),
    meta: {
      title: '监测预警',
    },
  },
  {
    path: '/realtime-warning',
    name: 'RealtimeWarning',
    component: Layout,
    children: [
      {
        path: 'realtime-warning-list',
        name: 'RealtimeWarningList',
        component: () => import('@/views/realtime-warning-list/index.vue'),
        meta: {
          title: '实时预警列表',
        },
      },
      {
        path: 'realtime-warning-detail',
        name: 'RealtimeWarningDetail',
        component: () => import('@/views/realtime-warning-detail/index.vue'),
        meta: {
          title: '实时预警详情',
        },
      },
      {
        path: 'warning-search',
        name: 'WarningSearch',
        component: () => import('@/views/warning-search/index.vue'),
        meta: {
          title: '预警搜索',
        },
      }
    ],
  },
  {
    path: '/history-warning',
    name: 'HistoryWarning',
    component: Layout,
    children: [
      {
        path: 'history-warning-list',
        name: 'HisyoryWarningList',
        component: () => import('@/views/history-warning-list/index.vue'),
        meta: {
          title: '历史预警列表',
        },
      },
      {
        path: 'history-warning-detail',
        name: 'HisyoryWarningDetail',
        component: () => import('@/views/history-warning-detail/index.vue'),
        meta: {
          title: '历史预警详情',
        },
      },
    ],
  },
  {
    path: '/warning-attachment',
    name: 'WarningAttachment',
    component: () => import('@/views/attachment/index.vue'),
    meta: {
      title: '附件查看',
    },
  },
];

const router = createRouter({
  history: createWebHistory(`/${process.env.PROD_PREFIX}`),
  routes,
});

export default router;
