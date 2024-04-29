<template>
  <hl-upload
    ref="uploaderRef"
    :class="{ 'hide-upload-btn': hideUploadBtn }"
    :action="fileServer" :accept="accept"
    list-type="card"
    :file-list="modelValue"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :on-success="handleSuccess"
    :before-upload="handleBeforeUpload"
    :on-exceed="handleExceed"
    :limit="limit">
    <hl-icon><two-upload /></hl-icon>
  </hl-upload>
  <hl-dialog v-model="dialogVisible" title="查看图片" @close="dialogVisible = false" :append-to-body="true" width="30%" height="90%" custom-class="image-viewer">
    <hl-group :style="`background: url('${dialogFile.url}'); width: 100%; height: 100%; background-size: contain; background-repeat: no-repeat; background-position: center;`" class="viewer-box">
    </hl-group>
  </hl-dialog>
</template>

<script lang="ts" setup>
import { ref, nextTick, computed } from 'vue';
import { Indexable } from 'fx-front-utils';
import { HlMessage } from 'hongluan-ui';
import { GlobalAPI } from '@/common/global-api';
import userAuth from '@/common/user-auth';

interface UploadUserFile {
  dirUrl: string;
  name: string;
  url: string;
  id: string;
  type: string;
  attachmentType: string;
  percentage: number;
  response?: IsuccessUpload;
}

interface IsuccessUpload {
  data: Indexable<any>;
}

const props = defineProps({
  modelValue: Array,
  accept: {
    type: String,
    default: '.jpg,.png,.jpeg'
  },
  limit: {
    type: Number,
    default: 3
  }
});

const hideUploadBtn = computed(() => {
  return (props.modelValue as UploadUserFile[]).length >= props.limit;
});

const emit = defineEmits(['update:modelValue', 'on-success', 'on-remove']);

const uploaderRef = ref();

const fileServer = GlobalAPI.config.UPLOAD_URL;
const dialogFile = ref();
const dialogVisible = ref(false);

const handlePreview = (file: UploadUserFile) => {
  dialogFile.value = file;
  nextTick(() => {
    dialogVisible.value = true;
  });
};

const handleSuccess = (res: IsuccessUpload, file: any, list: UploadUserFile[]) => {
  file.id = res.data.id;
  emit('update:modelValue', list);
  emit('on-success', list);
};

const handleRemove = (file: UploadUserFile, files: UploadUserFile[]) => {
  emit('update:modelValue', files);
};

const removeFile = (file: UploadUserFile) => {
  uploaderRef.value?.handleRemove(file);
  emit('update:modelValue', props.modelValue);
};

// 限制文件
const handleExceed = () => {
  HlMessage.warning(`当前限制选择 ${props.limit} 个文件`);
};

const handleBeforeUpload = (file: any) => {
  const formats = props.accept.replace(/\./g, '').split(',');
  const upperClassFormats = formats.map(item => item.toUpperCase());
  const acceptFormats = formats.concat(upperClassFormats).join('|');
  const reg = new RegExp(acceptFormats);
  if (!reg.test(file.type)) {
    HlMessage.warning(`仅可上传 ${props.accept} 格式的文件`);
    return false;
  }

  // 限制大小
  const endType = file.type.split('/')[1];
  if (IMG_TYPE.includes(endType) && file.size > FILE_SIZE * M * M) {
    HlMessage.warning(IMAGE_LIMIT_MESSAGE);
    return false;
  }
  if (PDF.includes(endType) && file.size > FILE_SIZE * M * M) {
    HlMessage.warning(PDF_LIMIT_MESSAGE);
    return false;
  }
  if (VIDEO_TYPE.includes(endType) && file.size > VIDEO_SIZE * M * M) {
    HlMessage.warning(VIDEO_LIMIT_MESSAGE);
    return false;
  }
};

const FILE_SIZE = 50;
const VIDEO_SIZE = 100;
const M = 1024;
const IMG_TYPE = ['jpg', 'png', 'jpeg'];
const VIDEO_TYPE = ['wmv', 'avi', 'mp4', 'mpeg'];
const PDF = ['pdf'];
const IMAGE_LIMIT_MESSAGE = `图片大小不可超过 ${FILE_SIZE}M！`;
const PDF_LIMIT_MESSAGE = `pdf大小不可超过 ${FILE_SIZE}M！`;
const VIDEO_LIMIT_MESSAGE = `视频大小不可超过 ${VIDEO_SIZE}M！`;
</script>
