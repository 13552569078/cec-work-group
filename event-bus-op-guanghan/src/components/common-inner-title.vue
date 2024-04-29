<template>
  <hl-group class="inner-title w-full">
    <hl-group align="items-middle">
      <img class="start-icon" src="@/assets/images/eventDetail/history-title.png" alt="">
      <slot name="left"></slot>
    </hl-group>
     <hl-group align="items-middle">
      <slot name="right"></slot>
    </hl-group>
  </hl-group>
</template>
<style lang="scss" scoped>
.inner-title {
  padding: 0 calc(var(--xl) * 0.72);
  height: calc(var(--xl) * 1.2);
  justify-content: space-between;
  font-size: calc(var(--xl) * 0.48);
  font-family: SourceHanSansCN-Light, SourceHanSansCN;
  font-weight: 300;
  color: #FFFFFF;
  background-image: url('@/assets/images/eventDetail/history-title-bg.png');
  background-repeat: no-repeat;
  background-size: cover;
  .start-icon {
    margin-right: calc(var(--xl) * 0.52);
    width: calc(var(--xl) * 0.81);
    height: calc(var(--xl) * 0.81);

  }
}
</style>
