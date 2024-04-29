<template>
  <div class="box-close-btn cursor-pointer" @click="emit('click')"></div>
</template>

<script lang='ts' setup>
import { ref } from 'vue';
const emit = defineEmits(['click']);
</script>

<style lang='scss' scoped>
.box-close-btn {
  background: url('@/assets/images/buttons/close_button.png') 100% 100%;
  width: calc(var(--xxl) * 1.1963);
  height: calc(var(--xxl) * 0.72);
  position: absolute;
  top: calc(var(--xs) * -1);
  right: calc(var(--xs) * -1);
  background-size: contain;
  &:hover {
    background-image: url('@/assets/images/buttons/close_button_on.png');
  }
}
</style>
