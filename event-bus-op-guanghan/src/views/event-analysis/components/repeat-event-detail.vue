<template>
  <common-dialog title="重复诉求事件" width="calc(var(--xl) * 26)"  @close="handleClose">
    <!-- <template #action>
      <hl-button type="primary" size="" @click.stop="goDetail">进入事件</hl-button>
    </template> -->
    <hl-group class="w-full" full gap="var(--md)">
      <hl-group dir="vertical" style="width: 50%">
        <c-label class="m-b-md" :isLong="true">当前事件信息</c-label>
        <hl-scrollbar style="height:calc(var(--xl) * 22)">
          <event-info v-if="repeatEventDetail?.currentEventInfo" :data="repeatEventDetail?.currentEventInfo" class="w-full"/>
        </hl-scrollbar>
      </hl-group>
      <hl-group dir="vertical" style="width: 50%">
        <c-label class="m-b-md" :isLong="true">重复事件信息</c-label>
        <hl-scrollbar style="height:calc(var(--xl) * 22)">
          <event-info v-if="repeatEventDetail?.repeatEventInfo" :data="repeatEventDetail?.repeatEventInfo" class="w-full"/>
        </hl-scrollbar>
      </hl-group>
    </hl-group>
    <hl-group dir="vertical" style="margin-top: calc(var(--xl) * 0.6);" class="w-full">
      <c-label class="m-b-md">处置状态</c-label>
      <hl-group>
        处置状态:{{repeatEventDetail?.currentEventInfo?.duplicateState || '--'}}
      </hl-group>
    </hl-group>
  </common-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useEventData, useGlobalState } from '@/hooks';
import { apiEventAnalysisObj } from '@/apis';

const props = defineProps({
  id: String
});

const emit = defineEmits(['close']);
const { handleCloseAllEventDialog } = useGlobalState();
const router = useRouter();
const repeatEventDetail = ref();

const fetchData = async () => {
  const res = await apiEventAnalysisObj.getRepeatEvent(props.id as string);
  repeatEventDetail.value = res.data;
};

fetchData();

const goDetail = () => {
  router.push({
    name: 'event-detail',
    query: {
      eventId: props.id
    }
  });
  handleCloseAllEventDialog();
};

const handleClose = () => {
  emit('close');
};
</script>

<style lang="scss" scoped></style>
