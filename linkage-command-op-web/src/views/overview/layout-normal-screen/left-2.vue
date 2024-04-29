<template>
  <card-panel title="处置中事件" :class="['left2', expandable ? 'card-expandable' : '']">
    <template #action>
      <button-group :buttons="[{label: '创建事件', value: 1}]" :hide-single="false" @click="eventListRef?.createEvent"/>
      <expandable-button mark="left2" />
    </template>
    <event-list ref="eventListRef" />
  </card-panel>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue';
import { ButtonGroup, ExpandableButton } from '@/components';
import { ExpandableCardParamsKey } from '@/common';
import { ExpandableCardParams } from '@/types';
import EventList from '../panels/event-list/event-list.vue';

const { left2: expandable } = inject<ExpandableCardParams>(ExpandableCardParamsKey)!;

const eventListRef = ref();
</script>
<style lang="scss" scoped>
.left2 {
  height: 29.2592592592592vh;
  // &.expandable {
  //   height: 88vh;
  // }
}
</style>
