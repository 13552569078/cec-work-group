<template>
  <hl-panel class="card-panel" borderless>
    <template #header>
      <div class="panel-title">
        {{ title }}
      </div>
      <div class="panel-header-right">
        <slot name="action" />
      </div>
    </template>
    <div class="card-panel-body">
      <slot />
    </div>
  </hl-panel>
</template>
<script lang="ts" setup>

defineProps({
  title: String
});

</script>
<style lang="scss" scoped>
.card-panel {
  width: var(--card-width);
  --panel-bg-color: transparent;
  --panel-header-height: calc(var(--xxs) * 11);
  --panel-header-padding: 0;
  --panel-body-padding: var(--md) 0 0 0;
  --panel-shadow: none;
  :deep(.panel-header) {
    height: var(--panel-header-height);
    background-image: url('@/assets/images/panel/panel-header.png');
    background-repeat: no-repeat;
    background-size: 100%;
    .panel-title {
      font-size: calc(var(--font-sm) + var(--font-md));
      font-family: YouSheBiaoTiHei;
      color: #FFFFFF;
      line-height: calc(var(--font-lg) + var(--font-xl));
      padding-left: calc(var(--xxs) * 16);
    }
  }
  :deep(.panel-body) {
    height: calc(100% - var(--panel-header-height));
    .card-panel-body {
      height: 100%;
      padding: var(--panel-body-padding);
    }
  }
}
</style>
