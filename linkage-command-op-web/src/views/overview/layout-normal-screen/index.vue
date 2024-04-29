<template>
  <!-- 中小屏布局 宽高比在3.5以下，左右各一列卡片-->
  <div :class="['left-panels', showMask ? 'panels-show' : 'left-panels-hidden', expandable ? 'expandable' : '']">
    <left1 :class="[expandable ? 'panel-hidden' : '']"/>
    <left2 />
    <left3 :class="[expandable ? 'panel-hidden' : '']"/>
  </div>
  <div v-if="resourceTypeLoaded" :class="['right-panels', showMask ? 'panels-show' : 'right-panels-hidden']">
    <right1 />
    <right2 />
    <right3 />
    <right4 v-if="resourceDetailParams.show"/>
  </div>
  <map-nav />
  <map-layers v-if="resourceTypeLoaded" />
</template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted, provide, reactive, ref } from 'vue';
import {
  useExpandableCard,
  useLayout,
  useMapLayer,
  useWarning,
  useDataRefresher,
  useResourceData
} from '@/hooks';
import { ExpandableCardParams, ResourceDetailParams } from '@/types';
import { ExpandableCardParamsKey, ResourceDetailParamsKey } from '@/common';
import Left1 from './left-1.vue';
import Left2 from './left-2.vue';
import Left3 from './left-3.vue';
import Right1 from './right-1.vue';
import Right2 from './right-2.vue';
import Right3 from './right-3.vue';
import Right4 from './right-4.vue';
import MapLayers from '../map-layers.vue';
import MapNav from '../map-nav.vue';
import { GlobalAPI } from '@/common';

const { showMask, setGlobalTitle } = useLayout();
const { expandable } = useExpandableCard();
const { clearAll } = useMapLayer();
const { getWarningList } = useWarning();
const { getAllResourceType, resourceTypeLoaded } = useResourceData();
useDataRefresher(getWarningList);

const resourceDetailParams = reactive({
  show: false,
  title: '',
  key: ''
});

provide<ResourceDetailParams>(ResourceDetailParamsKey, resourceDetailParams);
provide<ExpandableCardParams>(ExpandableCardParamsKey, { left2: expandable });

onMounted(() => {
  getAllResourceType();
  getWarningList();
  setGlobalTitle();
});

onBeforeUnmount(() => {
  clearAll();
});
</script>
<style scoped lang="scss">
</style>
