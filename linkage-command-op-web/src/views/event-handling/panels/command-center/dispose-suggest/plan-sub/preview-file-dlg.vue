<template>
  <hl-dialog
    :model-value="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :width="dlgWidth"
    height="calc(var(--xxs) * 200)"
    body-padding="var(--md)"
    custom-class="full-body"
    title="附件预览"
    append-to-body
    draggable
    @close="$emit('cancel')"
  >
    <hl-thumb v-if="fileType === '1'" :src="getRemoteFilePath(fileUrl)" style="width: 100%; height: 100%" fit="contain" />
    <hl-scrollbar v-if="['2', '3'].includes(fileType)">
      <vue-office-docx v-if="fileType === '2'" :src="getRemoteFilePath(fileUrl)" style="width: 100%;" />
      <vue-office-excel v-if="fileType == '3'" :src="getRemoteFilePath(fileUrl)" style="height: calc(var(--xxs) * 187);" />
    </hl-scrollbar>
  </hl-dialog>
</template>
<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { HlMessage } from 'hongluan-ui';
import { GlobalAPI, getRemoteFilePath } from '@/common';
import VueOfficeExcel from '@vue-office/excel';
import VueOfficeDocx from '@vue-office/docx';
import '@vue-office/excel/lib/index.css';
import '@vue-office/docx/lib/index.css';

const props = defineProps({
  fileUrl: {
    type: String,
    default: ''
  }
});
const emit = defineEmits(['cancel']);

const fileType = ref();
const dlgWidth = ref('calc(var(--xxs) * 160)');

const getFileType = (fileUrl: string) => {
  if (!fileUrl) emit('cancel');
  const curFileType = fileUrl.split('.')[1].toLowerCase();
  switch (curFileType) {
    case 'jpg':
    case 'jpeg':
    case 'png':
      fileType.value = '1';
      dlgWidth.value = 'calc(var(--xxs) * 160)';
      break;
    case 'docx':
      fileType.value = '2';
      dlgWidth.value = 'calc(var(--xxs) * 240)';
      break;
    case 'xlsx':
      fileType.value = '3';
      dlgWidth.value = 'calc(var(--xxs) * 332)';
      break;
    default:
      HlMessage.warning('此附件不支持预览');
      emit('cancel');
      break;
  }
};

watch(() => props.fileUrl, (val: string) => {
  getFileType(val);
}, {
  immediate: true
});
</script>
<style lang="scss" scoped>
</style>
