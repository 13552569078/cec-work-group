<template>
  <div class="plotting-tab h-full">
    <button-group :buttons="tabs" class="w-full" @click="v => tab = v"/>
    <icon v-if="tab === 'icon'" class="self-grow"/>
    <list v-else-if="tab === 'list'" class="self-grow"/>
    <record v-if="tab === 'record'" class="self-grow"/>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { ButtonGroup } from '@/components';
import Icon from './plotting-tab-icon.vue';
import List from './plotting-tab-list.vue';
import Record from './plotting-tab-record.vue';

const tabs = [{ label: '标绘图标', value: 'icon' }, { label: '标绘列表', value: 'list' }, { label: '标绘记录', value: 'record' }];
const tab = ref('icon');
</script>
<style lang="scss" scoped>
.plotting-tab {
  display: flex;
  flex-direction: column;
  :deep(.button-group) {
    display: flex;
    column-gap: var(--px20);
    margin-bottom: var(--px20);
    .hl-button {
      width: auto;
      flex: 1;
      margin-right: 0 !important;
    }
  }
}
</style>
