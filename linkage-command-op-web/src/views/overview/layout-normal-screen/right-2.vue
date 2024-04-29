<template>
  <card-panel :title="title" class="right2">
    <template #action>
      <button-group :buttons="tabs" @click="v => tab = v"/>
    </template>
    <resource-equip
      v-if="tab === RESOURCE_EQUIP"
      :label="tabLabel"
      style="--tabs-height:0px"
    />
    <resource-material
      v-else-if="tab === RESOURCE_MATERIAL"
      :api-key="RESOURCE_MATERIAL"
      :label="tabLabel"
      style="--tabs-height:0px"
    />
    <resource-material
      v-else
      :api-key="RISK_REFUGE"
      :label="tabLabel"
      style="--tabs-height:0px"
    />
  </card-panel>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { ButtonGroup } from '@/components';
import { ButtonTabItem } from '@/types';
import { GlobalAPI, RESOURCE_EQUIP, RESOURCE_MATERIAL, RISK_REFUGE } from '@/common';
import ResourceEquip from '../panels/material-support/resource-equip.vue';
import ResourceMaterial from '../panels/material-support/resource-material.vue';

const tabs: ButtonTabItem[] = GlobalAPI.config.NORMAL_MAP_CONFIG.materialSupport.tabs;
const title = GlobalAPI.config.NORMAL_MAP_CONFIG.materialSupport.name;
const tab = ref(GlobalAPI.config.NORMAL_MAP_CONFIG.materialSupport.tabs[0].value);

// const tabHeight = computed(() => ({ '--tabs-height': tabs.length > 1 ? 'var(--xxs) * 9' : '0px' }));
const tabLabel = computed(() => tabs.find(t => t.value === tab.value)?.label);
</script>
<style lang="scss" scoped>
.right2 {
  height: 32.96296296296vh;
}
</style>
