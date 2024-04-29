<template>
  <hl-group class="aggre-box p-t-lg cursor-pointer" dir="vertical" align="items-middle" gap="var(--xxs)">
    <span class="font-xl m-b-xxxs">{{ props.data.areaName }}</span>
    <span><strong class="gradient-text number">{{ props.data.eventNum }}</strong> 件</span>
    <span class="font-md">{{ props.data.eventRate }}%</span>
  </hl-group>
</template>

<script setup lang="ts">
import { useGlobalState } from '@/hooks';
import bg from '@/assets/images/map/aggregation_bg.png';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
});

const { searchParams, isLastLevelArea, globalSearchIsChanged } = useGlobalState();
const handleClick = () => {
  searchParams.district = props.data.areaId;
  globalSearchIsChanged();
  isLastLevelArea.value = true;
};

</script>

<style lang="scss">
  .aggre-box {
    width: calc(var(--xl) * 4.05);
    height: calc(var(--xl) * 6);
    position: relative;
    background: url(@/assets/images/map/aggregation_bg.png);
    background-size: contain;
    background-repeat: no-repeat;
    img {
      width: 100%;
    }
    .number {
      font-size: calc(var(--md) * 1.5);
      line-height: calc(var(--md) * 1.5);
    }
  }
</style>
