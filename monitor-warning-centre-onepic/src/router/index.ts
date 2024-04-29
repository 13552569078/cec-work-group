import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { GlobalAPI } from '@/common';

const MonitorCenter = () => import('@/views/monitor-center/index.vue');
const JudgementCenter = () => import('@/views/judgement-center/index.vue');
const Judge = () => import('@/views/judge/index.vue');
const MonitorRegion = () => import('@/views/monitor-region/index.vue');

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/monitor/center',
  },
  {
    path: '/monitor/center',
    name: 'monitor-center',
    component: MonitorCenter,
    meta: {
      title: '监测中心',
    },
  },
  {
    path: '/warning/center',
    name: 'warning-center',
    component: MonitorCenter,
    meta: {
      title: '预警中心',
    },
  },
  {
    path: '/monitor/judgement-center',
    name: 'monitor-judgement-center',
    component: JudgementCenter,
    meta: {
      title: '监测研判中心',
    },
  },
  {
    path: '/warning/judgement-center',
    name: 'warning-judgement-center',
    component: JudgementCenter,
    meta: {
      title: '预警研判中心',
    },
  },
  {
    path: '/monitor/judge',
    name: 'monitor-judge',
    component: Judge,
    meta: {
      title: '监测研判',
    },
  },
  {
    path: '/warning/judge',
    name: 'warning-judge',
    component: Judge,
    meta: {
      title: '预警研判',
    },
  },
  {
    path: '/monitor/region',
    name: 'monitor/region',
    component: MonitorRegion,
    meta: {
      title: '监测主体',
    },
  }, {
    path: '/warning/region',
    name: 'warning/region',
    component: MonitorRegion,
    meta: {
      title: '监测主体',
    },
  },
];
export const ROUTER_BASE = GlobalAPI.config.PROD_PREFIX;
const router = createRouter({
  history: createWebHistory(ROUTER_BASE),
  routes,
});

export default router;
