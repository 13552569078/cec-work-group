<template>
  <hl-group class="progress-bar w-full">
    <hl-group class="h-full progress-inner" :style="`width:${percent}%`"></hl-group>
    <hl-group class="full progress-text" align="items-between">
      <hl-group align="items-middle">{{ progressName }}</hl-group>
      <hl-group align="items-right">{{percent}}%</hl-group>
    </hl-group>
    <hl-group class="progress-rect h-full" :style="`left: calc(${percent}% - (var(--xl) * 0.12))`"></hl-group>
  </hl-group>
</template>
<script lang="ts" setup>
const props = defineProps({
  percent: {
    type: [Number, String],
    default: '82'
  },
  progressName: {
    type: String,
    default: '相似度'
  },
});
</script>
<style lang="scss" scoped>
.progress-bar {
  position: relative;
  height: calc(var(--xl) * 0.64);
  background: rgba(15,20,30,1);
  font-size: calc(var(--xl) * 0.5);
  line-height: calc(var(--xl) * 0.66);
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: #FFFFFF;
  .progress-inner {
    background: url('@/assets/images/sample/progress-bar-bg.png');
    background-size: calc(var(--xl) * 1.32) 100%;
  }
  .progress-text {
    position: absolute;
    padding: 0 calc(var(--xl) * 0.36);
    font-family: PingFangSC-Medium;
  }
  .progress-rect {
    position: absolute;
    background: #fff;
    width: calc(var(--xl) * 0.12);
  }
}
</style>
