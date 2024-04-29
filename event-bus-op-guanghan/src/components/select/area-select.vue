<template>
  <hl-selector
    :class="!isFullWidth ? '' : 'w-full'"
    ref="selector1"
    filterable
    clearable
    block
    :popper-class="!isFullWidth ? 'poper-width' : ''"
    @input="handleTreeInput"
    @clear="handleClear"
    @resize="resize"
    placeholder="请选择行政区划"
    popper-append-to-body
  >
    <hl-scrollbar>
      <hl-tree
        ref="hlTreeSingle"
        :style="treeStyle"
        node-key="id"
        :data="areaList"
        :filter-node-method="filterNode"
        class="p-md small-text"
        @node-click="clickTree"
        :props="defaultProps"
        default-expand-all
      />
    </hl-scrollbar>
  </hl-selector>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { findNode } from '@/common';
import { GlobalAPI } from '@/common/global-api';
import { useUtils } from '@/hooks';

const { areaList, getAreaList } = useUtils();

interface ItreeNode {
  label: string;
  children: any[];
  value: string;
  areaCode: string;
  areaName: string;
}

const props = defineProps({
  deep: {
    type: Boolean,
    default: true,
  },
  modelValue: Number,
  isEmitAreaCode: {
    type: Boolean,
    default: true
  },
  isFullWidth: {
    type: Boolean,
    default: false
  }
});

watch(() => props.modelValue,
  n => {
    if (n) {
      if (props.isEmitAreaCode) {
        setValueByCode(props.modelValue as number);
      }
    } else {
      reset();
    }
  },
  {
    deep: true,
  });

const defaultProps = {
  children: 'children',
  label: 'name',
  value: 'id'
};

const emit = defineEmits(['change', 'update:modelValue', 'clearArea']);
const selector1 = ref();
const hlTreeSingle = ref();
const treeStyle = ref({
  width: '',
});

const clickTree = (data: ItreeNode) => {
  const areaName = setValueByCode(data.id);
  selector1.value.togglePopperVisible(false);
  if (!props.isEmitAreaCode) {
    emit('update:modelValue', areaName);
  } else {
    emit('update:modelValue', data.id);
  }
  emit('change', data);
};
const reset = () => {
  selector1.value.setValue('');
  selector1.value.togglePopperVisible(false);
  hlTreeSingle.value.filter('');
  emit('clearArea');
};

const handleClear = () => {
  emit('update:modelValue', '');
  emit('change', '');
};

const filterNode = (value: string, data: ItreeNode) => {
  console.log(value, data, 123);
  if (!value) return true;
  return data.name.indexOf(value) !== -1;
};
const handleTreeInput = (val: string) => {
  hlTreeSingle.value.filter(val);
};
const resize = (data: { offsetWidth: number }) => {
  treeStyle.value.width = data.offsetWidth + 'px';
};
const getAreaNamePath = (areaCode: number, areaArr: ItreeNode[], areaNamePath: string | boolean) => {
  let path = '';
  let count = 0;
  if (!areaCode) return path;
  let currentAreaCode = areaCode;
  while (currentAreaCode !== 0 && count < 1000) {
    const node = findNode(currentAreaCode, 'id', areaArr);
    if (node) {
      path = path ? `${node.name}-${path}` : `${node.name}`;
      currentAreaCode = node.pid;
    }
    count++;
  }
  return path;
};

const getAreaCodeByAreaName = (name: string) => {
  const node = findNode(name, 'label', areaList.value);
  if (node) {
    return node.value;
  }
  return '';
};

const setValueByCode = (areaCode: number) => {
  const areaName = getAreaNamePath(areaCode, areaList.value, '');
  selector1.value.setValue(areaName);
  return areaName;
};

onMounted(async() => {
  await getAreaList();
  if (areaList.value.length && props.modelValue) {
    setValueByCode(props.modelValue);
  }
});

defineExpose({
  setValueByCode,
  getAreaCodeByAreaName
});
</script>
