<template>
  <div ref="eventIconDom" class="event-handling-icon" :style="iconSize"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import lottie from 'lottie-web';
import animData from '@/assets/images/map/even-handling-icon.json';
import { EventAnimIconSize, GlobalAPI } from '@/common';

animData.assets.forEach(a => {
  a.u = GlobalAPI.config.MAP_IMAGES_URL + 'normal/处置中/';
});

const iconSize = `width:${EventAnimIconSize[0]}px;height:${EventAnimIconSize[1]}px`;

const eventIconDom = ref();
onMounted(() => {
  lottie.loadAnimation({
    container: eventIconDom.value,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData: animData
  });
});
</script>

<style lang="css" scoped>
</style>
