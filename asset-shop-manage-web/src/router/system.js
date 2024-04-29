/**
 * @Description: 系统路由
 * @Author: zhangsen
 * @Date: 2021-11-13
 */

/** 重要说明
 * meta 字段下的 isTop 属性是标识多级路由的顶级路由，作用是面包屑回退的控制。
 * meta 字段下的 breadcrumb 属性是标识当前路由的title是否显示在面包屑中。
 * navCode 字段 系统使用动态路由时，为必须字段，便于和用户中心配置的动态路由表进行匹配。
 * hidden 字段 控制是否在左侧路由面版显示
 */

import { layout } from '@l'
import { checkSYSTYPE } from '@/utils'

export const getRouteList = function() {
  let routes = [
    {
      path: '/statistics',
      component: layout,
      navCode: 'statistics',
      meta: { title: '概览', icon: 'statistics', isTop: true },
      children: [{
        hidden: true,
        path: '',
        meta: { title: '概览', breadcrumb: false },
        component: () => import('@/views/statistics')
      }]
    },
    {
      path: '/management',
      component: layout,
      navCode: 'approvalManage',
      redirect: '/management/waiting-audit-list',
      meta: { title: '运营审核', icon: 'public-manage', isTop: true },
      children: [
        {
          path: 'waiting-audit-list',
          navCode: 'approval',
          meta: { title: '编目审核' },
          component: () => import('@/views/management/catalog'),
          children: [
            {
              path: 'detailing',
              meta: { title: '待审核详情' },
              hidden: true,
              component: () => import('@/views/management/catalog/detail.vue')
            },
            {
              path: 'detail',
              meta: { title: '已审核详情' },
              hidden: true,
              component: () => import('@/views/management/catalog/detail.vue')
            }
          ]
        },
        {
          path: 'sub-waiting-list',
          navCode: 'subApproval',
          meta: { title: '资源申请' },
          component: () => import('@/views/management/subscription/'),
          children: [
            {
              path: 'detailing',
              meta: { title: '待审核详情' },
              hidden: true,
              component: () => import('@/views/management/subscription/detail.vue')
            },
            {
              path: 'detail',
              meta: { title: '已审核详情' },
              hidden: true,
              component: () => import('@/views/management/subscription/detail.vue')
            }
          ]
        }

      ]
    },

    {
      path: '/basic-information-management',
      navCode: 'basicInfo',
      component: layout,
      redirect: '/basic-information-management/tags-page',
      meta: { title: '基础信息管理', icon: 'basic-manage', isTop: true },
      children: [{
        path: 'tags-page',
        navCode: 'tagsPage',
        meta: { title: '标签管理' },
        component: () => import('@/views/label-management')
      }, {
        path: 'scene-page',
        navCode: 'scenePage',
        meta: { title: '类型管理' },
        component: () => import('@/views/scene-management')
      }]
    }, {
      path: '/operate-rule',
      navCode: 'operateRule',
      component: layout,
      meta: { title: '运营规则配置', icon: 'operate-rule', isTop: true },
      children: [{
        hidden: true,
        path: '',
        meta: { title: '运营规则配置', breadcrumb: false },
        component: () => import('@/views/operate-rule')
      }]
    }
  ]
  // 非默认模式下（体征/接口模式）不展示运营分析和基础信息
  if (!checkSYSTYPE('default')) {
    routes = routes.filter(r => {
      return r.navCode !== 'statistics' && r.navCode !== 'basicInfo'
    })
  }
  return routes
}
export default getRouteList()
