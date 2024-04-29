<template>
  <hl-cascader
    ref="areaCascaderRef"
    v-model="checkedData"
    :props="areaProps"
    :options="areaTreeData"
    collapse-tags
    :clearable="customProps?.clearable"
    @change="onChange"
    placeholder="请选择"
    block
    :show-all-levels="false"
  />
</template>
<script setup lang="ts">
import { PropType, ref } from 'vue';
import { useAreaList } from '@/hooks';

interface CustomPropsItem {
  multiple?: boolean;
  clearable?: boolean
}
const props = defineProps({
  customProps: {
    type: Object as PropType<CustomPropsItem>,
  },
  modelData: {
    type: [String, Array] as PropType<string | string[]>,
    default: ''
  }
});
const emit = defineEmits(['change']);

const { areaTreeData, getAreaTree } = useAreaList();

const checkedData = ref<string|string[]>(props.modelData);
const areaCascaderRef = ref();
const areaProps = {
  emitPath: false,
  value: 'code',
  label: 'name',
  checkStrictly: true,
  children: 'children',
  multiple: props.customProps?.multiple,
};

const onChange = (val: any) => {
  let obj;
  if (props.customProps?.multiple) {
    obj = {
      idList: val,
      nameList: areaCascaderRef.value.getCheckedNodes().map((el: any) => el.label)
    };
  } else {
    obj = {
      id: val,
      name: areaCascaderRef.value.getCheckedNodes().map((el: any) => el.label)[0]
    };
  }
  emit('change', obj);
};

getAreaTree();
</script>
<style lang="scss" scoped>

</style>
