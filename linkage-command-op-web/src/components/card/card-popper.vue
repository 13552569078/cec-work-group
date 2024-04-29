<template>
  <hl-panel class="card-popper" borderless>
    <template #header>
      <div class="panel-title">
        {{ title }}
      </div>
      <div class="panel-header-right">
        <slot name="action" />
        <img v-if="showClose" :src="closeIcon" class="close-icon" @click="$emit('close')" />
      </div>
    </template>
    <div class="card-panel-body">
      <slot />
    </div>
  </hl-panel>
</template>
<script lang="ts" setup>
import closeIcon from '@/assets/images/panel/close.png';

defineProps({
  title: String,
  showClose: {
    type: Boolean,
    default: true,
  }
});

</script>
<style lang="scss" scoped>
.card-popper {
  position: relative;
  width: var(--card-popper-width);
  --panel-bg-color: transparent;
  --panel-header-height: calc(var(--xxs) * 11);
  --panel-header-padding: 0;
  --panel-body-padding: var(--md);
  --panel-shadow: none;
  :deep(.panel-header) {
    height: var(--panel-header-height);
    background-image: var(--card-popper-header-img);
    background-repeat: no-repeat;
    background-size: 100%;
    .panel-title {
      font-size: var(--font-xxxl);
      font-family: YouSheBiaoTiHei;
      color: #FFFFFF;
      line-height: var(--font-xxxxl);
      padding-left: calc(var(--xxs) * 12);
    }
    .panel-header-right {
      .close-icon {
        cursor: pointer;
        width: calc(var(--xxs) * 7);
        height: calc(var(--xxs) * 7);
      }
    }
  }
  :deep(.panel-body) {
    height: calc(100% - var(--panel-header-height));
    background: url('@/assets/images/panel/body-bg.png') no-repeat;
    background-size: 100% 100%;
    padding-top: var(--panel-body-padding) !important;
    .card-panel-body {
      height: 100%;
    }
    &::before, &::after {
      content: "";
      position: absolute;
      bottom: 0;
      width: calc(var(--xxs) * 2.5);
      height: calc(var(--xxs) * 2.5);
    }
    &::before {
      left: 0;
      background: url('@/assets/images/panel/bottom-left-icon.png') no-repeat;
      background-size: 100%;
    }
    &::after {
      right: 0;
      background: url('@/assets/images/panel/bottom-right-icon.png') no-repeat;
      background-size: 100%;
    }
  }
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    width: 100%;
    height: var(--md);
    background: url('@/assets/images/panel/bottom-line.png') no-repeat;
    background-size: 100%;
  }
}
</style>
