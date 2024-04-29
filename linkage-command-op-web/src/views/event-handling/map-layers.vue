<template>
  <div class="map-layers" :class="[showMask ? 'map-tools-left-show' : 'map-tools-moving-left']">
    <div class="layer-list-icon cursor-pointer" @click="show=!show">
      <hl-icon size="lg"><fill-layer /></hl-icon>
    </div>
    <card-popover title="图层" :class="['map-layer-list m-t-md', show ? '' : 'hide']">
      <template #action>
        <hl-spinner v-if="isLoading" />
      </template>
      <hl-scrollbar max-height="60vh">
        <hl-tree
          ref="treeRef"
          class="layer-tree"
          node-key="id"
          :props="treeProps"
          :data="treeData"
          :default-expanded-keys="defaultExpandedKeys"
          :default-checked-keys="defaultCheckedKeys"
          show-checkbox
          :checkbox-disabled="isLoading"
          @check="handleCheckChange"
        >
          <template #default="{ node, data }">
            <hl-group full class="w-full overflow-hidden" gap="var(--xs)" align="items-middle items-between">
              <img v-if="data.iconUrl" :src="data.iconUrl" class="layer-icon"/>
              <div class="text-ellipsis w-full">{{ node.label }}</div>
            </hl-group>
          </template>
        </hl-tree>
      </hl-scrollbar>
    </card-popover>
  </div>
</template>
<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { groupBy } from 'lodash-es';
import { CommonUtils } from 'fx-front-utils';
import {
  useCurrentEvent,
  useLayout,
  useMap,
  useMapLayer,
  useMapBuffer,
  useResourceData
} from '@/hooks';
import { GlobalAPI, MAX_PAGE_SIZE, EventIconSize, ResourceIconSize, ResourceClusterIconSize, EVENT_HANDLING, RESOURCE_NAME, RISK_NAME, PROTECT_NAME, scaleSizeRadio, CLUSTER_MIN_POINTS } from '@/common';
import { ButtonItem, LayerTreeItem } from '@/types';
import { apiDataResourceObj } from '@/apis/modules/data-resource';
import { apiFixedVideoObj } from '@/apis/modules/fixed-video';

const { showMask } = useLayout();
const { setCenter } = useMap();
const { waitingRefreshLayerMarkers, getAllLayerKeys, updateLayer, removeLayers, addIcon, clearLayers } = useMapLayer();
const { queryParams } = useMapBuffer();
const { currentEvent } = useCurrentEvent(handleEventHandlingLayers);
const { ALL_RESOURCES_DICT_NEW, getResourceInfo, isResource } = useResourceData();

const resourceApiObj = {
  [RISK_NAME]: 'postFindEventSurroundingRisk',
  [RESOURCE_NAME]: 'postFindEventSurroundingResources',
  [PROTECT_NAME]: 'postFindEventSurroundingProtectionTarget'
};

const isLoading = ref(false);
const show = ref(true);
const treeRef = ref();
const treeProps = {
  label: 'name',
  children: 'children',
};
const defaultKeys = ref<LayerTreeItem[]>([]);
const treeData = ref<Record<string, any>[]>([]);

const defaultExpandedKeys = computed(() => ['-1']);
const defaultCheckedKeys = computed(() => defaultKeys.value.map(d => d.layerCode));

const loadLayerData = (layers: LayerTreeItem[]) => {
  isLoading.value = true;
  layers.forEach(async lk => {
    if ([EVENT_HANDLING].includes(lk.layerCode)) {
      await updateCurrentEventLayer(lk);
    } else if (['FixedVideo'].includes(lk.layerCode)) {
      await updatFixedVideoLayer(lk);
    } else if (['SitePersonnel'].includes(lk.layerCode)) {
      await updatEventPersonsLayer(lk);
    } else if (['EventAssemblePoints'].includes(lk.layerCode)) {
      await updatEventAssemblePointsLayer(lk);
    }
  });
  isLoading.value = false;
};

const loadResourceLayerData = async(layers: LayerTreeItem[]) => {
  if (!layers.length) return;

  isLoading.value = true;
  const params = {
    ...queryParams.value,
    pageSize: -1,
    strategyId: currentEvent.strategyInfoId
  };
  Object.keys(resourceApiObj).forEach(async prefixKey => {
    const uKeys = new Set<string>();
    layers.forEach(lk => {
      if (lk.belong?.startsWith(prefixKey)) {
        uKeys.add(lk.layerCode);
      }
    });
    if (uKeys.size) {
      // @ts-ignore
      const result = await apiDataResourceObj[resourceApiObj[prefixKey]]({ ...params, resourceType: [...uKeys.keys()] });
      const groupResults = groupBy(result.data, 'resourceType');
      uKeys.forEach(k => {
        if (!groupResults[k]) groupResults[k] = []; // 添加空图层，防止下次对比后，仍继续请求api查找此图层
      });
      Object.keys(groupResults).forEach(key => {
        updateMapResourceLayer({
          layerCode: key,
          name: ALL_RESOURCES_DICT_NEW.value[key].label,
        }, groupResults[key]);
      });
    }
  });
  isLoading.value = false;
};

const updateCurrentEventLayer = async(lk: LayerTreeItem) => {
  const center = [+currentEvent.longitude, +currentEvent.latitude];
  updateLayer(lk.layerCode, {
    data: [{
      coordinates: center,
      properties: {
        ...currentEvent,
        icon: lk.name
      }
    }]
  });
  setCenter(center);
};

const updatFixedVideoLayer = async(lk: LayerTreeItem) => {
  const result = await apiFixedVideoObj.postFindEventFixedDeviceList({ ...queryParams.value, pageSize: -1 });
  updateMapResourceLayer(lk, result.data.list);
};
const updatEventPersonsLayer = async(lk: LayerTreeItem) => {
  const result = await apiDataResourceObj.postListEventPersons({
    circleCenter: { longitude: queryParams.value.longitude, latitude: queryParams.value.latitude },
    eventId: currentEvent.id,
    radius: queryParams.value?.distance,
    rangeType: '1'
  });

  updateMapResourceLayer(lk, result.data);
};

const updatEventAssemblePointsLayer = async(lk: LayerTreeItem) => {
  const result = await apiDataResourceObj.postFindCommandCenterAssemblePointList(currentEvent.id);

  updateLayer(lk.layerCode, {
    data: result.data.map(d => ({
      coordinates: [+d.longitude, +d.latitude],
      properties: {
        ...d,
        resourceType: lk.layerCode,
        icon: lk.name
      }
    }))
  });
  addIcon(lk.name, GlobalAPI.config.MAP_IMAGES_URL + 'normal/' + lk.name + '.svg', ResourceIconSize);
};

const updateMapResourceLayer = (lk: LayerTreeItem, list: any[]) => {
  const clusterIcon = isResource(lk.layerCode) ? getResourceInfo(lk.layerCode, 'code') : `${lk.name}-cluster`;
  const icon = isResource(lk.layerCode) ? getResourceInfo(lk.layerCode, 'code') : lk.name;
  updateLayer(lk.layerCode, {
    cluster: true,
    clusterMinPoints: CLUSTER_MIN_POINTS,
    clusterIcons: [{
      textColor: 'white',
      textSize: scaleSizeRadio(16),
      iconName: clusterIcon,
    }],
    data: list.map(d => ({
      coordinates: [+d.longitude, +d.latitude],
      properties: {
        ...d,
        resourceType: lk.layerCode,
        icon
      }
    }))
  });
  addIcon(icon, GlobalAPI.config.MAP_IMAGES_URL + 'normal/' + icon + '.svg', ResourceIconSize);
  addIcon(clusterIcon, GlobalAPI.config.MAP_IMAGES_URL + 'cluster/' + icon + '.svg', ResourceClusterIconSize);
};

const diffLayers = (layers: LayerTreeItem[]) => {
  const resourcesLayers: LayerTreeItem[] = [];
  const otherLayers: LayerTreeItem[] = [];
  layers.forEach(al => {
    const resourceItem = ALL_RESOURCES_DICT_NEW.value[al.layerCode];
    if (resourceItem) {
      resourcesLayers.push({ ...al, belong: resourceItem.belong });
    } else {
      otherLayers.push(al);
    }
  });
  return { resourcesLayers, otherLayers };
};

const handleCheckChange = () => {
  const checkedNodes: LayerTreeItem[] = treeRef.value.getCheckedNodes(true);
  const checkedNodesKeys: string[] = treeRef.value.getCheckedKeys(true);
  const existedLayerKeys = getAllLayerKeys();

  const waitingDeletedLayerKeys = existedLayerKeys.filter(ek => !checkedNodesKeys.includes(ek));
  const waitingAddedLayers = checkedNodes.filter(ck => !existedLayerKeys.includes(ck.layerCode));

  removeLayers(waitingDeletedLayerKeys);

  const { resourcesLayers, otherLayers } = diffLayers(waitingAddedLayers);
  loadLayerData(otherLayers);
  loadResourceLayerData(resourcesLayers);
};

const clearCheckedNodes = () => {
  treeRef.value.setCheckedKeys([]);
};

async function handleEventHandlingLayers() {
  clearLayers();
  const localTreeData: Record<string, any>[] = [];

  const remoteResources: Array<{name: string;value:string;layerSeq:number;}> = [];
  GlobalAPI.config.WARTIME_MAP_CONFIG.mapLayers.forEach((m: any) => {
    const icon = isResource(m.value) ? getResourceInfo(m.value, 'code') : `${m.icon || m.name}`;
    if (!m.remote) {
      localTreeData.push({
        id: m.value,
        name: m.name,
        layerCode: m.value,
        layerSeq: m.layerSeq,
        iconUrl: GlobalAPI.config.MAP_IMAGES_URL + `layer/${icon}.svg`
      });
      if (m.layerSelected) {
        defaultKeys.value.push({ name: m.name, layerCode: m.value });
      }
    } else {
      remoteResources.push(m);
    }
  });
  treeData.value = localTreeData.sort((d1, d2) => d1.layerSeq - d2.layerSeq); // 开始渲染树，不用等底下的远程图层
  loadLayerData(defaultKeys.value);

  const allTreeData: Record<string, any>[] = [...localTreeData];
  for (const r of remoteResources) {
    // @ts-ignore
    const result = await apiDataResourceObj[r.value]({ strategyId: currentEvent.strategyInfoId });
    allTreeData.push({
      id: r.value,
      name: r.name,
      layerCode: r.value,
      layerSeq: r.layerSeq,
      children: result.data.map((d: any) => {
        const label = ALL_RESOURCES_DICT_NEW.value[d.resoureType].label;
        return {
          id: d.resoureType,
          name: label,
          layerCode: d.resoureType,
          iconUrl: GlobalAPI.config.MAP_IMAGES_URL + `layer/${getResourceInfo(d.resoureType, 'code')}.svg`
        };
      })
    });
  }
  treeData.value = allTreeData.sort((d1, d2) => d1.layerSeq - d2.layerSeq);
}

watch(queryParams, () => { // 监听缓冲区更新，重新加载资源，视频，现场人员数据
  const checkedNodes: LayerTreeItem[] = treeRef.value.getCheckedNodes(true);
  const { resourcesLayers, otherLayers } = diffLayers(checkedNodes);

  loadResourceLayerData(resourcesLayers);

  otherLayers.forEach(lk => {
    if (['FixedVideo'].includes(lk.layerCode)) {
      updatFixedVideoLayer(lk);
    } else if (['SitePersonnel'].includes(lk.layerCode)) {
      updatEventPersonsLayer(lk);
    }
  });
});

watch(waitingRefreshLayerMarkers, val => {
  console.log('waitingRefreshLayerMarkers', val);
  if (val.length) {
    const checkedNodes: LayerTreeItem[] = treeRef.value.getCheckedNodes(true);
    checkedNodes.forEach(async lk => {
      if (val.includes(lk.layerCode)) {
        if (lk.layerCode === 'EventAssemblePoints') {
          await updatEventAssemblePointsLayer(lk);
        }
      }
    });
    nextTick(() => {
      waitingRefreshLayerMarkers.value = [];
    });
  }
});

defineExpose({
  clearCheckedNodes
});
</script>
<style lang="scss" scoped>
</style>
