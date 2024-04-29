<template>
  <card-panel title="现场聚焦" :class="['right2', expandable ? 'card-expandable' : '']">
    <template #action>
      <button-group :buttons="tabs" @click="v => tab = v"/>
      <expandable-button mark="right2" />
    </template>
    <site-personnel v-if="tab === 'SitePersonnel'" />
    <site-dynamics v-else-if="tab === 'SiteDynamics'" />
    <fixed-video v-else-if="tab === 'FixedVideo'" />
  </card-panel>
</template>

<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue';
import { ButtonGroup, ExpandableButton } from '@/components';
import { ButtonItem, ButtonTabItem, ExpandableCardParams } from '@/types';
import { ExpandableCardParamsKey, GlobalAPI } from '@/common';
import SitePersonnel from '../panels/site-focus/site-personnel.vue';
import SiteDynamics from '../panels/site-focus/site-dynamics.vue';
import FixedVideo from '../panels/site-focus/fixed-video.vue';

const { right2: expandable } = inject<ExpandableCardParams>(ExpandableCardParamsKey)!;

const tabs = ref<ButtonItem[]>(GlobalAPI.config.WARTIME_MAP_CONFIG.siteFocus.tabs);
const tab = ref('FixedVideo');
</script>
<style lang="scss" scoped>
.right2 {
  height: 35.407407407407405vh;
}
</style>
