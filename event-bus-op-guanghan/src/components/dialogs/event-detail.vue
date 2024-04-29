<template>
  <common-dialog title="事件详情" width="calc(var(--xl) * 29.58)" @close="$emit('close')">
    <template #action>
      <hl-button class="standard-text m-r-md" type="primary" @click.stop="toggleInstructDialog" >下发指令</hl-button>
      <hl-button class="standard-text" type="primary" @click.stop="goDetail">进入事件</hl-button>
    </template>
    <hl-group class="w-full" full gap="var(--md)">
      <hl-group dir="vertical" style="width: 50%">
        <c-label class="m-b-md">基本信息</c-label>
        <hl-scrollbar style="height: calc(var(--xl) * 22)">
          <event-info :data="eventDetail" class="w-full" />
        </hl-scrollbar>
      </hl-group>

      <hl-group dir="vertical" style="width: 50%">
        <c-label class="m-b-md" :isLong="true">事件处置全流程</c-label>
        <hl-scrollbar style="height: calc(var(--xl) * 22)">
          <event-handle-process :data="eventDetail" />
        </hl-scrollbar>
      </hl-group>
    </hl-group>
    <hl-group class="m-t-lg">
      <hl-button v-if="isNeedManualHandle" class="standard-text m-r-md" type="primary" @click="handleFlowVisiable = true" >手动调度</hl-button>
      <!-- 待调度状态 2 没有退回和办结 -->
      <hl-button type="" class="standard-text" v-if="eventDetail?.eventStatus !== 2 && eventDetail?.eventStatus !== 5" @click="sendBackEvent">事件退回</hl-button>
      <hl-button type="" class="m-l-md standard-text" v-if="eventDetail?.eventStatus !== 2 && eventDetail?.eventStatus !== 5" @click="finishEvent">事件办结</hl-button>
    </hl-group>
  </common-dialog>
  <!-- 手动流转 -->
  <handle-flow :id="id" v-if="handleFlowVisiable" @close="handleFlowVisiable = false" @confirmHandle="confirmHandle" :platText="eventDetail?.platformSrcName"></handle-flow>
  <common-dialog title="提示" width="calc(var(--xl) * 8)" v-if="sendBackEventVisiable" @close="sendBackEventClose">
    <hl-group class="m-t-md">
      <hl-group align="items-top">
        <hl-icon type="warning" class="m-t-xxs">
          <fill-warning />
        </hl-icon>
      </hl-group>
      <hl-group dir="vertical" gap="var(--sm)" class="m-l-sm">
        <span class="label"> 确认将事件退回发起系统?</span>
        <span class="label-value">发起系统：{{ eventDetail?.platformSrcName || '--' }}</span>
      </hl-group>
    </hl-group>
    <hl-group align="items-right" class="m-t-md w-full">
      <hl-button type="primary" size="sm" @click="sendBackEventOk">确认</hl-button>
    </hl-group>
  </common-dialog>
  <common-dialog title="提示" width="calc(var(--xl) * 8)" v-if="finishEventVisiable" @close="finishEventClose">
    <hl-group class="m-t-md">
      <hl-group align="items-top">
        <hl-icon type="warning" class="m-t-xxs">
          <fill-warning />
        </hl-icon>
      </hl-group>
      <hl-group dir="vertical" gap="var(--sm)" class="m-l-sm">
        <span class="label">确认将事件办结?</span>
        <span class="label-value">当前事件存在被退回记录</span>
      </hl-group>
    </hl-group>
    <hl-group align="items-right" class="m-t-md w-full">
      <hl-button type="primary" size="sm" @click="finishEventOk">确认</hl-button>
    </hl-group>
  </common-dialog>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useEventData, useGlobalState, useMapData } from '@/hooks';
import { HlMessage, HlMessageBox } from 'hongluan-ui';
import { apiManualHanleObj as api } from '@/apis/modules/manual-handle';
import { FillWarning } from '@hongluan-ui/icons';

const props = defineProps({
  id: String
});

const emits = defineEmits(['close']);

const { eventDetail, getEventDetail } = useEventData();
const { handleCloseAllEventDialog, manualHandleVisible, eventInfoTabName, resetResourceVideo, refreshTimeChange, toggleInstructDialog } = useGlobalState();
const { clearMapLayerPoint } = useMapData();
const router = useRouter();

const handleFlowVisiable = ref(false);
const sendBackEventVisiable = ref(false);
const finishEventVisiable = ref(false);

const fetchData = async () => {
  await getEventDetail(props.id as string);
  // getEventDetail('20');
};

fetchData();

const isNeedManualHandle = computed(() => {
  if (eventDetail.value) {
    if (eventDetail.value.eventStatus === 2) {
      return true;
    } else if (eventDetail.value.eventThirdState === 5 || eventDetail.value.eventThirdState === 8) {
      return true;
    } else {
      return false;
    }
  }
  return false;
});

const goDetail = () => {
  // 事件详情初始化基本信息
  eventInfoTabName.value = 'baseInfo';
  resetResourceVideo();
  handleCloseAllEventDialog();
  clearMapLayerPoint();
  router.push({
    name: 'event-detail',
    query: {
      eventId: props.id
    }
  });
};

const sendBackEvent = () => {
  sendBackEventVisiable.value = true;
  // HlMessageBox.confirm(`确认将事件退回发起系统?(发起系统：${eventDetail.value?.platformSrcName || '--'})`, '提示', {
  //   confirmButtonText: '确认',
  //   confirmButtonType: 'danger',
  //   cancelButtonText: '取消'
  // }).then(async () => {
  //   await api.postManualHandleUpdate({
  //     id: props.id,
  //     status: 2
  //   });
  //   refreshTimeChange();
  //   emits('close');
  // });
};
const sendBackEventOk = async () => {
  sendBackEventVisiable.value = false;
  await api.postManualHandleUpdate({
    id: props.id,
    status: 2
  });
  refreshTimeChange();
  emits('close');
};
const sendBackEventClose = async () => {
  sendBackEventVisiable.value = false;
};

const finishEvent = () => {
  finishEventVisiable.value = true;
  // HlMessageBox.confirm('确认将事件办结?当前事件存在被退回记录', '提示', {
  //   confirmButtonText: '确认',
  //   confirmButtonType: 'danger',
  //   cancelButtonText: '取消'
  // }).then(async () => {
  //   await api.postManualHandleUpdate({
  //     id: props.id,
  //     status: 1
  //   });
  //   refreshTimeChange();
  //   emits('close');
  // });
};
const finishEventOk = async () => {
  await api.postManualHandleUpdate({
    id: props.id,
    status: 1
  });
  refreshTimeChange();
  emits('close');
  finishEventVisiable.value = false;
};
const finishEventClose = () => {
  finishEventVisiable.value = false;
};
const confirmHandle = () => {
  handleFlowVisiable.value = false;
  refreshTimeChange();
  emits('close');
};

// const getDispatchDetail = async () => {
//   const { data } = await api.detail(props.id as string);
//   dispathDetail.value = data;
//   load.value = true;
// };

// manualHandleVisible && getDispatchDetail();
</script>

<style lang="scss" scoped>
.label-value {
  color: #d0deee;
}
</style>
