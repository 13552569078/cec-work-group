<template>
  <x-source id='yancheng' :tileJsonSource="yanchengVectorTileSource" />
  <!-- *********底图********* -->
    <x-mapbox-style-layer :mapboxStyle="yanchengMapStyle"/>
    <!-- <x-water-layer
      id="waterLayer"
      beforeId="name-town"
      :data="`${base}/map/data/water.geojson`"
      :dataTransform="(d) => d.features"
      :getPolygon="(data) => data.geometry.coordinates[0]"
      :opacity="0.5"
    /> -->
  <!-- *********底图结束********* -->
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { GlobalAPI } from '@/common';
const base = GlobalAPI.config.PROD_PREFIX ? '/' + GlobalAPI.config.PROD_PREFIX : '';

const mapServicePerfix = GlobalAPI.config.MAP_SERVICE;
// ----------- 基础地图属性 ---------------
const yanchengMapStyle = ref(`${mapServicePerfix}/api/styles/yancheng`);
// const yanchengVectorTileSource = ref({
//   type: 'vector',
//   url: `${mapServicePerfix}/api/tilesets/yancheng/tilejson`
// });
const yanchengVectorTileSource = ref({
  type: 'vector',
  url: `${base}/mapJson/tile.json`
});
</script>
