<template>
  <hl-select v-model="value" @change="handleChange" clearable popper-append-to-body>
    <hl-option v-for="option in eventTypeList" :key="option.label" :label="option.label" :value="option.value" />
  </hl-select>
</template>

<script lang='ts' setup>
import { ref, onMounted, watch } from 'vue';
import { useUtils } from '@/hooks';

const props = defineProps<{
  platform: string|number,
  modelValue?: string|number,
  hasDefaultValue: boolean,
  showAll: boolean,
}>();

const { eventTypeList, getEventTypeList } = useUtils(props.showAll);

const emits = defineEmits(['update:modelValue']);

const value = ref(props.modelValue);

const handleChange = (val: string) => {
  emits('update:modelValue', val);
};

const fetchData = async () => {
  await getEventTypeList(props.platform);
  if (props.hasDefaultValue) {
    value.value = eventTypeList.value[0].value;
    emits('update:modelValue', value.value);
  }
};

watch(() => props.platform, async (val: string|number) => {
  fetchData();
});

watch(() => props.modelValue, (val: string) => {
  value.value = val;
});

onMounted(async () => {
  fetchData();
});

</script>

<style lang='scss' scoped>
</style>
