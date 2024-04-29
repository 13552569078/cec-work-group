<template>
  <hv-panel title="相似事件推荐">
    <template #action> </template>
    <hl-group align="items-between items-middle" class="w-full" gap-x="var(--lg)" style="height: calc(var(--xl) * 1.2)">
      <hl-group align="items-middle">
        <span class="m-r-xs" style="width: calc(var(--xl) * 3)">时间选择</span>
        <hl-date-picker v-model="searchTime" type="month" placeholder="选择时间" block style="width: calc(var(--xl) * 3.2)" size="sm" />
      </hl-group>
      <hl-group align="items-middle">
        <span class="m-r-xs" style="width: calc(var(--xl) * 3)">事件类型</span>
        <event-type-select v-model="searchParams.eventTypeId" :platform="100" @update:modelValue="getList" :hasDefaultValue="false" :showAll="false" />
      </hl-group>
    </hl-group>
    <hl-group style="height: calc(var(--xl) * 13.5)" dir="vertical" gap="var(--xxs)" full="full-x">
      <event-list :list="pageList" :height="'calc(var(--xl) * 17.1)'" plat-type-style="progress" progress-name="置信度"></event-list>
    </hl-group>
  </hv-panel>
</template>

<script setup lang="ts">
import { ref, watch, reactive, PropType } from 'vue';
import { dayjs } from 'hongluan-ui';
import { dateFormat } from '@/common/time';
import { EventList } from '@/components';
import { apiEventAnalysisObj } from '@/apis';
import { IgetDetailSpace } from '@/apis/modules/index-page/model';

const props = defineProps({
  eventId: {
    type: String,
    default: ''
  },
  eventDetail: {
    type: Object as PropType<IgetDetailSpace.Data>,
    default: () => {
      return {};
    }
  }
});

const searchTime = ref(new Date());
const searchParams = reactive({
  startTime: dayjs(searchTime.value).startOf('month').format(dateFormat),
  endTime: dayjs(searchTime.value).endOf('month').format(dateFormat),
  eventDesc: props.eventDetail.eventDesc ?? '',
  eventTypeId: props.eventDetail.eventTypeId,
  eventId: props.eventDetail.id
});
const pageList = ref();

watch(searchTime, () => {
  searchParams.startTime = dayjs(searchTime.value).startOf('month').format(dateFormat);
  searchParams.endTime = dayjs(searchTime.value).endOf('month').format(dateFormat);
  getList();
});

const getList = async () => {
  const { data } = await apiEventAnalysisObj.postRecommend(searchParams);
  pageList.value = data.map(e => ({
    id: e.id,
    title: e.title,
    time: e.eventTime,
    name: `${e.eventTypeLName ?? '--'}/${e.eventTypeMName ?? '--'}/${e.eventTypeName ?? '--'}`,
    address: e.eventAddress,
    showPosition: e.coordx && e.coordy,
    location: [+e.coordx, +e.coordy],
    confidence: Number(e.confidence.split('%')[0]) || 0
  }));
};

getList();
</script>
