<template>
  <card-panel :title="title" class="right3">
    <focus-goal />
  </card-panel>
</template>

<script setup lang="ts">
import { GlobalAPI } from '@/common';
import FocusGoal from '../panels/focus-goal/focus-goal.vue';

const title = GlobalAPI.config.NORMAL_MAP_CONFIG.focusGoals.name;
</script>
<style lang="scss" scoped>
.right3 {
  height: 24.8148148148148vh;
}
</style>
