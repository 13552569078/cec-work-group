<template>
  <div>
    <div v-for="item in infoList" :key="item.key" class="sub-card-item m-t-xs">
      <div class="display-flex items-center items-middle sub-card-title">
        <span class="self-full"><span class="font-bold">{{ item.title }}</span></span>
        <hl-button v-if="!eventIsFinished && item.dataList.length" type="primary" class="hover-style normal-width" @click="edit(item.key)">编辑</hl-button>
      </div>
      <hl-row layout="grid" count="count-2" dir="vertical" gap="var(--sm)" class="p-sm">
        <hl-col v-for="subItem in item.dataList" :key="subItem.code" class="col col-item display-flex items-middle">
          <span class="col-label self-full color-two-level text-ellipsis" @mouseover="showTooltip">{{ getLabelUnit(subItem) }}</span>
          <span class="col-value self-no-full text-ellipsis" @mouseover="showTooltip">{{ subItem.value || '--' }}</span>
        </hl-col>
      </hl-row>
    </div>
    <affected-person-dlg v-if="editKey === 'people'" :idx-list="idxList" @cancel="cancelDlg" @ok="okDlg"/>
    <affected-econ-dlg v-if="editKey === 'econ'" :idx-list="idxList" @cancel="cancelDlg" @ok="okDlg"/>
    <!-- <affected-facility-dlg v-if="editKey === 'facility'" :unit="unit" :info="infoList[2]" @cancel="cancelDlg" @ok="okDlg"/> -->
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, PropType, ref, watch } from 'vue';
import { omit } from 'lodash-es';
import { useCurrentEvent, useTextOverflow } from '@/hooks';
import { EVENT_NUM_IDX, LOSS_CARD, PERSON_INJURY_CARD } from '@/common';
import AffectedPersonDlg from './affected-person-dlg.vue';
import AffectedEconDlg from './affected-econ-dlg.vue';
import AffectedFacilityDlg from './_affected-facility-dlg.vue';

import type { IpostFindEventTypeIndexListSpace } from '@/apis/modules/event-element/model';

const props = defineProps({
  idxList: {
    type: Array as PropType<IpostFindEventTypeIndexListSpace.Data[]>,
    default: () => []
  }
});

const { currentEvent, updateEvent, eventIsFinished } = useCurrentEvent();
const { showTooltip } = useTextOverflow();

const editKey = ref('');
const infoList = computed(() => [{
  title: '人员伤亡情况',
  key: 'people',
  dataList: props.idxList.filter(i => i.displayCard === PERSON_INJURY_CARD.value)
    .map(i => Object.assign({}, i, currentEvent.indicies?.find(d => d.code === i.code) || {}))
}, {
  title: '损失情况',
  key: 'econ',
  dataList: props.idxList.filter(i => i.displayCard === LOSS_CARD.value)
    .map(i => Object.assign({}, i, currentEvent.indicies?.find(d => d.code === i.code) || {}))
}]);

const getLabelUnit = (subItem: Record<string, any>) => {
  return `${subItem.name}${subItem.type === EVENT_NUM_IDX && subItem.unit ? '(' + subItem.unit + ')' : ''}`;
};
const edit = (key: string) => {
  editKey.value = key;
};
const cancelDlg = () => {
  editKey.value = '';
};
const okDlg = async(data: Record<string, any>) => {
  const result = {
    ...omit(data, 'customIdx'),
    eventIndicies: Object.keys(data.customIdx).map(k => ({
      'eventId': currentEvent.id,
      'code': k,
      'unit': data.customIdx[k].unit,
      'value': data.customIdx[k].value
    }))
  };
  await updateEvent(result);
  cancelDlg();
};
</script>
<style lang="scss" scoped>
.sub-card-item {
  .color-two-level, :deep(.color-two-level) {
    color: #B5CEE3;
  }
  .font-two-level {
    font-size: var(--font-md);
    line-height: 1.428;
  }
  font-size: var(--md);
  line-height: calc(var(--xxs) * 5.5);
  background-image: url(@/assets/images/event-handling/left-1/sub-card-bg.png);
  background-size: 100% 100%;
  .sub-card-title{
    padding: var(--sm) var(--md) var(--sm) calc(var(--xxs) * 9) !important;
    background-image: url(@/assets/images/event-handling/left-1/affected-title-bg.png);
    background-size: 100% 100%;
    position: relative;
    &::before{
      display: block;
      content: '';
      position: absolute;
      width: var(--lg);
      height: var(--lg);
      background-image: url(@/assets/images/event-handling/left-1/prefix-icon.png);
      background-size: 100% 100%;
      top: var(--sm);
      left: var(--xs);
    }
  }
  .col-item{
    // height: var(--xxl);
    :deep(.col-label){
      padding: calc(var(--xxs) * 2.25);
      padding-right: 0 !important;
      background: rgba(0,158,247,0.12);
    }
    :deep(.col-value){
      padding: calc(var(--xxs) * 2.25);
      padding-right: 0 !important;
      width: calc(var(--xxs) * 13.5);
      background: #014779;
    }
  }
}
</style>
