<template>
  <div ref="plan2AnimDom" class="plan2-anim"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import lottie from 'lottie-web';
import { getPrjRoot } from '@/common';
import animData from './plan2-anim.json';

animData.assets.forEach(a => {
  if (a.u && a.u.indexOf('images') > -1) {
    a.u = getPrjRoot() + '/images/anim/plan/plan2/';
  }
});

const plan2AnimDom = ref();
onMounted(() => {
  lottie.loadAnimation({
    container: plan2AnimDom.value,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData: animData
  });
});
</script>

<style lang="css" scoped>
.plan2-anim {
  position: absolute;
  width: 80%;
  height: 80%;
  top: -10%;
  left: -16%;
}
</style>
