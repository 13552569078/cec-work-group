<template>
  <div class="specialist-tab">
    <div v-for="item in specialistData.resourceCountList" :key="item.code" class="specialist-item" @click="showDetail(item)">
      <div :class="`bg bg${item.code}`"></div>
      <div class="text">
        <span class="num mid-num">{{ item.count }}</span>
        <span class="name">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, computed, inject, reactive } from 'vue';
import { useCurrentArea } from '@/hooks';
import { ResourceDetailParams } from '@/types';
import { apiResourceObj } from '@/apis/modules/resource';
import { IpostEmergencyStatSpace } from '@/apis/modules/resource/model';
import { ResourceDetailParamsKey, RESOURCE_EXPERT } from '@/common';

const SPECIALIST_TYPE = { type: 'resource_expert' };

const props = defineProps({
  label: String
});

const resourceDetailParams = inject<ResourceDetailParams>(ResourceDetailParamsKey)!;
const specialistData = reactive({} as IpostEmergencyStatSpace.Model['data']);

const getData = async(areaCode: string) => {
  const result = await apiResourceObj.postEmergencyStat({ areaCode, ...SPECIALIST_TYPE });
  Object.assign(specialistData, result.data);
};
const showDetail = (type: IpostEmergencyStatSpace.Data) => {
  resourceDetailParams.show = true;
  Object.assign(resourceDetailParams, { ...type, ...SPECIALIST_TYPE, title: props.label, key: RESOURCE_EXPERT });
};

useCurrentArea(getData);
</script>
<style lang="scss" scoped>
.specialist-tab {
  display: flex;
  column-gap: calc(var(--xxs) * 13.25);
  row-gap: calc(var(--xxs) * 2.5);
  flex-wrap: wrap;
  .specialist-item {
    cursor: pointer;
    display: flex;
    column-gap: calc(var(--xxs) * 4);
    .text {
      display: flex;
      flex-direction: column;
      align-items: start;
      justify-content: center;
      .name {
        font-size: var(--font-lg);
      }
    }
    .bg {
      width: calc(var(--xxs) * 27);
      height: calc(var(--xxs) * 28.75);
      background-size: 100% 100%;
      background-repeat: no-repeat;
      &.bg1 {
        background-image: url('@/assets/images/overview/right-1/emergency.png');
      }
      &.bg2 {
        background-image: url('@/assets/images/overview/right-1/nature.png');
      }
      &.bg3 {
        background-image: url('@/assets/images/overview/right-1/safety.png');
      }
      &.bg4 {
        background-image: url('@/assets/images/overview/right-1/other.png');
      }
    }
  }
}
</style>
