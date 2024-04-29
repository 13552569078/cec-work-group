<template>
  <hl-group wrap gap="var(--xs)">
    <hl-tag
      v-for="tag in data"
      :key="tag"
      closable
      type="primary"
      :disable-transitions="false"
      @close="tagsClose(tag.label)"
    >{{ tag.label }}</hl-tag>
    <hl-input
      v-if="taskData.showInput"
      ref="tagInputRef"
      v-model="taskData.addVal"
      size="sm"
      @keyup.enter="confirm"
      @blur="confirm"
    />
    <hl-button size="sm" @click="showTaskTagInput">+ 添加</hl-button>
  </hl-group>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick } from 'vue';
import { HlMessage } from 'hongluan-ui';

import type { PropType } from 'vue';

interface Item {
  label: string
  addUserName: string
}

const props = defineProps({
  tags: Array as PropType<Item[]>,
  default: () => {
    return [];
  }
});
const emit = defineEmits(['change']);

const data = ref(props.tags as Item[]);
const taskData = reactive({
  showInput: false,
  addVal: ''
});
const tagInputRef = ref();

const tagsClose = (label: string) => {
  data.value.splice(
    data.value.findIndex(el => el.label === label),
    1
  );
  emit('change', data.value);
};
const confirm = () => {
  taskData.addVal && data.value.push({
    label: taskData.addVal,
    addUserName: ''
  });
  taskData.showInput = false;
  taskData.addVal = '';
  emit('change', data.value);
};
const showTaskTagInput = () => {
  if (data.value.length >= 30) {
    HlMessage.warning({
      message: '最多添加30个任务标签!',
    });
  } else {
    taskData.showInput = true;
    nextTick(() => {
      tagInputRef.value.focus();
    });
  }
};
</script>
