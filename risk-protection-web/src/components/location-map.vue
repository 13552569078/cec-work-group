<template>
  <MbLocationSelector
    show-location-tip
    :location="initCenter"
    :map-bound="mapBound"
    @ok="args => $emit('ok', args)"
    @cancel="$emit('cancel')"
  />
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { GlobalAPI, loadMapboxComponents } from '@/common';

const { center: defaultCenter, mapBound } = GlobalAPI.config.MAP_CONFIG_LINKAGE_COMMAND_ONEPIC;
const [MbLocationSelector] = loadMapboxComponents(['MbLocationSelector']);

const props = defineProps({
  longitude: {
    type: [Number, String]
  },
  latitude: {
    type: [Number, String]
  }
});
const emit = defineEmits(['cancel', 'ok']);

const initCenter = ref<number[]>([]);

watch(() => [props.longitude, props.latitude], () => {
  if (props.longitude && props.latitude) {
    initCenter.value = [+props.longitude, +props.latitude];
  } else {
    initCenter.value = [defaultCenter[0], defaultCenter[1]];
  }
}, {
  immediate: true,
});
</script>
<style lang="scss">
</style>
