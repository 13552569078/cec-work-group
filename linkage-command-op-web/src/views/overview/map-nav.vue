<template>
  <div class="map-nav p-r-sm" :class="[showMask ? 'map-tools-left-show' : 'map-tools-moving-left']">
    <hl-group class="nav-name-box">
      <hl-icon class="m-r-xs">
        <fill-map />
      </hl-icon>
      <span @mouseenter="showAreaPanel = true" v-for="(nav, idx) in mapNavs" :key="idx">
        <h6 class="nav-name" :title="nav.name">
          {{ nav.name.length > 6 ? nav.name.substring(0, 6) + '...' : nav.name }}
        </h6>
        <span v-if="idx !== mapNavs.length - 1" class="nav-sepatator">&nbsp;-&nbsp;</span>
      </span>
    </hl-group>

    <hl-cascader-panel
      v-if="showAreaPanel"
      v-model="pathCodeList"
      ref="areaCascaderPanelRef"
      :options="areaTreeData"
      :props="areaProps"
      @change="onAreaChange"
      @mouseleave="showAreaPanel = false"
    />
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, nextTick } from 'vue';
import { useAreaList, useCurrentArea, useLayout, useMap, useMapNav } from '@/hooks';

const { showMask } = useLayout();
const { setCenter: setMapCenter } = useMap();
const { setArea, areaCode, areaName, areaCenter, setCenter: setAreaCenter } = useCurrentArea();
const { mapNavs } = useMapNav();
const { areaTreeData, getAreaTree } = useAreaList();

const pathCodeList = ref<string[]>([]);
const areaCascaderPanelRef = ref();
const showAreaPanel = ref(false);
const areaProps = {
  emitPath: true,
  value: 'code',
  label: 'name',
  checkStrictly: true,
  children: 'children',
};

const initData = () => {
  if (!mapNavs.value.length) {
    mapNavs.value = [
      {
        code: areaCode.value,
        name: areaName.value,
        longitude: `${areaCenter.value[0]}`,
        latitude: `${areaCenter.value[1]}`
      }
    ];
  }
  pathCodeList.value = mapNavs.value.map(el => el.code);
};

const onAreaChange = (data: string[]) => {
  const pathNodes = areaCascaderPanelRef.value.getCheckedNodes()[0].pathNodes;
  mapNavs.value = pathNodes.map((el: any, idx: number) => idx === 0 ? mapNavs.value[0] : el.data);

  pathCodeList.value = data;
  const { name, code, latitude, longitude } = areaCascaderPanelRef.value.getCheckedNodes()[0].data;
  setArea({ areaName: name, areaCode: code, latitude, longitude });
  setMapCenter([+longitude!, +latitude!]);
};

onMounted(async() => {
  await getAreaTree();
  setAreaCenter(+areaTreeData.value[0].longitude, +areaTreeData.value[0].latitude);
  initData();
  setMapCenter(areaCenter.value.map(Number));
});
</script>
<style lang="scss" scoped>
.map-nav {
  position: absolute;
  top: var(--panels-top);
  z-index: 10;
  .nav-name-box {
    height: calc(var(--xxs) * 10);
    display: flex;
    align-items: center;
    background: linear-gradient(270deg, rgba(1,62,100,0) 0%, rgba(0,78,121,0.9) 100%);
    border: 1px solid;
    border-image: linear-gradient(270deg, rgba(36, 155, 242, 0), rgba(85, 213, 241, 0.24)) 1 1;
    border-right: none;
    padding-left: calc(var(--xxs) * 3);
    color: #FFF;
    cursor: pointer;
    font-weight: var(--font-weight-bold);
    h6 {
      display: inline;
    }
  }
}
</style>
