<template>
  <hl-panel class="w-100 h-100" full-body>
    <MbLocationDisplayer
      :zoom="10"
      :locations="initCenter"
      show-location-tip
      @click="$emit('clickMap')"
    />
  </hl-panel>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { TiandituApi } from '@hongtu-next/core';
import { GlobalAPI } from '@/common/global-api';
import { MAPBOX_CONFIG, loadMapboxComponents } from '@/common';

const { center: defaultCenter } = GlobalAPI.config.MAP_CONFIG_LINKAGE_COMMAND_ONEPIC;
const [MbLocationDisplayer] = loadMapboxComponents(['MbLocationDisplayer']);

const emit = defineEmits(['clickMap']);
const props = defineProps({
  longitude: {
    type: [Number, String]
  },
  latitude: {
    type: [Number, String]
  }
});

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
