<template>
  <div class="card-popover">
    <div class="header" v-if="title || $slots.action">
      <h4 class="title">{{ title }}</h4>
      <slot name="action" />
    </div>
    <div class="body">
      <slot v-if="$slots.default" />
      <template v-else>
        {{ content }}
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>

defineProps({
  title: String,
  content: String
});

</script>
<style lang="scss" scoped>
.card-popover {
  position: relative;
  background: rgba(16,51,91,0.9);
  border: 1px solid;
  border-image: linear-gradient(180deg, rgba(71, 99, 141, 0.12), rgba(81, 165, 255, 0.89), rgba(64, 83, 112, 0.26)) 1 1;
  backdrop-filter: blur(1.4px);
  &::before, &::after {
    content: "";
    position: absolute;
    top: 0;
    width: calc(var(--xxs) * 2.5);
    height: calc(var(--xxs) * 2.5);
  }
  &::before {
    left: 0;
    background: url('@/assets/images/panel/top-left-icon.png') no-repeat;
    background-size: 100%;
  }
  &::after {
    right: 0;
    background: url('@/assets/images/panel/top-right-icon.png') no-repeat;
    background-size: 100%;
  }
  .header {
    position: relative;
    font-size: var(--font-h4);
    color: #FFFFFF;
    padding: var(--sm) var(--md);
    font-weight: var(--font-weight-bold);
    user-select: none;
    display: flex;
    .title {
      flex: 1;
    }
    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: var(--xs);
      background: url('@/assets/images/panel/header-line.png') no-repeat;
      background-size: 100%;
    }
  }
  .body {
    padding: var(--card-popover-body-paddding, var(--sm));
    &::before, &::after {
      content: "";
      position: absolute;
      bottom: 0;
      width: calc(var(--xxs) * 2.5);
      height: calc(var(--xxs) * 2.5);
    }
    &::before {
      left: 0;
      background: url('@/assets/images/panel/bottom-left-icon.png') no-repeat;
      background-size: 100%;
    }
    &::after {
      right: 0;
      background: url('@/assets/images/panel/bottom-right-icon.png') no-repeat;
      background-size: 100%;
    }
  }
}
</style>
