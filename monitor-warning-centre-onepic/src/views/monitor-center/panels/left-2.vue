<template>
  <hv-panel title="监测布控">
    <template #action> </template>
    <hl-group align="items-between" class="ornament-title bg-light m-t-md p-r-md border border-dark">
      <span>监测主体</span>
      <hl-group align="items-middle" class="static" gap="var(--sm)">
        <hl-group align="items-middle" gap="var(--sm)">
          <span>共</span>
          <span class="text-primary relative" data-suffix="个">{{ totalRegionNumber }}</span>
        </hl-group>
        <hl-group align="items-middle" gap="var(--sm)">
          <span>已选择</span>
          <template v-if="selectedRegionNumber>0">
            <hl-popover placement="right" trigger="click" class="m-r-lg"
                        @show="regionTreeShow=true" @hide="regionTreeShow=false">
              <template #reference>
                <span class="text-success relative cursor-pointer" data-suffix="个">{{ selectedRegionNumber }}</span>
              </template>
              <address-tree
                :selectedRegionTypeIds="selectedRegionTypeIds"
                v-if="regionTreeShow"
                :regionTypeCodeList="distFilterData.regionTypeCodeList" />
            </hl-popover>
          </template>
          <span v-else class="text-success relative" data-suffix="个">{{ selectedRegionNumber }}</span>
        </hl-group>
      </hl-group>
      <hl-group merge indent>
        <hl-button size="sm" @click="handleAllRegionType">全选</hl-button>
        <hl-button size="sm" @click="handleClearRegionType">清除</hl-button>
      </hl-group>
    </hl-group>

    <hl-group full class="border border-dark border-top-none bg-light p-md">
      <hl-scrollbar style="height: calc(var(--xxs) * 37);">
        <hl-checkbox-group v-model="selectedRegionTypeIds" dir="horizontal" wrap full>
          <hl-row layout="grid" count="count-3" class="" gap="var(--xs)" full>
            <hl-col span="col" v-for="regionType in regionTypeList" :key="regionType.id">
              <hl-checkbox class="w-full" :label="regionType.id" custom>
                <hl-group dir="vertical" align="items-middle" full class="p-xxs border checked:border-success transition">
                  <h4 class="font-din m-b-xxs checked:text-success">{{ regionType.regionNumber }}</h4>
                  <hl-group full align="items-center" class="p-y-xxs bg-light checked:bg-success-opacity-2 bounce-enter-checked" gap="var(--xxs)">
                    <hb-text-overflow method="length" :length="5" effect="dark" class="text-center">
                      {{ regionType.regionTypeName }}
                    </hb-text-overflow>
                  </hl-group>
                </hl-group>
              </hl-checkbox>
            </hl-col>
          </hl-row>
        </hl-checkbox-group>
      </hl-scrollbar>
    </hl-group>
    <hl-group align="items-between" class="ornament-title bg-light p-r-md border border-top-none border-dark">
      <span>监测点</span>
      <hl-group align="items-middle" class="static" gap="var(--sm)">
        <hl-group align="items-middle" gap="var(--sm)">
          <span>共</span>
          <span class="text-primary relative" data-suffix="个">{{ totalEventNumber }}</span>
        </hl-group>
        <hl-group align="items-middle" gap="var(--sm)">
          <span>已选择</span>
          <template v-if="selectedEventNumber>0">
            <hl-popover placement="top" trigger="click" class="m-r-lg"
                        @show="eventTreeShow=true" @hide="eventTreeShow=false">
              <template #reference>
                <span class="text-success relative cursor-pointer" data-suffix="个">{{ selectedEventNumber }}</span>
              </template>
              <address-tree
                :selectedRegionTypeIds="selectedRegionTypeIds"
                v-if="eventTreeShow"
                :eventTypeCodeList="distFilterData.eventTypeCodeList"/>
            </hl-popover>
          </template>
          <span v-else class="text-success relative" data-suffix="个">{{ selectedEventNumber }}</span>
        </hl-group>
        <hl-group merge indent>
          <hl-button size="sm" @click="handleAllEventType">全选</hl-button>
          <hl-button size="sm" @click="handleClearEventType">清除</hl-button>
        </hl-group>
      </hl-group>
    </hl-group>
    <hl-group full="full-x" class="border border-dark border-top-none bg-light p-md">
      <hl-scrollbar height="calc(var(--xxs) * 20)">
        <hl-checkbox-group v-model="selectedEventTypeIds" dir="horizontal" wrap full v-if="eventTypeList.length>0">
          <hl-row layout="grid" count="count-2" gap="var(--xs)">
            <hl-col v-for="eventType in eventTypeList" :key="eventType.eventTypeCode" span="col">
              <hl-checkbox class="w-full" :label="eventType.eventTypeCode" custom>
                <hb-data-collect full="full-x" padding-x="var(--sm)" padding-y="var(--xxs)" class="border bg-light checked:border-primary radius-none">
                  <hb-text-overflow method="length" :length="10" effect="dark" class="text-secondary font-md checked:text-primary">
                    {{ eventType.eventTypeName }}
                  </hb-text-overflow>
                  <hl-group align="items-middle" class="static" gap="var(--xs)">
                    <h4 class="font-din relative">{{ eventType.monitorPointNumber }}</h4>
                  </hl-group>
                </hb-data-collect>
              </hl-checkbox>
            </hl-col>
          </hl-row>
        </hl-checkbox-group>
        <hl-group full v-else class="display-flex items-middle items-center">暂无数据</hl-group>
      </hl-scrollbar>
    </hl-group>
    <hl-group align="items-between" class="ornament-title bg-light p-r-md border border-top-none border-dark">
      <span>监测设备</span>
    </hl-group>
    <hl-group dir="vertical" full gap="var(--sm)" class="border border-dark border-top-none bg-light p-md">
      <hb-data-collect class="border" full="full-x" gap="var(--sm)" padding="var(--sm)">
        <cite class="dom-frame"><cite class="dom-frame"></cite></cite>
        <hl-icon size="sm" fill class="symbol">
          <fill-Monitor />
        </hl-icon>
        <span class="text-secondary font-md">监控视频</span>
        <hl-group align="items-right" gap="var(--lg)">
          <hl-group align="items-middle" class="static" gap="var(--xs)">
            <span class="text-secondary">共</span>
            <h3 class="font-lg text-primary">{{ totalVideoNumber }}</h3>
            <span class="text-secondary">路</span>
          </hl-group>
          <hl-group align="items-middle" class="static" gap="var(--xs)">
            <span class="text-secondary">已选择</span>
            <h3 class="font-lg text-primary">{{ selectedVideoNumber }}</h3>
            <span class="text-secondary">路</span>
          </hl-group>
        </hl-group>
      </hb-data-collect>
      <hb-data-collect class="border" full="full-x" gap="var(--sm)" padding="var(--sm)">
        <cite class="dom-frame"><cite class="dom-frame"></cite></cite>
        <hl-icon size="sm" fill class="symbol">
          <fill-Monitor />
        </hl-icon>
        <span class="text-secondary font-md">物联设备</span>
        <hl-group align="items-right" gap="var(--lg)">
          <hl-group align="items-middle" class="static" gap="var(--xs)">
            <span class="text-secondary">共</span>
            <h3 class="font-lg text-primary">{{ totalIotNumber }}</h3>
            <span class="text-secondary">个</span>
          </hl-group>
          <hl-group align="items-middle" class="static" gap="var(--xs)">
            <span class="text-secondary">已选择</span>
            <h3 class="font-lg text-primary">{{ selectedIotNumber }}</h3>
            <span class="text-secondary">个</span>
          </hl-group>
        </hl-group>
      </hb-data-collect>
    </hl-group>
  </hv-panel>
</template>

<script setup lang="ts">
import { ref, watch, computed, inject } from 'vue';
import { useMonitorCenter, useMap } from '@/hooks';
import AddressTree from '@/views/monitor-center/components/address-tree.vue';
import { Emitter } from 'mitt';
const $mitter = inject('$mitter') as Emitter;

const {
  regionTypeList,
  eventTypeList,
  selectedRegionTypeIds,
  selectedEventTypeIds,
  totalRegionNumber,
  selectedRegionNumber,
  totalEventNumber,
  selectedEventNumber,
  totalVideoNumber,
  totalIotNumber,
  selectedVideoNumber,
  selectedIotNumber,
  mapRegions,
  mapEvents,
  mapMonitorPoints,
  getRegionTypeList,
  getEventTypeList,
  selectAllRegionType,
  clearRegionType,
  selectAllEventType,
  clearEventType,
  getMapRegionData,
  getMapEvent,
  getMapMonitorPoints,
} = useMonitorCenter();

const {
  updatePolygonData,
  updatePointData,
  resetMapPoint,
  resetMapPolygen
} = useMap();

const regionTreeShow = ref(false);
const eventTreeShow = ref(false);

const showAddressTree = ref(false);
const distFilterData = computed(() => {
  return {
    regionTypeCodeList: selectedRegionTypeIds.value,
    eventTypeCodeList: selectedEventTypeIds.value,
  };
});
const fetchMonitorData = () => {
  getRegionTypeList();
  getEventTypeList();
  getMapEvent();
  // fetchMapData();
};

const fetchMapData = (type?: string) => {
  getMapEvent();
  if (!type) {
    getMapRegionData({ regionTypeCodeList: selectedRegionTypeIds.value });
  }
  getMapMonitorPoints(distFilterData.value);
};

const init = () => {
  fetchMonitorData();
};

init();

watch(() => selectedRegionTypeIds.value, async() => {
  const data = {
    regionTypeCodeList: selectedRegionTypeIds.value,
  };
  resetMapPoint();
  clearEventType();
  if (selectedRegionTypeIds.value.length) {
    await getEventTypeList();
    selectAllEventType();
    getMapRegionData(data);
  } else {
    resetMapPolygen();
    getEventTypeList();
  }
});

watch(() => selectedEventTypeIds.value, () => {
  resetMapPoint();
  if (selectedEventTypeIds.value.length) {
    fetchMapData('event');
  } else {
    getMapEvent();
  }
});

watch(() => mapRegions.value, () => {
  updatePolygonData(mapRegions.value);
});

watch(() => mapEvents.value, () => {
  updatePointData(mapEvents.value);
});

watch(() => mapMonitorPoints.value, () => {
  updatePointData(mapMonitorPoints.value);
});

// 全选主体类型
const handleAllRegionType = () => {
  selectAllRegionType();
};
// 清空主体类型选择
const handleClearRegionType = () => {
  clearRegionType();
};

// 全选事件类型
const handleAllEventType = () => {
  selectAllEventType();
};
// 清空事件类型选择
const handleClearEventType = () => {
  clearEventType();
};

</script>
<style lang="scss" scoped></style>
