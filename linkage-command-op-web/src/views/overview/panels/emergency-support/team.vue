<template>
  <div class="display-flex h-full team-tab">
    <div class="left">
      <team-anim />
      <div class="txt cursor-pointer" @click="showDetail({ code: '' })">
        <div class="big-num">{{ teamData.total }}</div>
        <h4>{{ label }}总数</h4>
      </div>
    </div>
    <div class="right">
      <hl-scrollbar height="100%">
        <div class="team-list">
          <div v-for="t in teamData.resourceCountList" :key="t.name" class="team-item cursor-pointer" @click="showDetail(t)">
            <span class="name text-ellipsis" @mouseover="showTooltip">{{ t.name }}</span>
            <span class="mid-num">{{ t.count }}</span>
          </div>
        </div>
      </hl-scrollbar>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, computed, inject, reactive } from 'vue';
import { useCurrentArea, useTextOverflow } from '@/hooks';
import { ResourceDetailParams } from '@/types';
import { apiResourceObj } from '@/apis/modules/resource';
import { IpostEmergencyStatSpace } from '@/apis/modules/resource/model';
import { ResourceDetailParamsKey, RESOURCE_TEAM } from '@/common';
import TeamAnim from './team-anim.vue';

const TEAM_TYPE = { type: 'resource_team' };

const props = defineProps({
  label: String
});

const { showTooltip } = useTextOverflow();

const resourceDetailParams = inject<ResourceDetailParams>(ResourceDetailParamsKey)!;
const teamData = reactive({} as IpostEmergencyStatSpace.Model['data']);

const getData = async(areaCode: string) => {
  const result = await apiResourceObj.postEmergencyStat({ areaCode, ...TEAM_TYPE });
  Object.assign(teamData, result.data);
};
const showDetail = (type: IpostEmergencyStatSpace.Data) => {
  resourceDetailParams.show = true;
  Object.assign(resourceDetailParams, { ...type, ...TEAM_TYPE, title: props.label, key: RESOURCE_TEAM });
};

useCurrentArea(getData);
</script>
<style lang="scss" scoped>
.left {
  position: relative;
  width: calc(var(--xxl) * 4.7);
  margin-right: calc(var(--md) + var(--xxs));
  // background-image: url('@/assets/images/overview/right-1/team-bg.png');
  // background-size: cover;
  // background-repeat: no-repeat;
  .txt {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: var(--md);
  }
}
.right {
  flex: 1;
  .team-list {
    display: flex;
    flex-direction: column;
    row-gap: var(--xxs);
    .team-item {
      height: calc(var(--xxs) * 11);
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      background-image: url('@/assets/images/overview/right-1/team-item-bg.png');
      background-repeat: no-repeat;
      background-size: cover;
      padding-right: var(--md);
      padding-left: calc(var(--px20) + var(--md));
      font-size: var(--font-lg);
      .name {
        max-width: 8em;
        line-height: calc(var(--font-xxxl));
      }
      &::before {
        content: "";
        position: absolute;
        left: 0;
        background-image: url('@/assets/images/overview/right-1/team-item-icon.png');
        background-size: 100%;
        width: calc(var(--lg) + var(--xxs) / 2);
        height: calc(var(--lg) + var(--xxs) / 2);
      }
    }
  }
}
</style>
