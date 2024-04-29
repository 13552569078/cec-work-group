import {
  layout
} from '@l'

import MediumLayout from '@/layout/medium-layout.vue'
export default [

  {
    path: '/home',
    navCode: 'home',
    meta: {
      title: '概览',
      icon: 'index-home',
      isTop: true
    },
    component: layout,
    children: [{
      hidden: true,
      path: '',
      meta: {
        title: '概览',
        breadcrumb: false
      },
      component: () => import('@/views/home/home')
    }]
  },
  {
    path: '/application-management',
    navCode: 'applicationManagement',
    meta: {
      title: '场景应用管理',
      icon: 'application-management',
      isTop: true
    },
    component: layout,
    children: [{
      hidden: true,
      path: '',
      meta: {
        title: '场景应用管理',
        breadcrumb: false
      },
      component: () => import('@/views/application-management/index'),
      children: [{
        path: '/application-detail',
        hidden: true,
        meta: {
          title: '应用详情'
        },
        component: () => import('@/views/application-management/detail'),
        children: [{
          path: 'add-flow',
          hidden: true,
          meta: {
            title: '业务流程'
          },
          component: () => import('@/views/application-management/components/add-flow')
        },

        {
          path: 'add-mode',
          hidden: true,
          meta: {
            title: '模型资源'
          },
          component: () => import('@/views/application-management/components/add-mode')
        },
        {
          path: 'add-ti',
          hidden: true,
          meta: {
            title: '体征资源'
          },
          component: () => import('@/views/application-management/components/add-ti')
        },
        {
          path: 'add-data',
          hidden: true,
          meta: {
            title: '数据资源'
          },
          component: () => import('@/views/application-management/components/add-data')
        },
        {
          path: 'add-interface',
          hidden: true,
          meta: {
            title: '接口'
          },
          component: () => import('@/views/application-management/components/add-interface')
        },

        {
          path: 'add-kpi',
          hidden: true,
          meta: {
            title: '指标资源'
          },
          component: () => import('@/views/application-management/components/add-kpi')
        },

        {
          path: 'add-object',
          hidden: true,
          meta: {
            title: '对象资源'
          },
          component: () => import('@/views/application-management/components/add-object')
        },

        {
          path: 'add-script',
          hidden: true,
          meta: {
            title: '脚本'
          },
          component: () => import('@/views/application-management/components/add-script')
        },

        {
          path: 'add-page',
          hidden: true,
          meta: {
            title: '页面'
          },
          component: () => import('@/views/application-management/components/add-page')
        }]
      },
      {
        path: '/select-assets',
        hidden: true,
        meta: {
          title: '选择资源'
        },
        component: () => import('@/views/application-management/select-assets')
      }

      ]
    }]
  },

  {
    path: '/asset-management',
    navCode: 'assetManagement',
    component: layout,
    meta: {
      title: '组件资源开发',
      icon: 'asset-show',
      isTop: true
    },
    children: [
      {
        path: 'flow-asset',
        navCode: 'flowAsset',
        meta: { title: '流程资源' },
        component: () => import('@/views/asset-management/flow-asset'),
        children: [{
          path: 'add',
          meta: { title: '业务流程' },
          hidden: true,
          component: () => import('@/views/asset-management/flow-asset/components/edit')
        }]
      },

      {
        path: 'object-asset',
        navCode: 'objectAsset',
        meta: { title: '对象资源' },
        component: () => import('@/views/asset-management/object-asset'),
        children: [{
          path: 'addEntry',
          meta: { title: '实体对象' },
          hidden: true,
          component: () => import('@/views/asset-management/object-asset/add')
        }]
      },
      {
        path: '/asset-management/statistics-asset',
        meta: {
          title: '数据资源'
        },
        component: () => import('@/views/asset-management/statistics-asset'),
        children: [
          {
            path: 'ti-asset/add',
            meta: {
              title: '体征'
            },
            hidden: true,
            component: () => import('@/views/asset-management/statistics-asset/ti-asset/')
          },
          {
            path: '/asset-management/statistics-asset/kpi-asset/edit',
            meta: {
              title: '指标'
            },
            hidden: true,
            component: () => import('@/views/asset-management/statistics-asset/webview')
          },
          {
            path: 'data-asset/add',
            meta: {
              title: '数据'
            },
            hidden: true,
            component: () => import('@/views/asset-management/statistics-asset/data-asset/add')
          },
          {
            path: 'kpi-asset/add',
            meta: {
              title: '指标'
            },
            hidden: true,
            component: () => import('@/views/asset-management/statistics-asset/kpi-asset/')
          },
          {
            path: '/asset-management/statistics-asset/data-asset/task-add',
            meta: {
              title: '数据'
            },
            hidden: true,
            component: () => import('@/views/asset-management/statistics-asset/webview')
          }
        ]
      },
      {
        path: '/asset-management/technology-asset',
        navCode: 'technologyAsset',
        meta: { title: '技术资源' },
        component: () => import('@/views/asset-management/technology-asset'),
        children: [{
          path: '/asset-management/technology-asset/page-asset',
          meta: {
            title: '页面'
          },
          hidden: true,
          component: () => import('@/views/asset-management/technology-asset/page-asset')
        }, {
          path: '/asset-management/technology-asset/interface-asset',
          meta: {
            title: '接口'
          },
          hidden: true,
          component: () => import('@/views/asset-management/technology-asset/interface-asset')
        }, {
          path: '/asset-management/technology-asset/script-asset',
          meta: { title: '脚本' },
          hidden: true,
          component: () => import('@/views/asset-management/technology-asset/script-asset')
        }
        ]
      },
      {
        path: '/asset-management/mode-asset',
        navCode: 'modelAsset',
        meta: {
          title: '模型资源'
        },
        component: () => import('@/views/asset-management/mode-asset'),
        children: [
          {
            path: '/asset-management/mode-asset/mode-asset',
            component: () => import('@/views/asset-management/mode-asset/mode-asset'),
            hidden: true,
            meta: {
              title: '模型'
            }
          }
        ]
      },
      {
        path: '/asset-management/monitor-asset',
        meta: {
          title: '监测资源'
        },
        hidden: true,
        component: () => import('@/views/asset-management/monitor-asset'),
        children: [{
          path: '/asset-management/monitor-asset/model-asset',
          meta: {
            title: '监测模型'
          },
          hidden: true,
          component: () => import('@/views/asset-management/statistics-asset/webview')
        }, {
          path: '/asset-management/monitor-asset/strategy-asset',
          meta: {
            title: '监测策略'
          },
          hidden: true,
          component: () => import('@/views/asset-management/statistics-asset/webview')
        },
        {
          path: '/asset-management/monitor-asset/control-asset',
          component: () => import('@/views/asset-management/statistics-asset/webview'),
          hidden: true,
          meta: {
            title: '监测布控'
          }
        }
        ]
      }
    ]
  },
  {
    path: '/common-asset',
    navCode: 'commonAsset',
    meta: {
      title: '公共资源库',
      icon: 'common-asset',
      isTop: true
    },
    component: layout,
    children: [{
      hidden: true,
      path: '',
      meta: { title: '公共资源库', breadcrumb: false },
      component: () => import('@/views/common-asset')
    }, {
      hidden: true,
      navCode: '',
      path: 'detail',
      meta: { title: '详情' },
      component: () => import('@/views/common-asset/detail.vue')
    }]
  },
  {
    path: '/download-management',
    navCode: 'downloadManagement',
    meta: {
      title: '我的下载',
      icon: 'download-management',
      isTop: true
    },
    component: layout,
    children: [{
      navCode: 'assetDownload',
      path: 'asset-download',
      meta: { title: '资源' },
      component: () => import('@/views/download-management/my-download')
    }, {
      navCode: 'appDownload',
      path: 'app-download',
      meta: { title: '应用' },
      component: () => import('@/views/download-management/my-download/app-download')
    }]
  },
  {
    path: '/subscription-management',
    navCode: 'assetSubscription',
    meta: {
      title: '我的订阅',
      icon: 'subscription-management',
      isTop: true
    },
    component: layout,
    redirect: '/subscription-management/asset-subscription',
    children: [{
      hidden: true,
      path: 'asset-subscription',
      meta: {
        title: '我的订阅',
        breadcrumb: false
      },
      component: () => import('@/views/subscription-management/index')
    }]
  },
  {
    path: '/sceneManagement',
    navCode: 'sceneManagement',
    meta: {
      title: '场景管理',
      icon: 'shop-web',
      isTop: true
    },
    component: layout,
    children: [{
      hidden: true,
      path: '',
      meta: {
        title: '场景管理',
        breadcrumb: false
      },
      component: () => import('@/views/scene-management/index')
    }]
  },
  {
    path: '/shopWeb',
    navCode: 'serverHome',
    meta: {
      title: '数字资源服务门户',
      icon: 'shop-web',
      isTop: true,
      type: 'shopWeb',
      openA: true
    }
  },
  {
    path: '/asset-list',
    meta: {
      title: '资源目录',
      icon: 'asset-list'
    },
    hidden: true,
    component: MediumLayout,
    children: [{
      path: '',
      meta: {
        title: '资源目录'
      },
      component: () => import('@/views/application-management/asset-list/index')
    }]
  }
]
