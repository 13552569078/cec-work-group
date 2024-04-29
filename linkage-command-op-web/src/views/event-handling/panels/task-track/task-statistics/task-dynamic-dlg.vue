<template>
  <hl-dialog
    class="task-dynamic-dlg"
    :model-value="true"
    width="calc(var(--xxs) * 194)"
    height="calc(var(--xxs) * 200)"
    placement="center"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    padding="var(--xl)"
    title="任务动态"
    :append-to-body="true"
    @close="$emit('cancel')"
  >
    <hl-group full align="items-middle items-between" class="tab-box">
      <hl-tabs
        v-model="activeDynamicType"
        type="line"
        nav-height="calc(var(--xxs) * 14)"
        class="w-full"
        style="
          --tabs-font-color: var(--text-secondary);
          --tabs-bar-color: var(--text-hover);
          --tabs-border-color: #0c3864;
          --tabs-font-size: var(--font-lg)
        "
      >
        <hl-tab-pane
          v-for="(item, index) in taskDynamicType"
          :key="index"
          :label="item.label"
          :name="item.value"
        ></hl-tab-pane>
      </hl-tabs>
    </hl-group>
    <hl-scrollbar height="calc(var(--xxs) * 164)" class="m-t-md">
      <task-dynamic :id="detailsId" :active-dynamic-type="activeDynamicType" />
    </hl-scrollbar>
  </hl-dialog>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue';
import { TaskDynamic } from './';
import { taskDynamicType } from '@/common';

const props = defineProps({
  id: {
    type: String,
    default: ''
  }
});
defineEmits(['cancel']);

const detailsId = ref(props.id);
const activeDynamicType = ref('');
</script>

<style lang="scss">
.task-dynamic-dlg.hl-panel .panel-body {
  padding: 0 calc(var(--xxs) * 5);
  overflow: hidden;
}
.hl-tabs.tabs-top.tabs-line .tabs-item {
  margin-right: calc(var(--xxs) * 10);
}
.task-dynamic-dlg.hl-panel {
  --panel-border-color: none;
}
</style>
<style lang="scss" scoped>
.task-dynamic-dlg {
  .tab-box {
    padding-left: var(--lg);
    border-bottom: calc(var(--xxs) * 0.25) solid #0c3864;
  }
}
</style>
