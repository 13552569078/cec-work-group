<template>
  <div class="total-section m-b-md">
    <div class="total-icon"></div>
    <div class="total-count cursor-pointer" @click="showDetail({ name: '', code: '' })">
      <h4>{{ label }}总数</h4>
      <span class="big-num">{{ totalCount }}</span>
    </div>
  </div>
  <rank-list
    :ranks="equipData"
    class="rank-list"
    v-bind="$attrs"
    @click="showDetail"
  />
</template>
<script lang="ts" setup>
import { onMounted, ref, computed, inject } from 'vue';
import { useCurrentArea } from '@/hooks';
import { RankList } from '@/components';
import { ResourceDetailParams } from '@/types';
import { apiResourceObj } from '@/apis/modules/resource';
import { IgetEquipStatSpace, IpostEmergencyStatSpace } from '@/apis/modules/resource/model';
import { ResourceDetailParamsKey, RESOURCE_EQUIP } from '@/common';

defineOptions({
  inheritAttrs: false
});
const props = defineProps({
  label: String
});

const resourceDetailParams = inject<ResourceDetailParams>(ResourceDetailParamsKey)!;

const equipData = ref<IpostEmergencyStatSpace.Data[]>([]);

const totalCount = computed(() => equipData.value.reduce((prev, cur) => prev + cur.count, 0));

const getData = async(areaCode: string) => {
  const result = await apiResourceObj.postEmergencyStat({ areaCode, type: RESOURCE_EQUIP });
  equipData.value = result.data.resourceCountList;
};
const showDetail = (type: IgetEquipStatSpace.Data) => {
  resourceDetailParams.show = true;
  Object.assign(resourceDetailParams, { ...type, title: props.label, key: RESOURCE_EQUIP, type: RESOURCE_EQUIP });
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
    background-image: url('@/assets/images/overview/right-2/total-icon1.png');
    background-size: 100%;
    background-repeat: no-repeat;
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
.rank-list {
  height: calc(100% - var(--tabs-height) - var(--xxs) * 23.5 - var(--xxs) * 6.5);
  :deep(.name) {
    width: 6em !important;
  }
}
</style>
