<template>
  <div class="map-layers" :class="[showMask ? 'map-tools-left-show' : 'map-tools-moving-left']">
    <div class="layer-list-icon cursor-pointer" @click="show=!show">
      <hl-icon size="lg"><fill-layer /></hl-icon>
    </div>
    <card-popover title="图层" :class="['map-layer-list m-t-md', show ? '' : 'hide']">
      <template #action>
        <hl-spinner v-if="isLoading" />
      </template>
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
    </card-popover>
  </div>
</template>
<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { CommonUtils } from 'fx-front-utils';
import { useCurrentArea, useLayout, useMapLayer, useResourceData } from '@/hooks';
import { GlobalAPI, DATA_RESOURCE_EVENT, DATA_RESOURCE_GOAL, DATA_RESOURCE_EMERGENCY, DATA_RESOURCE_SUPPORT, MAX_PAGE_SIZE, EVENT_HANDLING, EventIconSize, ResourceIconSize, ResourceClusterIconSize, scaleSizeRadio, CLUSTER_MIN_POINTS } from '@/common';
import { ButtonItem, LayerTreeItem } from '@/types';
import { apiResourceObj } from '@/apis/modules/resource';
import { apiDataResourceObj } from '@/apis/modules/data-resource';
import { apiEventListObj } from '@/apis/modules/event-list';
import { apiFixedVideoObj } from '@/apis/modules/fixed-video';

const { showMask } = useLayout();
const { waitingRefreshLayerMarkers, getAllLayerKeys, updateLayer, removeLayers, addIcon, clearLayers } = useMapLayer();
const { areaCode } = useCurrentArea();
const { getResourceInfo, isResource } = useResourceData();

const isLoading = ref(false);
const show = ref(true);
const treeRef = ref();
const treeProps = {
  label: 'name',
  children: 'children',
};
const defaultKeys = ref<LayerTreeItem[]>([]);
const treeData = ref<Record<string, any>[]>([]);

const defaultExpandedKeys = computed(() => defaultKeys.value.map(d => d.layerCode));
const defaultCheckedKeys = computed(() => defaultKeys.value.map(d => d.layerCode));

const loadLayerData = (layers: LayerTreeItem[]) => {
  isLoading.value = true;
  layers.forEach(async lk => {
    if (DATA_RESOURCE_GOAL.includes(lk.layerCode)) {
      await updateGoalLayer(lk);
    } else if (DATA_RESOURCE_EMERGENCY.includes(lk.layerCode)) {
      await updateEmergencyLayer(lk);
    } if (DATA_RESOURCE_SUPPORT.includes(lk.layerCode)) {
      await updateSupportLayer(lk);
    } if (DATA_RESOURCE_EVENT.includes(lk.layerCode)) {
      await updateEventLayer(lk);
    } if (['FixedVideo'].includes(lk.layerCode)) {
      await updatFixedVideoLayer(lk);
    }
  });
  isLoading.value = false;
};

const updateEventLayer = async(lk: LayerTreeItem) => {
  const result = await apiEventListObj.postFindEventList({
    currentPage: 1,
    pageSize: MAX_PAGE_SIZE,
    areaCodeList: [areaCode.value],
    eventStates: lk.layerCode.split(','),
  });
  updateLayer(lk.layerCode, {
    data: result.data.list.map(d => ({
      coordinates: [+d.longitude, +d.latitude],
      properties: {
        ...d,
        icon: lk.name
      }
    }))
  });
  // 处置中是lottie动画，不是icon
  // lk.layerCode !== EVENT_HANDLING && addIcon(lk.name, GlobalAPI.config.MAP_IMAGES_URL + 'normal/' + lk.name + '.svg', [47, 108]);
  addIcon(lk.name, GlobalAPI.config.MAP_IMAGES_URL + 'normal/' + lk.name + '.svg', EventIconSize);
};
const updateSupportLayer = async(lk: LayerTreeItem) => {
  const result = await apiDataResourceObj.postSupportResourcePage({
    currentPage: 1,
    pageSize: MAX_PAGE_SIZE,
    areaCode: areaCode.value,
    type: lk.layerCode,
  });
  updateMapResourceLayer(lk, result.data.list);
};
const updateEmergencyLayer = async(lk: LayerTreeItem) => {
  const result = await apiDataResourceObj.postStatResourcePage({
    currentPage: 1,
    pageSize: MAX_PAGE_SIZE,
    areaCode: areaCode.value,
    type: lk.layerCode,
  });
  updateMapResourceLayer(lk, result.data.list);
};
const updateGoalLayer = async(lk: LayerTreeItem) => {
  const result = await apiResourceObj.postFindFocusGoalsPageByType({
    currentPage: 1,
    pageSize: MAX_PAGE_SIZE,
    areaCode: areaCode.value,
    category: lk.layerCode,
  });
  updateMapResourceLayer(lk, result.data.list);
};
const updatFixedVideoLayer = async(lk: LayerTreeItem) => {
  const result = await apiFixedVideoObj.postFindEventFixedDeviceList({ distance: '', pageSize: -1 });
  updateMapResourceLayer(lk, result.data.list);
};

const updateMapResourceLayer = (lk: LayerTreeItem, list: any[]) => {
  const clusterIcon = isResource(lk.layerCode) ? getResourceInfo(lk.layerCode, 'code') : `${lk.name}-cluster`;
  const icon = isResource(lk.layerCode) ? getResourceInfo(lk.layerCode, 'code') : lk.name;
  updateLayer(lk.layerCode, {
    cluster: true,
    // clusterMinPoints: CLUSTER_MIN_POINTS,
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

const handleCheckChange = () => {
  const checkedNodes: LayerTreeItem[] = treeRef.value.getCheckedNodes(true);
  const checkedNodesKeys: string[] = treeRef.value.getCheckedKeys(true);
  const existedLayerKeys = getAllLayerKeys();

  const waitingDeletedLayerKeys = existedLayerKeys.filter(ek => !checkedNodesKeys.includes(ek));
  const waitingAddedLayers = checkedNodes.filter(ck => !existedLayerKeys.includes(ck.layerCode));

  removeLayers(waitingDeletedLayerKeys);
  loadLayerData(waitingAddedLayers);
};

const handleOverviewLayers = () => {
  const overviewConfig = GlobalAPI.config.NORMAL_MAP_CONFIG;
  overviewConfig.mapLayers.forEach((m: any) => {
    const icon = isResource(m.value) ? getResourceInfo(m.value, 'code') : `${m.icon || m.name}`;
    treeData.value.push({
      id: m.value,
      name: m.name,
      layerCode: m.value,
      layerSeq: m.layerSeq,
      iconUrl: GlobalAPI.config.MAP_IMAGES_URL + `layer/${icon}.svg`
    });
    if (m.layerSelected) {
      defaultKeys.value.push({ name: m.name, layerCode: m.value });
    }
  });
  Object.keys(overviewConfig).forEach(k => {
    if (overviewConfig[k]?.asLayers) {
      const layer = {
        id: '' + CommonUtils.seqID(),
        layerSeq: overviewConfig[k].layerSeq,
        name: overviewConfig[k].name,
        children: [] as any[]
      };
      overviewConfig[k].tabs.forEach((t: ButtonItem) => {
        const icon = isResource(t.value) ? getResourceInfo(t.value, 'code') : `${t.label}`;
        if (!t.hideLayer) {
          layer.children.push({
            id: t.value,
            name: t.label,
            layerCode: t.value,
            iconUrl: GlobalAPI.config.MAP_IMAGES_URL + 'layer/' + icon + '.svg'
          });
          if (t.layerSelected) {
            defaultKeys.value.push({ name: t.label, layerCode: t.value });
          }
        }
      });
      treeData.value.push(layer);
    }
  });
  treeData.value.sort((d1, d2) => d1.layerSeq - d2.layerSeq);
  loadLayerData(defaultKeys.value);
};

watch(areaCode, () => {
  clearLayers();
  const checkedNodes = treeRef.value.getCheckedNodes(true);
  loadLayerData(checkedNodes);
});

watch(waitingRefreshLayerMarkers, val => {
  console.log('waitingRefreshLayerMarkers', val);
  if (val.length) {
    const checkedNodes: LayerTreeItem[] = treeRef.value.getCheckedNodes(true);
    checkedNodes.forEach(async lk => {
      if (val.includes(lk.layerCode)) {
        if (DATA_RESOURCE_EVENT.includes(lk.layerCode)) {
          await updateEventLayer(lk);
        }
      }
    });
    nextTick(() => {
      waitingRefreshLayerMarkers.value = [];
    });
  }
});

handleOverviewLayers();
</script>
<style lang="scss" scoped>
</style>
