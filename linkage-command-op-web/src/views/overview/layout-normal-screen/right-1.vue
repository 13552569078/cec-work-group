<template>
  <card-panel :title="title" class="right1">
    <template #action>
      <button-group :buttons="buttons" @click="v => tab = v"/>
    </template>
    <team v-if="tab === RESOURCE_TEAM" :label="tabLabel" />
    <specialist v-else :label="tabLabel" />
  </card-panel>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { ButtonGroup } from '@/components';
import { GlobalAPI, RESOURCE_TEAM } from '@/common';
import { ButtonItem } from '@/types';
import Team from '../panels/emergency-support/team.vue';
import Specialist from '../panels/emergency-support/specialist.vue';

const buttons: ButtonItem[] = GlobalAPI.config.NORMAL_MAP_CONFIG.emergencySupport.tabs;
const title = GlobalAPI.config.NORMAL_MAP_CONFIG.emergencySupport.name;
const tab = ref(GlobalAPI.config.NORMAL_MAP_CONFIG.emergencySupport.tabs[0].value);

const tabLabel = computed(() => buttons.find(t => t.value === tab.value)?.label);
</script>
<style lang="scss" scoped>
.right1 {
  height: 27.407407407407vh;
}
</style>
