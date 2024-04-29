<template>
  <div class="background-map">
    <x-map ref="commonMap" :minzoom="minZoom" :maxzoom="maxZoom" :zoom="zoom" :center="center" :mapStyle="mapStyle"
      :backgroundColor="'#21416B'" @created="mapCreatedHandler" :extendProps="extendProps" @update:zoom="handleZoomUpdate" @dblclick="handleMapClick">

      <!-- <x-tianditu-layer
        :types="['cva','cia']"
        :token="TIANDITU_TOKEN"
      /> -->

      <x-wmts-layer
        v-bind="darkWMTSProps"
        @created="darkMapCreated"
      ></x-wmts-layer>

      <template v-if="rectMapVisible && !isEventDetailPage">
        <x-polygon-layer
          :data="mapBigRectData"
          :color="['get', 'fillColor']"
          :outline-color="['get', 'outlineColor']"
          :useExpression="true"
          @click="handleClickBigRect"
          @mousemove="handleRectHover"
          @mouseleave="handleClearHover"
        />

        <x-polygon-layer
          :data="mapMidRectData"
          :color="['get', 'fillColor']"
          :outline-color="['get', 'outlineColor']"
          :useExpression="true"
          @click="handleClickMidRect"
          @mousemove="handleRectHover"
          @mouseleave="handleClearHover"
        />
      </template>

      <x-image-loader :images="images" />

      <!-- 事件打点 -->
      <x-symbol-layer v-if="
        eventData &&
        eventData.length &&
        layerSwitch.mode === MAP_POINT"
        id="event"
        :data="eventDataFiltered" :show="true"
        iconAnchor="bottom" :cluster="true" :clusterIcons="CLUSTER_ICONS" :spiderify="true" :iconAllowOverlap="true" :textAllowOverlap="false"
        iconImageField="icon" :textField="'text'" :textColor="['get', 'color']" :textOffset="[0, -2]"
        :textFont="['PingFangSC Medium']" @click="handleEventDetail" @mousemove="mouseOverMapEvent"></x-symbol-layer>

        <!-- 视频点位 -->
        <x-symbol-layer v-if="
          cameraData &&
          cameraData.length &&
          layerSwitch.videosSelected.length"
          id="camera"
          :data="cameraDataFiltered" :show="true"
          iconAnchor="bottom" :iconAllowOverlap="true" :textAllowOverlap="false"
          iconImageField="icon"
          :textFont="['PingFangSC Medium']"
          textField="name"
          textColor="#ffffff"
          :textTranslate="[6 * getRem(), -9.4 * getRem()]"
          :textOptional="true"
          :iconOffset="[7.5 * getRem(), 0]"
          textAnchor="top-left"
          :textSize="getRem() * 1.4"
          @click="handleCameraView" @mousemove="mouseOverMapEvent"></x-symbol-layer>
        <!-- 资源图层 -->
        <template v-if="resourcesListFiltered && resourcesListFiltered.length">
          <x-symbol-layer
            v-for="resource in resourcesListFiltered"
            :key="'resource' + resource.type"
            :id="'resource' + resource.type"
            :data="resource.children" :show="true"
            iconAnchor="bottom" :iconAllowOverlap="true" :textAllowOverlap="false"
            iconImageField="icon"
            :textFont="['PingFangSC Medium']"
            textField="name"
            textColor="#ffffff"
            :textTranslate="[6 * getRem(), -9.4 * getRem()]"
            :textOptional="true"
            :iconOffset="[7.5 * getRem(), 0]"
            textAnchor="top-left"
            :textSize="getRem() * 1.4"
            @click="handleResourceView"></x-symbol-layer>
        </template>

      <!-- 热力图 -->
      <x-heatmap-layer
        v-if="eventData && eventData.length && layerSwitch.mode === MAP_HEAT"
        :data="eventDataFiltered"
        :radius="[0, 30, 1, 40, 14, 60]"
      />

      <!-- 聚合打点 -->
      <template v-if="
        layerSwitch.mode === MAP_AGGRE &&
        !isLastLevelArea &&
        !isEventDetailPage &&
        !isAggregateHide">
        <x-map-popup
          v-model:show="showAggregate"
          v-for="aggregate in aggregationData"
          :key="aggregate.areaCode"
          :coordinates="[aggregate.coordx, aggregate.coordy]"
          anchor="bottom"
          :showTip="false"
        >
          <aggregate-popup :data="aggregate"/>
        </x-map-popup>
      </template>

      <!-- 缓冲区 -->
      <x-buffer-circle-layer
        v-if="bufferOptions"
        :center="bufferOptions.center"
        :radius="bufferOptions.radius"
        border-color="#FF8500"
        :borderWidth="2"
        :border-opacity="0.5"
        background-color="rgba(255,133,0,0.2)"
        center-color="#FF8500"
        :centerRadius="2"
        :background-opacity="0.1"
      />

    </x-map>

    <!-- 地图工具 -->
    <map-tools />

    <!-- 网格信息弹窗 -->
    <rect-info v-if="rectInfoVisible" />

  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getMapIconOption } from '@/common/utils';
import { hongtuTypes } from '@hongtu-next/core';
import { GlobalAPI, MAP_HEAT, MAP_POINT, getLastPath, MAP_AGGRE, RECT_TYPE } from '@/common';
import { useGlobalState, useMapData, useMapTools, useRectData } from '@/hooks';
import {
  SHOW_CAMERA
} from '@/views/event-center/constant';
import AggregatePopup from './popup-box/aggregate.vue';

const {
  searchParams,
  handleShowEventDetail,
  handleShowSelfHandleEventDetail,
  handleShowCamera,
  handleShowResource,
  layerSwitch,
  isLastLevelArea,
  currentEventId,
  rectInfoVisible,
  rectMapVisible,
  mapChangeModeToPoint,
  mapChangeModeToHeat,
  isMeasureMode } = useGlobalState({
  handleWatch: (params: any) => {
    fetchMapData(params);
  }
});
const {
  aggregationData,
  getAggregationPoint,
  eventData,
  getEventPoint,
  cameraData,
  getVideoMapPoint,
  resourcesList,
  getResourcesList,
} = useMapData();

const { setMapInstance, flyToDefault, bufferOptions, initMapUtils, flyTo } = useMapTools();
const {
  mapBigRectData,
  mapMidRectData,
  getRectData,
  getRectManagerData,
  currentBigRectParams,
  setCurrentBigRectParams,
  setCurrentMidRectParams,
  setNextRectParams,
  clearCurrentMidRectParams,
  handleRectHover,
  handleClearHover,
  currentHoverRect } = useRectData();

const route = useRoute();
const eventId = computed(() => { return route.query.eventId; });

const CLUSTER_ICONS = getMapIconOption('#FF9645');

getVideoMapPoint();
getResourcesList();
getRectData();

watch(() => currentEventId.value, val => {
  console.log(val, 'id changed');
  eventData.value = eventData.value.map((event: any) => {
    if (event.properties.id === val) {
      event.properties.icon = `${event.properties.icon}-2x`;
    } else {
      event.properties.icon = event.properties.icon.replace('-2x', '');
    }
    return event;
  });
});

let { MAP_CONFIG, TIANDITU_TOKEN } = GlobalAPI.config;
MAP_CONFIG = typeof MAP_CONFIG === 'string' ? JSON.parse(MAP_CONFIG) : MAP_CONFIG;

let $map: hongtuTypes.XMap = null;

const defaultCenter = MAP_CONFIG.center || [116.40, 39.91];
const defaultZoom = MAP_CONFIG.zoom || 16;

const commonMap = ref();
const maxZoom = ref(MAP_CONFIG.maxzoom || 18);
const minZoom = 2;
const zoom = ref(defaultZoom);
const center = ref(defaultCenter);

const isAggregateHide = ref(false);

const extendProps = {
  transformRequest(url: string) {
    return {
      url,
      headers: {
        'X-Auth-Token': MAP_CONFIG.token,
      }
    };
  }
};

const darkWMTSProps = {
  url: MAP_CONFIG.darkWMTS,
  layerName: '',
  layerStyle: 'default',
  tileMatrixSetID: 'default028mm',
  maxzoom: 21,
  minzoom: 1,
};

// const bigRect = [
//   { coordinates: [
//     [104.26, 30.98],
//     [104.30, 30.98],
//     [104.28, 30.96],
//   ],
//   properties: {
//     id: 1
//   } },
// ];

const handleClickBigRect = async (rect: any) => {
  console.log(rect, rect.properties);
  flyTo({
    center: rect.mouseCoordinates,
    zoom: 13
  });
  if (currentBigRectParams.wgbm !== rect.properties.wgbm) {
    clearCurrentMidRectParams();
    setCurrentBigRectParams(rect.properties);
    setNextRectParams({
      wglx: RECT_TYPE.MID,
      wgbm: rect.properties.wgbm
    });
    await getRectManagerData(1);
    await getRectData();
    rectInfoVisible.value = true;
  }
};

const handleClickMidRect = async (rect: any) => {
  console.log(rect, rect.properties);
  flyTo({
    center: rect.mouseCoordinates,
    zoom: 13
  });
  setCurrentMidRectParams(rect.properties);
  await getRectManagerData(1);
  rectInfoVisible.value = true;
};

// http://10.74.115.103:9337/GuangHanDark3857?style=default&Service=WMTS&tilematrixset=default028mm&Request=GetTile&Version=1.0.0&Format=image/png&TileMatrix=17&TileCol=103504&TileRow=53669

const currentEvent = ref({});
const showAggregate = ref(true);

// 过滤事件
const eventDataFiltered = computed(() => { // event.properties.id || event.properties.eventId
  console.log('过滤事件');
  if (!eventData.value.length) return [];
  return eventData.value.filter((point: typeof eventData.value) => layerSwitch.layerSelected.includes(`${point.properties.eventStatus}`) || Number(point.properties.id) === Number(eventId.value));
});
// 过滤视频
const cameraDataFiltered = computed(() => {
  console.log('过滤视频');
  return layerSwitch.videosSelected && layerSwitch.videosSelected.length ? cameraData.value : [];
});
// 过滤资源
const resourcesListFiltered = computed(() => {
  console.log('过滤资源');
  if (resourcesList.value.length) {
    return resourcesList.value.filter(point => layerSwitch.resourcesSelected.includes(`${point.type}`));
  } else {
    return [];
  }
});

const currentPage = ref(getLastPath());
const isEventDetailPage = computed(() => {
  return currentPage.value === 'detail';
});
const isEventAnalysisPage = computed(() => {
  return currentPage.value === 'analysis';
});

/*
 * 监控路由，如果是详情页，则：
 * 1. 隐藏聚合图层
 * 2. 展示打点图层
 * 3. 图层控制器：切换到点位显示模式
 */
watch(
  () => route.path,
  () => {
    currentPage.value = getLastPath();
    switch (currentPage.value) {
      case 'detail':
        mapChangeModeToPoint();
        break;
      case 'analysis':
        flyToDefault();
        getEventPoint(searchParams);
        mapChangeModeToPoint();
        break;
      case 'center':
        mapChangeModeToPoint();
        fetchMapData(searchParams);
        break;
      default:
        break;
    }
  }
);

const fetchMapData = (params: any) => {
  if (!isEventDetailPage.value) {
    getAggregationPoint(params);
    getEventPoint(params);
  }
};

fetchMapData(searchParams);

// ----------- 基础地图属性 ---------------

const base = `${GlobalAPI.config.PROD_PREFIX ? '/' + GlobalAPI.config.PROD_PREFIX : ''}`;
const iconBase = `${base}/images/map/icons`;

const mapStyle = ref({
  version: 8,
  sources: {},
  layers: [],
  glyphs: `${base}/supermap/{fontstack}/{range}.pbf`,
  sprite: ''
});

const getRem = () => {
  return 1.358611 * document.documentElement.clientHeight * 0.01;
};

const getIconSize = () => {
  // w = 15rem
  const w = 15 * getRem();
  // [558, 415]
  const h = w * 415 / 558;
  return [w, h];
};

const getIconSizeNoText = () => {
  // w = 15rem
  const w = 10 * 199 / 406 * getRem();
  // [177, 415]
  const h = w * 406 / 199;
  return [w, h];
};

const images = [
  {
    name: 'event-waiting',
    type: 'link:*',
    url: `${iconBase}/waiting.png`,
    size: getIconSizeNoText()
  },
  {
    name: 'event-pending',
    type: 'link:*',
    url: `${iconBase}/pending.png`,
    size: getIconSizeNoText()
  },
  {
    name: 'event-finished',
    type: 'link:*',
    url: `${iconBase}/finished.png`,
    size: getIconSizeNoText()
  },
  {
    name: 'event-self-handle',
    type: 'link:*',
    url: `${iconBase}/self-handle.png`,
    size: getIconSizeNoText()
  },
  {
    name: 'event-waiting-2x',
    type: 'link:*',
    url: `${iconBase}/waiting.png`,
    size: getIconSizeNoText().map(item => {
      return item * 1.3;
    })
  },
  {
    name: 'event-pending-2x',
    type: 'link:*',
    url: `${iconBase}/pending.png`,
    size: getIconSizeNoText().map(item => {
      return item * 1.3;
    })
  },
  {
    name: 'event-finished-2x',
    type: 'link:*',
    url: `${iconBase}/finished.png`,
    size: getIconSizeNoText().map(item => {
      return item * 1.3;
    })
  },
  {
    name: 'event-self-handle-2x',
    type: 'link:*',
    url: `${iconBase}/self-handle.png`,
    size: getIconSizeNoText().map(item => {
      return item * 1.3;
    })
  },
  {
    name: 'camera',
    type: 'link:*',
    url: `${iconBase}/camera.png`,
    size: getIconSize(),
  },
  {
    name: 'business',
    type: 'link:*',
    url: `${iconBase}/business.png`,
    size: getIconSize(),
  },
  {
    name: 'hospital',
    type: 'link:*',
    url: `${iconBase}/hospital.png`,
    size: getIconSize(),
  },
  {
    name: 'hotel',
    type: 'link:*',
    url: `${iconBase}/hotel.png`,
    size: getIconSize(),
  },
  {
    name: 'sanxiao',
    type: 'link:*',
    url: `${iconBase}/sanxiao.png`,
    size: getIconSize(),
  },
  {
    name: 'school',
    type: 'link:*',
    url: `${iconBase}/school.png`,
    size: getIconSize()
  },
  {
    name: 'traffic',
    type: 'link:*',
    url: `${iconBase}/traffic.png`,
    size: getIconSize()
  },
];

const mapCreatedHandler = (map: hongtuTypes.XMap) => {
  $map = map;
  map.resize();
  setMapInstance(commonMap.value);
};

const darkMapCreated = () => {
  initMapUtils($map);
};

const handleMapClick = () => {
  if (isMeasureMode.value) {
    isMeasureMode.value = false;
  }
};

const mouseOverMapEvent = (data: any) => {
  currentEvent.value = data;
};

const handleEventDetail = (event: any) => {
  console.log('show', event);
  if (event.properties.dealStatus) {
    handleShowSelfHandleEventDetail(event.properties.id || event.properties.eventId);
  } else {
    handleShowEventDetail(event.properties.id || event.properties.eventId);
  }
};

const handleCameraView = (camera: any) => {
  console.log('show', camera);
  handleShowCamera(camera.properties.channelId);
};

const handleResourceView = (resource: any) => {
  console.log('show', resource);
  handleShowResource(resource.properties);
};

const handleZoomUpdate = (zoomNumber: number) => {
  console.log(zoomNumber);
  if (zoomNumber <= MAP_CONFIG.zoomHideAggregate) {
    isAggregateHide.value = true;
  } else {
    isAggregateHide.value = false;
  }
};

</script>
<style lang="scss" scoped>
.background-map {
  width: 100%;
  height: 100%;
  z-index: 0;
}
</style>
