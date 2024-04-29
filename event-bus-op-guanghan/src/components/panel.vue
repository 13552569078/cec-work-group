<template>
  <!-- 面板内容 begin-->
  <hl-col
    class="custom-panel"
    span="col-24"
  >
    <hl-panel
      class="panel-card index"
      borderless
      :class="panelClass"
      :style="bodyHeight ? `--panel-body-height: ${bodyHeight}` : ''"
    >
      <template #header>
        <h2 class="panel-title">
          <slot name="title">
            {{ title }}
          </slot>

        </h2>
        <div class="panel-header-right">
          <slot name="action"></slot>
        </div>
      </template>
      <slot></slot>
    </hl-panel>
  </hl-col>
  <!-- 面板内容 end-->
</template>

<script lang="ts" setup>
import { defineComponent } from 'vue';
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  bodyHeight: {
    type: String,
    default: '',
  },
  panelClass: {
    type: String,
    default: '',
  },
});
</script>
<style lang="scss" scoped>
</style>
