<template>
  <div class="outer-box">
    <div class="arrow left-arrow" v-if="fileList.length>3 && activeIndex>0" @click="prev"><img src="~@/assets/images/event-handling/left-1/button-left-arrow.png" alt=""></div>
    <div class="arrow right-arrow" v-if="fileList.length>3 && activeIndex!==maxIndex" @click="next"><img src="~@/assets/images/event-handling/left-1/button-right-arrow.png" alt=""></div>
    <div class="display-flex h-full inner-box" :style="{transform: `translateX(${translateX})`}">
      <div class="item h-full m-r-xs display-flex items-middle items-center" :style="{width: itemWidth}" v-for="(item,index) in fileList" :key="`${index}-${item.id}-${item.name}`"
        @click="handlePreview(getRemoteFilePath(item.url))"
      >
        <img v-if="isVideo(item.url)" src="~@/assets/images/event-handling/left-1/button-video-play.png" alt="" class="play-icon" />
        <video v-if="isVideo(item.url)" :src="getRemoteFilePath(item.url)" class="inner-item"/>
        <img v-else-if="isImage(item.url)" :src="getRemoteFilePath(item.url)" alt="" class="inner-item" />
        <hl-icon v-else size="xxl">
          <component :is="fileIcons[getFileIconName(item.name.split('.')[1])]" />
        </hl-icon>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watchEffect, PropType } from 'vue';
import { Constants, CommonUtils } from 'fx-front-utils';
import { usePreviewer } from 'fx-front-framework';
import { GlobalAPI, isImage, isVideo, getRemoteFilePath } from '@/common';
import { useIcons } from '@/hooks';

interface FileList {
  name: string,
  url: string
}
const props = defineProps({
  fileList: {
    type: Array as PropType<FileList[]>,
    default: () => ([]),
  },
});

const { openPreviewer } = usePreviewer();
const { fileIcons, getFileIconName } = useIcons();

const FILE_VIEW = GlobalAPI.config.FILE_VIEW;
const itemWidth = 'calc(var(--xxs) * 31.25)';
const activeIndex = ref(0);
const maxIndex = ref(0);
const translateX = ref('0');

const prev = () => {
  if (activeIndex.value <= 0) {
    return;
  }
  activeIndex.value--;
  translateX.value = `calc(var(--xxs) * -33.25 * ${activeIndex.value})`;
};
const next = () => {
  if (activeIndex.value >= maxIndex.value) {
    return;
  }
  activeIndex.value++;
  translateX.value = `calc(var(--xxs) * -33.25 * ${activeIndex.value})`;
};

const handlePreview = (url: any) => {
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

watchEffect(() => {
  maxIndex.value = props.fileList.length - 3;
});

</script>
<style lang="scss" scoped>
.outer-box {
  height: calc(var(--xxs) * 17.5);
  width: 100%;
  overflow: hidden;
  position: relative;
  .inner-box {
    transition: all .2s linear;
    .item {
      flex: none;
      background-image: url(@/assets/images/event-handling/left-1/arousel-item-bg.png);
      background-size: 100% 100%;
      position: relative;
      cursor: pointer;
      .play-icon {
        width: var(--lg);
        height: var(--lg);
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
      .inner-item {
        width: 100%;
        height: 100%;
        max-width: 100%;
        object-fit: cover;
      }
    }
  }
  .arrow {
    width: var(--xl);
    height: var(--xl);
    border-radius: 100%;
    background-color: #045E9C;
    position: absolute;
    z-index: 2;
    left: calc(var(--md) * -1);
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    img {
      position: absolute;
      left: var(--md);
      top: 50%;
      transform: translateY(-50%);
      width: calc(var(--xxs) * 3.25);
    }
    &.right-arrow {
      left: auto;
      right: calc(var(--md) * -1);
      img {
        left: auto;
        right: var(--md);
      }
    }
  }
}

</style>
