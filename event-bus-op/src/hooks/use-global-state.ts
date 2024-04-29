import { ref, reactive, watch } from 'vue';
import { Indexable } from 'fx-front-utils';
import * as eventSearch from './use-global-state-modules/event-search';
import {
  GlobalAPI,
  MAP_HEAT,
  MAP_POINT,
  MAP_AGGRE,
  DEFAULT_SET_TIME,
  getQuarterAndMonthTime,
  RESOURCE_TYPE as RESOURCE
} from '@/common';

import {
  ALL,
  WAITING,
  PENDING,
  FINISHED,
  SHOW_CAMERA,
  SELF_HANDLE
} from '@/views/event-center/constant';

const userInfo = reactive({
  id: '',
  username: ''
})

const setUserInfo = ({ id, username }: { id: string, username: string }) => {
  userInfo.id = id;
  userInfo.username = username
}

// 工具栏状态
const isGlobalSearchOpen = ref(true);
const isToolBoxOpen = ref(false);

const isFooterEventListOpen = ref(true);

const toggleGlobalSearchBox = () => {
  isGlobalSearchOpen.value = !isGlobalSearchOpen.value;
  console.log(isGlobalSearchOpen.value)
}

const toggleToolBox = () => {
  isToolBoxOpen.value = !isToolBoxOpen.value;
}


// 初始化搜索时间,默认为当年当月
const initTime = getQuarterAndMonthTime(DEFAULT_SET_TIME)

// 事件详情 显示/隐藏开关
const eventDetailVisible = ref(false);
// 自处置事件详情 显示/隐藏开关
const eventSelfHandleDetailVisible = ref(false);
// 视频窗口 显示/隐藏开关
const cameraVisible = ref(false);
// 缓冲区 显示/隐藏开关
const bufferPanelVisible = ref(false);
// 异常事件 显示/隐藏开关
const urgencyVisible = ref(false);
// 事件总览/详情-事件搜索 显示/隐藏开关
const searchVisible = ref(false);
// 创建会议 显示/隐藏开关
const meetingVisible = ref(false);
// 监督分析-事件搜索 显示/隐藏开关
const searchAnalysisVisible = ref(false);
// 事件详情-下发指令 显示/隐藏开关
const detailInstructVisible = ref(false);
// 相似事件搜索 显示/隐藏开关
const similarEventsVisible = ref(false);
// 图层搜索/视频资源 显示/隐藏开关
const maplayerSearchVisible = ref(false);
// 要素分析弹框
const factorAnalysisVisible = ref(false);

const toggleInstructDialog = () => {
  detailInstructVisible.value = !detailInstructVisible.value;
};

// 事件详情-下发历史 显示/隐藏开关
const detailInstructHistoryVisible = ref(false);
// 网格信息弹窗 显示/隐藏开关
const rectInfoVisible = ref(false);
// 地图-多边形图层 显示/隐藏开关
const rectMapVisible = ref(false);
// 地图 - 测量模式
const isMeasureMode = ref(false);
// 当前选择的tool
const currentMode = ref('')

const clearMode = () => {
  currentMode.value = '';
};

const setMode = (mode: string) => {
  currentMode.value = mode;
};


// 弹窗-手动流转-显示/隐藏开关
const manualHandleVisible = ref(false);

// 弹窗-趋势分析-显示/隐藏开关
const trendVisible = ref(false);
// 弹窗-事件流转关系图-显示/隐藏开关
const eventGraphVisible = ref(false);

// 当前显示的事件 id
const currentEventId = ref('');
// 当前显示的事件编码
const currentEventCode = ref('');
// 清空当前事件信息
const clearCurrentEvent = () => {
  currentEventId.value = '';
  currentEventCode.value = '';
}
// 当前显示的视频 id
const currentCameraId = ref('');

// 默认的地区code
const defaultAreaId = ref(0);
const defualtSearchParams = {
  eventStatus: '',
  platform: '100',
  district: 0,
  districtName: '',
  timeDimension: '2', // 全局时间维度 用于计算环比 1本日、2本月、3本季度、4本年
  // district: +(process.env.DEFAULT_AREA_ID as string),
  startTime: initTime[0],
  endTime: initTime[1],
}

// 全局搜索条件
const searchParams = reactive<Indexable<string | number>>(JSON.parse(JSON.stringify(defualtSearchParams)))

// 全局搜索发生任何变化，此值都会改变；需要根据全局搜索组件状态更新数据的组件，都应该 watch 到值，
const globalSearchChanged = ref();

// 地图图层控制
const layerSwitch = reactive({
  mode: MAP_POINT,
  layerSelected: [WAITING, PENDING, FINISHED, SELF_HANDLE],
  eventUrgent: '',
  // 资源图层
  resourcesSelected: [
    RESOURCE.BUSINESS,
    RESOURCE.HOSPITAL,
    RESOURCE.HOTEL,
    RESOURCE.SANXIAO,
    RESOURCE.SCHOOL,
    RESOURCE.TRAFFIC,
    RESOURCE.SUPPLY,
  ] as string[],
  // 视频图层
  videosSelected: [SHOW_CAMERA]
})

console.log(layerSwitch.resourcesSelected)

// 是否最后一级
const isLastLevelArea = ref(false);

// 资源
const resourcesVisible = ref(false);
const currentResourceInfo = ref({});


// 地图聚合事件/资源/视频-列表 显示/隐藏开关
const clusterListVisible = ref(false);
const currentClusterListInfo = ref({});
const currentClusterlistMode = ref('eventCluster');


// 事件详情左侧面板tab绑定
const eventInfoTabName = ref('baseInfo');

// 手动流转 操作刷新列表
const refreshTime = ref(new Date().getTime());

function useGlobalState(params?: any) {

  // 显示聚合列表弹窗
  const handleShowClusterList = (info: any, mode: string) => {
    currentClusterListInfo.value = info;
    currentClusterlistMode.value = mode;
    clusterListVisible.value = true;
  };

  // 关闭聚合列表弹窗
  const handleCloseClusterList = () => {
    clusterListVisible.value = false;
    currentClusterListInfo.value = {};
  };

  // 显示资源
  const handleShowResource = (info: any) => {
    if (cameraVisible.value) return;
    resourcesVisible.value = true;
    currentResourceInfo.value = info;
  };

  // 关闭资源
  const handleCloseResource = () => {
    resourcesVisible.value = false;
    currentResourceInfo.value = {};
  };

  // 显示事件详情弹窗
  const handleShowEventDetail = (eventId: string) => {
    currentEventId.value = eventId;
    eventDetailVisible.value = true;
  }

  const handleShowSelfHandleEventDetail = (eventId: string) => {
    currentEventId.value = eventId;
    eventSelfHandleDetailVisible.value = true;
  }
  // 显示视频
  const handleShowCamera = (cameraId: string) => {
    if (resourcesVisible.value) return;
    currentCameraId.value = cameraId;
    cameraVisible.value = true;
  }
  // 关闭事件详情弹窗
  const handleCloseEventDetail = () => {
    currentEventId.value = '';
    currentEventCode.value = '';
    eventDetailVisible.value = false;
  }
  // 关闭事件详情弹窗
  const handleCloseSelfHandleEventDetail = () => {
    currentEventId.value = '';
    currentEventCode.value = '';
    eventSelfHandleDetailVisible.value = false;
  }
  // 关闭视频弹窗
  const handleCloseCamera = () => {
    currentCameraId.value = '';
    cameraVisible.value = false;
  }
  // 更新全局搜索条件的修改时间；
  const globalSearchIsChanged = () => {
    globalSearchChanged.value = new Date().getTime();
    console.log('全局搜索变化', globalSearchChanged.value, searchParams)
  }

  // 重置 searchParams
  const handleReset = (isEmitChange = true) => {
    for (const key in defualtSearchParams) {
      searchParams[key] = defualtSearchParams[key as keyof typeof defualtSearchParams];
    }
    if (isEmitChange) globalSearchIsChanged();
    isLastLevelArea.value = false;
  }

  const mapChangeModeToHeat = () => {
    layerSwitch.mode = MAP_HEAT;
  }

  const mapChangeModeToPoint = () => {
    layerSwitch.mode = MAP_POINT;
  }

  // 关闭缓冲区查询弹框
  const handleCloseBufferSearchPanel = () => {
    bufferPanelVisible.value = false;
    currentMode.value = '';
    eventInfoTabName.value = 'baseInfo';
  }

  // 关闭事件相关弹框
  const handleCloseAllEventDialog = () => {
    eventDetailVisible.value = false;
    urgencyVisible.value = false;
    searchVisible.value = false;
    clusterListVisible.value = false;
    searchAnalysisVisible.value = false;
    meetingVisible.value = false;
    similarEventsVisible.value = false;
    factorAnalysisVisible.value = false;
    detailInstructVisible.value = false;
    detailInstructHistoryVisible.value = false;
    manualHandleVisible.value = false;
    trendVisible.value = false;
    eventGraphVisible.value = false;
    currentMode.value = '';
    rectInfoVisible.value = false;
    maplayerSearchVisible.value = false;
  }

  const refreshTimeChange = () => {
    refreshTime.value = new Date().getTime();
  }

  // 监听全局搜索变化，执行回调函数
  watch(() => globalSearchChanged.value, () => {
    if (params && typeof params.handleWatch === 'function') {
      params.handleWatch(searchParams);
    }
  }, { immediate: !!params?.immediate })

  // 资源图层
  const resourcesList = ref([
    {
      id: 1,
      type: 1,
      name: '三小场所',
      prop: 'threeSmallPlacesNum',
      total: 0
    },
    {
      id: 2,
      type: 2,
      name: '商业枢纽',
      prop: 'businessHubNum',
      total: 0,
    },
    {
      id: 3,
      type: 3,
      name: '交通枢纽',
      prop: 'transportHubNum',
      total: 0
    },
    {
      id: 4,
      type: 4,
      name: '医疗机构',
      prop: 'hospitalNum',
      total: 0
    },
    {
      id: 5,
      type: 5,
      name: '学校',
      prop: 'schoolNum',
      total: 0
    },
    {
      id: 6,
      type: 6,
      name: '酒店宾馆',
      prop: 'hotelNum',
      total: 0
    }, {
      id: 7,
      type: 7,
      name: '物资保障',
      prop: 'hotelNum',
      total: 0
    },
  ]);

  const videosList = ref([
    {
      id: 1,
      type: SHOW_CAMERA,
      name: '视频监控'
    },
  ]);

  const resetResourceVideo = () => {
    layerSwitch.layerSelected = [WAITING, PENDING, FINISHED, SELF_HANDLE];
    layerSwitch.resourcesSelected = ['1', '2', '3', '4', '5', '6'];
    layerSwitch.videosSelected = [SHOW_CAMERA];
  };

  return {
    currentEventId,
    currentEventCode,
    clearCurrentEvent,
    currentCameraId,
    currentMode,
    setMode,
    clearMode,
    searchParams,
    eventDetailVisible,
    bufferPanelVisible,
    cameraVisible,
    urgencyVisible,
    searchVisible,
    meetingVisible,
    similarEventsVisible,
    factorAnalysisVisible,
    searchAnalysisVisible,
    detailInstructVisible,
    maplayerSearchVisible,
    toggleInstructDialog,
    eventSelfHandleDetailVisible,
    detailInstructHistoryVisible,
    rectInfoVisible,
    handleCloseBufferSearchPanel,
    globalSearchChanged,
    layerSwitch,
    isLastLevelArea,
    handleShowEventDetail,
    handleCloseEventDetail,
    handleShowSelfHandleEventDetail,
    handleCloseSelfHandleEventDetail,
    handleShowCamera,
    handleCloseCamera,
    handleCloseAllEventDialog,
    globalSearchIsChanged,
    handleReset,
    defualtSearchParams,
    mapChangeModeToHeat,
    mapChangeModeToPoint,
    defaultAreaId,
    resourcesList,
    videosList,
    userInfo,
    setUserInfo,
    clusterListVisible,
    handleShowClusterList,
    handleCloseClusterList,
    currentClusterListInfo,
    currentClusterlistMode,
    currentResourceInfo,
    handleShowResource,
    handleCloseResource,
    resourcesVisible,
    eventInfoTabName,
    manualHandleVisible,
    trendVisible,
    eventGraphVisible,
    resetResourceVideo,
    refreshTime,
    refreshTimeChange,
    rectMapVisible,
    isMeasureMode,
    isGlobalSearchOpen,
    isToolBoxOpen,
    toggleGlobalSearchBox,
    toggleToolBox,
    ...eventSearch,
    isFooterEventListOpen
  }
}

export { useGlobalState }
