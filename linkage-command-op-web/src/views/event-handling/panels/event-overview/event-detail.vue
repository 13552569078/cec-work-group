<template>
  <div class="display-flex flex-col h-full">
    <div class="display-flex items-middle items-between title-box m-b-sm">
      <span class="self-full h4 text-ellipsis" @mouseover="showTooltip">
        {{ currentEvent.name }}
      </span>
      <hl-button v-if="expandable && !eventIsFinished" type="primary" class="hover-style" @click="showEventBasicDlg = true">编辑</hl-button>
    </div>
    <hl-scrollbar class="self-grow">
      <hl-row layout="grid" count="count-2" dir="vertical" gap="var(--xs)">
        <hl-col class="sub-card-item col">
          <div class="color-2 m-b-xxs">事件类型</div>
          <div class="font-bold">{{ currentEvent.eventTypeName }}</div>
        </hl-col>
        <hl-col class="sub-card-item col">
          <div class="color-2 m-b-xxs">发生时间</div>
          <div class="font-bold" style="white-space:nowrap;">{{ currentEvent.happenTime }}</div>
        </hl-col>
        <hl-col class="sub-card-item col" v-if="expandable">
          <div class="color-2 m-b-xxs">事件等级</div>
          <div class="font-bold">{{ currentEvent.eventLevelName || '--' }}</div>
        </hl-col>
        <hl-col class="sub-card-item col" v-if="expandable">
          <div class="color-2 m-b-xxs">行政区划</div>
          <div class="font-bold">{{ currentEvent.mainAreaName }}</div>
        </hl-col>
        <hl-col v-for="idx in basicCardOtherData" :key="idx.code" class="sub-card-item col" :class="{'col-span-2': idx.type === EVENT_TEXT_IDX && idx.length === EVENT_TEXT_IDX_LONG}">
          <div class="color-2 m-b-xxs">{{ idx.name }}{{ idx.unit ? `（${idx.unit}）` : ''}}</div>
          <div v-if="idx.type === EVENT_TEXT_IDX" class="font-bold">
            <span class="ellipsis" style="--line: 2" @mouseover="showTooltip">{{ idx.value }}</span>
          </div>
          <div v-else class="font-bold">{{ idx.value }}</div>
        </hl-col>
        <hl-col class="sub-card-item col col-span-2" v-if="expandable">
          <div class="color-2 m-b-xxs">事件描述</div>
          <div class="font-bold">
            <span class="ellipsis" style="--line: 2" @mouseover="showTooltip">{{ currentEvent.desc }}</span>
          </div>
        </hl-col>
        <hl-col class="sub-card-item col col-span-2 attachments">
          <div class="color-2 m-b-xs">图片视频文件</div>
          <div class="font-bold" v-if="currentEvent.detailedAttachmentInfo?.length == 0">--</div>
          <file-carousel v-else :fileList="currentEvent.detailedAttachmentInfo" />
        </hl-col>
      </hl-row>
      <affected-info v-show="expandable && currentEvent.id" :idx-list="eventIdx"/>
    </hl-scrollbar>
    <event-basic-dlg v-if="showEventBasicDlg" :idx-list="eventIdx" @cancel="showEventBasicDlg = false" @ok="okDlg" />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, watchEffect, ref, inject, onMounted } from 'vue';
import { omit } from 'lodash-es';
import { useCurrentEvent, useDataRefresher, useTextOverflow } from '@/hooks';
import { ExpandableCardParams } from '@/types';
import { BASIC_CARD, ExpandableCardParamsKey, EVENT_TEXT_IDX, EVENT_TEXT_IDX_LONG } from '@/common';
import { FileCarousel } from '@/components';
import { apiEventElementObj } from '@/apis/modules/event-element';
import AffectedInfo from './components/affected-info.vue';
import EventBasicDlg from './components/event-basic-dlg.vue';

import type { IpostFindEventTypeIndexListSpace } from '@/apis/modules/event-element/model';

const { left1: expandable } = inject<ExpandableCardParams>(ExpandableCardParamsKey)!;

const { eventIsFinished, fetchEvent, currentEvent, updateEvent } = useCurrentEvent(() => { loadEventIdx(); });
const { showTooltip } = useTextOverflow();

const showEventBasicDlg = ref(false);
const eventIdx = ref<IpostFindEventTypeIndexListSpace.Data[]>([]);

const basicCardOtherData = computed(() => {
  if (expandable.value) {
    return eventIdx.value.filter(i => i.displayCard === BASIC_CARD.value)
      .map(i => Object.assign({}, i, currentEvent.indicies?.find(d => d.code === i.code) || {}));
  } else {
    return [];
  }
});

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
  showEventBasicDlg.value = false;
};

const loadEventIdx = async() => {
  const res = await apiEventElementObj.postFindEventTypeIndexList({
    eventTypeCode: currentEvent.eventTypeCode,
    state: 1,
  });
  eventIdx.value = res.data;
};

useDataRefresher(() => {
  fetchEvent(currentEvent.id!, true, false);
});
</script>
<style lang="scss" scoped>
.color-2 {
  color: #B5CEE3;
}
.title-box {
  height: calc(var(--xxs) * 11);
  padding: calc(var(--xxs) * 2.5) var(--md);
  background-image: url(@/assets/images/event-handling/left-1/title-bg.png);
  background-size: 100% 100%;
}
.sub-card-item {
  min-height: calc(var(--xxs) * 18);
  font-size: var(--font-lg);
  line-height: 1.375;
  font-family: PingFangSC-Semibold, PingFang SC;
  padding: var(--sm) var(--md) var(--sm) calc(var(--xxs) * 3) !important;
  background-image: url(@/assets/images/event-handling/left-1/sub-card-bg.png);
  background-size: 100% 100%;
  position: relative;
  &.attachments {
    height: calc(var(--xxs) * 31);
    overflow: hidden;
  }
}
.two-line {
  display: -webkit-box;
  white-space: break-spaces;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
