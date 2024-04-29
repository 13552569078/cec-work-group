<template>
  <hl-group dir="vertical" gap="var(--xxs)">
    <hl-group class="box-styled p-sm" dir="vertical" gap="var(--xxs)">
      <div>
        <span class="font-lg">半径范围：</span>
        <hl-input v-model.number="distances" placeholder="请输入半径范围" style="width: 30%;margin-right: var(--sm);" /><span
          style="margin-right: var(--lg);">千米内</span>
        <hl-button class="query-btn" style="height: calc(var(--xxs) * 8)" @click="submit">查询</hl-button>
      </div>
    </hl-group>
    <div class="font-lg m-t-sm">搜索结果</div>
    <layer-switcher-radius :isSingleEvent="true" :distances="distancesClone" :eventDetail="eventDetail" />
  </hl-group>
</template>

<script setup lang='ts'>
import { ref } from 'vue';

const props = defineProps({
  eventDetail: {
    type: Object,
    default: () => ({})
  }
});
const distances = ref(5);
const distancesClone = ref(5);
const submit = () => {
  if (distances.value) {
    distancesClone.value = distances.value;
  }
};
</script>

<style lang="scss" scoped>
:deep(.layer-switcher-box) {
  position: relative !important;
  left: 0;
  top: 0;
  z-index: 999;
}

:deep(.hl-checkbox-group .hl-checkbox) {
  font-size: var(--font-lg) !important;
}

.query-btn {
  position: absolute;
  right: var(--xxl);
  color: #D0DEEE !important;
  background: rgba(21, 154, 255, 0.25) !important;
  box-shadow: inset 0px 34px 32px 0px rgba(21, 154, 255, 0.5), inset 0px 0px 12px 0px rgba(46, 102, 255, 0.5) !important;
}
</style>
<style lang="scss">
.layer-switcher-single-box {
  .layer-panel {
    width: 100%;
  }

  .text {
    font-size: 1.125rem !important;
  }
}
</style>
