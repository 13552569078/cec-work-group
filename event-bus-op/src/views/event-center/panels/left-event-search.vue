<template>
  <hv-panel title="搜索条件">
    <hl-group full="full-x" dir="vertical" gap="var(--xxs)">
      <hl-group class="w-full m-t-sm m-b-xs" align="items-between" gap="var(--md)">
        <c-tabs
          :isFull="true"
          v-model="eventTabType"
          :tabs="eventTabOptions"
          @click="handleTabChange"
        />
      </hl-group>
      <hl-group class="search-form p-lg" dir="vertical">
        <hl-form
          :model="eventSearchParams"
          :width="['col-4', 'col-20']"
          :label-position="['items-right', 'items-middle']"
          item-gap="var(--md)"
        >
          <hl-form-item label="事件时间">
            <hl-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              block
              :clearable="false"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </hl-form-item>
          <hl-form-item label="事件编号">
            <hl-input
              v-model="eventSearchParams.eventCode"
              placeholder="请输入事件编号"
              class="w-full"
            />
          </hl-form-item>
          <hl-form-item label="事件标题">
            <hl-input
              v-model="eventSearchParams.title"
              placeholder="请输入事件标题"
              class="w-full"
            />
          </hl-form-item>
          <hl-form-item label="事件地区">
            <area-select
              v-model="eventSearchParams.district"
              class="w-full"
              :is-full-width="true"
            />
          </hl-form-item>
          <hl-form-item label="详细地址">
            <hl-input
              v-model="eventSearchParams.address"
              placeholder="请输入地址"
              class="w-full"
            />
          </hl-form-item>
          <hl-group
            class="toggle-line cursor-pointer"
            align="items-center items-middle"
            @click="handleToggleSearch"
          >
            <span class="small-text"
              >{{ isShowMore ? "收起筛选" : "更多筛选" }}
              <img :src="isShowMore ? ArrUp : ArrDown" />
            </span>
          </hl-group>
          <template v-if="isShowMore">
            <hl-form-item label="平台选择">
              <dict-select
                v-model="eventSearchParams.platform"
                dictType="event_platform"
                class="w-full"
              />
            </hl-form-item>
            <hl-form-item label="事件类型">
              <event-type-select
                v-model="eventSearchParams.eventType"
                platform="100"
                class="w-full"
              />
            </hl-form-item>
            <hl-form-item v-if="eventTabType === 'manual'" label="紧急程度">
              <dict-select
                v-model="eventSearchParams.eventUrgent"
                dictType="event_urgent_level"
                class="w-full"
              />
            </hl-form-item>
            <hl-form-item label="事件状态">
              <dict-select
                v-if="eventTabType === 'manual'"
                v-model="eventSearchParams.eventStatus"
                dictType="front_event_state"
                class="w-full"
              />
              <dict-select
                v-else
                v-model="eventSearchParams.eventStatus"
                dictType="self_handle_event_state"
                class="w-full"
              />
            </hl-form-item>
            <hl-form-item v-if="eventTabType === 'manual'" label="事件来源">
              <dict-select
                v-model="eventSearchParams.eventOrigin"
                dictType="event_origin"
                class="w-full"
              />
            </hl-form-item>
            <hl-form-item label="超时状态">
              <dict-select
                v-model="eventSearchParams.overtimeFlag"
                dictType="overtime_flag"
                class="w-full"
              />
            </hl-form-item>
          </template>
        </hl-form>
        <hl-group gap="var(--md)" class="m-t-xxl">
          <hl-button
            class="standard-text"
            type="primary"
            @click="handleSearch"
            style="width: calc(var(--xl) * 4)"
            >查询</hl-button
          >
          <hl-button
            class="standard-text"
            @click="handleReset"
            style="width: calc(var(--xl) * 4)"
            >重置</hl-button
          >
          <hl-button
            class="standard-text"
            @click="handleClose"
            style="width: calc(var(--xl) * 4)"
            >退出</hl-button
          >
        </hl-group>
      </hl-group>
    </hl-group>
  </hv-panel>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash-es';
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useGlobalState, useDate, useMapData, useMapTools } from '@/hooks';
import dayjs from 'dayjs';
import ArrUp from '@/assets/images/event-search/arr_up.png';
import ArrDown from '@/assets/images/event-search/arr_down.png';

const {
  eventSearchParams,
  toggleEventSearchMode,
  resetEventSearchParams,
  eventTabType,
} = useGlobalState();
const { dateRange, resetDateRange } = useDate('last30Days');
const { eventData, setEventData } = useMapData();
const { flyToDefault } = useMapTools();

const eventDataCopy = cloneDeep(eventData.value);

const emit = defineEmits(['search', 'tabChange', 'reset']);

const isShowMore = ref(false);

const eventTabOptions = computed(() => {
  return [
    {
      label: '流入事件',
      value: 'manual',
    },
    {
      label: '自处置事件',
      value: 'selfHandling',
    },
  ];
});

const handleSearch = () => {
  emit('search');
};

const handleReset = () => {
  reset();
  nextTick(() => {
    handleSearch();
  });
};

const handleTabChange = (tabValue: string) => {
  emit('tabChange', tabValue);
  nextTick(() => {
    reset();
    nextTick(() => {
      handleSearch();
    });
  });
};

const resetDateToParams = () => {
  eventSearchParams.value.startTime = dateRange.value[0];
  eventSearchParams.value.endTime = dayjs(dateRange.value[1])
    .endOf('day')
    .format('YYYY-MM-DD HH:mm:ss');
};

watch(
  () => dateRange,
  () => {
    resetDateToParams();
  },
  {
    deep: true,
  }
);

const reset = () => {
  emit('reset');
  setEventData([]);
  resetDateRange();
  resetEventSearchParams();
  resetDateToParams();
  flyToDefault();
};

const handleClose = () => {
  reset();
  setEventData(eventDataCopy);
  toggleEventSearchMode();
};

const handleToggleSearch = () => {
  isShowMore.value = !isShowMore.value;
};

resetDateToParams();

onMounted(() => {
  nextTick(() => {
    handleSearch();
  });
});
</script>

<style lang="scss" scoped>
.search-form {
  background-color: #0a2038;
  height: calc(26.5 * var(--xl));
}
.toggle-line {
  background: url("@/assets/images/event-search/t_line.png") no-repeat;
  background-size: 100% 100%;
  height: calc(0.12 * var(--xl));
  width: 100%;
  span {
    color: #139aff;
    img {
      width: calc(0.9 * var(--xl));
      height: calc(0.9 * var(--xl));
      margin-left: calc(-0.2 * var(--xl));
    }
  }
}
</style>
