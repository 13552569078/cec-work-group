import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useIframeUrl } from '@/hooks';
import { Login } from 'fx-front-ucenter';
import Layout from '@/layout/layout.vue';
import EnterpriseList from '@/views/enterprise-management/enterprise-list.vue';
import MajorHazard from '@/views/major-resource-management/major-hazard/list.vue';
import ControlledChemical from '@/views/major-resource-management/controlled-chemical/list.vue';
import MajorTechnology from '@/views/major-resource-management/major-technology/list.vue';
import MonitorList from '@/views/monitor-management/monitor-list.vue';

const { setIframeUrl } = useIframeUrl();
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
      redirect: '/enterprise-management/risk-enterprise'
    }
  },
  {
    path: '/risk-one-picture',
    name: 'RiskOnePicture',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'RiskOnePictureIndex',
        component: () => import('@/views/landing/monitor.vue'),
        meta: {
          systemIcon: 'FillMap',
          title: '安全生产一张图',
          iframeUrl: '/risk-protection-op-web/',
          roles: ['JX-SafeProductionAdmin', 'JX-SmartAdmin'],
        }
      }
    ],
    meta: {
      systemIcon: 'FillMap',
      sort: 0,
      menu: true,
      onlyOne: true,
      title: '安全生产一张图'
    }
  },
  {
    path: '/natural-disasters-one-picture',
    name: 'NaturalDisastersOnePicture',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'NaturalDisastersOnePictureIndex',
        component: () => import('@/views/landing/monitor.vue'),
        meta: {
          systemIcon: 'FillMap',
          title: '自然灾害一张图',
          iframeUrl: '/natural-disasters-op-web/',
          roles: ['JX-ReduceDisasterAdmin', 'JX-SmartAdmin'],
        }
      },
    ],
    meta: {
      systemIcon: 'FillMap',
      sort: 0,
      menu: true,
      onlyOne: true,
      title: '自然灾害一张图'
    }
  },
  {
    path: '/enterprise-management',
    name: 'EnterpriseManagement',
    component: Layout,
    children: [{
      path: 'risk-enterprise',
      name: 'RiskEnterprise',
      component: EnterpriseList,
      meta: {
        title: '危化企业信息',
        roles: ['JX-SafeProductionAdmin', 'JX-ReduceDisasterAdmin', 'JX-SmartAdmin'],
      },
      props: {
        enterpriseType: 'dangerous_chemicals',
      }
    }, {
      path: 'gas-station',
      name: 'GasStation',
      component: EnterpriseList,
      meta: {
        title: '加油站信息',
        roles: ['JX-SafeProductionAdmin', 'JX-ReduceDisasterAdmin', 'JX-SmartAdmin'],
      },
      props: {
        enterpriseType: 'gas_station',
      }
    }, {
      path: 'business-enterprise',
      name: 'BusinessEnterprise',
      component: EnterpriseList,
      meta: {
        title: '工商贸企业信息',
        roles: ['JX-SafeProductionAdmin', 'JX-ReduceDisasterAdmin', 'JX-SmartAdmin'],
      },
      props: {
        enterpriseType: 'industrial_commercial',
      }
    }],
    meta: {
      icon: 'enterprise-icon',
      sort: 0,
      menu: true,
      title: '企业信息管理'
    }
  }, {
    path: '/major-resource-management',
    name: 'MajorResourceManagement',
    component: Layout,
    children: [{
      path: 'major-hazard',
      name: 'MajorHazard',
      component: MajorHazard,
      meta: {
        title: '重大危险源',
        roles: ['JX-SafeProductionAdmin', 'JX-ReduceDisasterAdmin', 'JX-SmartAdmin'],
      },
    }, {
      path: 'controlled-chemical',
      name: 'ControlledChemical',
      component: ControlledChemical,
      meta: {
        title: '重点监管化学品',
        roles: ['JX-SafeProductionAdmin', 'JX-ReduceDisasterAdmin', 'JX-SmartAdmin'],
      }
    }, {
      path: 'major-technology',
      name: 'MajorTechnology',
      component: MajorTechnology,
      meta: {
        title: '重点工艺',
        roles: ['JX-SafeProductionAdmin', 'JX-ReduceDisasterAdmin', 'JX-SmartAdmin'],
      }
    }],
    meta: {
      icon: 'major-icon',
      sort: 0,
      menu: true,
      title: '两重点一重大'
    }
  }, {
    path: '/monitor-management',
    name: 'MonitorManagement',
    component: Layout,
    children: [{
      path: 'monitor-list',
      name: 'MonitorList',
      component: MonitorList,
      meta: {
        title: '企业视频列表',
        roles: ['JX-SafeProductionAdmin', 'JX-SmartAdmin'],
      }
    }],
    meta: {
      icon: 'monitor-icon',
      sort: 0,
      menu: true,
      onlyOne: true,
      title: '企业视频接入管理'
    }
  }, {
    path: '/warning-strategy',
    name: 'WarningStrategy',
    component: Layout,
    children: [
      {
        path: 'risk-type',
        name: 'RiskType',
        component: () => import('@/views/landing/monitor.vue'),
        meta: {
          title: '风险分类管理',
          iframeUrl: setIframeUrl('/pre-warning-center/monitoring-config/event-type?embed=true'),
          appName: 'PreWarningCenter',
          routeParams: { path: '/monitoring-config/event-type' },
          roles: ['JX-SafeProductionAdmin', 'JX-SmartAdmin'],
        }
      },
      {
        path: 'strategy-tpl',
        name: 'StrategyTpl',
        component: () => import('@/views/landing/monitor.vue'),
        meta: {
          title: '预警策略模板',
          iframeUrl: setIframeUrl('/pre-warning-center/monitoring-config/alarm-strategy-tpl?embed=true'),
          appName: 'PreWarningCenter',
          routeParams: { path: '/monitoring-config/alarm-strategy-tpl' },
          roles: ['JX-SafeProductionAdmin', 'JX-SmartAdmin'],
        }
      },
      {
        path: 'strategy-config',
        name: 'StrategyConfig',
        component: () => import('@/views/landing/monitor.vue'),
        meta: {
          title: '预警策略配置',
          iframeUrl: setIframeUrl('/pre-warning-center/monitoring-config/alarm-strategy-config?embed=true'),
          appName: 'PreWarningCenter',
          routeParams: { path: '/monitoring-config/alarm-strategy-config' },
          roles: ['JX-SafeProductionAdmin', 'JX-SmartAdmin'],
        }
      },
    ],
    meta: {
      icon: 'warning-strategy-icon',
      sort: 0,
      menu: true,
      title: '预警策略'
    }
  }, {
    path: '/warning-management',
    name: 'WarningManagement',
    component: Layout,
    children: [
      {
        path: 'realtime-warning',
        name: 'RealtimeWarning',
        component: () => import('@/views/landing/monitor.vue'),
        meta: {
          title: '实时预警',
          iframeUrl: setIframeUrl('/pre-warning-center/monitoring-warning/warning-management/realtime-warning?embed=true'),
          appName: 'PreWarningCenter',
          routeParams: { path: '/monitoring-warning/warning-management/realtime-warning' },
          roles: ['JX-SafeProductionAdmin', 'JX-SmartAdmin'],
        }
      },
      {
        path: 'historical-warning',
        name: 'HistoricalWarning',
        component: () => import('@/views/landing/monitor.vue'),
        meta: {
          title: '历史预警',
          iframeUrl: setIframeUrl('/pre-warning-center/monitoring-warning/warning-management/historical-warning?embed=true'),
          appName: 'PreWarningCenter',
          routeParams: { path: '/monitoring-warning/warning-management/historical-warning' },
          roles: ['JX-SafeProductionAdmin', 'JX-SmartAdmin'],
        }
      },
      {
        path: 'warning-judgment',
        name: 'WarningJudgment',
        component: () => import('@/views/landing/monitor.vue'),
        meta: {
          title: '预警研判',
          iframeUrl: setIframeUrl('/pre-warning-center/monitoring-warning/warning-management/warning-judgment?embed=true'),
          appName: 'PreWarningCenter',
          routeParams: { path: '/monitoring-warning/warning-management/warning-judgment' },
          roles: ['JX-SafeProductionAdmin', 'JX-SmartAdmin'],
        }
      },
      {
        path: 'warning-notice',
        name: 'WarningNotice',
        component: () => import('@/views/landing/monitor.vue'),
        meta: {
          title: '预警通知',
          iframeUrl: setIframeUrl('/pre-warning-center/monitoring-warning/warning-management/warning-notice?embed=true'),
          appName: 'PreWarningCenter',
          routeParams: { path: '/monitoring-warning/warning-management/warning-notice' },
          roles: ['JX-SafeProductionAdmin', 'JX-SmartAdmin'],
        }
      }
    ],
    meta: {
      icon: 'warning-management-icon',
      sort: 0,
      menu: true,
      title: '预警管理'
    }
  }, {
    path: '/monitoring-elements',
    name: 'MonitoringElements',
    component: Layout,
    children: [
      {
        path: 'subject',
        name: 'MonitoringSubject',
        component: () => import('@/views/landing/monitor.vue'),
        meta: {
          title: '监测主体管理',
          iframeUrl: setIframeUrl('/pre-warning-center/monitoring-elements/subject?embed=true'),
          appName: 'PreWarningCenter',
          routeParams: { path: '/monitoring-elements/subject' },
          roles: ['JX-SafeProductionAdmin', 'JX-SmartAdmin'],
        }
      },
      {
        path: 'point',
        name: 'MonitoringPoint',
        component: () => import('@/views/landing/monitor.vue'),
        meta: {
          title: '监测点管理',
          iframeUrl: setIframeUrl('/pre-warning-center/monitoring-elements/point?embed=true'),
          appName: 'PreWarningCenter',
          routeParams: { path: '/monitoring-elements/point' },
          roles: ['JX-SafeProductionAdmin', 'JX-SmartAdmin'],
        }
      },
      {
        path: 'equipment',
        name: 'MonitoringEquipment',
        component: () => import('@/views/landing/monitor.vue'),
        meta: {
          title: '监测设备管理',
          iframeUrl: setIframeUrl('/pre-warning-center/monitoring-elements/equipment?embed=true'),
          appName: 'PreWarningCenter',
          routeParams: { path: '/monitoring-elements/equipment' },
          roles: ['JX-SafeProductionAdmin', 'JX-SmartAdmin'],
        }
      }
    ],
    meta: {
      icon: 'monitoring-elements-icon',
      sort: 0,
      menu: true,
      title: '监测布控'
    }
  },
  {
    path: '/disaster-bearing-body-management',
    name: 'DisasterBearingBodyManagement',
    component: Layout,
    children: [
      {
        path: 'management-of-public-cultural-places',
        name: 'ManagementOfPublicCulturalPlaces',
        component: () => import('@/views/basic-information/management-of-public-cultural-places/index.vue'),
        meta: {
          title: '公共文化场所管理',
          roles: ['JX-ReduceDisasterAdmin', 'JX-SmartAdmin'],
        },
      },
      {
        path: 'star-rated-hotel',
        name: 'StarRatedHotel',
        component: () => import('@/views/basic-information/star-rated-hotel/index.vue'),
        meta: {
          title: '星级酒店管理',
          roles: ['JX-ReduceDisasterAdmin', 'JX-SmartAdmin'],
        },
      },
      {
        path: 'large-shopping-malls',
        name: 'LargeShoppingMalls',
        component: () => import('@/views/basic-information/large-shopping-malls/index.vue'),
        meta: {
          title: '大型商场管理',
          roles: ['JX-ReduceDisasterAdmin', 'JX-SmartAdmin'],
        },
      },
      {
        path: 'social-welfare-institutions',
        name: 'SocialWelfareInstitutions',
        component: () => import('@/views/basic-information/social-welfare-institutions/index.vue'),
        meta: {
          title: '社会福利机构管理',
          roles: ['JX-ReduceDisasterAdmin', 'JX-SmartAdmin'],
        },
      },
      {
        path: 'stadium',
        name: 'Stadium',
        component: () => import('@/views/basic-information/stadium/index.vue'),
        meta: {
          title: '体育场馆管理',
          roles: ['JX-ReduceDisasterAdmin', 'JX-SmartAdmin'],
        },
      },
      {
        path: 'chemical-park',
        name: 'ChemicalPark',
        component: () => import('@/views/basic-information/chemical-park/index.vue'),
        meta: {
          title: '化工园区管理',
          roles: ['JX-ReduceDisasterAdmin', 'JX-SmartAdmin'],
        },
      },
      {
        path: 'protectSchool',
        name: 'ProtectSchool',
        component: () => import('@/views/landing/monitor.vue'),
        meta: {
          title: '学校管理',
          iframeUrl: setIframeUrl('/resource-management-web/resource-center/protection-target?onlyTab=protectSchool'),
          appName: 'ResourceManagement',
          routeParams: { path: '/resource-center/protection-target', query: { onlyTab: 'protectSchool' } },
          roles: ['JX-ReduceDisasterAdmin', 'JX-SmartAdmin'],
        },
      },
      {
        path: 'protectMedicalInstitution',
        name: 'ProtectMedicalInstitution',
        component: () => import('@/views/landing/monitor.vue'),
        meta: {
          title: '医疗机构管理',
          iframeUrl: setIframeUrl('/resource-management-web/resource-center/protection-target?onlyTab=protectMedicalInstitution'),
          appName: 'ResourceManagement',
          routeParams: { path: '/resource-center/protection-target', query: { onlyTab: 'protectMedicalInstitution' } },
          roles: ['JX-ReduceDisasterAdmin', 'JX-SmartAdmin'],
        },
      },
    ],
    meta: {
      icon: 'bearing-body-icon',
      sort: 0,
      menu: true,
      title: '承灾体管理'
    }
  },
  {
    path: '/disaster-reduction-capability-management',
    name: 'DisasterReductionCapabilityManagement',
    component: Layout,
    children: [
      {
        path: 'township-disaster-reduction-capacity',
        name: 'TownshipDisasterReductionCapacity',
        component: () => import('@/views/basic-information/township-disaster-reduction-capacity/index.vue'),
        meta: {
          title: '乡镇减灾能力',
          roles: ['JX-ReduceDisasterAdmin', 'JX-SmartAdmin'],
        },
      },
      {
        path: 'community-disaster-reduction-capacity',
        name: 'CommunityDisasterReductionCapacity',
        component: () => import('@/views/basic-information/community-disaster-reduction-capacity/index.vue'),
        meta: {
          title: '社区(行政村)减灾能力',
          roles: ['JX-ReduceDisasterAdmin', 'JX-SmartAdmin'],
        },
      },
      {
        path: 'org-disaster-reduction-capacity',
        name: 'OrgDisasterReductionCapacity',
        component: () => import('@/views/basic-information/org-disaster-reduction-capacity/index.vue'),
        meta: {
          title: '社会组织减灾能力',
          roles: ['JX-ReduceDisasterAdmin', 'JX-SmartAdmin'],
        },
      },
      {
        path: 'county-basic-index-stat',
        name: 'CountyBasicIndexStat',
        component: () => import('@/views/basic-information/county-basic-index-stat/index.vue'),
        meta: {
          title: '县域基础指标统计',
          roles: ['JX-ReduceDisasterAdmin', 'JX-SmartAdmin'],
        },
      },
      {
        path: 'township-basic-index-stat',
        name: 'TownshipBasicIndexStat',
        component: () => import('@/views/basic-information/township-basic-index-stat/index.vue'),
        meta: {
          title: '乡镇基础指标统计',
          roles: ['JX-ReduceDisasterAdmin', 'JX-SmartAdmin'],
        },
      },
      {
        path: 'gov-disaster-mgmt-capacity',
        name: 'GovDisasterMgmtCapacity',
        component: () => import('@/views/basic-information/gov-disaster-mgmt-capacity/index.vue'),
        meta: {
          title: '政府灾害管理能力',
          roles: ['JX-ReduceDisasterAdmin', 'JX-SmartAdmin'],
        },
      },
      {
        path: 'equipmentWarehouse',
        name: 'EquipmentWarehouse',
        component: () => import('@/views/landing/monitor.vue'),
        meta: {
          title: '救灾物资储备库',
          iframeUrl: setIframeUrl('/resource-management-web/resource-center/emergency-resource'),
          appName: 'ResourceManagement',
          routeParams: { path: '/resource-center/emergency-resource', query: { onlyTab: 'equipmentWarehouse' } },
          roles: ['JX-ReduceDisasterAdmin', 'JX-SmartAdmin'],
        },
      },
      {
        path: 'riskRefuge',
        name: 'RiskRefuge',
        component: () => import('@/views/landing/monitor.vue'),
        meta: {
          title: '应急避难场所',
          iframeUrl: setIframeUrl('/resource-management-web/resource-center/emergency-resource'),
          appName: 'ResourceManagement',
          routeParams: { path: '/resource-center/emergency-resource', query: { onlyTab: 'riskRefuge' } },
          roles: ['JX-ReduceDisasterAdmin', 'JX-SmartAdmin'],
        },
      },
      {
        path: 'rescueTeam',
        name: 'RescueTeam',
        component: () => import('@/views/landing/monitor.vue'),
        meta: {
          title: '救援队伍',
          iframeUrl: setIframeUrl('/resource-management-web/resource-center/emergency-resource'),
          appName: 'ResourceManagement',
          routeParams: { path: '/resource-center/emergency-resource', query: { onlyTab: 'rescueTeam' } },
          roles: ['JX-ReduceDisasterAdmin', 'JX-SmartAdmin'],
        },
      },
    ],
    meta: {
      icon: 'disaster-reduction-icon',
      sort: 0,
      menu: true,
      title: '减灾能力管理'
    }
  },
  {
    path: '/historical-disaster-management',
    name: 'HistoricalDisasterManagement',
    component: Layout,
    children: [{
      path: 'index',
      name: 'HistoricalDisasterManagementIndex',
      component: () => import('@/views/basic-information/historical-disaster-management/index.vue'),
      meta: {
        title: '历史灾情管理',
        roles: ['JX-ReduceDisasterAdmin', 'JX-SmartAdmin'],
      }
    }],
    meta: {
      icon: 'historical-disaster-icon',
      sort: 0,
      menu: true,
      onlyOne: true,
      title: '历史灾情管理'
    }
  },
  {
    path: '/river-information-management',
    name: 'RiverInformationManagement',
    component: Layout,
    children: [{
      path: 'index',
      name: 'RiverInformationManagementIndex',
      component: () => import('@/views/basic-information/river-information-management/index.vue'),
      meta: {
        title: '河流信息管理',
        roles: ['JX-ReduceDisasterAdmin', 'JX-SmartAdmin'],
      }
    }],
    meta: {
      icon: 'river-icon',
      sort: 0,
      menu: true,
      onlyOne: true,
      title: '河流信息管理'
    }
  },
  {
    path: '/gate-station-information-management',
    name: 'GateStationInformationManagement',
    component: Layout,
    children: [{
      path: 'index',
      name: 'GateStationInformationManagementIndex',
      component: () => import('@/views/basic-information/gate-station-information-management/index.vue'),
      meta: {
        title: '闸站信息管理',
        roles: ['JX-ReduceDisasterAdmin', 'JX-SmartAdmin'],
      }
    }],
    meta: {
      icon: 'gate-station-icon',
      sort: 0,
      menu: true,
      onlyOne: true,
      title: '闸站信息管理'
    }
  },
  {
    path: '/risk-water-logged-place-management',
    name: 'RiskWaterloggedPlaceMgmt',
    component: Layout,
    children: [{
      path: 'index',
      name: 'RiskWaterloggedPlaceMgmtIndex',
      component: () => import('@/views/landing/monitor.vue'),
      meta: {
        title: '易涝点信息管理',
        roles: ['JX-ReduceDisasterAdmin', 'JX-SmartAdmin'],
        iframeUrl: setIframeUrl('/resource-management-web/resource-center/risk-hidden-danger'),
        appName: 'ResourceManagement',
        routeParams: { path: '/resource-center/risk-hidden-danger', query: { onlyTab: 'riskWaterloggedPlace' } },
      },
    }],
    meta: {
      icon: 'gate-station-icon',
      sort: 0,
      menu: true,
      onlyOne: true,
      title: '易涝点信息管理'
    }
  }
];

const router = createRouter({
  history: createWebHistory(`/${process.env.PROD_PREFIX}`),
  routes,
});

export default router;
