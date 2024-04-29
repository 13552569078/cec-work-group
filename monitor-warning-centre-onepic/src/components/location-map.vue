<template>
  <hl-dialog v-model="dialogVisiable" custom-class="map-container" title="选择位置" width="800px" height="800px" :append-to-body="true" @closed="handleClose">
    <x-map :zoom="14" @click="handleMapClick" :center="centers" @created="mapCreatedHandler">
      <x-tianditu-layer :types="['img','cia']"/>
      <x-map-marker :coordinates="locations" :draggable="false" color="red"/>
    </x-map>
    <template #footer>
      <span class="dialog-footer">
        <hl-button @click="handleClose">取 消</hl-button>
        <hl-button type="primary" class="m-l-md" @click="handleConfirm">确 定</hl-button>
      </span>
    </template>
  </hl-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { GlobalAPI } from '@/common/global-api';
// eslint-disable-next-line camelcase
const { center } = JSON.parse(GlobalAPI.config.MAP_CONFIG_MONITOR_WARNING_ONEPIC);

const props = defineProps({
  visiable: {
    type: Boolean,
    default: false
  },
  longitude: {
    type: Number
  },
  latitude: {
    type: Number
  }
});

const emit = defineEmits(['locationClose', 'locationSubmit']);
const dialogVisiable = ref(props.visiable);
const centers = ref([]);
const locations = ref([]);

watch(
  () => props.visiable,
  (count, prevCount) => {
    dialogVisiable.value = count;
  }
);
const mapCreatedHandler = map => {
  map.resize();
};
const handleMapClick = info => {
  locations.value = info.coordinates;
};
const handleClose = () => {
  emit('locationClose');
};
const handleConfirm = () => {
  const url = `http://api.tianditu.gov.cn/geocoder?postStr={'lon':${locations.value[0]},'lat':${locations.value[1]},'ver':1}&type=geocode&tk=82d822a61cefc9898e63a0c51e933f5a`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const locationInfo = {
        lon: locations.value[0],
        lat: locations.value[1],
        address: data?.result?.formatted_address
      };
      console.log(locationInfo);
      emit('locationSubmit', locationInfo);
    })
    .catch(e => console.log('maps-error', e));
};

onMounted(() => {
  locations.value = [props.longitude || center[0], props.latitude || center[1]];
  centers.value = [props.longitude || center[0], props.latitude || center[1]];
});
</script>
<style lang="scss">
.map-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  .panel-body {
    height: 100%;
  }
}
.mapboxgl-marker {
  position: absolute;
  top: 0;
  left: 0;
  will-change: transform;
}
</style>
