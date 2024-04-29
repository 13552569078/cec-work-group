<template>
  <div class="total-section m-b-md">
    <div class="total-icon" :class="apiKey"></div>
    <div class="total-count cursor-pointer" @click="showDetail({ name: '', code: '' })">
      <h4>{{ label }}总数</h4>
      <span class="big-num">{{ totalCount }}</span>
    </div>
  </div>
  <hl-scrollbar class="material-list-wrapper" v-bind="$attrs">
    <div v-if="materialData.length" class="material-list">
      <div
        v-for="item in materialData"
        :key="item.name"
        class="material-item p-r cursor-pointer"
        :class="apiKey"
        @click="showDetail(item)"
      >
        <div class="content" data-unit="个">
          <span class="xmid-num">{{item.count}}</span>
          <span class="material-name text-ellipsis" @mouseover="showTooltip">{{ item.name}}</span>
        </div>
      </div>
    </div>
    <hb-empty v-else :image="NoDataImg" description="暂无数据"></hb-empty>
  </hl-scrollbar>
</template>
<script lang="ts" setup>
import { onMounted, ref, computed, inject, PropType } from 'vue';
import { useCurrentArea, useTextOverflow } from '@/hooks';
import { ResourceDetailParamsKey, RESOURCE_MATERIAL, RISK_REFUGE } from '@/common';
import { RankList } from '@/components';
import { ResourceDetailParams } from '@/types';
import { apiResourceObj } from '@/apis/modules/resource';
import { IgetEquipStatSpace, IpostEmergencyStatSpace } from '@/apis/modules/resource/model';
import NoDataImg from '@/assets/images/empty/no-data.png';

defineOptions({
  inheritAttrs: false
});
const props = defineProps({
  label: String,
  apiKey: String as PropType<typeof RESOURCE_MATERIAL | typeof RISK_REFUGE>,
});

const { showTooltip } = useTextOverflow();

const resourceDetailParams = inject<ResourceDetailParams>(ResourceDetailParamsKey)!;

const materialData = ref<IpostEmergencyStatSpace.Data[]>([]);

const totalCount = computed(() => materialData.value.reduce((prev, cur) => prev + cur.count, 0));

const getData = async(areaCode: string) => {
  const result = await apiResourceObj.postEmergencyStat({ areaCode, type: props.apiKey });
  materialData.value = result.data.resourceCountList;
};
const showDetail = (type: IgetEquipStatSpace.Data) => {
  resourceDetailParams.show = true;
  Object.assign(resourceDetailParams, { ...type, title: props.label, key: props.apiKey, type: props.apiKey });
};

useCurrentArea(getData);
</script>
<style lang="scss" scoped>
.total-section {
  display: flex;
  align-items: center;
  column-gap: var(--px20);
  .total-icon {
    width: calc(var(--xxs) * 30.5);
    height: calc(var(--xxs) * 23.5);
    background-size: 100%;
    background-repeat: no-repeat;
    &.resource_material {
      background-image: url('@/assets/images/overview/right-2/total-icon2.png');
    }
    &.risk_refuge {
      background-image: url('@/assets/images/overview/right-2/total-icon3.png');
    }
  }
  .total-count {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: calc(var(--xxs) * 7.5);
    padding-right: calc(var(--xxs) * 12.5);;
    height: calc(var(--xxs) * 18);
    background-image: url('@/assets/images/overview/right-2/total-count-bg.png');
    background-size: 100%;
    background-repeat: no-repeat;
  }
}
.material-list-wrapper {
  height: calc(100% - var(--tabs-height) - calc(var(--xxs) * 23.5) - var(--xxs) * 6.5);;
}
.material-list {
  margin-top:  calc(var(--xxs) * 2);
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: calc(var(--xxs) * 3.75);
  row-gap: calc(var(--xxs) * 3);
  .material-item {
    height: calc(var(--xxs) * 21.5);
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    .content{
      display: flex;
      flex-direction: column;
      position: relative;
      &::before {
        content: attr(data-unit);
        position: absolute;
        left: var(--md);
        top: var(--xs);
      }
    }
    .material-name {
      max-width: 6em;
      font-size: var(--font-lg);
    }
    &.resource_material {
      background-image: url('@/assets/images/overview/right-2/material.png');
    }
    &.resource_material:hover {
      background-image: url('@/assets/images/overview/right-2/material-active.png');
    }
    &.risk_refuge {
      background-image: url('@/assets/images/overview/right-2/refuge.png');
    }
    &.risk_refuge:hover {
      background-image: url('@/assets/images/overview/right-2/refuge-active.png');
    }
  }
  .p-r {
    padding-left: calc(var(--xxs) * 29);
  }
}
</style>
