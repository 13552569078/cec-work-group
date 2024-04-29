import { ref, onMounted } from 'vue';
import { apiTaskObj } from '@/apis/modules/task';
import { Indexable } from 'fx-front-utils';

const tableData = [
  {
    value: 'noRepeat',
    label: '不重复',
    isRepeat: 0,
    repeatType: '0'
  },
  {
    value: 'dayRepeat',
    label: '每天重复',
    isRepeat: 1,
    repeatType: 'day'
  },
  {
    value: 'weekRepeat',
    label: '每周重复',
    isRepeat: 1,
    repeatType: 'week'
  },
  {
    value: 'monthRepeat',
    label: '每月重复',
    isRepeat: 1,
    repeatType: 'month'
  },
  {
    value: 'custom',
    label: '自定义重复',
  },
];
const dictMap = new Map([
  ['year', '年'],
  ['month', '月'],
  ['week', '周'],
  ['day', '日'],
  ['hour', '小时'],
  ['year', '年'],
  ['minute', '分钟']
]);
const optionRepeatType = [
  { value: 'year', label: '年' },
  { value: 'month', label: '月' },
  { value: 'week', label: '周' },
  { value: 'day', label: '日' },
  { value: 'hour', label: '小时' },
  { value: 'minute', label: '分钟' }
];

function useTask() {
  const defaultTaskTypeId = ref('');
  const taskConfig = ref({
    extendedInformationConfig: {
      taskReminder: 1,
      degreeUrgency: 1,
      taskTag: 1,
      taskAttachment: 1,
    },
    isAssociatedEvent: 1,
    taskFallback: 1,
    isRepeat: 1,
  } as Indexable<any>);
  const tips = ref('');

  const getRepeatTaskTips = ({ repeatNum, repeatSeondary, repeatType, isRepeatTaskCustom }: { repeatNum: string, repeatSeondary: string[], repeatType: string, isRepeatTaskCustom: number }) => {
    if (+isRepeatTaskCustom === 0) {
      return tableData.filter(el => el.repeatType === repeatType)[0].label;
    } else {
      const repeatTypeName = dictMap.get(repeatType);
      tips.value = `每${repeatNum ?? ''}${repeatTypeName ?? ''}${repeatSeondary ?? [].join('、')}${repeatType === 'month' && repeatSeondary.length ? '日' : ''}重复`;
      return tips.value;
    }
  };
  const getOriginalLabel = (type: string) => {
    return dictMap.get(type);
  };

  const getTaskTypeId = async() => {
    const res = await apiTaskObj.getFindTaskTypeByName('事件处置');
    defaultTaskTypeId.value = res.data;
  };

  const getFindTaskTypeConfigById = async(taskTypeId: string) => {
    const res = await apiTaskObj.postFindTaskTypeConfigById(taskTypeId);
    if (res.data) taskConfig.value = res.data;
  };

  const getTaskConfig = async() => {
    await getTaskTypeId();
    await getFindTaskTypeConfigById(defaultTaskTypeId.value);
  };

  onMounted(async() => {
    await getTaskConfig();
  });

  return {
    defaultTaskTypeId,
    taskConfig,
    tableData,
    dictMap,
    optionRepeatType,
    getRepeatTaskTips,
    getOriginalLabel,
    getTaskConfig,
  };
}

export {
  useTask
};
