<template>
  <div ref="plan5AnimDom" class="plan5-anim"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import lottie from 'lottie-web';
import { getPrjRoot } from '@/common';
import animData from './plan5-anim.json';

animData.assets.forEach(a => {
  if (a.u && a.u.indexOf('images') > -1) {
    a.u = getPrjRoot() + '/images/anim/plan/plan5/';
  }
});

const plan5AnimDom = ref();
onMounted(() => {
  lottie.loadAnimation({
    container: plan5AnimDom.value,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData: animData
  });
});
</script>

<style lang="css" scoped>
.plan5-anim {
  position: absolute;
  width: 80%;
  height: 80%;
  top: -10%;
  left: -16%;
}
</style>
