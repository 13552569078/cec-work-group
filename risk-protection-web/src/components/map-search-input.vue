<template>
  <mb-location-searcher
    class="map-search-input"
    ref="mapSearcherRef"
    :map-bound="mapBound"
    @focus="f => $emit('foucs', f)"
    @showLocations="locs => $emit('showLocations', locs)"
    @selectLocation="loc => $emit('selectLocation', loc)"
  />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { GlobalAPI, loadMapboxComponents } from '@/common';

const { mapBound } = GlobalAPI.config.MAP_CONFIG_LINKAGE_COMMAND_ONEPIC;
const [MbLocationSearcher] = loadMapboxComponents(['MbLocationSearcher']);

const route = useRoute();

const mapSearcherRef = ref();

const setResultVisible = (visible: boolean) => {
  mapSearcherRef.value.setResultVisible(visible);
};

defineExpose({
  setResultVisible,
});
</script>
<style lang="scss" scoped>
.map-search-input {
  position: absolute;
  left: calc(var(--xxs) * 6);
  top: var(--md);
}
</style>
