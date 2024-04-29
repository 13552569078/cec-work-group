<template>
  <hl-group v-if="data" dir="vertical" gap="var(--xxs)">
    <hl-group class="box-styled-short p-xs p-l-lg p-t-sm" gap="var(--xxs)" align="items-between">
      <span class="gradient-text standard-text" style="font-weight: normal !important;">{{ data.eventTitle }}</span>
      <span class="standard-text">{{ handleEmptyStr(data.eventTime) }} </span>
    </hl-group>
    <hl-group gap="var(--md)" class="m-b-sm">
      <hl-group style="width: 50%;" dir="vertical" gap="var(--xs)">

        <hl-group class="bg-cell p-xs" align="items-between">
          <span class="label">事件状态</span>
          <event-status-tag :event-status="data.dealStatus"/>
        </hl-group>
        <hl-group class="bg-cell p-xs" align="items-between">
          <span class="label">超时状态</span>
          <span
            :class="['standard-text', data.overTimeFlag === 1 ? 'text-primary' : 'text-danger']">{{
              data.overTimeFlag === null ? '--' : data.overTimeFlag === 1 ? '未超时' : '已超时'
            }}</span>
        </hl-group>
        <hl-group class="bg-cell p-xs" align="items-between">
          <span class="label">发起平台</span>
          <span class="standard-text">{{ handleEmptyStr(data.platformSrcName) }}</span>
        </hl-group>
        <hl-group class="bg-cell p-xs" align="items-between">
          <span class="label">发生地址</span>
          <span class="standard-text">{{ handleEmptyStr(data.eventAddress) }}</span>
        </hl-group>
        <hl-group class="bg-cell p-xs" align="items-between">
          <span class="label">事件来源</span>
          <span class="standard-text">{{ handleEmptyStr(data.eventSrcName) }}</span>
        </hl-group>
        <hl-group class="bg-cell p-xs" align="items-between">
          <span class="label">紧急程度</span>
          <span class="standard-text">{{ data.eventUrgent === 1 ? '一般' : '紧急' }}</span>
        </hl-group>
        <hl-group class="bg-cell p-xs" align="items-between">
          <span class="label">上报人</span>
          <span class="standard-text">{{ handleEmptyStr(data.reporterName) }}</span>
        </hl-group>
        <hl-group class="bg-cell p-xs" align="items-between">
          <span class="label">联系方式</span>
          <span class="standard-text">{{ handleEmptyStr(data.reporterMobile) }}</span>
        </hl-group>

      </hl-group>

      <hl-group style="width: 50%;" dir="vertical" gap="var(--xs)" full>
        <hl-group class="bg-cell p-xs static" align="items-between" full dir="vertical">
          <span class="label">事件描述</span>
          <span class="standard-text">{{ handleEmptyStr(data.eventDesc) }}</span>
        </hl-group>
        <hl-group class="bg-cell p-xs" gap="var(--md)">
          <span class="label">处置前</span>
          <hl-group gap="var(--xs)">
            <!-- <hl-thumb :src="img" size="xxxl" :preview-src-list="srcList"/>
          <hl-thumb :src="img" size="xxxl" :preview-src-list="srcList"/> -->
            <hl-thumb v-for="img in data.baseMediaList" :key="img.mediaName" :src="img.mediaPath" size="xxxl"
              :preview-src-list="beforeImgList" />
          </hl-group>
        </hl-group>
        <hl-group class="bg-cell p-xs" gap="var(--md)">
          <span class="label">处置后</span>
          <hl-group gap="var(--xs)">
            <!-- <hl-thumb :src="img" size="xxxl" :preview-src-list="srcList"/>
          <hl-thumb :src="img" size="xxxl" :preview-src-list="srcList"/> -->
            <hl-thumb v-for="img in data.processMediaList" :key="img.mediaName" :src="img.mediaPath" size="xxxl"
              :preview-src-list="afterImgList" />
          </hl-group>
        </hl-group>
      </hl-group>

    </hl-group>

  </hl-group>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import img from '@/assets/images/sample/s1.png';
import { handleEmptyStr } from '@/common';

type Image = {
  mediaName: string;
  mediaPath: string;
  mediaType: string;
};

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
});

const srcList = [img, img];
const beforeImgList = computed(() => {
  if (props.data.baseMediaList.length === 0) return [];
  return props.data.baseMediaList.map((image: Image) => {
    return image.mediaPath;
  });
});

const afterImgList = computed(() => {
  if (props.data.processMediaList.length === 0) return [];
  return props.data.processMediaList.map((image: Image) => {
    return image.mediaPath;
  });
});
</script>

<style lang="scss" scoped>
.bg-cell {
  background-color: #0A2038;
}

.label {
  color: #d7ebff;
  font-size: 1.125rem;
}
</style>
