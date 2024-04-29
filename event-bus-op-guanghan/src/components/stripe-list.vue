<template>
  <hl-scrollbar :style="`height: ${height};max-height: ${height};`" ref="treeScrollbarRef">
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
  // background: rgba(43, 54, 72, 0.78);
  border-collapse: separate; /* 确保边框被分隔开 */
  border-spacing: 0px calc(var(--xl) * 0.24); /* 调整行之间的间距 */
  // opacity: 0.7;
  color: #fff;
  thead {
    background: rgba(55, 86, 126, 1);
    color: #fff;
  }
  // .striped-odd > tbody > tr:nth-child(odd) td {
  //   background: rgba(72, 86, 110, 0.78);
  //   opacity: 0.7;
  // }
  // tbody > tr:nth-child(odd) {
  //   background: #214664;
  // }
  // tbody > tr:nth-child(even) {
  //   background: #142330;
  // }
  tbody tr td {
    padding: 0 !important;
  }
  .fixed-left {
    background-color: transparent;
  }
}
</style>
