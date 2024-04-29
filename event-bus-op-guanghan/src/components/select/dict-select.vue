<template>
  <hl-select v-model="value" @change="handleChange" clearable>
    <hl-option v-for="option in options" :key="option.label" :label="option.label" :value="option.value" />
  </hl-select>
</template>

<script lang='ts' setup>
import { ref, onMounted, watch } from 'vue';
import { useUtils } from '@/hooks';

const { getDict } = useUtils();

const props = defineProps<{
  dictType: string,
  modelValue: string,
  data: [] | undefined
}>();

const emits = defineEmits(['update:modelValue', 'change']);

const options = ref<{
  label: string,
  value: string
}[]>([]);

const value = ref(props.modelValue);

const handleChange = (val: string) => {
  emits('update:modelValue', val);
  emits('change', val);
};

watch(() => props.modelValue, (val: string) => {
  value.value = val;
});

onMounted(async () => {
  if (!props.data) {
    options.value = await getDict(props.dictType);
  } else {
    options.value = props.data;
  }
});

</script>

<style lang='scss' scoped>
</style>
