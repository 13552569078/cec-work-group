<template>
  <div class="file-outer-box" :style="{ width: size, height: size }" @click="handlePreview(url)">
    <img v-if="isVideo(url)" src="~@/assets/images/event-handling/left-1/button-video-play.png" alt="" class="play-icon" />
    <video v-if="isVideo(url)" :src="getRemoteFilePath(url)" class="inner-item"/>
    <img v-else-if="isImage(url)" :src="getRemoteFilePath(url)" alt="" class="inner-item" />
    <hl-icon v-else-if="url && url.split('.')[1]" size="xxl" style="display:block !important;">
      <component :is="fileIcons[getFileIconName(url.split('.')[1])]" />
    </hl-icon>
  </div>
</template>
<script setup lang="ts">
import { Constants } from 'fx-front-utils';
import { usePreviewer } from 'fx-front-framework';
import { getRemoteFilePath, GlobalAPI, isImage, isVideo } from '@/common';
import { useIcons } from '@/hooks';

const { fileIcons, getFileIconName } = useIcons();
const { openPreviewer } = usePreviewer();

const props = defineProps({
  url: String,
  size: {
    type: String,
    default: 'calc(var(--xxs) * 22.5)'
  }
});

const handlePreview = (dirUrl: string) => {
  const url = getRemoteFilePath(dirUrl);
  if (isImage(url) || isVideo(url)) {
    openPreviewer({
      sourceType: isImage(url) ? 1 : 2,
      id: Math.random() * 100 + '',
      name: '文件预览',
      url: url,
      showCollapse: false,
    });
  } else {
    window.open(url, '_blank');
  }
};

defineExpose({
  handlePreview
});

</script>
<style lang="scss" scoped>
.file-outer-box{
  flex: none !important;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  width: calc(var(--xxs) * 22.5);
  height:  calc(var(--xxs) * 22.5);
  border: 1px solid rgba(0,158,247,0.24);
  border-radius: var(--xxs);
  background-color: rgba(0,158,247,0.12);
  .play-icon{
    width: var(--lg);
    height: var(--lg);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .inner-item{
    width: 100%;
    height: 100%;
    max-width: 100%;
    object-fit: cover;
  }
}
</style>
