import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { GlobalAPI } from '@/common';

const EventCenter = () => import('@/views/event-center/index.vue');
const EventDetail = () => import('@/views/event-detail/index.vue');
const EventAnalysis = () => import('@/views/event-analysis/index.vue');

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/event/center',
  },
  {
    path: '/event/center',
    name: 'event-center',
    component: EventCenter,
    meta: {
      title: '首页',
    },
  },
  {
    path: '/event/analysis',
    name: 'event-analysis',
    component: EventAnalysis,
    meta: {
      title: '监督分析',
    },
  },
  {
    path: '/event/detail',
    name: 'event-detail',
    component: EventDetail,
    meta: {
      title: '事件详情',
    },
  },

];
export const ROUTER_BASE = GlobalAPI.config.PROD_PREFIX;
const router = createRouter({
  history: createWebHistory(ROUTER_BASE),
  routes,
});

export default router;
