<template>
  <div class="background-map" :class="isPlotting ? 'plotting' : ''">
    <!-- <x-symbol-layer
      v-if="handlingEventsLayer"
      id="handlingEvents"
      v-bind="handlingEventsLayer"
      iconAnchor="bottom"
      :iconAllowOverlap="true"
      :textAllowOverlap="false"
      iconImageField="icon"
      @click="clickEventMarker"
      @mousemove="showLocBriefPopup"
      @mouseleave="hideAllPopup"
    ></x-symbol-layer> -->
    <mb-map
      :zoom="zoom"
      :center="center"
      :type="mapType"
      :glyphs="GLYPHS_SRC"
      :extend-props="{ maxzoom, preserveDrawingBuffer: true }"
      :is-blank-map="isBlankMap"
      @map-created="mapCreated"
      @click="clickMap"
    >
      <template #imageLoader>
        <x-image-loader :images="imageIcons" />
      </template>
      <template v-if="handlingEventsLayer">
        <x-map-marker
          v-for="(item, idx) in handlingEventsLayer.data"
          :key="idx"
          :coordinates="item.coordinates"
          :draggable="false"
        >
          <event-handling-icon
            @click="clickEventMarker(item)"
            @mousemove="showLocBriefPopup(item)"
            @mouseleave="hideAllPopup(item)"
          />
        </x-map-marker>
      </template>

      <x-symbol-layer
        v-if="finishedEventsLayer"
        id="finishedEvents"
        v-bind="finishedEventsLayer"
        iconAnchor="bottom"
        :iconAllowOverlap="true"
        :textAllowOverlap="false"
        iconImageField="icon"
        @click="clickEventMarker"
        @mousemove="showLocBriefPopup"
        @mouseleave="hideAllPopup"
      ></x-symbol-layer>
      <x-symbol-layer
        v-for="(resourceLayer, index) in resourceLayers"
        :key="`symbol${index}`"
        iconImageField="icon"
        :iconAllowOverlap="true"
        :textFont="['PingFangSC Medium']"
        iconAnchor="bottom"
        :clusterMaxZoom="maxzoom"
        :spiderify="true"
        v-bind="resourceLayer"
        @click="resourceLayerClickHandler"
        @clusterclick="resourceLayerClusterClickHandler"
        @mousemove="showLocBriefPopup"
        @mouseleave="hideAllPopup"
      ></x-symbol-layer>

      <template v-if="tempResourceItemMarker?.length">
        <x-map-marker
          v-for="(item, idx) in tempResourceItemMarker"
          :key="idx"
          :coordinates="item.coordinates"
          :draggable="false"
        >
          <img
            :src="item.iconUrl"
            :style="{width: `${item.iconSize[0]}px`, height: `${item.iconSize[1]}px`}"
            @click="resourceLayerClickHandler(item)"
            @mousemove="showLocBriefPopup(item)"
            @mouseleave="hideAllPopup(item)"
          />
        </x-map-marker>
      </template>
      <x-map-marker
        v-if="clickMapMarkerInfo.show && clickMapMarkerInfo.lnglat?.length"
        v-model:coordinates="clickMapMarkerInfo.lnglat"
        color="#2b7cff"
        :draggable="false"
      />

      <x-buffer-circle-layer
        v-if="currentMapBuffer"
        border-color="#71F8FC"
        backgroundColor="#71F8FC"
        textColor="#FF4242"
        :textSize="18"
        resizerColor="rgb(16, 51, 91)"
        :resizerRadius="14"
        :backgroundOpacity="0.16"
        :center="[currentMapBuffer.longitude, currentMapBuffer.latitude]"
        :radius="currentMapBuffer.radius"
        :visible="currentMapBuffer.show"
        countable
        draggable
        resizable
        @update="bufferChanged"
      />
      <loc-brief-popup v-bind="locBriefProps" />
      <cluster-points-popup v-bind="clusterPointsProps" @close="clusterPointsProps.show = false;" />
    </mb-map>
    <event-detail-dlg
      v-if="eventDlgParams.show"
      v-bind="eventDlgParams"
      @ok="closeDlg(eventDlgParams)"
      @cancel="closeDlg(eventDlgParams)"
    />
    <assemble-point-detail-dlg
      v-if="resourceDlgParams.resourceType === 'EventAssemblePoints' && resourceDlgParams.show"
      v-bind="resourceDlgParams"
      @ok="closeDlg(resourceDlgParams)"
      @cancel="closeDlg(resourceDlgParams)"
    />
    <site-personnel-detail-dlg
      v-else-if="resourceDlgParams.resourceType === 'SitePersonnel' && resourceDlgParams.show"
      v-bind="resourceDlgParams"
      @ok="closeDlg(resourceDlgParams)"
      @cancel="closeDlg(resourceDlgParams)"
    />
    <resource-detail-dlg
      v-else-if="resourceDlgParams.show"
      v-bind="resourceDlgParams"
      @ok="closeDlg(resourceDlgParams)"
      @cancel="closeDlg(resourceDlgParams)"
    />
    <plotting-list v-if="showPlottingList" @cancel="showPlottingList=false"/>
    <plotting-toolbox-panel v-if="isPlotting" />
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick, reactive, h, inject } from 'vue';
import { debounce, cloneDeep } from 'lodash-es';
import MapboxDraw from 'hongtu-draw';
import * as hongtuUtil from '@hongtu-next/util';
import { TiandituApi } from '@hongtu-next/core';
import { GlobalAPI, loadMapboxComponents, EventAnimIconSize, playFixedVideos, loadMapboxOthers, DRAW_ACTIONS, waitingForMap, ResourceClusterIconSize } from '@/common';
import { useMap, useMapLayer, useMapBuffer, useMapPlotting } from '@/hooks';
import { EventDetailDlg, ResourceDetailDlg, AssemblePointDetailDlg, SitePersonnelDetailDlg } from './dialog';
import { LocBriefPopup, ClusterPointsPopup, initPopupProps } from './popup';
import EventHandlingIcon from './event-handling-icon.vue';
import { PlottingList, PlottingToolboxPanel } from './plotting';

let locationToAddress: typeof TiandituApi.locationToAddress;

const [MbMap] = loadMapboxComponents(['MbMap']);

const GLYPHS_SRC = process.env.NODE_ENV === 'production' ? `${window.location.origin}/${GlobalAPI.config.PROD_PREFIX}/supermap/0-255.pbf` : '/supermap/0-255.pbf';
const isBlankMap = process.env.NODE_ENV !== 'production';
let $drawUtil: any = null;
let $measureUtil: any = null;

const { center, zoom, maxzoom, mapType, mapCreated, downloadMap, getMapboxInst } = useMap();
const {
  imageIcons,
  handlingEventsLayer,
  finishedEventsLayer,
  resourceLayers,
  tempResourceItemMarker,
  clickMapMarkerInfo,
  getIcon,
} = useMapLayer();
const { currentMapBuffer, updateBuffer } = useMapBuffer();
const {
  isPlotting,
  showPlottingList,
  currentPlottingInfo,
  syncView,
  changeTab,
  addPlottingData,
  modifyPlottingData,
  clearPlottingData
} = useMapPlotting();

const isDlgShowing = ref(false);
const locBriefProps = reactive<Record<string, any>>(cloneDeep(initPopupProps));
const clusterPointsProps = reactive<Record<string, any>>(cloneDeep(initPopupProps));
const eventDlgParams = reactive({ show: false, id: '' });
const resourceDlgParams = reactive({ show: false, id: '', resourceType: '', name: '', properties: {} as Record<string, any> });

const initDrawUtil = async() => {
  console.log('initDrawUtil', $drawUtil);
  if ($drawUtil) return;
  await waitingForMap();
  $drawUtil = new MapboxDraw(getMapboxInst(), {
    userProperties: true,
    showTooltip: true
  });
  // @ts-ignore
  // eslint-disable-next-line new-cap
  $measureUtil = new hongtuUtil.measureUtil(getMapboxInst(), {
    showTooltip: true,
    delete({ tooltip }: { tooltip: { id: string }}) {
      currentPlottingInfo.measureFeatureIds.delete(tooltip.id);
    },
    update({ tooltip }: { tooltip: { id: string }}) {
      currentPlottingInfo.measureFeatureIds.add(tooltip.id);
    }
  }, $drawUtil);

  getMapboxInst().on('draw.selectionchange', drawChangeHandler);
  getMapboxInst().on('draw.update', drawUpdateHandler);
};
const drawChangeHandler = (data: Record<string, any>) => {
  if (data.features?.length > 0) {
    if (!currentPlottingInfo.drawShape.startsWith('measure')) {
      changeTab('property');
      addPlottingData(data.features[0]);
    }
  } else {
    currentPlottingInfo.curFeatureData = {};
  }
};
const drawUpdateHandler = (data: Record<string, any>) => {
  if (data.features?.length > 0) {
    if (!currentPlottingInfo.drawShape.startsWith('measure')) {
      modifyPlottingData(data.features[0]);
    }
  } else {
    currentPlottingInfo.curFeatureData = {};
  }
};

const showLocBriefPopup = (e: any) => {
  const icon = getIcon(e.properties.icon);
  locBriefProps.coordinates = e.coordinates;
  locBriefProps.properties = e.properties;
  locBriefProps.offset = [0, (icon?.size[1] ?? EventAnimIconSize[1]) * -1 - 2];
  locBriefProps.show = true;
};
const hideAllPopup = () => {
  locBriefProps.show = false;
};

const clickEventMarker = (e: any) => {
  console.log('clickEventMarker', e);
  if (isDlgShowing.value) return;
  eventDlgParams.id = e.properties.id;
  locBriefProps.show = false;
  clusterPointsProps.show = false;
  eventDlgParams.show = true;

  isDlgShowing.value = true;
};
const resourceLayerClickHandler = (e: any) => {
  console.log('resourceLayerClickHandler', e);
  if (isDlgShowing.value) return;

  if (e.properties.resourceType === 'FixedVideo') {
    playFixedVideos([e.properties], {
      onClose: () => {
        isDlgShowing.value = false;
      }
    });
  } else {
    resourceDlgParams.id = e.properties.id || e.properties.userId;
    resourceDlgParams.resourceType = e.properties.resourceType;
    resourceDlgParams.name = e.properties.resName || e.properties.name;
    resourceDlgParams.properties = e.properties;
    locBriefProps.show = false;
    resourceDlgParams.show = true;
  }

  isDlgShowing.value = true;
};
const resourceLayerClusterClickHandler = (e: any) => {
  // console.log('resourceLayerClusterClickHandler', e);
  if (isDlgShowing.value) return;
  clusterPointsProps.coordinates = e.mouseCoordinates;
  clusterPointsProps.properties = e.data;
  clusterPointsProps.offset = [0, ResourceClusterIconSize[1] * -1 - 2];
  clusterPointsProps.show = true;
};

const closeDlg = (dlgParams: { show: boolean }) => {
  dlgParams.show = false;
  isDlgShowing.value = false;
};

const bufferChanged = debounce((params: { center: number[]; radius: number}) => {
  updateBuffer({ longitude: params.center[0], latitude: params.center[1], radius: params.radius });
}, 300);

const clickMap = async(payload: any) => {
  if (!clickMapMarkerInfo.value.show) return;
  const d = await locationToAddress(payload.coordinates[0] + '', payload.coordinates[1] + '');
  const result = d.data.result;
  clickMapMarkerInfo.value = {
    show: true,
    address: result.formatted_address,
    lnglat: [+payload.coordinates[0], +payload.coordinates[1]]
  };
};

const clearAllDraws = () => {
  // 测量工具不删除
  const data = $drawUtil?.getAll() || { features: [] };
  const ids = data.features.map((f: { id: any; }) => f.id).filter((id: string) => !currentPlottingInfo.measureFeatureIds.has(id));
  $drawUtil?.delete(ids);
};

watch(() => currentPlottingInfo.shapeCount, async() => {
  if (!isPlotting.value) return;
  const shape = currentPlottingInfo.drawShape;
  if (shape === 'download_map') {
    downloadMap(currentPlottingInfo.activeLayer.layerName!);
  } else if (shape === 'set_common_view') {
    syncView();
  } else {
    await initDrawUtil();
    if (shape === 'measure_distance') {
      $measureUtil.changeMode('length');
    } else if (shape === 'measure_area') {
      $measureUtil.changeMode('area');
    } else if (shape === 'draw_camera') {
      $drawUtil.changeMode('draw_camera', {
        imageId: new Date().getTime(),
        imageUrl: `${GlobalAPI.config.FILE_VIEW}/jczhtest/xtbh/电子显示屏.png`,
        iconSize: 0.25
      });
    } else if (shape.startsWith('draw_icon')) {
      const info = JSON.parse(shape.slice('draw_icon'.length));
      $drawUtil.changeMode('draw_image', {
        imageId: info.id,
        imageUrl: info.url,
        iconSize: 0.25
      });
    } else {
      $drawUtil.changeMode(shape, shape === 'draw_text' ? { 'text-color': '#0000ff' } : {});
    }
  }
});
watch(() => currentPlottingInfo.curMarkVoListData, async val => {
  if (!isPlotting.value) return;
  await initDrawUtil();
  clearAllDraws();
  val?.forEach(v => {
    const markObj = JSON.parse(v.markOther!);
    if (markObj.type === 'Feature') {
      $drawUtil?.add(markObj);
    }
  });
}, {
  immediate: true,
  deep: true,
});
watch(() => currentPlottingInfo.curFeatureData.properties?.visible, val => {
  if (!isPlotting.value) return;
  if (typeof val === 'boolean') {
    $drawUtil.setFeatureProperty(currentPlottingInfo.curFeatureData.id, 'visible', val);
  }
});

watch(isPlotting, val => {
  if (!val) {
    clearPlottingData();
    clearAllDraws();
    getMapboxInst()?.off('draw.selectionchange', drawChangeHandler);
    getMapboxInst()?.off('draw.update', drawUpdateHandler);
    $measureUtil?.destroy();
    $drawUtil = null;
    $measureUtil = null;
  }
});

onMounted(async() => {
  const [useRemoteMap] = await loadMapboxOthers(['useMap']);
  const { locationToAddress: lta } = useRemoteMap();
  locationToAddress = lta;
});
</script>
<style lang="scss" scoped>
.background-map {
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>
