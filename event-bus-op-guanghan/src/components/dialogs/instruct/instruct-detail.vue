<template>
  <common-dialog title="指令详情" width="calc(var(--xl) * 25)">
    <hl-scrollbar :style="`height: calc(var(--xl) * 20);`" class="m-t-lg">
      <hl-group dir="vertical" gap="var(--xxs)" class="w-full">
        <hl-group class="box-styled p-sm" dir="vertical" gap="var(--xxs)">
          <h4 class="gradient-text">指令标题</h4>
          <span class="font-lg">{{ detailsObj?.title }} </span>
        </hl-group>
        <hl-group class="bg-cell p-sm" align="items-between">
          <span class="label">创建时间</span>
          <span class="font-lg">{{ detailsObj?.commandTime }}</span>
        </hl-group>
        <hl-group class="bg-cell p-sm" align="items-between">
          <span class="label">指令状态</span>
          <span class="font-lg" :class="[detailsObj?.commandStatus === 1 ? 'count-green' : 'count-red']">{{ detailsObj?.commandStatusName }}</span>
        </hl-group>
        <hl-group class="bg-cell p-sm" align="items-between" dir="vertical">
          <span class="label">指令内容</span>
          <span class="font-lg">{{ detailsObj?.content }}</span>
        </hl-group>
        <hl-group class="bg-cell p-sm" gap="var(--md)" dir="vertical">
          <span class="label">指令附件</span>
          <hl-group gap="var(--xs)">
            <hl-thumb v-for="(img, index) in sendMediaList" :key="index" :src="img" size="xxxl" :preview-src-list="sendMediaList" fit="cover" :initial-index="index" :preview-teleported="true" />
          </hl-group>
        </hl-group>
        <hl-group class="bg-cell p-sm" align="items-between">
          <span class="label">事件编号</span>
          <span class="font-lg text-primary cursor-pointer" @click="handleShowEventDetail(detailsObj?.eventId)">{{ detailsObj?.eventCode }}</span>
        </hl-group>
        <hl-group class="bg-cell p-sm" align="items-between">
          <span class="label">接收人</span>
          <span class="font-lg">{{ detailsObj?.receiveUserName }}</span>
        </hl-group>
        <hl-group class="bg-cell p-sm" align="items-between" dir="vertical">
          <span class="label">反馈内容</span>
          <span class="font-lg">{{ detailsObj?.replyContent }}</span>
        </hl-group>
        <hl-group class="bg-cell p-sm" gap="var(--md)" dir="vertical">
          <span class="label">反馈附件</span>
          <hl-group gap="var(--xs)">
            <hl-thumb v-for="(img, index) in replyMediaList" :key="index" :src="img" size="xxxl" :preview-src-list="replyMediaList" fit="cover" :initial-index="index" :preview-teleported="true" />
          </hl-group>
        </hl-group>
      </hl-group>
    </hl-scrollbar>
  </common-dialog>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import img from '@/assets/images/sample/s1.png';
import { handleEmptyStr } from '@/common';
import { EVENT_STATUS_MAPPER } from '@/views/event-center/constant';
import { apiInstructObj } from '@/apis/modules/instruct';
import { IgetCommandSpace } from '@/apis/modules/instruct/model';
import { useGlobalState } from '@/hooks';

type Image = {
  mediaName: string;
  mediaPath: string;
  mediaType: string;
};

const props = defineProps({
  instructId: {
    type: String,
    default: ''
  }
});

const { currentEventId, handleShowEventDetail } = useGlobalState();

const InitialIndex = ref(0);
const detailsObj = ref<IgetCommandSpace.Data>();

const fetchData = async () => {
  const { data } = await apiInstructObj.getCommand(props.instructId);
  detailsObj.value = data;
};
const changeInitial = (idx: number) => {
  InitialIndex.value = idx;
};

const sendMediaList = computed(() => {
  if (detailsObj.value?.sendMediaList.length === 0) return [];
  return detailsObj.value?.sendMediaList.map((image: Image) => {
    return image.mediaPath;
  });
});

const replyMediaList = computed(() => {
  if (detailsObj.value?.replyMediaList.length === 0) return [];
  return detailsObj.value?.replyMediaList.map((image: Image) => {
    return image.mediaPath;
  });
});

fetchData();
</script>

<style lang="scss" scoped>
.bg-cell {
  background-color: rgba(43, 59, 72, 0.58);
}
.label {
  color: #d7ebff;
  font-size: 1.125rem;
}
.count-green {
  color: #19ecad;
}
.count-red {
  color: #ff4b00;
}
</style>
