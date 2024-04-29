<template>
  <div ref="plan1AnimDom" class="plan1-anim"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import lottie from 'lottie-web';
import { getPrjRoot } from '@/common';
import animData from './plan1-anim.json';

animData.assets.forEach(a => {
  if (a.u && a.u.indexOf('images') > -1) {
    a.u = getPrjRoot() + '/images/anim/plan/plan1/';
  }
});

const plan1AnimDom = ref();
onMounted(() => {
  lottie.loadAnimation({
    container: plan1AnimDom.value,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData: animData
  });
});
</script>

<style lang="css" scoped>
.plan1-anim {
  position: absolute;
  width: 80%;
  height: 80%;
  top: -10%;
  left: -16%;
}
</style>
