import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
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
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
  path: '/login',
  component: () =>
    import('@/views/login/index'),
  hidden: true
},
// sso 跳转后的页面，进行切换角色
{
  path: '/empty-role',
  component: () =>
    import ('@/components/page-wrapper/emptyRole'),
  hidden: true
},
{
  path: '/404',
  component: () =>
    import('@/views/404'),
  hidden: true
},
{
  path: '/',
  component: Layout,
  hidden: true,
  children: [
    {
      // 默认页面, 无权限路由时展示
      path: '',
      name: 'default',
      component: () => import('@/views/default/index'),
      meta: { title: '无内容', icon: '' }
    }
  ]
},
{
  path: '/workbench',
  component: Layout,
  redirect: '/workbench/todo',
  meta: { title: '工作台', icon: 'menu-icon-workbench' },
  children: [{
    path: 'whistle',
    name: 'workbenchWhistle',
    component: () =>
      import('@/views/workbench'),
    meta: { title: '吹哨事件', icon: '', keepAlive: true },
    children: [{
      path: 'info',
      name: 'workbenchWhistleInfo',
      component: () =>
        import('@/views/workbench'),
      meta: { title: '事件详情', icon: '', activeMenu: '/workbench/whistle' }
    }]
  }, {
    path: 'handle',
    name: 'workbenchHandle',
    component: () =>
      import('@/views/workbench'),
    meta: { title: '经办事件', icon: '', keepAlive: true },
    children: [{
      path: 'info',
      name: 'WorkbenchEventInfo',
      component: () =>
        import('@/views/workbench'),
      meta: { title: '事件详情', icon: '', activeMenu: '/workbench/handle' }
    }]
  }, {
    path: 'todo',
    name: 'workbenchTodo',
    component: () =>
      import('@/views/workbench'),
    meta: { title: '待处理事件', icon: '', keepAlive: true },
    children: [{
      path: 'info',
      name: 'WorkbenchTodoInfo',
      component: () =>
        import('@/views/workbench'),
      meta: { title: '事件详情', icon: '', activeMenu: '/workbench/todo' }
    }]
  },
  {
    path: 'assist',
    name: 'workbenchAssist',
    component: () =>
      import('@/views/workbench'),
    meta: { title: '协办事件', icon: '', keepAlive: true },
    children: [{
      path: 'info',
      name: 'WorkbenchAssistInfo',
      component: () =>
        import('@/views/workbench'),
      meta: { title: '事件详情', icon: '', activeMenu: '/workbench/assist' }
    }]
  },
  {
    path: 'notify',
    name: 'workbenchNotify',
    component: () =>
      import('@/views/workbench'),
    meta: { title: '知会事件', icon: '', keepAlive: true },
    children: [{
      path: 'info',
      name: 'WorkbenchNotifyInfo',
      component: () =>
        import('@/views/workbench'),
      meta: { title: '事件详情', icon: '', activeMenu: '/workbench/notify' }
    }]
  },
  {
    path: 'home',
    name: 'workbenchHome',
    component: () =>
      import('@/views/workbench'),
    meta: { title: '工作台', icon: '' }
  },
  {
    path: 'event-focus',
    name: 'eventFocus',
    component: () =>
      import('@/views/workbench'),
    meta: { title: '事件汇聚', icon: '', keepAlive: true }
  }
  ]
},
{
  path: '/event',
  component: Layout,
  redirect: 'noRedirect',
  meta: { title: '事件管理', icon: 'menu-icon-event' },
  children: [{
    path: 'type-in',
    name: 'typeIn',
    component: () =>
      import('@/views/event'),
    meta: { title: '事件录入', icon: '', keepAlive: true },
    children: [{
      path: 'info',
      name: 'typeInInfo',
      component: () =>
        import('@/views/event'),
      meta: { title: '事件详情', icon: '', activeMenu: '/event/type-in' }
    }, {
      path: 'type-in-add',
      name: 'typeInAdd',
      component: () =>
        import('@/views/event'),
      meta: { title: '新增事件录入', icon: '' }
    }, {
      path: 'type-in-edit',
      name: 'typeInEdit',
      component: () =>
        import('@/views/event'),
      meta: { title: '编辑事件录入', icon: '' }
    }]
  }, {
    path: 'filter',
    name: 'filter',
    component: () =>
      import('@/views/event'),
    meta: { title: '重复事件过滤', icon: '' },
    children: [{
      path: 'filterInfo',
      name: 'filterInfo',
      component: () =>
        import('@/views/event'),
      meta: { title: '重复事件过滤详情', icon: '', activeMenu: '/event/filter' }
    }]
  }, {
    path: 'review',
    name: 'review',
    component: () =>
      import('@/views/event'),
    meta: { title: '事件审核', icon: '', keepAlive: true },
    children: [{
      path: 'info',
      name: 'reviewInfo',
      component: () =>
        import('@/views/event'),
      meta: { title: '事件详情', icon: '', activeMenu: '/event/review' }
    }]
  },
  {
    path: 'dispatch',
    name: 'dispatch',
    component: () =>
      import('@/views/event'),
    meta: { title: '事件调度', icon: '', keepAlive: true },
    children: [{
      path: 'info',
      name: 'dispatchInfo',
      component: () =>
        import('@/views/event'),
      meta: { title: '事件详情', icon: '', activeMenu: '/event/dispatch' }
    }]
  },
  {
    path: 'handle',
    name: 'handle',
    component: () =>
      import('@/views/event'),
    meta: { title: '事件处理', icon: '', keepAlive: true },
    children: [{
      path: 'info',
      name: 'handleInfo',
      component: () =>
        import('@/views/event'),
      meta: { title: '事件详情', icon: '', activeMenu: '/event/handle' }
    }]
  },
  {
    path: 'handled',
    name: 'handled',
    component: () =>
      import('@/views/event'),
    meta: { title: '已处置事件', icon: '', keepAlive: true },
    children: [{
      path: 'info',
      name: 'handledInfo',
      component: () =>
        import('@/views/event'),
      meta: { title: '事件详情', icon: '', activeMenu: '/event/handled' }
    }]
  },
  {
    path: 'settle',
    name: 'settle',
    component: () =>
      import('@/views/event'),
    meta: { title: '待核查事件', icon: '', keepAlive: true },
    children: [{
      path: 'info',
      name: 'settleInfo',
      component: () =>
        import('@/views/event'),
      meta: { title: '事件详情', icon: '', activeMenu: '/event/settle' }
    }]
  },
  {
    path: 'settled',
    name: 'settled',
    component: () =>
      import('@/views/event'),
    meta: { title: '已核查事件', icon: '', keepAlive: true },
    children: [{
      path: 'info',
      name: 'settledInfo',
      component: () =>
        import('@/views/event'),
      meta: { title: '事件详情', icon: '', activeMenu: '/event/settled' }
    }]
  },
  {
    path: 'draft',
    name: 'draft',
    component: () =>
      import('@/views/event'),
    meta: { title: '预受理事件', icon: '', keepAlive: true }
  },
  {
    path: 'query',
    name: 'query',
    component: () =>
      import('@/views/event'),
    meta: { title: '事件查询', icon: '', keepAlive: true },
    children: [{
      path: 'info',
      name: 'queryInfo',
      component: () =>
        import('@/views/event'),
      meta: { title: '事件详情', icon: '', activeMenu: '/event/query' }
    }]
  },
  {
    path: 'cgHistory',
    name: 'cgHistory',
    component: () =>
      import('@/views/event'),
    meta: { title: '历史事件查询', icon: '', keepAlive: true },
    children: [{
      path: 'info',
      name: 'cgHistoryInfo',
      component: () =>
        import('@/views/event'),
      meta: { title: '事件详情', icon: '', activeMenu: '/event/cgHistory' }
    }]
  },
  {
    path: 'approval',
    name: 'approval',
    component: () =>
      import('@/views/event'),
    meta: { title: '审批管理', icon: '', keepAlive: true },
    children: [{
      path: 'info',
      name: 'approvalInfo',
      component: () =>
        import('@/views/event'),
      meta: { title: '事件详情', icon: '', activeMenu: '/event/approval' }
    }]
  },
  {
    path: 'verify',
    name: 'verify',
    component: () =>
      import('@/views/event'),
    meta: { title: '待审核事件', icon: '', keepAlive: true },
    children: [{
      path: 'info',
      name: 'verifyInfo',
      component: () =>
        import('@/views/event'),
      meta: { title: '事件详情', icon: '', activeMenu: '/event/verify' }
    }]
  },
  {
    path: 'verified',
    name: 'verified',
    component: () =>
      import('@/views/event'),
    meta: { title: '已审核事件', icon: '', keepAlive: true },
    children: [{
      path: 'info',
      name: 'verifiedInfo',
      component: () =>
        import('@/views/event'),
      meta: { title: '事件详情', icon: '', activeMenu: '/event/verified' }
    }]
  },
  {
    path: 'de-weight',
    name: 'deWeight',
    component: () =>
      import('@/views/event'),
    meta: { title: '事件去重', icon: '', keepAlive: true },
    children: [{
      path: 'info',
      name: 'deWeightInfo',
      component: () =>
        import('@/views/event'),
      meta: { title: '事件详情', icon: '', activeMenu: '/event/de-weight' }
    }, {
      path: 'detail',
      name: 'deWeightDetail',
      component: () =>
        import('@/views/event'),
      meta: { title: '事件详情', icon: '', activeMenu: '/event/de-weight' }
    }]
  },
  {
    path: 'merge',
    name: 'merge',
    component: () =>
      import('@/views/event'),
    meta: { title: '事件合并', icon: '', keepAlive: true },
    children: [{
      path: 'info',
      name: 'mergeInfo',
      component: () =>
        import('@/views/event'),
      meta: { title: '事件详情', icon: '', activeMenu: '/event/merge' }
    }]
  },
  {
    path: 'appraise',
    name: 'appraise',
    component: () =>
      import('@/views/event'),
    meta: { title: '事件评价', icon: '', keepAlive: true }
  }, {
    path: 'pre-accepted',
    name: 'preAccepted',
    component: () =>
      import ('@/views/event'),
    meta: { title: '事件预受理', icon: '', keepAlive: true },
    children: [{
      path: 'info',
      name: 'preAcceptedInfo',
      component: () =>
        import ('@/views/event'),
      meta: { title: '事件详情', icon: '', activeMenu: '/event/pre-accepted' }
    }]
  },
  {
    path: 'collection',
    name: 'collection',
    component: () =>
      import('@/views/event'),
    meta: { title: '事件汇聚', icon: '' },
    children: [{
      path: 'unsolved',
      name: 'collectionUnsolved',
      component: () =>
        import('@/views/event'),
      meta: { title: '待处置事件', icon: '', activeMenu: '/event/collection/unsolved', keepAlive: true }
    }, {
      path: 'all',
      name: 'collectionAll',
      component: () =>
        import('@/views/event'),
      meta: { title: '全部事件', icon: '', activeMenu: '/event/collection/all', keepAlive: true }
    }, {
      path: 'third-self-handle',
      name: 'thirdSelfHandle',
      component: () =>
        import('@/views/event'),
      meta: { title: '三方自处置事件', icon: '', activeMenu: '/event/collection/third-self-handle', keepAlive: true }
    }]
  }
  ]
},
{
  path: '/inspector',
  component: Layout,
  redirect: 'noRedirect',
  meta: { title: '督查督办', icon: 'menu-icon-inspector' },
  children: [{
    path: 'list',
    name: 'list',
    component: () =>
      import('@/views/inspector'),
    meta: { title: '督查单', icon: '', keepAlive: true },
    children: [{
      path: 'info',
      name: 'inspectorInfo',
      component: () =>
        import('@/views/inspector'),
      meta: { title: '事件详情', icon: '', activeMenu: '/inspector/list' }
    }]
  }, {
    path: 'report',
    name: 'report',
    component: () =>
      import('@/views/inspector'),
    meta: { title: '督查报告', icon: '' }
  }, {
    path: 'feedback',
    name: 'feedback',
    component: () =>
      import('@/views/inspector'),
    meta: { title: '待反馈督办', icon: '', keepAlive: true },
    children: [{
      path: 'info',
      name: 'feedbackInfo',
      component: () =>
        import('@/views/inspector'),
      meta: { title: '事件详情', icon: '', activeMenu: '/inspector/feedback' }
    }]
  }, {
    path: 'settle',
    name: 'inspectorSettle',
    component: () =>
      import('@/views/inspector'),
    meta: { title: '我的督办', icon: '', keepAlive: true },
    children: [{
      path: 'info',
      name: 'inspectorSettleInfo',
      component: () =>
        import('@/views/inspector'),
      meta: { title: '事件详情', icon: '', activeMenu: '/inspector/settle' }
    }]
  }, {
    path: 'gridHandle',
    name: 'gridHandle',
    component: () =>
      import('@/views/inspector'),
    meta: { title: '区域督办单统计', icon: '' },
    children: []
  }, {
    path: 'departHandle',
    name: 'departHandle',
    component: () =>
      import('@/views/inspector'),
    meta: { title: '部门督办单统计', icon: '' },
    children: []
  }]
}, {
  path: '/event-analysis',
  component: Layout,
  redirect: 'noRedirect',
  meta: { title: '事件分析', icon: 'menu-icon-eventAnalysis' },
  children: [
  //   {
  //   path: 'event-type',
  //   name: 'eventTypeAnalysis',
  //   component: () =>
  //     import('@/views/event-analysis/index'),
  //   meta: { title: '事件类别统计', icon: '' }
  // },
    {
      path: 'event-quantity',
      name: 'eventQuantityAnalysis',
      component: () =>
        import('@/views/event-analysis/index'),
      meta: { title: '事件量统计', icon: '' }
    }, {
      path: 'eventAppraiseAnalysis',
      name: 'eventAppraiseAnalysis',
      hidden: false,
      component: () =>
        import('@/views/event-analysis/index'),
      meta: { title: '事件评价分析', icon: '' }
    }, {
      path: 'eventType-analysis',
      name: 'eventTypeAnalysis',
      component: () =>
        import('@/views/event-analysis/index'),
      meta: { title: '事件类型统计', icon: '' }
    }, {
      path: 'dept-analysis',
      name: 'deptAnalysis',
      component: () =>
        import('@/views/event-analysis/index'),
      meta: { title: '部门办理统计', icon: '' }
    }, {
      path: 'area-analysis',
      name: 'areaAnalysis',
      component: () =>
        import('@/views/event-analysis/index'),
      meta: { title: '区域办理统计', icon: '' }
    }]
}, {
  path: '/strategy-config',
  component: Layout,
  redirect: 'noRedirect',
  meta: { title: '策略配置', icon: 'menu-icon-strategy-config' },
  children: [{
    path: 'accrual-list',
    name: 'accrualList',
    component: () =>
      import('@/views/strategy-config'),
    meta: { title: '权责清单', icon: '', keepAlive: true }
  }, {
    path: 'accrual-set',
    name: 'accrualSet',
    component: () =>
      import('@/views/strategy-config'),
    meta: { title: '设置权责清单', icon: '' }
  }, {
    path: 'setting',
    name: 'setting',
    component: () =>
      import('@/views/strategy-config'),
    meta: { title: '调度策略', icon: '' }
  }, {
    path: 'event-type',
    name: 'eventType',
    component: () =>
      import('@/views/strategy-config'),
    meta: { title: '事件类型管理', icon: '' }
  }, {
    path: 'event-type-leaf',
    name: 'eventTypeLeaf',
    component: () =>
      import('@/views/strategy-config'),
    meta: { title: '编辑事件类型', icon: '' }
  }, {
    path: 'event-type-leaf-info',
    name: 'eventTypeLeafInfo',
    component: () =>
      import('@/views/strategy-config'),
    meta: { title: '事件类型详情', icon: '' }
  }, {
    path: 'dict',
    name: 'dict',
    component: () =>
      import('@/views/strategy-config'),
    meta: { title: '数据字典配置', icon: '' }
  }, {
    path: 'disScope-config',
    name: 'disScopeConfig',
    component: () =>
      import('@/views/strategy-config'),
    meta: { title: '调度策略配置', icon: '' }
  }, {
    path: 'de-weight',
    name: 'deWeight',
    component: () =>
      import('@/views/strategy-config'),
    meta: { title: '去重策略配置', icon: '' }
  }, {
    path: 'over-time',
    name: 'overTime',
    component: () =>
      import('@/views/strategy-config'),
    meta: { title: '时限配置', icon: '' }
  }, {
    path: 'request-auth',
    name: 'requestAuth',
    component: () =>
      import('@/views/strategy-config'),
    meta: { title: '请求鉴权配置', icon: '' }
  },
  {
    path: 'evt-change',
    name: 'evtChange',
    component: () =>
      import('@/views/strategy-config'),
    meta: { title: '流转配置', icon: '' }
  }, {
    path: 'transition',
    name: 'transition',
    component: () =>
      import('@/views/strategy-config'),
    meta: { title: '要素转换配置', icon: '' }
  },
  {
    path: 'standardized',
    name: 'standardized',
    component: () =>
      import('@/views/strategy-config'),
    meta: { title: '标准化管理', icon: '' }
  },
  {
    path: 'instruct-accept',
    name: 'instructAccept',
    component: () =>
      import('@/views/strategy-config'),
    meta: { title: '指令接受', icon: '' }
  }, {
    path: 'duty-dept',
    name: 'dutyDept',
    component: () =>
      import('@/views/strategy-config'),
    meta: { title: '职能部门', icon: '' }
  }]
},
{
  path: '/process',
  component: Layout,
  redirect: 'noRedirect',
  meta: { title: '流程配置', icon: 'menu-icon-strategy-config' },
  children: [{
    path: 'process-model',
    name: 'processModel',
    component: () =>
      import('@/views/strategy-config'),
    meta: { title: '模型管理', icon: '' },
    children: [{
      path: 'draw',
      name: 'processDraw',
      component: () =>
        import('@/views/strategy-config'),
      meta: { title: '绘制流程', icon: '', activeMenu: '/process/process-model' }
    }]
  }, {
    path: 'process-list',
    name: 'processList',
    component: () =>
      import('@/views/strategy-config'),
    meta: { title: '流程管理', icon: '' },
    children: [{
      path: 'nodeConfig',
      name: 'nodeConfig',
      component: () =>
        import('@/views/strategy-config'),
      meta: { title: '节点配置', icon: '', activeMenu: '/process/process-list' }
    }]
  }]
},
{
  path: '/task',
  component: Layout,
  redirect: 'noRedirect',
  meta: { title: '任务中心', icon: '' },
  hidden: false,
  children: [{
    path: 'todo',
    name: 'taskList',
    component: () =>
      import('@/views/task'),
    meta: { title: '待办任务', icon: '' }
  },
  {
    path: 'config',
    name: 'taskConfig',
    component: () =>
      import('@/views/task'),
    meta: { title: '任务计划中心', icon: '' },
    children: [{
      path: 'log',
      name: 'log',
      component: () =>
        import('@/views/task'),
      meta: { title: '执行任务计划', icon: '' }
    }]
  },
  {
    path: 'manage',
    name: 'manage',
    component: () =>
      import('@/views/task'),
    meta: { title: '任务管理', icon: '' }
  }
  ]
},
{
  path: '/other',
  component: Layout,
  redirect: 'noRedirect',
  meta: { title: '其他平台', icon: '' },
  hidden: false,
  children: [{
    path: 'iframe',
    name: 'other',
    component: () =>
      import('@/layout/components/iframe'),
    meta: { title: '其他平台', icon: '' }
  }]
},
{
  path: '/addressBook',
  component: Layout,
  hidden: false,
  redirect: '/addressBook/index',
  meta: { title: '通讯录', icon: 'menu-icon-eventAnalysis' },
  children: [{
    path: 'index',
    name: 'index',
    hidden: false,
    component: () =>
      import('@/views/address-book/index'),
    meta: { title: '通讯录', icon: '' }
  }]
},
{
  path: '/workManage',
  component: Layout,
  redirect: 'noRedirect',
  hidden: false,
  meta: { title: '值班管理', icon: 'menu-icon-eventAnalysis' },
  children: [{
    path: 'arrange',
    name: 'arrange',
    hidden: false,
    component: () =>
      import('@/views/workManage/arrange/index'),
    meta: { title: '排班', icon: '' },
    children: [{
      path: 'add',
      name: 'add',
      hidden: true,
      meta: { title: '添加排班', icon: 'menu-icon-eventAnalysis' },
      component: () =>
        import('@/views/workManage/arrange/addEdit.vue')
    },
    {
      path: 'edit',
      name: 'edit',
      hidden: true,
      meta: { title: '编辑排班', icon: 'menu-icon-eventAnalysis' },
      component: () =>
        import('@/views/workManage/arrange/addEdit.vue')
    }

    ]
  },
  {
    path: 'workList',
    name: 'workList',
    component: () =>
      import('@/views/workManage/workList'),
    meta: { title: '值班表', icon: '' }
  }
  ]
}, {
  path: '/joint-conference',
  component: Layout,
  redirect: 'noRedirect',
  meta: { title: '联席会议', icon: 'menu-icon-eventAnalysis' },
  children: [{
    path: 'meeting-query',
    name: 'meetingQuery', // /joint-conference/meeting-query
    component: () =>
      import('@/views/jointConference/meetingQuery/index'),
    meta: { title: '联席会议查询', icon: '' },
    children: [{
      path: 'info',
      name: 'infos',
      component: () =>
        import('@/views/jointConference/meetingQuery/infos'),
      meta: { title: '联席会议查询详情', icon: '', menuType: 'details' }
    }]
  }, {
    path: 'my-meeting',
    name: 'myMeeting',
    component: () =>
      import('@/views/jointConference/myMeeting/index'),
    meta: { title: '我的联席会议', icon: '' },
    children: [{
      path: 'info',
      name: 'infos',
      component: () =>
        import('@/views/jointConference/myMeeting/infos'),
      meta: { title: '我的联席会议详情', icon: '', menuType: 'details' }
    }]
  }, {
    path: 'meeting-event',
    name: 'meetingEvent',
    component: () =>
      import('@/views/jointConference/eventQuery/index'),
    meta: { title: '联席事件', icon: '' },
    children: [{
      path: 'info',
      name: 'infos',
      component: () =>
        import('@/views/jointConference/eventQuery/infos'),
      meta: { title: '联席事件查询', icon: '', menuType: 'details' }
    }]
  }]
},
// 监控
{
  path: '/monitor',
  component: Layout,
  hidden: false,
  redirect: '/monitor/inflow',
  meta: { title: '事件监控', icon: 'menu-assess-report' },
  children: [{
    path: 'inflow',
    name: 'monitorInflow',
    component: () =>
      import('@/views/monitor'),
    meta: { title: '事件流入监控', icon: '', keepAlive: false }
  },
  {
    path: 'third-inflow',
    name: 'thirdInflow',
    component: () =>
      import('@/views/monitor'),
    meta: { title: '三方流入监控', icon: '', keepAlive: true }
  },
  {
    path: 'event-access',
    name: 'monitorEventAccess',
    component: () =>
      import('@/views/monitor'),
    meta: { title: '接入监控', icon: '', keepAlive: false }
  },
  {
    path: 'event-access-detail',
    name: 'monitorEventAccessDetail',
    component: () =>
      import('@/views/monitor'),
    meta: { title: '接入监控', icon: '', keepAlive: false }
  },
  {
    path: 'inflow-view',
    name: 'monitorInflowView',
    component: () =>
      import('@/views/monitor'),
    meta: { title: '事件流入监控分析', icon: '', keepAlive: false }
  },
  {
    path: 'out-view',
    name: 'monitorOutView',
    component: () =>
      import('@/views/monitor'),
    meta: { title: '事件流出分析', icon: '' }
  },
  {
    path: 'out-flow',
    name: 'monitorOutflow',
    component: () =>
      import('@/views/monitor'),
    meta: { title: '事件流出监控', icon: '' }
  },
  {
    path: 'event-status',
    name: 'monitorEventStatus',
    component: () =>
      import('@/views/monitor'),
    meta: { title: '事件状态监控', icon: '' }
  }
  ]
},
{
  path: '/overview',
  component: Layout,
  hidden: false,
  meta: { title: '事件概览', icon: '' },
  children: [
    {
      path: 'analysis',
      name: 'analysis',
      hidden: false,
      component: () => import('@/views/overview'),
      meta: { title: '事件概览', icon: '' }
    }
  ]
},
// 全部事件-一键直查
{
  path: '/one-click-search',
  component: Layout,
  hidden: false,
  meta: { title: '一键直查', icon: 'menu-assess-report' },
  children: [
    {
      path: '',
      name: 'oneClickSearch',
      hidden: false,
      component: () =>
        import('@/views/oneClickDirectQuery/oneQueryIndex'),
      meta: { title: '一键直查', icon: '' }
    }
  ]
},
// {
//   path: '/eventcenter-event',
//   component: Layout,
//   hidden: false,
//   meta: { title: '全部事件', icon: '' },
//   children: [
//     {
//       path: 'one-click-search',
//       name: 'oneClickSearch',
//       hidden: false,
//       component: () =>
//         import('@/views/oneClickDirectQuery/oneQueryIndex'),
//       meta: { title: '一键直查', icon: '' }
//     }
//   ]
// },
// 第三方接入
{
  path: '/third-access',
  component: Layout,
  hidden: false,
  meta: { title: '事件接入', icon: '' },
  children: [
    {
      path: 'api-config',
      name: 'apiConfig',
      hidden: false,
      component: () =>
        import('@/views/third-access'),
      meta: { title: '接口配置管理', icon: '' }
    },
    {
      path: 'config',
      name: 'config',
      hidden: false,
      component: () =>
        import('@/views/third-access'),
      meta: { title: '第三方平台配置', icon: '' }
    }
  ]
},

{
  path: '/third-system-manage',
  component: Layout,
  redirect: 'noRedirect',
  meta: { title: '第三方系统管理', icon: '' },
  children: [
    {
      path: 'base-info',
      name: 'BaseInfo',
      component: () =>
        import('@/views/third-system-manage/index.vue'),
      meta: { title: '基本信息管理', icon: '' }
    },
    {
      path: 'request-auth',
      name: 'RequestAuth',
      component: () =>
        import('@/views/third-system-manage/index.vue'),
      meta: { title: '请求鉴权配置', icon: '' }
    },
    {
      path: 'third-interface',
      name: 'ThirdInterface',
      component: () =>
        import('@/views/third-system-manage/index.vue'),
      meta: { title: '三方接口管理', icon: '', keepAlive: true }
    },
    {
      path: 'edit-interface',
      name: 'EditInterface',
      hidden: false,
      component: () =>
        import('@/views/third-system-manage/index.vue'),
      meta: { title: '编辑接口配置', icon: '' }
    },
    {
      path: 'view-interface',
      name: 'ViewInterface',
      hidden: false,
      component: () =>
        import('@/views/third-system-manage/index.vue'),
      meta: { title: '查看接口配置', icon: '' }
    },
    {
      path: 'element-transition',
      name: 'ElementTransition',
      component: () =>
        import('@/views/third-system-manage/index.vue'),
      meta: { title: '要素转换配置', icon: '' }
    },
    {
      path: 'third-type',
      name: 'ThirdType',
      component: () =>
        import('@/views/third-system-manage/index.vue'),
      meta: { title: '三方类型配置', icon: '' }
    }
  ]
},
// 评价配置
{
  path: '/evaluate-config',
  component: Layout,
  hidden: false,
  meta: { title: '评价配置', icon: '' },
  children: [
    {
      path: 'target',
      name: 'Target',
      hidden: false,
      component: () =>
        import('@/views/evaluate-config'),
      meta: { title: '评价指标配置', icon: '' }
    },
    {
      path: 'model',
      name: 'Model',
      hidden: false,
      component: () =>
        import('@/views/evaluate-config'),
      meta: { title: '评价模型配置', icon: '' }
    },
    {
      path: 'edit-model',
      name: 'EditModel',
      hidden: false,
      component: () =>
        import('@/views/evaluate-config'),
      meta: { title: '评价模型配置', icon: '' }
    }
    /* {
      path: 'edit-model',
      name: 'EditModel',
      // hidden: true,
      component: () =>
        import('@/views/evaluate-config/model/editModel'),
      meta: { title: '评价模型配置', icon: '' }
    } */
  ]
}
  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

window?.$wujie?.props?.method?.hackRouter?.(router)

export default router
