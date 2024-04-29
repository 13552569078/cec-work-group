<template>
  <hl-group dir="vertical" gap-x="var(--md)" gap-y="calc(var(--xs)* 1.5)" class="page-left">
    <left-1 />
    <left-2 />
    <left-3 />
  </hl-group>
  <hl-group dir="vertical" gap-x="var(--md)" gap-y="calc(var(--xs)* 1.5)" class="page-right">
    <right-1 />
  </hl-group>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import left1 from './panels/left-1.vue';
import left2 from './panels/left-2.vue';
import left3 from './panels/left-3.vue';
import right1 from './panels/right-1.vue';
// import right2 from './panels/right-2.vue';

</script>

<style lang="scss" scoped>
.today-condition {
  position: absolute;
  top: calc(var(--xxs) * 24);
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}

.float-number {
  position: absolute;
  left: size(32px);
  right: 0;
  top: 0;
  bottom: 0;
  pointer-events: none;
}
</style>
