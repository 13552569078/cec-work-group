<template>
  <div>
    <hl-select v-model="selectedQuarter" size="sm" clearable>
      <hl-option v-for="item in quarterList" :key="item.value" :value="item.value" :label="item.label"></hl-option>
    </hl-select>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, ref, watch } from 'vue';
const props = defineProps({
  modelValue: {
    type: String,
    default: '01-03'
  },
  onChange: {
    type: Function
  }
});

const emit = defineEmits(['update:modelValue']);
const selectedQuarter = ref(props.modelValue);

const quarterList = [
  {
    label: '一季度',
    value: '01-03'
  },
  {
    label: '二季度',
    value: '04-06'
  },
  {
    label: '三季度',
    value: '07-09'
  }, {
    label: '四季度',
    value: '10-12'
  },
];

// 监听选中季度改变
watch(selectedQuarter, newVal => {
  emit('update:modelValue', newVal);
  if (props.onChange) {
    props.onChange(newVal);
  }
}, {
  immediate: true,
  deep: true
});

</script>
