<template>
  <div class="map-mode-switcher" :class="{lower: !isFooterEventListOpen}">
    <div class="button-tab">
      <div class="button-styled" :class="{on: layerSwitch.mode === MAP_POINT}" @click="handleChangeMode(MAP_POINT)">事件点位</div>
      <div class="button-styled" :class="{on: layerSwitch.mode === MAP_AGGRE}" @click="handleChangeMode(MAP_AGGRE)">事件聚合</div>
      <div class="button-styled" :class="{on: layerSwitch.mode === MAP_HEAT}" @click="handleChangeMode(MAP_HEAT)">事件热力图</div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { useGlobalState } from '@/hooks';
import { MAP_AGGRE, MAP_HEAT, MAP_POINT } from '@/common';

const {
  layerSwitch,
  isFooterEventListOpen,
} = useGlobalState();

const handleChangeMode = (mode: string) => {
  layerSwitch.mode = mode;
};

</script>

<style lang='scss' scoped>
</style>
