<template>
  <hl-scrollbar height="100%">
    <div class="targets-list">
      <div v-for="t in focusItems" :key="t.name" class="target-item cursor-pointer" @click="showDetail(t)">
        <span class="xmid-num">{{ t.val }}</span>
        <span class="font-lg text-ellipsis target-name" @mouseover="showTooltip">{{ t.name }}</span>
      </div>
    </div>
  </hl-scrollbar>
</template>
<script setup lang="ts">
import { inject, ref, watch } from 'vue';
import { ButtonTabItem, ResourceDetailParams } from '@/types';
import { useCurrentArea, useTextOverflow } from '@/hooks';
import { FOCUS_GOAL, GlobalAPI, ResourceDetailParamsKey } from '@/common';
import { apiResourceObj } from '@/apis/modules/resource';
import { IgetFocusGoalsStatSpace } from '@/apis/modules/resource/model';

const { showTooltip } = useTextOverflow();

const resourceDetailParams = inject<ResourceDetailParams>(ResourceDetailParamsKey)!;

const tabs: ButtonTabItem[] = GlobalAPI.config.NORMAL_MAP_CONFIG.focusGoals.tabs;
const title = GlobalAPI.config.NORMAL_MAP_CONFIG.focusGoals.name;
const focusItems = ref<IgetFocusGoalsStatSpace.Data[]>([]);

const getData = async(areaCode: string) => {
  focusItems.value.length = 0;
  const result = await apiResourceObj.getFocusGoalsStat(areaCode);

  result.data.forEach(d => {
    const tab = tabs.find(t => t.value === d.code);
    if (tab) {
      focusItems.value.push({ ...d, name: tab.label });
    }
  });
};
const showDetail = (type: IgetFocusGoalsStatSpace.Data) => {
  resourceDetailParams.show = true;
  Object.assign(resourceDetailParams, { ...type, title: type.name, key: FOCUS_GOAL });
};

useCurrentArea(getData);
</script>
<style lang="scss" scoped>
.targets-list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: calc(var(--xxs) * 7);
  .target-item {
    height: calc(var(--xxs) * 25.5);
    background-image: url('@/assets/images/overview/right-3/item-icon.png');
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding-bottom: calc(var(--xxs) * 3.5);
    .target-name {
      max-width: 5em;
    }
  }
}
</style>
