<template>
  <hl-group gap="var(--lg)" class="full h-full"
    :class="[
      !isInDialog ? 'full-page' : 'full-page-dialog',
      isIframe ? 'iframe-fit' : '',
      isIframe && props.isWithHeaderTab ? 'iframe-fit-tab' : null]">
    <!-- 左侧 -->
    <hl-group full :style="`width: calc(var(--xxs) * ${leftWidth});overflow: hidden;`" class="static left">
      <slot name="left"></slot>
    </hl-group>
    <!-- 右侧 -->
    <hl-panel full-body class="table-panel bg-transparent h-full w-xl right">
      <slot name="right"></slot>
    </hl-panel>
  </hl-group>
</template>
<script lang="ts" setup>
import { useIframe } from 'fx-front-framework';

const { isIframe } = useIframe();
const props = defineProps({
  leftWidth: {
    type: Number,
    default: 60
  },
  isInDialog: {
    type: Boolean,
    default: false
  },
  isWithHeaderTab: {
    type: Boolean,
    default: false
  }
});
</script>
