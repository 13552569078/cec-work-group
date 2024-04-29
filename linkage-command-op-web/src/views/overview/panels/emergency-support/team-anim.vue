<template>
  <div ref="teamAnimDom" class="team-anim"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import lottie from 'lottie-web';
import { getPrjRoot } from '@/common';
import animData from './team-anim.json';

animData.assets.forEach(a => {
  a.u = getPrjRoot() + '/images/anim/team/';
});

const teamAnimDom = ref();
onMounted(() => {
  lottie.loadAnimation({
    container: teamAnimDom.value,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData: animData
  });
});
</script>

<style lang="css" scoped>
.team-anim {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: -1;
}
</style>
