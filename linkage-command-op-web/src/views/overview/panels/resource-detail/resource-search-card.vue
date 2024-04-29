<template>
  <card-popper :title="resourceDetailParams.title" class="resource-search-card" @close="closeDetailCard">
    <hl-input v-model="keyword" block @keypress.enter="loadData">
      <template #prefix>
        <hl-icon><fill-search /></hl-icon>
      </template>
    </hl-input>
    <hl-scrollbar class="list">
      <div class="list-item cursor-pointer" v-for="item in items" :key="item.resName + item.address" @click="setMapCenter(item)">
        <h5 class="name text-ellipsis" :title="item.resName">{{ item.resName }}</h5>
        <span v-if="!isResourceEquip" class="address text-ellipsis" :title="item.address">
          <hl-icon><fill-map /></hl-icon>
          {{ item.address }}
        </span>
      </div>
      <div v-if="!items.length">
        <hb-empty :image="noDataImg"></hb-empty>
      </div>
    </hl-scrollbar>
  </card-popper>
</template>
<script lang="ts" setup>
import { ref, inject, watch, reactive, onBeforeUnmount, computed } from 'vue';
import { BasicResourceItem, ResourceDetailParams } from '@/types';
import { useCurrentArea, useMap, useMapLayer, useResourceData } from '@/hooks';
import { apiResourceObj } from '@/apis/modules/resource';
import { FOCUS_GOAL, GlobalAPI, ResourceDetailParamsKey, ResourceIconSize, RESOURCE_EQUIP, RESOURCE_EXPERT, RESOURCE_MATERIAL, RESOURCE_TEAM, RISK_REFUGE } from '@/common';
import noDataImg from '@/assets/images/empty/no-data.png';

const resourceDetailParams = inject<ResourceDetailParams>(ResourceDetailParamsKey)!;

const { areaCode } = useCurrentArea();
const { setCenter } = useMap();
const { tempResourceItemMarkerKey, updateMarker, removeMarker } = useMapLayer();
const { getResourceInfo } = useResourceData();

const keyword = ref('');
const pagination = reactive({
  currentPage: 1,
  pageSize: 100
});
const items = ref<BasicResourceItem[]>([]);

const isResourceEquip = computed(() => resourceDetailParams.key === RESOURCE_EQUIP);

const closeDetailCard = () => {
  removeMarker(tempResourceItemMarkerKey);
  resourceDetailParams.show = false;
};
const setMapCenter = (item: BasicResourceItem) => {
  // if (isResourceEquip.value) return; // 应急物资不打点
  const resourceType = resourceDetailParams.key === FOCUS_GOAL ? resourceDetailParams.code : resourceDetailParams.key;
  setCenter([+item.longitude, +item.latitude]);
  updateMarker(tempResourceItemMarkerKey, [
    {
      coordinates: [+item.longitude, +item.latitude],
      iconUrl: GlobalAPI.config.MAP_IMAGES_URL + 'normal/' + getResourceInfo(resourceType, 'code') + '.svg',
      iconSize: ResourceIconSize,
      properties: {
        resourceType,
        ...item
      }
    }
  ]);
};

const searchEmergency = async() => {
  const result = await apiResourceObj.postPageResource({
    ...pagination,
    name: keyword.value,
    areaCode: areaCode.value,
    resType: resourceDetailParams.code,
    type: resourceDetailParams.type,
  });
  items.value = result.data.list;
};
const searchFocusGoals = async() => {
  const result = await apiResourceObj.postFindFocusGoalsPageByType({
    ...pagination,
    resName: keyword.value,
    areaCode: areaCode.value,
    category: resourceDetailParams.code,
  });
  items.value = result.data.list;
};

const loadData = () => {
  switch (resourceDetailParams.key) {
    case RESOURCE_EQUIP:
    case RESOURCE_MATERIAL:
    case RISK_REFUGE:
    case RESOURCE_EXPERT:
    case RESOURCE_TEAM:
      searchEmergency();
      break;
    case FOCUS_GOAL:
      searchFocusGoals();
      break;
    default:
      break;
  }
};

watch(resourceDetailParams, () => {
  resourceDetailParams.key && loadData();
}, {
  immediate: true,
});
watch(areaCode, () => {
  resourceDetailParams.key && loadData();
});

onBeforeUnmount(() => {
  items.value = [];
});
</script>
<style lang="scss" scoped>
</style>
