// 无权限静态路由
import { RouteRecordRaw } from 'vue-router'
import Layout from '/@/layout/index.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/platform',
    component: shallowRef(Layout),
    meta: { title: '问政', icon: '' },
    children: [
      {
        path: '',
        name: 'platform',
        component: () => import('/@/views/demo/index.vue'),
        meta: { title: '工作台', icon: '', activeMenu: '/platform' }
      }
    ]
  },
  {
    path: '/intelligent-services',
    component: shallowRef(Layout),
    meta: { title: '智能服务', icon: '' },
    redirect: '/intelligent-services/assistant',
    children: [
      {
        path: '/intelligent-services/knowledge-portal',
        name: 'knowledge-portal',
        component: () => import('/@/views/demo/index.vue'),
        meta: { title: '知识门户', icon: '', activeMenu: '/intelligent-services/knowledge-portal' }
      },
      {
        path: '/intelligent-services/assistant',
        name: 'assistant',
        component: () => import('/@/views/dashboard/index.vue'),
        meta: { title: '智能助手', icon: '', activeMenu: '/intelligent-services/assistant' }
      },
      {
        path: '/intelligent-services/search',
        name: 'search',
        component: () => import('/@/views/demo/index.vue'),
        meta: { title: '智能搜索', icon: '', activeMenu: '/intelligent-services/search' }
      }
    ]
  },
  {
    path: '/assistant-decision',
    component: shallowRef(Layout),
    meta: { title: '辅助决策', icon: '' },
    redirect: '/assistant-decision/leadership',
    children: [
      {
        path: '/assistant-decision/leadership',
        name: 'leadership',
        component: () => import('/@/views/demo/index.vue'),
        meta: { title: '领导决策', icon: '', activeMenu: '/assistant-decision/leadership' }
      },
      {
        path: '/assistant-decision/grassroots-governance',
        name: 'grassroots-governance',
        component: () => import('/@/views/demo/index.vue'),
        meta: {
          title: '基层治理',
          icon: '',
          activeMenu: '/assistant-decision/grassroots-governance'
        }
      }
    ]
  },
  {
    path: '/knowledge-management',
    component: shallowRef(Layout),
    meta: { title: '知识管理', icon: '' },
    children: [
      {
        path: '',
        name: 'Knowledge management',
        component: () => import('/@/views/demo/index.vue'),
        meta: { title: '知识管理', icon: '', activeMenu: '/knowledge-management' }
      }
    ]
  },
  {
    path: '/knowledge-managementdb',
    component: shallowRef(Layout),
    meta: { title: '知识仓库', icon: '' },
    redirect: '/knowledge-managementdb/general',
    children: [
      {
        path: '/knowledge-managementdb/general',
        name: 'general',
        component: () => import('/@/views/demo/index.vue'),
        meta: { title: '通用知识库', icon: '', activeMenu: '/knowledge-managementdb/general' }
      },
      {
        path: '/knowledge-managementdb/special',
        name: 'special',
        component: () => import('/@/views/demo/index.vue'),
        meta: { title: '专题知识库', icon: '', activeMenu: '/knowledge-managementdb/special' }
      },
      {
        path: '/knowledge-managementdb/event',
        name: 'event',
        component: () => import('/@/views/demo/index.vue'),
        meta: { title: '事项知识库', icon: '', activeMenu: '/knowledge-managementdb/event' }
      },
      {
        path: '/knowledge-managementdb/Q&A',
        name: 'Q&A',
        component: () => import('/@/views/demo/index.vue'),
        meta: { title: '问答知识库', icon: '', activeMenu: '/knowledge-managementdb/Q&A' }
      },
      {
        path: '/knowledge-managementdb/document',
        name: 'document',
        component: () => import('/@/views/demo/index.vue'),
        meta: { title: '文档知识库', icon: '', activeMenu: '/knowledge-managementdb/document' }
      }
    ]
  },
  {
    path: '/knowledge-perations',
    component: shallowRef(Layout),
    meta: { title: '知识运营', icon: '' },
    children: [
      {
        path: '/knowledge-perations',
        name: 'knowledge-perations',
        component: () => import('/@/views/demo/index.vue'),
        meta: { title: '知识运营', icon: '', activeMenu: '/knowledge-perations' }
      }
    ]
  }
]

export default routes
