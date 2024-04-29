<template>
  <div class="event-media-part">
    <hl-upload
      :action="`${GlobalAPI.config.BASE_URL}/swan-file/files`"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :on-success="successHandle"
      :accept="acceptType"
      :on-error="handleError"
    >
      <hl-group v-if="!imgUrl" class="upload-box" dir="vertical" align="items-center">
        <hl-icon size="xl" color="#6f8ea8" width="calc(var(--xxs) * 16.5)" height="calc(var(--xxs) * 11)"><FillCloudUpload /></hl-icon>
        <div class="text">点击上传</div>
        <div class="text-danger">可上传1张 jpg/png 图片，且不超过10mb</div>
      </hl-group>

      <hl-group  v-else class="bg-content" @click.stop>
        <div class="img-box">
          <hl-thumb class="img" :src="imgUrl" fit="cover" />
          <div class="operate-box">
            <hl-icon class="icon" size="lg" @click.stop="handlePreviewImg"><two-zoom-in /></hl-icon>
            <hl-icon class="icon" size="lg" @click.stop="handleDeleteImg"><two-close /></hl-icon>
          </div>
        </div>
      </hl-group>
    </hl-upload>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { HlMessage, UploadRawFile } from 'hongluan-ui';
import { usePreviewer } from 'fx-front-framework';
import { getRemoteFilePath, GlobalAPI } from '@/common';

const emit = defineEmits(['updateInfo']);

const { openPreviewer } = usePreviewer();

const acceptType = '.jpg,.png,.jpeg,.JPG,.JPEG,.PNG';
const fileType = ['image/jpg', 'image/jpeg', 'image/png'];
const sizeLimit = 10;

const imgUrl = ref('');
const imgDirUrl = ref('');

const beforeUpload = (rawFile: UploadRawFile) => {
  if (!fileType.includes(rawFile.type)) {
    HlMessage.warning('上传图片只能是 JPG、PNG 格式');
    return false;
  } if (rawFile.size / 1024 / 1024 > sizeLimit) {
    HlMessage.warning(`图片大小不能超过 ${sizeLimit}MB!`);
    return false;
  }
  return true;
};
const handleError = () => {
  HlMessage.warning('上传失败，请重试');
};
const successHandle = (res: Record<string, any>) => {
  imgUrl.value = getRemoteFilePath(res.data.dirUrl);
  imgDirUrl.value = res.data.dirUrl;
  updateFileInfo();
};
const handlePreviewImg = () => {
  openPreviewer({
    sourceType: 1,
    id: Math.random() * 100 + '',
    name: '图片预览',
    url: imgUrl.value,
    showCollapse: false,
  });
};
const handleDeleteImg = () => {
  imgUrl.value = '';
  imgDirUrl.value = '';
  updateFileInfo();
};

const updateFileInfo = () => {
  emit('updateInfo', {
    key: 'image',
    value: imgDirUrl.value
  });
};
</script>
<style lang="scss" scoped>
.event-media-part {
  border: none;
  box-sizing: border-box;
  padding: calc(var(--xxs) * 5);
  overflow: hidden;
  background: rgba(0, 158, 247, 0.10);
  :deep(.hl-upload) {
    width: 100%;
  }
  :deep(.hl-upload .handle-text) {
    width: 100%;
  }
  .upload-box {
    display: flex;
    align-items: center;
    width: 100%;
    height: calc(var(--xxs) * 125);
    background: rgba(0,158,247,0.12);
    border-radius: var(--xxs);
    border: calc(var(--xxs) * 0.25) solid rgba(0,158,247,0.24);
    .text {
      font-size: var(--font-lg);
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 2;
    }
    .text-danger {
      height: calc(var(--xxs) * 5);
      font-size: var(--font-md);
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FD6161;
      line-height: 1.43;
    }
  }
  .bg-content {
    width: calc(var(--xxs) * 40);
    border-radius: var(--xs);
    .img-box {
      position: relative;
      width: calc(var(--xxs) * 40);
      height: calc(var(--xxs) * 40);
      border-radius: var(--xs);
      .img {
        width: 100%;
        height: 100%;
        border-radius: var(--xs);
      }
      .operate-box {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: calc(var(--xxs) * 5);
        box-sizing: border-box;
        width: calc(var(--xxs) * 40);
        height: calc(var(--xxs) * 40);
        border-radius: var(--xs);
        top: 0;
        left: 0;
        .icon {
          opacity: 0;
        }
      }
      &:hover {
        .operate-box {
          background: rgba(0,0,0,.6);
          .icon {
            opacity: 1;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
