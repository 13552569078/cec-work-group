<template>
  <PlanRisk :defaultParams="defaultParams" @updateInfo="updateInfo" />
  <PlanProject :defaultParams="defaultParams" @updateInfo="updateInfo" />
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { PlanRisk, PlanProject } from './index';
import { DefaultParams } from './plan-model';

const emit = defineEmits(['updateInfo']);

const props = defineProps<{
  defaultParams: DefaultParams;
}>();

const updateInfo = (value: any) => {
  emit('updateInfo', value);
};
</script>
<style lang="scss" scoped>
</style>
