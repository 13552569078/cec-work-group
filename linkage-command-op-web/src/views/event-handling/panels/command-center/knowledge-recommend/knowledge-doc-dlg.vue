<template>
  <hl-dialog
    :model-value="true"
    width="calc(var(--xxs) * 300)"
    height="calc(var(--xxs)*241.5)"
    :title="currentDoc.name"
    class="knowledge-doc-dlg full-body"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @closed="$emit('cancel')"
  >
    <doc-previewer v-bind="currentDoc" style="height: 98%" />
  </hl-dialog>
</template>
<script setup lang="ts">
import DocPreviewer from './knowledge-doc-previewer.vue';

const props = defineProps({
  currentDoc: Object,
});
</script>
<style scoped lang="scss">
</style>
