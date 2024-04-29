import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Layout from '@/layout/layout.vue';
import { Login } from 'fx-front-ucenter';

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
    name: 'Login',
    component: Login,
    meta: {
      redirect: '/home-page/index'
    }
  },
  {
    path: '/home-page',
    name: 'HomePage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'HomePageIndex',
        component: () => import('@/views/home-page/index.vue'),
        meta: {
          hiddenSubHeader: false,
          title: '概览'
        }
      }
    ],
    meta: {
      icon: 'FillDashboard',
      sort: 0,
      menu: true,
      onlyOne: true,
      title: '概览'
    }
  },
  {
    path: '/event-reception',
    name: 'EventReception',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'eventReport',
        component: () => import('@/views/landing/monitor.vue'),
        meta: {
          title: '事项上报',
          iframeUrl: '/swan-event-reception/?redirect=eventReport',
          appName: 'EventReception'
        }
      },
      {
        path: 'accept',
        name: 'eventAccept',
        component: () => import('@/views/landing/monitor.vue'),
        meta: {
          title: '事项接报',
          iframeUrl: '/swan-event-reception/?redirect=eventAccept&tab=2',
          appName: 'EventReception'
        }
      },
    ],
    meta: {
      icon: 'FillReport',
      sort: 0,
      menu: true,
      title: '事项接报'
    }
  },

  {
    path: '/event-response',
    name: 'EventResponse',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'EventResponseIndex',
        component: () => import('@/views/landing/monitor.vue'),
        meta: {
          title: '事项策略',
          iframeUrl: '/linkage-command-event-handle-web/login?redirect=strategyList',
          appName: 'EventResponse'
        }
      },
      {
        path: 'list',
        name: 'EventResponseList',
        component: () => import('@/views/landing/monitor.vue'),
        meta: {
          title: '事项列表',
          iframeUrl: '/linkage-command-event-handle-web/login?redirect=eventList',
          appName: 'EventResponse'
        }
      },
    ],
    meta: {
      icon: 'FillAlert',
      sort: 0,
      menu: true,
      title: '事项响应'
    }
  },
  {
    path: '/one-picture',
    name: 'OnePicture',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'OnePictureIndex',
        component: () => import('@/views/landing/monitor.vue'),
        meta: {
          title: '一张图',
          iframeUrl: '/linkage-command-op-web',
        }
      }
    ],
    meta: {
      icon: 'FillMap',
      sort: 0,
      menu: true,
      onlyOne: true,
      title: '一张图'
    }
  },
  {
    path: '/task-center',
    name: 'TaskCenter',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'taskCenterIndex',
        component: () => import('@/views/landing/monitor.vue'),
        meta: {
          title: '任务中心',
          iframeUrl: '/swan-task-center/login?to=taskCenter',
          appName: 'TaskCenter'
        }
      },
      {
        path: 'type',
        name: 'taskTypeConfigureIndex',
        component: () => import('@/views/landing/monitor.vue'),
        meta: {
          title: '任务类型',
          iframeUrl: '/swan-task-center/login?to=taskTypeConfigureIndex',
          appName: 'TaskCenter'
        }
      }
    ],
    meta: {
      icon: 'FillPage',
      sort: 0,
      menu: true,
      title: '任务中心'
    }
  },
  {
    path: '/knowledge-management',
    name: 'KnowledgeManagement',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'LibraryManagement',
        component: () => import('@/views/landing/monitor.vue'),
        meta: {
          title: '知识发布',
          iframeUrl: '/knowledge-management-web/login?redirect=LibraryManagement',
          appName: 'KnowledgeManagement'
        }
      },
      {
        path: 'search',
        name: 'librarySearch',
        component: () => import('@/views/landing/monitor.vue'),
        meta: {
          title: '知识检索',
          iframeUrl: '/knowledge-management-web/login?redirect=librarySearch',
          appName: 'KnowledgeManagement'
        }
      },
    ],
    meta: {
      icon: 'FillBook2',
      sort: 0,
      menu: true,
      title: '知识管理'
    }
  },
  {
    path: '/meeting',
    name: 'Meeting',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'MeetingIndex',
        component: () => import('@/views/landing/monitor.vue'),
        meta: {
          title: '协同会商',
          iframeUrl: '/swan-collaborative-meeting/login?redirect=',
          appName: 'Meeting'
        }
      }
    ],
    meta: {
      icon: 'FillConference',
      sort: 0,
      menu: true,
      onlyOne: true,
      title: '协同会商'
    }
  },
  {
    path: '/plotting',
    name: 'Plotting',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'PlottingIndex',
        component: () => import('@/views/landing/monitor.vue'),
        meta: {
          title: '协同标绘',
          iframeUrl: '/pc-collaborative-plotting/#/login',
        }
      }
    ],
    meta: {
      icon: 'FillMapDistance',
      sort: 0,
      menu: true,
      onlyOne: true,
      title: '协同标绘'
    }
  },
  {
    path: '/command-system',
    name: 'CommandSystem',
    component: Layout,
    children: [
      {
        path: 'command-management',
        name: 'CommandManagement',
        component: () => import('@/views/landing/monitor.vue'),
        meta: {
          title: '指挥体系管理',
          iframeUrl: '/swan-command-system/#/login?redirect=CommandManagement',
          appName: 'CommandSystem'
        }
      },
      {
        path: 'role-management',
        name: 'RoleManagement',
        component: () => import('@/views/landing/monitor.vue'),
        meta: {
          title: '岗位职责管理',
          iframeUrl: '/swan-command-system/#/login?redirect=RoleManagement',
          appName: 'CommandSystem'
        }
      },
      {
        path: 'agency-management',
        name: 'AgencyManagement',
        component: () => import('@/views/landing/monitor.vue'),
        meta: {
          title: '机构人员池',
          iframeUrl: '/swan-command-system/#/login?redirect=AgencyManagement',
          appName: 'CommandSystem'
        }
      },
      {
        path: 'work-group',
        name: 'WorkGroup',
        component: () => import('@/views/landing/monitor.vue'),
        meta: {
          title: '<%= commandSysName %>',
          hiddenMenu: true,
          showBack: true,
          defaultActive: '/command-system/command-management',
          iframeUrl: '/swan-command-system/#/login?redirect=WorkGroup',
          appName: 'CommandSystem'
        }
      },
    ],
    meta: {
      icon: 'FillAssemblyArea',
      sort: 0,
      menu: true,
      title: '指挥体系'
    }
  },
  {
    path: '/message-center',
    name: 'MessageCenter',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'MessageCenterIndex',
        component: () => import('@/views/landing/monitor.vue'),
        meta: {
          title: '消息中心',
          iframeUrl: '/swan-notice-center-pc/#/login?redirect=',
          appName: 'CommandSystem'
        }
      }
    ],
    meta: {
      icon: 'FillBell',
      sort: 0,
      menu: true,
      onlyOne: true,
      title: '消息中心',
    }
  },
  {
    path: '/resource-management',
    name: 'ResourceManagement',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'emergencyResource',
        component: () => import('@/views/landing/monitor.vue'),
        meta: {
          title: '应急资源管理',
          iframeUrl: '/resource-management-web/login?redirect=emergencyResource',
          appName: 'ResourceManagement'
        }
      },
      {
        path: 'risk-hidden-danger',
        name: 'riskHiddenDanger',
        component: () => import('@/views/landing/monitor.vue'),
        meta: {
          title: '风险隐患管理',
          iframeUrl: '/resource-management-web/login?redirect=riskHiddenDanger',
          appName: 'ResourceManagement'
        }
      },
      {
        path: 'protection-target',
        name: 'protectionTarget',
        component: () => import('@/views/landing/monitor.vue'),
        meta: {
          title: '防护目标管理',
          iframeUrl: '/resource-management-web/login?redirect=protectionTarget',
          appName: 'ResourceManagement'
        }
      },
    ],
    meta: {
      icon: 'FillBook2',
      sort: 0,
      menu: true,
      title: '资源管理'
    }
  },
  {
    path: '/reserve-plan-management',
    name: 'ReservePlanManagement',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'digitalPlanIndex',
        component: () => import('@/views/landing/monitor.vue'),
        meta: {
          title: '预案列表',
          iframeUrl: '/reserve-plan-management-web/login?redirect=digitalPlanIndex',
          appName: 'ReservePlanManagement'
        }
      },
    ],
    meta: {
      icon: 'FillBook2',
      sort: 0,
      menu: true,
      title: '预案管理'
    }
  },

];

const router = createRouter({
  history: createWebHistory(`/${process.env.PROD_PREFIX}`),
  routes,
});

export default router;
