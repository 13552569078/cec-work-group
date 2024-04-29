<template>
  <div class="scrolling-bar-chart" style="width: 100%">
    <div class="title-wrap m-b-xxs" v-if="title">
      <span class="title-icon m-r-xxs"></span>
      {{ title }}
    </div>
    <hl-group class="item-list w-full" dir="vertical" gap="var(--md)">
      <hl-group class="item p-md w-full" align="items-between items-middle" v-for="(barItem, idx) in chartData" :key="idx">
        <span class="label">{{ barItem.label }}</span>
        <span
          ><b class="gradient-text m-r-xxs">{{ barItem.value }}</b
          ><span class="unit" v-if="showUnit">{{ unit }}</span></span
        >
      </hl-group>
    </hl-group>
  </div>
</template>
<script lang="ts" setup>
import { CSSProperties, PropType, computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  showUnit: {
    type: Boolean,
    default: true
  },
  unit: {
    type: String,
    default: '件'
  },
  chartData: {
    type: Array as PropType<CardListItem[]>,
    default: () => []
  }
});

export interface CardListItem {
  value: any;
  label: string;
  precent?: string;
  barStyle?: Record<string, unknown>;
  valueStyle?: CSSProperties;
  labelStyle?: CSSProperties;
}
</script>
<style lang="scss" scoped>
.item {
  background-image: url('@/assets/images/eventStat/bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  height: calc(var(--xl) * 1.6);
}
.label {
  // padding-left: calc(var(--xl) * 0.6);
  font-size: calc(var(--xl) * 0.56);
}
.gradient-text {
  font-size: calc(var(--xl) * 0.6) !important;
  background: linear-gradient(180deg, #eeeeee 0%, #5eb5ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.unit {
  font-size: calc(var(--xl) * 0.42);
  color: #ffffff;
}
.title-wrap {
  color: #ffffff;
  font-size: calc(var(--xl) * 0.6);
  .title-icon {
    display: inline-block;
    width: calc(var(--xl) * 0.52);
    height: calc(var(--xl) * 0.46);
    background: url('@/assets/images/eventCenter/trend-title.png') no-repeat;
    background-size: 100% 100%;
  }
}
</style>
