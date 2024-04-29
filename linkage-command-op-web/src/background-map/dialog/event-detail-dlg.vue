<template>
  <hl-dialog
    :model-value="true"
    width="calc(var(--xxs) * 220)"
    teleported
    append-to-body
    borderless
    :title="eventDetail.name"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @closed="$emit('cancel')"
  >
    <hl-row layout="grid" class="m-t-lg font-16" count="count-2" gap-x="var(--xxl)" gap-y="var(--lg)">
      <hl-col span="col">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">事件类型</span>
          <span class="font-bold group-item">{{ eventDetail.eventTypeName }}</span>
        </hl-group>
      </hl-col>
      <hl-col span="col">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">发生时间</span>
          <span class="font-bold group-item">{{ eventDetail.happenTime }}</span>
        </hl-group>
      </hl-col>
      <hl-col span="col">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">事件等级</span>
          <span class="font-bold group-item">{{ eventDetail.eventLevelName || '--' }}</span>
        </hl-group>
      </hl-col>
      <hl-col span="col">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">行政区划</span>
          <span class="font-bold group-item">{{ eventDetail.mainAreaName }}</span>
        </hl-group>
      </hl-col>
      <hl-col span="col col-span-2">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">事件发生地点</span>
          <hb-text-overflow class="two-line font-bold group-item" method="length" :length="92" width="calc(var(--xxl) * 10)">{{ eventDetail.mainAddress || '--' }}</hb-text-overflow>
        </hl-group>
      </hl-col>
      <hl-col v-for="idx in basicCardOtherData" :key="idx.code" :span="`col ${idx.type === EVENT_TEXT_IDX ? 'col-span-2' : ''}`">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">{{ idx.name }}{{ idx.unit ? `（${idx.unit}）` : ''}}</span>
          <hb-text-overflow class="two-line font-bold group-item" method="length" :length="92" width="calc(var(--xxl) * 10)">{{ idx.value }}</hb-text-overflow>
        </hl-group>
      </hl-col>
      <hl-col span="col col-span-2">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">事件描述</span>
          <hb-text-overflow class="two-line font-bold group-item" method="length" :length="92" width="calc(var(--xxl) * 10)">{{ eventDetail.desc || '--' }}</hb-text-overflow>
        </hl-group>
      </hl-col>
      <hl-col span="col col-span-2">
        <hl-group dir="vertical" class="info-description">
          <span class="text-secondary group-item">图片视频文件</span>
          <file-carousel v-if="eventDetail.detailedAttachmentInfo?.length > 0" :fileList="eventDetail.detailedAttachmentInfo" style="width: calc(var(--xxs) * 98);"/>
          <div v-else>--</div>
        </hl-group>
      </hl-col>
    </hl-row>
    <template v-if="$route.name === 'overview'" #footer>
      <hl-button type="primary" @click="handleEvent">{{ eventDetail.eventState === 'FINISHED' ? '事件复盘' : '进入处置' }}</hl-button>
    </template>
  </hl-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { BASIC_CARD, EVENT_TEXT_IDX, GlobalAPI } from '@/common';
import { apiEventListObj } from '@/apis/modules/event-list';
import { FileCarousel } from '@/components';
import { apiEventElementObj } from '@/apis/modules/event-element';
import { IpostFindEventTypeIndexListSpace } from '@/apis/modules/event-element/model';
import { IpostFindEventDetailByIdSpace } from '@/apis/modules/event-condition/model';

const FILE_VIEW = GlobalAPI.config.FILE_VIEW;

const router = useRouter();

const props = defineProps({
  id: String
});
const emit = defineEmits(['cancel', 'ok']);

const eventDetail = reactive({} as IpostFindEventDetailByIdSpace.Data);
const eventIdx = ref<IpostFindEventTypeIndexListSpace.Data[]>([]);

const basicCardOtherData = computed(() => {
  return eventIdx.value.filter(i => i.displayCard === BASIC_CARD.value)
    .map(i => Object.assign({}, i, eventDetail.indicies?.find(d => d.code === i.code) || {}));
});

const handleEvent = () => {
  emit('ok');
  router.push({ name: 'event-handling', query: { id: eventDetail.id } });
};

watchEffect(async() => {
  const result = await apiEventListObj.getFindEventDetailById(props.id!);
  Object.assign(eventDetail, result.data);
  await loadEventIdx();
});

const handleCount = (val:any) => {
  if (!val && val + '' !== '0') return '--';
  return val;
};

const loadEventIdx = async() => {
  const res = await apiEventElementObj.postFindEventTypeIndexList({
    eventTypeCode: eventDetail.eventTypeCode,
    state: 1,
  });
  eventIdx.value = res.data;
};
</script>

<style lang="scss" scoped>
:deep(.hb-text-overflow.two-line) {
  display: -webkit-box;
  white-space: break-spaces;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
