<template>
  <hl-group v-if="data" dir="vertical" gap="var(--xxs)">

    <hl-group gap="var(--md)" class="m-b-sm">
      <hl-group style="width: 50%;" dir="vertical" gap="var(--xs)">

        <hl-group class="bg-cell p-xs" align="items-between">
          <span class="label">处理时间</span>
          <span class="standard-text">{{ handleEmptyStr(data.dealTime) }}</span>
        </hl-group>
        <hl-group class="bg-cell p-xs" align="items-between">
          <span class="label">处理人</span>
          <span class="standard-text">{{ handleEmptyStr(data.dealUserName) }}</span>
        </hl-group>
        <hl-group class="bg-cell p-xs" align="items-between">
          <span class="label">处理人联系方式</span>
          <span class="standard-text">{{ handleEmptyStr(data.dealUserPhone) }}</span>
        </hl-group>
        <hl-group class="bg-cell p-xs" align="items-between">
          <span class="label">操作动作</span>
          <span class="standard-text">{{ handleEmptyStr(data.dealOption) }}</span>
        </hl-group>

      </hl-group>

      <hl-group style="width: 50%;" dir="vertical" gap="var(--xs)" full>
        <hl-group class="bg-cell p-xs static" align="items-between" full dir="vertical">
          <span class="label">处理意见</span>
          <span class="standard-text">{{ handleEmptyStr(data.dealComment) }}</span>
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
  if (props.data.beforeMedia.length === 0) return [];
  return props.data.beforeMedia.map((image: Image) => {
    return image.mediaPath;
  });
});

const afterImgList = computed(() => {
  if (props.data.afterMeida.length === 0) return [];
  return props.data.afterMeida.map((image: Image) => {
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
