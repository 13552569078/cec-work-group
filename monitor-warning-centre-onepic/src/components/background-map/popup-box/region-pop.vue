<template>
  <hl-group class="pop-bg">
    <h2>{{$props.warningNumber}}</h2>
    <span>{{ `${systemName}次数` }}</span>
  </hl-group>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
const props = defineProps({
  warningNumber: {
    type: String,
    default: '0'
  }
});
const systemName = ref(inject('systemName'));
</script>

<style lang="scss">
  .pop-bg {
    width: calc(var(--xxs) * 32);
    height: calc(var(--xxs) * 40);
    position: relative;
    background: url('@/assets/pop-bg.png') no-repeat;
    background-size: contain;
    h2 {
      position: absolute;
      top: calc(var(--xxs) * 2);
      right: calc(var(--xxs) * 2);
      color: #FA5050;
    }
    span {
      position: absolute;
      left: calc(var(--xxs) * 2);
      top: calc(var(--xxs) * 12);
    }
  }
</style>
