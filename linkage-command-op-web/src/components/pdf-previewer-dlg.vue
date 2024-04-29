<template>
  <hl-dialog
    :model-value="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="calc(var(--xxs) * 300)"
    height="calc(var(--xxs) * 241.5)"
    body-padding="var(--md)"
    custom-class="full-body"
    title="PDF文件预览"
    append-to-body
    @close="$emit('cancel')"
  >
    <div class="content-wrap">
      <pdf-view :pdfUrl="url" />
    </div>
  </hl-dialog>
</template>
<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const PdfView = defineAsyncComponent(() => import('@/components/digital-reserve-plan/pdf-view.vue'));

defineProps({
  url: String
});
defineEmits(['cancel']);

</script>
<style lang="scss" scoped>
.content-wrap {
  display: flex;
  height: 100%;
  width: calc(var(--xxs) * 300 - var(--lg));
  overflow: hidden;
  padding: var(--lg);
}
</style>
