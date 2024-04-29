<template>
  <div ref="overviewAnimDom" class="overview-anim"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import lottie from 'lottie-web';
import { getPrjRoot } from '@/common';
import animData from './overview-anim.json';

animData.assets.forEach(a => {
  if (a.u && a.u.indexOf('images') > -1) {
    a.u = getPrjRoot() + 'images/anim/event-stat/';
  }
});

const overviewAnimDom = ref();
onMounted(() => {
  lottie.loadAnimation({
    container: overviewAnimDom.value,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData: animData
  });
});
</script>

<style lang="css" scoped>
.overview-anim {
  position: absolute;
  width: 200%;
  height: 140%;
  top: 0;
  left: -50%;
}
</style>
