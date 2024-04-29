<template>
<hl-group class="trend-title" :class="isLong ? 'title-long' : ''" align="items-middle">
  <div>
    <slot></slot>
  </div>
</hl-group>
</template>

<script lang='ts' setup>
const props = defineProps({
  isLong: {
    type: Boolean,
    default: false
  }
});
</script>

<style lang='scss' scoped>
.trend-title {
  padding-left: calc(var(--xl) * 0.65);
  width: 100%;
  height: calc(var(--xl) * 1.23);
  background-image: url('@/assets/images/eventCenter/title-label.png');
  background-repeat: no-repeat;
  background-size: 100% auto;
  font-size:  calc(var(--xl) * 0.6);
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: bold;
  color: #FFFFFF;
  &.title-long {
    background-image: url('@/assets/images/eventCenter/title-label-long.png');
  }
}
</style>
