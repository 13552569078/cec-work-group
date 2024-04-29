<template>
  <div :class="['left-panels', showMask ? 'panels-show' : 'left-panels-hidden', left1Expandable || left3Expandable ? 'expandable' : '']">
    <left1 :class="[left3Expandable ? 'panel-hidden' : '']" />
    <left2 v-if="resourceTypeLoaded" :class="[left1Expandable || left3Expandable ? 'panel-hidden' : '']" />
    <left3 :class="[left1Expandable ? 'panel-hidden' : '']" />
  </div>
  <div :class="[
    'right-panels',
    showMask ? 'panels-show' : 'right-panels-hidden',
    right1Expandable || right2Expandable ? 'expandable' : ''
  ]">
    <right1 v-if="resourceTypeLoaded" :class="{'panel-hidden': right2Expandable}" />
    <right2 :class="{'panel-hidden': right1Expandable}" />
    <right3 v-if="createAssemblePointParams.show"/>
  </div>
  <map-tools @clear-map="clearMap" />
  <map-layers v-if="resourceTypeLoaded" ref="mapLayersRef" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, provide, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import {
  useCurrentEvent,
  useDataRefresher,
  useExpandableCard,
  useLayout,
  useMapBuffer,
  useMapLayer,
  useResourceData,
  useWarning
} from '@/hooks';
import { ExpandableCardParams, ResourceDetailParams, CreateAssemblePointParams } from '@/types';
import { ExpandableCardParamsKey, ResourceDetailParamsKey, CreateAssemblePointParamsKey } from '@/common';
import Left1 from './left-1.vue';
import Left2 from './left-2.vue';
import Left3 from './left-3.vue';
import Right1 from './right-1.vue';
import Right2 from './right-2.vue';
import Right3 from './right-3.vue';
import MapLayers from '../map-layers.vue';
import MapTools from '../map-tools.vue';

const route = useRoute();
const { currentEvent, fetchEvent, clearEvent } = useCurrentEvent();
const { showMask } = useLayout();
const { tempResourceItemMarkerKey, removeMarker, clearAll } = useMapLayer();
const { clearBuffers } = useMapBuffer();
const { getWarningList } = useWarning();
const { getAllResourceType, resourceTypeLoaded } = useResourceData();

useDataRefresher(() => {
  currentEvent.eventTypeCode && getWarningList({ eventTypes: currentEvent.eventTypeCode });
});

const { expandable: left1Expandable } = useExpandableCard();
const { expandable: left3Expandable } = useExpandableCard();
const { expandable: right1Expandable } = useExpandableCard();
const { expandable: right2Expandable } = useExpandableCard();

const mapLayersRef = ref();
const createAssemblePointParams = reactive({
  show: false,
  title: '',
  type: '',
  data: {} as CreateAssemblePointParams['data']
});

provide<CreateAssemblePointParams>(CreateAssemblePointParamsKey, createAssemblePointParams);
provide<ExpandableCardParams>(ExpandableCardParamsKey, {
  left1: left1Expandable,
  left3: left3Expandable,
  right1: right1Expandable,
  right2: right2Expandable,
});

const clearMap = () => {
  clearAll();
  mapLayersRef.value.clearCheckedNodes();
};

watch(right1Expandable, val => {
  !val && removeMarker(tempResourceItemMarkerKey);
});

watch(() => route.query.id, async id => {
  if (id) {
    await fetchEvent(`${id}`);
    getWarningList({ eventTypes: currentEvent.eventTypeCode });
  }
}, {
  immediate: true,
});

getAllResourceType();

onBeforeUnmount(() => {
  clearBuffers();
  clearAll();
  clearEvent();

  createAssemblePointParams.show = false;
});
</script>
<style scoped lang="scss">
</style>
