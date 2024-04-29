<template>
  <hl-group
    class="w-full"
    gap="var(--xxs)"
    align="items-center"
  >
    <div :style="`width:${yearWidth};`">
      <hl-date-picker
        format="YYYY"
        value-format="YYYY"
        v-model="quarterAndMonthTimeObj.year"
        type="year"
        placeholder="按年"
        block
        :clearable="false"
        @change="changeQuarterAndMonthTime"
      />
    </div>
    <hl-select
      ref="quarterRef"
      v-model="quarterAndMonthTimeObj.quarter"
      :style="`width:${quarterWidth};`"
      clearable
      @change="changeQuarterAndMonthTime"
    >
      <hl-option
        v-for="item in quarterList"
        :key="item.value"
        :value="item.value"
        :label="item.label"
      ></hl-option>
    </hl-select>
    <hl-select
      :style="`width:${monthWidth};`"
      ref="monthRef"
      v-model="quarterAndMonthTimeObj.month"
      clearable
      @clear="clearMonth"
      @change="changeQuarterAndMonthTime"
    >
      <hl-option
        v-for="item in monthMap.get(quarterAndMonthTimeObj.quarter)"
        :key="item.value"
        :value="item.value"
        :label="item.label"
      ></hl-option>
    </hl-select>
  </hl-group>
</template>

<script lang="ts" setup>
import { defineComponent, ref, watch, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      year: '2023',
      quarter: '',
      month: '',
    }),
  },
  onChange: {
    type: Function,
  },
  yearWidth: {
    type: String,
    default: 'calc(var(--xl) * 4.39)',
  },
  quarterWidth: {
    type: String,
    default: 'calc(var(--xl) * 4.62)',
  },
  monthWidth: {
    type: String,
    default: 'calc(var(--xl) * 4.62)',
  },
});

const startDayTime = '00:00:00';
const endDayTime = '23:59:59';

// 时间范围规则：
// 1. 选择年： 年第一天 --- 年最后一天
// 2. 选择季度： 年-季度第一天 --- 年-季度最后一天
// 3. 选择月： 年-月第一天 --- 年-月最后一天
const emit = defineEmits(['update:modelValue']);
// const quarterAndMonthTimeObj = ref(props.modelValue);
const quarterAndMonthTimeObj = computed(() => props.modelValue);

const quarterAndMonthTimeValue = ref<string[]>([]);
const quarterRef = ref();
const monthRef = ref();

const quarterList = [
  {
    label: '一季度',
    value: '01-03',
  },
  {
    label: '二季度',
    value: '04-06',
  },
  {
    label: '三季度',
    value: '07-09',
  },
  {
    label: '四季度',
    value: '10-12',
  },
];

const monthList = [
  {
    label: '一月',
    value: '01',
  },
  {
    label: '二月',
    value: '02',
  },
  {
    label: '三月',
    value: '03',
  },
  {
    label: '四月',
    value: '04',
  },
  {
    label: '五月',
    value: '05',
  },
  {
    label: '六月',
    value: '06',
  },
  {
    label: '七月',
    value: '07',
  },
  {
    label: '八月',
    value: '08',
  },
  {
    label: '九月',
    value: '09',
  },
  {
    label: '十月',
    value: '10',
  },
  {
    label: '十一月',
    value: '11',
  },
  {
    label: '十二月',
    value: '12',
  },
];

const monthMap = new Map([
  ['01-03', monthList.slice(0, 3)],
  ['04-06', monthList.slice(3, 6)],
  ['07-09', monthList.slice(6, 9)],
  ['10-12', monthList.slice(9, monthList.length)],
  ['', monthList],
]);

// 选择季度，重置月份
watch(
  () => quarterAndMonthTimeObj.value.quarter,
  (newVal, oldVal) => {
    if (newVal !== oldVal && newVal !== '') {
      clearMonth();
      changeQuarterAndMonthTime();
    }
  }
);

watch(
  () => props.modelValue,
  newVal => {
    console.log(quarterAndMonthTimeObj.value, 122999);
    changeQuarterAndMonthTime();
    emit('update:modelValue', newVal);
    if (props.onChange) {
      props.onChange(quarterAndMonthTimeValue.value);
    }
  },
  {
    deep: true,
  }
);

const changeQuarterAndMonthTime = () => {
  const currentTime = getTimeStr();
  // 只选择了年 YYYY
  if (currentTime.length === 4) {
    quarterAndMonthTimeValue.value = [
      `${currentTime}-01-01 ${startDayTime}`,
      `${currentTime}-12-31 ${endDayTime}`,
    ];
  } else if (
    currentTime.length === 10 &&
    quarterAndMonthTimeObj.value.month === ''
  ) {
    // 只选择了年-季度 YYYY-MM-MM => 年-开始月-结束月
    const [year, monthStart, monthEnd] = currentTime.split('-');
    quarterAndMonthTimeValue.value = [
      getMonthStart(`${year}-${monthStart}`),
      getMonthEnd(`${year}-${monthEnd}`),
    ];
  } else if (currentTime.length === 13 || currentTime.length === 7) {
    // 选择了年-季度-月 YYYY-MM-MM-MM 或 选择了年-月 YYYY-MM
    const yearMonth = currentTime.split('-');
    quarterAndMonthTimeValue.value = [
      getMonthStart(`${yearMonth[0]}-${yearMonth[yearMonth.length - 1]}`),
      getMonthEnd(`${yearMonth[0]}-${yearMonth[yearMonth.length - 1]}`),
    ];
  }
  // console.log(quarterAndMonthTimeValue.value, quarterAndMonthTimeObj.value, "-------28888888");
};

const getTimeStr = () => {
  let res = quarterAndMonthTimeObj.value.year;
  for (const k in quarterAndMonthTimeObj.value) {
    if (
      k !== 'year' &&
      quarterAndMonthTimeObj.value[
        k as keyof typeof quarterAndMonthTimeObj.value
      ]
    ) {
      res += `-${
        quarterAndMonthTimeObj.value[
          k as keyof typeof quarterAndMonthTimeObj.value
        ]
      }`;
    }
  }
  return res;
};

const getMonthStart = (date: string): string => {
  const [year, month] = date.split('-');
  const firstDay = new Date(Number(year), Number(month) - 1, 1);
  const formattedFirstDay = formatDay(firstDay);

  return `${year}-${month}-${formattedFirstDay} ${startDayTime}`;
};

const getMonthEnd = (date: string): string => {
  const [year, month] = date.split('-');
  const lastDay = new Date(Number(year), Number(month), 0);
  const formattedLastDay = formatDay(lastDay);

  return `${year}-${month}-${formattedLastDay} ${endDayTime}`;
};

const formatDay = (date: Date): string => {
  const day = date.getDate();
  return day < 10 ? `0${day}` : `${day}`;
};

const clearMonth = () => {
  quarterAndMonthTimeObj.value.month = '';
};

defineExpose({
  quarterAndMonthTimeValue,
});
</script>
<style lang="scss" scoped>
:deep(.hl-date-input .prefix) {
  display: none !important;
}
</style>
