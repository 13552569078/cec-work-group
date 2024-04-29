<template>
  <page-header />
  <div class="mask-top"></div>
  <div class="mask-left"></div>
  <div class="mask-right"></div>
  <div class="mask-bottom"></div>
  <div class="map-class">
    <background-map />
  </div>
  <page-menu/>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { provide, watch, ref } from 'vue';
import PageHeader from './layout/page-header-sm.vue';
import BackgroundMap from '@/components/background-map/background-map.vue';
import { useRoute, useRouter } from 'vue-router';
import PageMenu from '@/layout/page-menu.vue';

const route = useRoute();
const router = useRouter();
const systemName = ref('');
provide('systemName', systemName);

watch(
  () => router.currentRoute.value.path,
  (newValue, oldValue) => {
    if (newValue !== '/') {
      // 系统分类
      systemName.value = newValue.includes('/warning') ? '预警' : newValue.includes('/monitor') ? '报警' : '';
      provide('systemName', systemName);
    }
  },
  { immediate: true }
);
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
