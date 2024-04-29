<template>
  <card-panel title="任务跟踪" :class="['left3', expandable ? 'card-expandable' : '']">
    <template #action>
      <button-group :buttons="curButtons" :hide-single="false" @click="showAddTaskDlg = true"/>
      <expandable-button mark="left3" />
    </template>
    <task-stat />
    <add-task-dlg v-if="showAddTaskDlg" @cancel="showAddTaskDlg = false" />
  </card-panel>
</template>

<script setup lang="ts">
import { inject, ref, watch, computed } from 'vue';
import { ButtonGroup, ExpandableButton } from '@/components';
import { useCurrentEvent } from '@/hooks';
import { ButtonItem, ButtonTabItem, ExpandableCardParams, ResourceDetailParams } from '@/types';
import { ExpandableCardParamsKey, GlobalAPI } from '@/common';
import TaskStat from '../panels/task-track/task-statistics.vue';
import AddTaskDlg from '../panels/task-track/add-task-dlg/index.vue';

const { left3: expandable } = inject<ExpandableCardParams>(ExpandableCardParamsKey)!;

const { eventIsFinished } = useCurrentEvent();

const buttons = ref<ButtonItem[]>(GlobalAPI.config.WARTIME_MAP_CONFIG.taskCenter.tabs);

const curButtons = computed(() => {
  return eventIsFinished.value ? buttons.value.filter(el => el.value !== 'CreateTask') : buttons.value;
});

const showAddTaskDlg = ref(false);

</script>
<style lang="scss" scoped>
.left3 {
  height: 24.90740740740741vh;
}
</style>
