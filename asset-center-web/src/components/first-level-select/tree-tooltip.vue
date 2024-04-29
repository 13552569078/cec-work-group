<template>
  <div class="c-tooltip__popper is-dark tree-tooltip" :style="{top:tooltipTop}" @click.stop="''">
    <div class="c-tooltip__popper-content">
      <slot name="content" />
    </div>
    <div x-arrow="" class="popper__arrow"></div>
  </div>
</template>

<script>
export default {
  name: 'NavTreeTooltip',
  props: {
    tooltipTop: {
      type: String,
      default: '32px'
    }
  }
}
</script>

<style lang="scss">
.tree-tooltip {
  transform-origin: center top;
  z-index: 2048;
  transform: translateX(-25px);
  display: none;
  top: 32px;

  .popper__arrow {
    top: -12px;
    left: 26px;
  }
}
</style>
