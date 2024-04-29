<template>
  <hl-scrollbar :style="`height: ${height};max-height: ${height};`" ref="treeScrollbarRef" class="w-full">
    <hl-simple-table class="w-full" :cols="cols" :data="list" stripe fixed-header v-bind="$attrs">
      <template #tableIndex="{ rowIndex }">
        <hl-group align="items-middle">{{ rowIndex + 1 }}</hl-group>
      </template>
    </hl-simple-table>
  </hl-scrollbar>
</template>

<script lang="ts" setup>
import { defineComponent } from 'vue';
import { ProgressBar } from '@/components';

const props = defineProps({
  list: {
    type: Array,
    default: () => {
      return [];
    }
  },
  cols: {
    type: Array,
    default: () => {
      return [];
    }
  },
  height: {
    type: String,
    default: 'calc(var(--xxl) * 11.3)'
  }
});
</script>
<!-- 透传 -->
<script lang="ts">
export default {
  inheritAttrs: false
};
</script>
<style lang="scss" scoped>
:deep(.hl-simple-table) {
  border-collapse: separate; /* 确保边框被分隔开 */
  border-spacing: 0px var(--xxs); /* 调整行之间的间距 */
  color: #DDF2FF;
  thead {
    background-color: #06274C;
    color: #fff;
    th {
      background-color: rgba(0,126,203,0.2) !important;
      // background-color: transparent;
      height: calc(var(--xxs) * 10);
    }
  }
  tbody tr {
    &:nth-child(odd) {
      td {
        background: rgba(71,132,255,0.1) !important;
      }
    }
    &:nth-child(even) {
      td {
        background: rgba(0,11,32,0.15) !important;
      }
    }
    td {
      height: calc(var(--xxs) * 9);
      padding: 0 !important;
      border-top: 1px solid rgba(0,138,255,0.1);
      border-bottom: 1px solid rgba(0,138,255,0.1);
      &:first-child {
        border-left: 1px solid rgba(0,138,255,0.1);
      }
      &:last-child {
        border-right: 1px solid rgba(0,138,255,0.1);
      }
    }
  }
  .fixed-left {
    background-color: transparent;
  }
  .fixed-top::before {
    border: 1px solid rgba(0,138,255,0.1);
    height: calc(var(--xxs) * 10);
    top: var(--xxs);
  }
}
</style>
