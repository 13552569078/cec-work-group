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

import MediumLayout from '@/components/layout/medium-layout'
import { ASSET_TITLE } from '@/utils/enum'
import { checkSYSTYPE } from '@/utils'
import { getToken } from '@l/utils/auth'

export const getRouteList = function() {
  const isLogin = !!getToken()
  return [
    // {
    //   hidden: (!checkSYSTYPE('default') || !isLogin),
    //   path: '/statistics',
    //   component: MediumLayout,
    //   navCode: 'statistics',
    //   meta: { title: '概览', icon: 'statistics', isTop: true },
    //   children: [{
    //     hidden: true,
    //     path: '',
    //     meta: { title: '概览', breadcrumb: false },
    //     component: () => import('@/views/statistics')
    //   }]
    // },
    // {
    //   hidden: !checkSYSTYPE('default'),
    //   path: '/home',
    //   component: MediumLayout,
    //   meta: { title: ASSET_TITLE },
    //   children: [{
    //     hidden: true,
    //     path: '',
    //     meta: { title: '首页' },
    //     component: () => import('@/views/home')
    //   }, {
    //     hidden: true,
    //     path: 'detail',
    //     meta: { title: '资源详情' },
    //     component: () => import('@/views/home/detail')
    //   }, {
    //     hidden: true,
    //     path: 'snapshoot',
    //     meta: { title: '资源快照' },
    //     component: () => import('@/views/home/detail')
    //   }]
    // },
    {
      hidden: !checkSYSTYPE('default'),
      path: '/templateApp',
      component: MediumLayout,
      // meta: { title: '应用资源' },
      meta: { title: '数字资源' },
      children: [{
        hidden: true,
        path: '',
        meta: { title: '首页' },
        component: () => import('@/views/template-app')
      }, {
        hidden: true,
        path: 'detail',
        meta: { title: '应用详情' },
        component: () => import('@/views/home/detail-app')
      }, {
        hidden: true,
        path: 'snapshoot',
        meta: { title: '应用快照' },
        component: () => import('@/views/home/detail-app')
      }]
    }, {
      hidden: !checkSYSTYPE('tizheng'),
      path: '/templateTZ',
      component: MediumLayout,
      meta: { title: '体征资源' },
      children: [{
        hidden: true,
        path: '',
        meta: { title: '首页' },
        component: () => import('@/views/template-tizheng')
      }, {
        hidden: true,
        path: 'detail',
        meta: { title: '资源详情' },
        component: () => import('@/views/template-tizheng/detail')
      }, {
        hidden: true,
        path: 'snapshoot',
        meta: { title: '资源快照' },
        component: () => import('@/views/template-tizheng/detail')
      }]
    }, {
      hidden: !checkSYSTYPE('jiekou'),
      path: '/templateInt',
      component: MediumLayout,
      meta: { title: '接口资源' },
      children: [{
        hidden: true,
        path: '',
        meta: { title: '首页' },
        component: () => import('@/views/template-int')
      }, {
        hidden: true,
        path: 'detail',
        meta: { title: '资源详情' },
        component: () => import('@/views/template-int/detail')
      }, {
        hidden: true,
        path: 'snapshoot',
        meta: { title: '资源快照' },
        component: () => import('@/views/template-int/detail')
      }]
    }, {
      hidden: !checkSYSTYPE('tizheng'),
      path: '',
      component: null,
      meta: { title: '体征引擎', base: 'signEngineUrl' }
    }, {
      hidden: !checkSYSTYPE('tizheng'),
      path: '',
      component: null,
      meta: { title: '体征中屏', base: 'signMidScreenUrl' }
    }, {
      hidden: (!checkSYSTYPE('default') || !isLogin),
      path: '/packManage',
      navCode: 'packManage',
      component: MediumLayout,
      meta: { title: '资源编目' },
      redirect: '/packManage/home',
      children: [{
        path: '/packManage/home',
        meta: { title: '组件编目' },
        component: () => import('@/views/pack-manage/home')
      }, {
        path: '/packManage/asset',
        meta: { title: '组件编目' },
        component: () => import('@/views/pack-manage'),
        children: [{
          hidden: true,
          path: 'config/:shopCode?',
          meta: { title: '上架版本' },
          component: () => import('@/views/pack-manage/config')
        }]
      }, {
        path: '/packManage/app',
        meta: { title: '资源编目' },
        component: () => import('@/views/pack-manage-app'),
        children: [{
          hidden: true,
          path: 'config/:shopCode?',
          meta: { title: '应用上架' },
          component: () => import('@/views/pack-manage-app/config')
        }]
      }, {
        path: '/packManage/api',
        meta: { title: '接口组件编目' },
        component: () => import('@/views/pack-manage-api'),
        children: [{
          hidden: true,
          path: 'config/:shopCode?',
          meta: { title: '' },
          component: () => import('@/views/pack-manage-api/config')
        }, {
          hidden: true,
          path: 'supportAppConfig/:shopCode?',
          meta: { title: '' },
          component: () => import('@/views/pack-manage-api/config')
        }]
      }]
    }, {
      hidden: !isLogin,
      path: '',
      navCode: 'shopManage',
      component: null,
      meta: { title: '运营中心', base: 'assetShopManageUrl' }
    }, {
      hidden: true,
      path: '/mine',
      navCode: 'mine',
      component: MediumLayout,
      meta: { title: '我的' },
      children: [{
        navCode: 'myApply',
        path: '/myApply',
        redirect: '/myApply/asset',
        component: () => import('@/views/my-apply'),
        meta: { title: '我的申请', tab: '/mine' },
        children: [
        //   {
        //   path: 'asset',
        //   navCode: 'myApplyAsset',
        //   meta: { title: '组件申请', key: 'asset' },
        //   component: () => import('@/views/my-apply/index-asset'),
        //   children: [{
        //     hidden: true,
        //     path: '/myApply/assetDetail',
        //     meta: { title: '详情' },
        //     component: () => import('@/views/my-apply/detail-asset')
        //   }]
        // },
        {
          hidden: !checkSYSTYPE('default'),
          path: 'app',
          navCode: 'myApplyApp',
          meta: { title: '数字资源', key: 'app' },
          component: () => import('@/views/my-apply/index-app'),
          children: [{
            hidden: true,
            path: '/myApply/appDetail',
            meta: { title: '详情' },
            component: () => import('@/views/my-apply/detail-app')
          }]
        }]
      }, {
        hidden: !checkSYSTYPE('default'),
        path: '/myApproval',
        navCode: 'myApproval',
        redirect: '/myApproval/wating',
        meta: { title: '我的审核', tab: '/mine' },
        component: () => import('@/views/my-approval'),
        children: [{
          path: 'wating',
          navCode: 'myApprovalWaiting',
          meta: { title: '待审核', key: 'approvaling' },
          component: () => import('@/views/my-approval/index-approvaling'),
          children: [{
            hidden: true,
            path: 'assetDetail',
            meta: { title: '详情' },
            component: () => import('@/views/my-approval/detail-asset')
          }, {
            hidden: true,
            path: 'appDetail',
            meta: { title: '详情' },
            component: () => import('@/views/my-approval/detail-app')
          }]
        }, {
          path: 'appprovaled',
          navCode: 'myApprovalEnd',
          meta: { title: '已审核', key: 'approvaled' },
          component: () => import('@/views/my-approval/index-appprovaled'),
          children: [{
            hidden: true,
            path: 'assetDetail',
            meta: { title: '详情' },
            component: () => import('@/views/my-approval/detail-asset')
          }, {
            hidden: true,
            path: 'appDetail',
            meta: { title: '详情' },
            component: () => import('@/views/my-approval/detail-app')
          }]
        }]
      }, {
        hidden: !checkSYSTYPE('default'),
        path: '/myPublic',
        navCode: 'myPublic',
        redirect: '/myPublic/asset',
        meta: { title: '我的上架', tab: '/mine' },
        component: () => import('@/views/my-public/index'),
        children: [
        //   {
        //   path: 'asset',
        //   navCode: 'myPublicAsset',
        //   meta: { title: ASSET_TITLE, key: 'asset' },
        //   component: () => import('@/views/my-public/index-asset'),
        //   children: [{
        //     hidden: true,
        //     path: 'detail',
        //     meta: { title: '详情' },
        //     component: () => import('@/views/my-public/detail-asset')
        //   }]
        // },
        {
          path: 'app',
          navCode: 'myPublicApp',
          meta: { title: '数字资源', key: 'app' },
          component: () => import('@/views/my-public/index-app'),
          children: [{
            hidden: true,
            path: 'detail',
            meta: { title: '详情' },
            component: () => import('@/views/my-public/detail-app')
          }]
        }]
      }, {
        hidden: !checkSYSTYPE('default'),
        path: '/myAppraise',
        navCode: 'myAppraise',
        redirect: '/myAppraise/others',
        meta: { title: '我的评价', tab: '/mine' },
        component: () => import('@/views/my-appraise/index'),
        children: [{
          path: 'others',
          meta: { title: '给他人的评价' },
          component: () => import('@/views/my-appraise/index-others'),
          children: [{
            hidden: true,
            path: 'assetDetail',
            meta: { title: '详情' },
            component: () => import('@/views/my-appraise/detail')
          }, {
            hidden: true,
            path: 'form',
            meta: { title: '评价' },
            component: () => import('@/views/my-appraise/form-appraise')
          }, {
            hidden: true,
            path: 'detail',
            meta: { title: '评价详情' },
            component: () => import('@/views/my-appraise/detail-appraise')
          }]
        }, {
          path: 'received',
          meta: { title: '我收到的评价' },
          component: () => import('@/views/my-appraise/index-received'),
          children: [{
            hidden: true,
            path: 'detail',
            meta: { title: '评价详情' },
            component: () => import('@/views/my-appraise/detail-appraise')
          }]
        }]
      }]
    }]
}

export default getRouteList()

