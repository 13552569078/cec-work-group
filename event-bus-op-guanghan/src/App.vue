<template>
  <template v-if="defaultAreaId">
    <page-header />
    <!-- <page-header-secondary /> -->
    <div class="mask-top"></div>
    <div class="mask-left"></div>
    <div class="mask-right"></div>
    <div class="mask-bottom"></div>
    <!-- 地图 -->
    <div class="map-class">
      <background-map />
    </div>

    <hl-group
      dir="vertical"
      gap="var(--md)"
      class="left-float-panel"
    >
      <!-- <globalSearchPanel /> -->
      <icon-button v-show="!isGlobalSearchOpen" :icon="icon" :iconOn="iconOn" @click="toggleGlobalSearchBox"/>
    </hl-group>

    <!-- 页面工具栏 -->
    <tool-box />
    <layer-switcher />
    <router-view v-if="isRouterAlive"></router-view>
  </template>
</template>

<script setup lang="ts">
import { provide, watch, ref, nextTick, computed } from 'vue';
import BackgroundMap from '@/components/background-map/background-map.vue';
import { useRoute, useRouter } from 'vue-router';
import { useGlobalState } from '@/hooks';
import { apiUtilsObj as api } from '@/apis';
import icon from '@/assets/images/buttons/global_search_button.png';
import iconOn from '@/assets/images/buttons/global_search_button_on.png';

const { defaultAreaId, searchParams, defualtSearchParams, isGlobalSearchOpen, toggleGlobalSearchBox } = useGlobalState();

const route = useRoute();
const router = useRouter();

const systemName = ref('');
const isRouterAlive = ref(true);
provide('systemName', systemName);

const reload = () => {
  isRouterAlive.value = false;
  nextTick(() => {
    isRouterAlive.value = true;
  });
};

provide('reload', reload);

// 获取行政区划
const getAreaList = async () => {
  try {
    const res = await api.getAreaList();
    defaultAreaId.value = res.data[0].id;
    if (searchParams.district === 0) {
      defualtSearchParams.district = defaultAreaId.value;
      Object.assign(searchParams, defualtSearchParams);
    }
  } catch (error) {
    console.log('获取地区失败');
    defaultAreaId.value = 1;
  }
};
getAreaList();
</script>

<style lang="scss">
.map-class {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
