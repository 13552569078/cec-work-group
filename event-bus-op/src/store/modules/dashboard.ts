/* eslint-disable global-require */
// initial state
// shape: [{ id, quantity }]
import { ActionTree, MutationTree } from 'vuex';
import type { RootState } from '../types';

interface MapConfig {
  curToolList: { [x: string]: any }[],
  mapType?: string
}

interface Dashborad {
  curMenuBtnIndex: number,
  curNavIndex: number,
  curSubNavIndex: number,
  curMapType?: string,
  curBaseInfo: { [x: string]: any },
  user: { [x: string]: any },
  backgroundMapInfo: MapConfig,
  opencloseMapStatus: boolean,
  opencloseMapPosition: boolean,
  rightLegendPosition: boolean,
  isShowLayer: boolean
}
const dashboard: Dashborad = {
  // 当前menu索引
  curMenuBtnIndex: 0,
  // 当前一级导航索引
  curNavIndex: 0,
  // 当前二级导航索引
  curSubNavIndex: 0,
  // 当前底图地图类型  egis  echarts
  curMapType: 'egis',
  // 当前用户基础信息
  curBaseInfo: {
    azToken: '',
    zjToken: '',
    jcToken: '',
    userLevel: ''
  },
  user: {
    // photo: require("~@/assets/images/baseInfo/user36.png"),
    // photoSmall: require("~@/assets/images/baseInfo/user32.png"),
    userName: '',
    orgName: '',
  },
  // 调用地图的方法
  backgroundMapInfo: {
    curToolList: [],
    mapType: 'egis'
  },
  // 地图一键收起/一键展开 按钮状态
  opencloseMapStatus: true,
  // 地图一键收起/一键展开 按钮位置
  opencloseMapPosition: true, // "7.2rem"
  // 右侧图例位置
  rightLegendPosition: true,
  // 是否显示图层
  isShowLayer: true,
  // 图层选择状态值
};

// actions
const actions: ActionTree<Dashborad, RootState> = {};

// mutations
const mutations: MutationTree<Dashborad> = {
  setUser(state, user) {
    state.user = user;
  },
  setNavIndex(state, navIndex) {
    state.curNavIndex = navIndex;
  },
  setSubNavIndex(state, subNavIndex) {
    state.curSubNavIndex = subNavIndex;
  },
  setMapConfig(state, mapConfig) {
    state.backgroundMapInfo.curToolList = mapConfig;
  },
  setOpencloseMapStatus(state, opencloseMapStatus) {
    state.opencloseMapStatus = opencloseMapStatus;
  },
  setOpencloseMapPosition(state, opencloseMapPosition) {
    state.opencloseMapPosition = opencloseMapPosition;
  },
  setRightLegendPosition(state, rightLegendPosition) {
    state.rightLegendPosition = rightLegendPosition;
  },
  setIsShowLayer(state, isShow) {
    state.isShowLayer = isShow;
  }
};

export default {
  namespaced: true,
  state: dashboard,
  actions,
  mutations
};
