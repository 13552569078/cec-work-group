<template>
  <hl-upload
    :action="fileUploadServer"
    list-type="card"
    name="file"
    multiple
    :limit="FILE_COUNT_LIMIT"
    :headers="headers"
    :accept="acceptFileTypes1"
    :file-list="mediaFileList"
    :on-preview="previewMediaFile"
    :on-remove="removeMediaFile"
    :on-success="handleMediaFileSuccess"
    :before-upload="beforeMediaFileUpload"
    :on-exceed="handleMediaFileExceed"
    :class="['upload-event-file-form-item', curFileList.length >= FILE_COUNT_LIMIT ? 'hide-upload' : '']"
  >
    <div class="text-center upload-content">
      <img src="@/assets/images/common/upload-icon.png" alt="" style="width:var(--xl);">
      <div class="m-t-xs">上传附件</div>
    </div>

    <template #tip>
      <div style="clear: both" class="text-danger m-t-sm">注：1、支持上传{{ acceptFileTypes2 }}格式的文件，文件大小不超过20MB！</div>
      <div class="text-danger" style="margin-left: calc(var(--xxs) * 7)">2、最多上传6个文件。</div>
    </template>
    <template #file-preview="{ file }">
      <event-upload-file-card :item="setFileCardItem(file)" style="position:absolute;" />
    </template>
  </hl-upload>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, PropType } from 'vue';
import { GlobalAPI, FileTypes, getRemoteFilePath } from '@/common';
import { useUser } from 'fx-front-ucenter';
import { Constants } from 'fx-front-utils';
import { usePreviewer } from 'fx-front-framework';
import { FormInstance, HlMessage, UploadFile } from 'hongluan-ui';
import EventUploadFileCard from './event-upload-file-card.vue';

const { getToken } = useUser();
const { openPreviewer } = usePreviewer();

const fileUploadServer = `${GlobalAPI.config.BASE_URL}/swan-file/files`;
const FILE_COUNT_LIMIT = 6;
const FILE_SIZE_LIMIT = 20;
const acceptFileTypes1 = FileTypes.map(el => el.type).join(',');
const acceptFileTypes2 = FileTypes.map(el => el.type.substring(1)).join('、');

const headers = computed(() => ({
  authorization: getToken()
}));
const mediaFileList = ref<Record<string, any>[]>([]);

const props = defineProps({
  attachmentList: {
    type: Array as PropType<any[]>,
    default: () => ([])
  },
});
const emit = defineEmits(['update']);

const curFileList = ref<any[]>([]);

const setFileCardItem = (f: any) => {
  const res = {
    id: f.id || f.response?.data.id,
    name: f.response ? f.response?.data.originalName : (f.originalName || f.name),
    url: f.response ? '/' + f.response?.data.dirUrl : f.url,
    createdAt: f?.createdAt,
    sourceType: getSourceType(f.name)
  };
  return res;
};

const handleAttachments = (fileList: Record<string, any>[]) => {
  curFileList.value = fileList.map(f => ({
    id: f.id || f.response?.data.id,
    name: f.response ? f.response?.data.originalName : (f.originalName || f.name),
    url: f.response ? '/' + f.response?.data.dirUrl : f.url,
    createdAt: f.createdAt
  }));
  console.log('handleAttachments....', curFileList.value);
  emit('update', curFileList.value);
};
const getSourceType = (name: string) => {
  let sourceType = 0;
  const fileType = '.' + name.split('.').pop()?.toLowerCase();
  if (Constants.PIC_FILES.includes(fileType)) {
    sourceType = 1;
  } else if (Constants.VIDEO_FILES.includes(fileType)) {
    sourceType = 2;
  } else {
    sourceType = 3;
  }
  return sourceType;
};

const previewMediaFile = (file: any) => {
  const name = file.response ? file.response?.data.originalName : (file.originalName || file.name);
  const url = file.response ? (file.response as any)?.data.url : file.url;
  const sourceType = getSourceType(name);
  if (sourceType === 1 || sourceType === 2) {
    openPreviewer({
      sourceType,
      id: String((file as any).id || file.uid),
      name: '预览',
      url: getRemoteFilePath(url),
      showMaximize: sourceType === 1
    });
  } else {
    window.open(getRemoteFilePath(url), '_blank');
  }
};
const removeMediaFile = (__: UploadFile, fileList: Record<string, any>[]) => {
  handleAttachments(fileList);
};
const handleMediaFileSuccess = (_: any, __: UploadFile, fileList: Record<string, any>[]) => {
  handleAttachments(fileList);
};
const beforeMediaFileUpload = (file: File) => {
  if (!FileTypes.map(el => el.fullName).includes(file.type)) {
    HlMessage.error(`仅支持上传${acceptFileTypes2}格式的文件！`);
    return false;
  }
  const maxsizefile = file.size / 1024 / 1024;
  if (maxsizefile > FILE_SIZE_LIMIT) {
    HlMessage.error(`上传大小不超过${FILE_SIZE_LIMIT}MB！`);
    return false;
  }
};
const handleMediaFileExceed = (files: unknown[], fileList: unknown[]) => {
  HlMessage.warning(
    `本次选择了 ${files.length} 个附件,总计: ${files.length +
    fileList.length}个附件,超出最大限制（${FILE_COUNT_LIMIT}个）,已禁止上传！`
  );
};
onMounted(() => {
  curFileList.value = [...props.attachmentList];
  mediaFileList.value = [...props.attachmentList];
});
</script>
<style scoped lang="scss">
.upload-event-file-form-item {
  --upload-handle-bg-color: rgba(0,158,247,0.12);
  --upload-handle-border-color: rgba(0,158,247,0.24);
  --upload-item-gap: var(--sm);
  &.hide-upload {
    :deep(.handle-card) {
      display: none;
    }
  }
  :deep(.handle-card) {
    border: calc(var(--xxs) * 0.25) solid var(--upload-handle-border-color);
    background: var(--upload-handle-bg-color)!important;
  }

  :deep(.upload-list.list-card .item) {
    background-color: var(--upload-handle-bg-color);
    border: 1px solid var(--upload-handle-border-color);
    position: relative;
    justify-content: center;
    margin-right: var(--xs);
    margin-bottom: var(--xs);
    border-radius: var(--xxs);
  }
}
</style>
