import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { GetParams, Login } from 'fx-front-ucenter';

import { GlobalAPI } from '@/common';

const OverviewForNormalScreen = () => import('@/views/overview/layout-normal-screen/index.vue');
const EventHandlingForNormalScreen = () => import('@/views/event-handling/layout-normal-screen/index.vue');

/**
* login route.meta中字段含义
* redirect: 值可以为:
  - [string] router path 如：'/home
  - [object] router.push的对象
  - [function] 参数1：route(route实例)、参数2：获取url中指定参数的回调函数 如：getParams('token')， 返回值值为route object，例如：{ path: '/home', query: { xx: 'xx' } }
*/
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      title: '登录',
      redirect: '/overview'
    },
  },
  {
    path: '/overview',
    name: 'overview',
    component: OverviewForNormalScreen,
    meta: {
      title: '总体态势',
    },
  },
  {
    path: '/event-handling',
    name: 'event-handling',
    component: EventHandlingForNormalScreen,
    meta: {
      title: '事件处置',
    },
  },
];

const router = createRouter({
  history: createWebHistory(`/${process.env.PROD_PREFIX}`),
  routes,
});

export default router;
