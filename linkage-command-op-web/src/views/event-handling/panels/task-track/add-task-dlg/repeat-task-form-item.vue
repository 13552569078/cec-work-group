<template>
  <hl-selector class="repeat-task-form-item" ref="selectorTableRef" block>
    <hl-simple-table
      ref="tableRef"
      :cols="cols"
      :data="tableData"
      tooltip-effect="dark"
      borderless
      highlight-current-row
      hover
      :show-header="false"
    >
      <template #label="{ row }">
        <hl-group
          style="width: calc(var(--xxl) * 5)"
          align="items-between items-middle"
          class="cursor-pointer"
          @click="selectChange(row)"
        >
          <span class="p-x-md">{{ row.label }}</span>
          <hl-group style="width: var(--lg)" align="items-center  items-middle">
            <hl-icon type="primary" :opacity="0" v-if="row.value === active">
              <two-checked />
            </hl-icon>
          </hl-group>
        </hl-group>
      </template>
    </hl-simple-table>
    <custom-repeat-condition-dlg
      v-if="isShowCustom"
      :params="repeatData"
      @cancel="isShowCustom = false"
      @submit="repeatTaskSubmit"
    />
  </hl-selector>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue';
import CustomRepeatConditionDlg from './custom-repeat-condition-dlg.vue';
import { useTask } from './use-task';

interface Row {
  value: string;
  label: string;
  isRepeat?: number;
  repeatType?: string;
}

const props = defineProps({
  params: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
const emit = defineEmits(['change']);
const { tableData, dictMap, getRepeatTaskTips } = useTask();

const selectorTableRef = ref();
const tableRef = ref();
const active = ref('');
const cols = ref([{ title: '', slotName: 'label' }]);
const isShowCustom = ref(false);
const repeatData = ref({});

const selectChange = (row: Row) => {
  active.value = row.value;
  if (row.value === 'custom') {
    isShowCustom.value = true;
    // selectorTableRef.value.togglePopperVisible(false);
  } else {
    const { isRepeat, repeatType, label } = row;
    selectorTableRef.value && selectorTableRef.value.setValue(label);
    emit('change', {
      isRepeat,
      repeatType,
      repeatNum: 1,
      repeatSeondary: [],
      isRepeatTaskCustom: '0',
    });
  }
};
const repeatTaskSubmit = (val: { [key: string]: string | string[] }) => {
  selectorTableRef.value && selectorTableRef.value.setValue(val.tips);
  const { isRepeat, repeatNum, repeatType, repeatSeondary } = val;
  emit('change', {
    isRepeat,
    repeatNum,
    repeatType,
    repeatSeondary,
    isRepeatTaskCustom: '1',
  });
};

watchEffect(() => {
  if (Object.keys(props.params).length) {
    repeatData.value = props.params;
    if (+props.params.isRepeatTaskCustom === 0) {
      if (!props.params.repeatType) return;
      const currentRow = tableData.filter(el => el.repeatType === props.params.repeatType);
      const { label, value } = currentRow[0];
      active.value = value;
      selectorTableRef.value && selectorTableRef.value.setValue(label);
    } else {
      active.value = 'custom';
      const tips = getRepeatTaskTips({
        repeatNum: props.params.repeatNum,
        repeatSeondary: props.params.repeatSeondary,
        repeatType: props.params.repeatType,
        isRepeatTaskCustom: props.params.isRepeatTaskCustom,
      });
      selectorTableRef.value && selectorTableRef.value.setValue(tips);
    }
  }
});
</script>
