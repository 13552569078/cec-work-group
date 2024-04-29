<template>
  <hl-popover
    :disabled="!tooltipVisible"
    ref="tooltipRef"
    placement="top"
    tooltip
    popper-class="global-tooltip-popper"
    :content="tooltipText"
    :popper-options="{
      modifiers: [
        {
          name: 'computeStyles',
          options: {
            adaptive: false,
            enabled: false,
          },
        },
      ],
    }"
    :virtual-ref="tooltipTextRef"
    virtual-triggering
    trigger="hover"
    @hide="clearTooltip"
  >
  </hl-popover>
</template>
<script lang="ts" setup>
import { useTextOverflow } from '@/hooks';

const { tooltipVisible, tooltipTextRef, tooltipText, clearTooltip } = useTextOverflow();

</script>
<style lang="scss">
.global-tooltip-popper {
  max-width: calc(var(--xxs) * 75);
}
</style>
