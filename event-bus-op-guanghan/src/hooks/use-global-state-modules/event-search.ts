import { reactive, ref } from 'vue';
import { cloneDeep } from 'lodash-es';

interface EventSearchParams {
  startTime?: string;
  endTime?: string;
  eventCode?: string;
  district?: string;
  title?: string; // 参数不统一 title
  address?: string;
  platform?: string; // 参数不统一 platformCode
  eventType?: string;
  eventStatus?: string; // 参数不统一 dealStatus
  eventOrigin?: string;
  overtimeFlag?: string | number;
  eventUrgent?: string;
  direction?: number;
}

const defaultParams = {
  startTime: '',
  endTime: '',
  eventCode: '',
  title: '',
  district: '',
  address: '',
  platform: '',
  eventType: '',
  eventStatus: '',
  eventOrigin: '',
  overtimeFlag: '',
  eventUrgent: '',
  direction: 1
}

// 事件搜索开关
const isEventSearchMode = ref(false);

const eventTabType = ref('manual');

const toggleEventSearchMode  = () => {
  isEventSearchMode.value = !isEventSearchMode.value;
}

// 事件搜索参数
const eventSearchParams = ref<EventSearchParams>(cloneDeep(defaultParams));

const resetEventSearchParams = () => {
  eventSearchParams.value = cloneDeep(defaultParams);
}

export {
  isEventSearchMode,
  eventTabType,
  toggleEventSearchMode,
  eventSearchParams,
  resetEventSearchParams
}