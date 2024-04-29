<template>
  <hl-dialog
    class="task-detail-dlg"
    :model-value="true"
    width="calc(var(--xxs) * 220)"
    height="calc(var(--xxs) * 200)"
    placement="center"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    padding="var(--xl)"
    title="任务详情"
    :append-to-body="true"
    @close="$emit('cancel')"
  >
    <hl-scrollbar :height="showFooter ? 'calc(var(--xxs) * 160)' : 'calc(var(--xxs) * 176)'">
      <task-details ref="taskDetailsRef" :id="detailsId" @updateDetailsId="val => detailsId = val"/>
    </hl-scrollbar>
    <template v-if="showFooter" #footer>
      <hl-button
        type="primary"
        style="
          width: calc(var(--xxs) * 24.5);
          --button-bg-color: transparent;
          --button-font-color: var(--primary);"
        @click="supervise"
      >一键督办</hl-button>
    </template>
  </hl-dialog>
</template>

<script lang="ts" setup>
import { ref, watchEffect, computed } from 'vue';
import { useCurrentEvent } from '@/hooks';
import { HlMessage } from 'hongluan-ui';
import { apiTaskObj } from '@/apis/modules/task';
import { TaskDetails } from './';

const props = defineProps({
  id: {
    type: String,
    default: ''
  }
});

defineEmits(['cancel']);

const { eventIsFinished } = useCurrentEvent();

const showFooter = computed(() => {
  return !eventIsFinished.value && +taskDetailsRef.value?.detailsData.taskState === 1;
});

const taskDetailsRef = ref();
const detailsId = ref(props.id);
const isDetailsCreator = ref(false);
const isDetailsData = ref({
  timeout: 0,
  id: null
});

const supervise = async() => {
  const id = isDetailsData.value.id ?? detailsId.value;
  await apiTaskObj.postOneKeySupervision(id);
  HlMessage.success({ message: '督办信息发送成功！' });
};

watchEffect(() => {
  if (taskDetailsRef.value) {
    // creator 创建人1 执行人0  全非2
    isDetailsCreator.value = +taskDetailsRef.value.detailsData.creator !== 2;
    isDetailsData.value = taskDetailsRef.value.detailsData;
  }
});
</script>

<style lang="scss">
.task-detail-dlg.hl-panel .panel-body {
  padding: calc(var(--xxs) * 5);
}
.task-detail-dlg.hl-panel > .panel-footer {
  padding-top: 0;
}
.hl-tabs.tabs-top.tabs-line .tabs-item {
  margin-right: calc(var(--xxs) * 10);
}
.task-detail-dlg.hl-panel {
  --panel-border-color: none;
}
</style>
