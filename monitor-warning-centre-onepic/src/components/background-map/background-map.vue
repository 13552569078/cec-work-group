<template>
  <div class="background-map">
    <x-map :minzoom="2" :zoom="zoom" :center="center" :pitch="45" ref="commonMap" :mapStyle="mapStyle" :backgroundColor="'#21416B'" @created="mapCreatedHandler">
      <x-image-loader :images="images" />
      <!-- <x-map-popup
        v-if="!!emergencyPopInfo.id || !!attachmentPopInfo.id"
        :coordinates="!!emergencyPopInfo.id ? [emergencyPopInfo?.longitude, emergencyPopInfo?.latitude] : [attachmentPopInfo?.longitude, attachmentPopInfo?.latitude]"
        :offset="[0, -80]"
        :showTip="false"
        anchor="bottom"
      >
        <emergency-detail-dlg v-if="!!emergencyPopInfo.id" :id="emergencyPopInfo?.id"></emergency-detail-dlg>
        <attachment-detail-dlg v-if="!!attachmentPopInfo.id" :attachmentPopInfo="attachmentPopInfo"></attachment-detail-dlg>
      </x-map-popup> -->

      <!-- 弹窗 - 监测主体详情 -->
      <template v-if="polygonLayer.features && polygonLayer.features.length && mapLengd.includes('region')">
        <x-map-popup v-for="region in polygonLayer.features" :key="region.properties.id" :coordinates="region.center" :show="true" anchor="bottom" :showTip="false" @click="handleGoRegionDetail(region.properties.id)">
          <region-pop :warningNumber="region.properties.warningNumber" />
        </x-map-popup>
      </template>

      <x-map-popup :show="!!currentMonitorPointId" :coordinates="currentMonitorPointLocation" anchor="bottom" :hideOnClick="false" :showTip="false">
        <equip-pop :monitorPointId="currentMonitorPointId" @close="handleClosePopupMonitor" />
      </x-map-popup>

      <!-- 面图层: 监测主体 -->
      <x-polygon-layer v-if="polygonLayer.features && polygonLayer.features.length && mapLengd.includes('region')" beforeId="name-town" :geoJsonDataSource="polygonLayer" :show="polygonLayerVisible" :color="['get', 'fillColor']" :outlineColor="['get', 'borderColor']" :useExpression="true" @click="clickMapPoint"></x-polygon-layer>

      <!-- 点图层 -->
      <x-symbol-layer v-if="pointLayer.length" id="event" :data="pointLayerComputed" :show="true" iconAnchor="bottom" :cluster="true" :clusterIcons="CLUSTER_ICONS" :spiderify="true" :iconAllowOverlap="true" :textAllowOverlap="false" iconImageField="icon" :textField="'text'" :textColor="['get', 'color']" :textOffset="[0, -2]" :textFont="['PingFangSC Medium']" @click="clickMapPoint" @mousemove="mouseOverMapPoint"></x-symbol-layer>

      <BaseLayer />
      <!-- <x-tianditu-layer
        :types="['cva','cia']"
      /> -->
    </x-map>

    <!-- 地图图层选择 -->
    <layer-filer @mapLayer="mapLayer" />
    <!-- 地图工具 -->
    <map-tools />
    <!-- 弹框 -->
    <!-- 报警详情、监测数据 -->
    <modal-event v-if="eventInfoVisibel" v-model="eventInfoVisibel" :eventId="eventId" :startTime="startTime" :activeName="activeName" />
    <!-- 视频弹窗   -->
    <modal-video v-if="videoVisible" v-model="videoVisible" :equipId="equipId" />
    <!--  物联网弹窗  -->
    <modal-iot v-if="iotVisible" v-model="iotVisible" :pointId="pointId"/>
    <!-- 天气 -->
    <hl-dialog v-model="weatherVisible" width="calc(var(--xxl) * 30)" title="天气信息">
      <weather-detail v-if="weatherVisible"> </weather-detail>
    </hl-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import type { Indexable } from 'pc-fx-framework';
import { hongtuTypes } from '@hongtu-next/core';
import { GlobalAPI } from '@/common';
import { useEventBus } from '@/hooks';
import { getUrlPrefix } from '@/common/utils';
import LayerFiler from './layer-filter.vue';
import BaseLayer from './base-layer.vue';
import MapTools from './maptools.vue';
import modalEvent from '@/components/dialogs/eventInfo/modalEvent.vue';
import modalVideo from '@/components/dialogs/eventInfo/modalVideo.vue';
import regionPop from './popup-box/region-pop.vue';
import equipPop from './popup-box/equip-pop.vue';
import ModalIot from '@/components/dialogs/eventInfo/modalIot.vue';
import WeatherDetail from '@/views/weather-detail/index.vue';

const router = useRouter();

const pointColor = '#FF9645';

const CLUSTER_ICONS = [
  { count: 50, textColor: 'white', textSize: 12, functionName: 'plusingDot', functionProps: { color: pointColor, radius: 50 } },
  { count: 100, textColor: 'white', textSize: 14, functionName: 'plusingDot', functionProps: { color: pointColor, radius: 75 } },
  { count: 200, textColor: 'white', textSize: 18, functionName: 'plusingDot', functionProps: { color: pointColor, radius: 100 } },
  { count: 500, textColor: 'white', textSize: 20, functionName: 'plusingDot', functionProps: { color: pointColor, radius: 125 } },
  { textColor: 'white', textSize: 22, functionName: 'plusingDot', functionProps: { radius: 150, color: pointColor } }
];

const defaultCenter = [120.1974, 33.31498];
const defaultZoom = 13;

const commonMap = ref();
const maxZoom = ref(22);
const minZoom = ref(0);
const zoom = ref(defaultZoom);
const center = ref(defaultCenter);

const eventId = ref('');
const startTime = ref('');
const currentMonitorPointId = ref('');
const currentMonitorPointLocation = ref('');
const eventInfoVisibel = ref(false);
const activeName = ref('detail');

const videoVisible = ref(false);
const weatherVisible = ref(false);
const iotVisible = ref(false);
const equipId = ref('');
const pointId = ref<string[]>([]);

const polygonLayerVisible = ref(true);
const polygonLayer = ref<any[]>([]);
const pointLayer = ref<any[]>([]);
const mapLengd = ref<string[]>([]);

const pointLayerComputed = computed(() => {
  const mapLengdString = mapLengd.value.join();
  return pointLayer.value.filter((item: any) => {
    return mapLengdString.indexOf(item.properties.icon) !== -1;
  });
});

let { MAP_CONFIG_MONITOR_WARNING_ONEPIC } = GlobalAPI.config;
MAP_CONFIG_MONITOR_WARNING_ONEPIC = typeof MAP_CONFIG_MONITOR_WARNING_ONEPIC === 'string' ? JSON.parse(MAP_CONFIG_MONITOR_WARNING_ONEPIC) : MAP_CONFIG_MONITOR_WARNING_ONEPIC;
// ----------- 基础地图属性 ---------------
const mapStyle = ref({
  layers: [],
  glyphs: MAP_CONFIG_MONITOR_WARNING_ONEPIC.glyphs,
  sprite: ''
});

const base = `${GlobalAPI.config.PROD_PREFIX ? '/' + GlobalAPI.config.PROD_PREFIX : ''}/images/map/icons`;

const images = [
  {
    name: 'camera',
    type: 'link',
    url: `${base}/camera.png`
  },
  {
    name: 'monitor-point',
    type: 'link',
    url: `${base}/monitor-point.png`
  },
  {
    name: 'ALARM_LEVEL_CODE_1',
    type: 'link',
    url: `${base}/ALARM_LEVEL_CODE_1.png`
  },
  {
    name: 'ALARM_LEVEL_CODE_2',
    type: 'link',
    url: `${base}/ALARM_LEVEL_CODE_2.png`
  },
  {
    name: 'ALARM_LEVEL_CODE_3',
    type: 'link',
    url: `${base}/ALARM_LEVEL_CODE_3.png`
  },
  {
    name: 'ALARM_LEVEL_CODE_4',
    type: 'link',
    url: `${base}/ALARM_LEVEL_CODE_4.png`
  },
  {
    name: 'WARNING_LEVEL_CODE_1',
    type: 'link',
    url: `${base}/WARNING_LEVEL_CODE_1.png`
  },
  {
    name: 'WARNING_LEVEL_CODE_2',
    type: 'link',
    url: `${base}/WARNING_LEVEL_CODE_2.png`
  },
  {
    name: 'WARNING_LEVEL_CODE_3',
    type: 'link',
    url: `${base}/WARNING_LEVEL_CODE_3.png`
  },
  {
    name: 'WARNING_LEVEL_CODE_4',
    type: 'link',
    url: `${base}/WARNING_LEVEL_CODE_4.png`
  }
];

const $eventBus = useEventBus('OPEN_DIALOG:eventInfo', (event: any) => {
  // if (typeof evtId === 'string') {
  //   eventId.value = evtId;
  //   activeName.value = 'detail';
  // } else {
  //   eventId.value = evtId.eventId;
  //   activeName.value = evtId.activeName;
  // }
  if (event.activeName) {
    activeName.value = event.activeName;
  } else {
    activeName.value = 'detail';
  }
  eventId.value = event.eventId;
  startTime.value = event.startTime;

  eventInfoVisibel.value = true;
});
useEventBus('OPEN_DIALOG:videoInfo', (id: string) => {
  equipId.value = id;
  videoVisible.value = true;
});
useEventBus('OPEN_DIALOG:iotInfo', id => {
  pointId.value = id;
  iotVisible.value = true;
});
useEventBus('OPEN_DIALOG:weather', (id: string) => {
  weatherVisible.value = true;
});

useEventBus('POPUP:equip', (data: any) => {
  currentMonitorPointId.value = data.properties.id;
  currentMonitorPointLocation.value = data.coordinates;
});

const handleClosePopupMonitor = () => {
  currentMonitorPointId.value = '';
  currentMonitorPointLocation.value = '';
};

useEventBus('SET_MAP:resetMap', () => {
  commonMap.value.easeTo({
    center: defaultCenter,
    zoom: defaultZoom
  });
});
// 公共监听方法--设置zoom
useEventBus('SET_MAP:plusZoom', () => {
  zoom.value++;
});
useEventBus('SET_MAP:minusZoom', () => {
  zoom.value--;
});
// 公共监听方法--移动地图到指定位置
useEventBus('SET_MAP:moveMap', (point: Array<number>) => {
  center.value = point;
});
// 公共监听方法--fly
useEventBus('SET_MAP:fly', (options: Indexable<any>) => {
  commonMap.value.easeTo(options);
});

useEventBus('UPDATE_MAP:polygon', (data: any) => {
  polygonLayer.value = data;
});

useEventBus('UPDATE_MAP:point', (data: any) => {
  const arr: any[] = [];
  pointLayer.value = arr.concat(pointLayer.value, data);
});

useEventBus('UPDATE_MAP:resetPolygen', (data: any) => {
  polygonLayer.value = [];
});

useEventBus('UPDATE_MAP:resetPoint', (data: any) => {
  pointLayer.value = [];
});

useEventBus('UPDATE_MAP:resetAll', (data: any) => {
  handleClosePopupMonitor();
  pointLayer.value = [];
  polygonLayer.value = [];
});

const mapCreatedHandler = (map: hongtuTypes.XMap) => {
  map.resize();
};

const clickMapPoint = (data: any) => {
  console.log(data);
  let event = {};
  if (data.properties.emit) {
    switch (data.properties.pointType) {
      case 'event':
        if (data.properties.event) {
          event = JSON.parse(data.properties.event);
        }
        $eventBus.emit(data.properties.emit, event);
        break;
    }
  }
};

const mouseOverMapPoint = (data: any) => {
  console.log(data);
  if (data.properties.emit) {
    switch (data.properties.pointType) {
      case 'monitor-point':
        $eventBus.emit(data.properties.emit, data);
        break;
    }
  }
};

const mapLayer = (types: string[]) => {
  mapLengd.value = types;
};

const handleGoRegionDetail = (regionId: string) => {
  // 如当前已在监测主体页面，则不能再点击打开新页面
  if (document.location.href.includes('/region')) return;
  const prefix = getUrlPrefix();
  window.open(`${document.location.origin}${GlobalAPI.config.PROD_PREFIX === '' ? '' : '/' + GlobalAPI.config.PROD_PREFIX}${prefix}/region?regionId=${regionId}`, '_blank');
};
</script>
<style lang="scss" scoped>
.background-map {
  width: 100%;
  height: 100%;
  z-index: 0;
}
</style>
