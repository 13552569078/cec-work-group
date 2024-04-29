<template>
  <div ref="plan3AnimDom" class="plan3-anim"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import lottie from 'lottie-web';
import { getPrjRoot } from '@/common';
import animData from './plan3-anim.json';

animData.assets.forEach(a => {
  if (a.u && a.u.indexOf('images') > -1) {
    a.u = getPrjRoot() + '/images/anim/plan/plan3/';
  }
});

const plan3AnimDom = ref();
onMounted(() => {
  lottie.loadAnimation({
    container: plan3AnimDom.value,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData: animData
  });
});
</script>

<style lang="css" scoped>
.plan3-anim {
  position: absolute;
  width: 80%;
  height: 80%;
  top: -10%;
  left: -16%;
}
</style>
