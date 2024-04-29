import { ref } from 'vue';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash-es';

const datePattern = {
  // 最近 30 天
  last30Days: [
    dayjs().add(-30, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')
  ]
}

function useDate (pattern: keyof typeof datePattern) {
  const dateRange = ref<string[]>(cloneDeep(datePattern[pattern]));

  const resetDateRange = () => {
    dateRange.value =cloneDeep(datePattern[pattern]);
  }

  return {
    dateRange,
    resetDateRange
  }
}

export { useDate };