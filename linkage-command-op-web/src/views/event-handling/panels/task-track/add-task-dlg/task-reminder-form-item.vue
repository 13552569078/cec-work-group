<template>
  <hl-group class="task-reminder-form-item" style="width: 100%;">
    <hl-selector
      ref="selectorTable"
      clearable
      block
      multiple
      collapse-tags
      collapse-tags-tooltip
      @remove-tag="removeTag"
      @clear="clearTags"
    >
      <hl-simple-table
        ref="tableRef"
        :cols="cols"
        :data="tableData"
        tooltip-effect="dark"
        borderless
        hover
        :show-header="false"
      >
        <template #label="{ row }">
          <hl-group
            style="width: calc(var(--xxl) * 5);"
            align="items-between items-middle"
            class="cursor-pointer"
            @click="select(row)"
          >
            <span :class="[row.value === 'custom' ? 'text-primary' : '',]">{{ row.label }}</span>
            <hl-group style="width: var(--lg)" align="items-center  items-middle">
              <hl-icon type="primary" :opacity="0" v-if="selectedList.includes(row.value)">
                <two-checked />
              </hl-icon>
            </hl-group>
          </hl-group>
        </template>
      </hl-simple-table>
      <template #collapse-tag="{ tag }">
        <span>{{ tag.text }}</span>
      </template>
    </hl-selector>

    <hl-dialog
      class="custom-reminder-time-dlg"
      v-model="visible"
      :modal="false"
      width="calc(var(--xxs) * 90)"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :append-to-body="true"
    >
      <template #header>
        <h4>添加指定时间</h4>
      </template>
      <hl-group class="p-y-xl w-full">
        <hl-date-picker
          ref="datePickerRef"
          v-model="customTime"
          type="datetime"
          placeholder="请指定时间"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DD HH:mm"
          @change="dateChange"
          block
        />
      </hl-group>
      <template #footer>
        <hl-group class="dialog-footer" gap="var(--md)">
          <hl-button @click="dateCancel">取 消</hl-button>
        </hl-group>
      </template>
    </hl-dialog>
  </hl-group>
</template>

<script lang="ts" setup>
import { ref, watch, PropType, watchEffect } from 'vue';
import { HlMessage } from 'hongluan-ui';
import type { TaskRemind } from '@/types';
import { differenceWith } from 'lodash-es';

const emit = defineEmits(['change']);
const props = defineProps({
  taskRemindList: {
    type: Array as PropType<TaskRemind[]>,
    default: () => ([])
  },
  endAtTime: {
    type: String,
    default: '',
  },
});

const datePickerRef = ref();
const tableRef = ref();
const selectedList = ref<any[]>([]);
const selectorTable = ref();
const tableData = ref([
  {
    value: '截止前5分钟',
    label: '截止前5分钟',
  },
  {
    value: '截止前10分钟',
    label: '截止前10分钟',
  },
  {
    value: '截止前15分钟',
    label: '截止前15分钟',
  },
  {
    value: '截止前30分钟',
    label: '截止前30分钟',
  },
  {
    value: '截止前1小时',
    label: '截止前1小时',
  },
  {
    value: '截止前2小时',
    label: '截止前2小时',
  },
  {
    value: 'custom',
    label: '添加指定时间',
  },
]);
const cols = ref([{ title: '', slotName: 'label' }]);
const visible = ref(false);
const customTime = ref('');

const removeTag = (tag: any) => {
  selectedList.value = selectedList.value.filter(el => el !== tag.text);
  updateData();
};
const clearTags = (tag: any) => {
  selectedList.value = [];
  updateData();
};

const updateData = () => {
  selectorTable.value?.setValue(selectedList.value);
  emit('change', selectedList.value.map(el => {
    return { reminderTime: el };
  }));
};

const select = (row: { value: string; label: string }) => {
  if (row.value === 'custom') {
    visible.value = true;
    customTime.value = '';
    selectorTable.value.togglePopperVisible(false);
  } else {
    const selectedIndex = selectedList.value.findIndex(el => el === row.label);
    if (selectedIndex > -1) {
      selectedList.value.splice(selectedIndex, 1);
    } else {
      selectedList.value.push(row.label);
    }
    updateData();
  }
};

const dateCancel = () => {
  selectorTable.value.togglePopperVisible(true);
  visible.value = false;
};

const dateChange = () => {
  if (new Date(customTime.value) < new Date()) {
    HlMessage.warning({
      message: '不允许设置早于当前时间的任务提醒',
    });
    datePickerRef.value.focus();
  } else if (props.endAtTime && new Date(customTime.value) > new Date(props.endAtTime)) {
    HlMessage.warning({
      message: '不允许设置晚于截止时间的任务提醒',
    });
    datePickerRef.value.focus();
  } else {
    dateCancel();
    tableData.value.pop();
    tableData.value = [
      ...tableData.value,
      ...[
        { value: customTime.value, label: customTime.value },
        {
          value: 'custom',
          label: '添加指定时间',
        },
      ],
    ];
    emit('change', selectedList.value.map(el => {
      return { reminderTime: el };
    }));
  }
};

watchEffect(() => {
  selectedList.value = [...props.taskRemindList.map(el => el.reminderTime)];
  selectorTable.value?.setValue(selectedList.value);
  const diff = differenceWith(selectedList.value, tableData.value.map(el => el.value));
  diff.forEach(el => {
    tableData.value.splice(tableData.value.length - 1, 0, { label: el, value: el });
  });
});
</script>
<style lang="scss">
.custom-reminder-time-dlg {
  .panel-header {
    background-image: url(@/assets/images/event-handling/right-3/add-task-dlg/custom-repeat-condition-dlg.png) !important;
    background-size: 100% 100% !important;
  }
}
</style>
