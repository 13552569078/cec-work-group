<template>
  <card-panel title="分析研判" :class="['right1', expandable ? 'card-expandable' : '']">
    <template #action>
      <expandable-button mark="right1" />
    </template>
    <detail-list />
  </card-panel>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { ExpandableCardParamsKey } from '@/common';
import { ExpandableButton } from '@/components';
import { ExpandableCardParams } from '@/types';
import DetailList from '../panels/analysis-judge/detail-list.vue';

const { right1: expandable } = inject<ExpandableCardParams>(ExpandableCardParamsKey)!;
</script>
<style lang="scss" scoped>
.right1 {
  height: 49.8888888889vh;
}
</style>
