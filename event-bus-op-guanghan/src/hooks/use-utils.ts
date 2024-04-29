import { ref } from 'vue';
import { apiUtilsObj as api } from '@/apis';

const areaList = ref<any[]>([]);
const eventTypeList = ref();

function useUtils(showAll = true) {
  
  // 获取字典
  const getDict = async (dictType: string) => {
    const res = await api.getDictList({ dictType })
    return res.data.list && res.data.list.length ? res.data.list.map(item => ({
      label: item.dictLabel,
      value: item.dictValue
    })) : [];
  }
  // 获取字典Name
  const getDictName = async (dictType: string, dictCode: string) => {
    const res = await api.getDictList({ dictType })
    const data = res.data.list && res.data.list.length ? res.data.list.map(item => ({
      label: item.dictLabel,
      value: item.dictValue
    })) : [];
    const findData = data.filter((item) => { return item.value === dictCode });
    return findData.length ? findData[0].label : ""
  }
  // 获取行政区划
  const getAreaList = async () => {
    if (areaList.value.length) {
      return areaList.value;
    }
    const res = await api.getAreaList();
    // const area = res.data.find(item => item.id === 58815)?.children[0]
    // areaList.value = [area as unknown as any[]];
    areaList.value = res.data;
    return res.data
  }

  const getEventTypeList = async (platform: string | number) => {
    const res = await api.getEventTypeList({ platform });
    eventTypeList.value = res.data.filter((item1) => {
      return item1.level === '3'
    }).map(item => ({
      label: item.eventTypeName,
      value: item.id
    }));
    eventTypeList.value = showAll ? [{ label: '全部', value: '' }, ...eventTypeList.value] : [...eventTypeList.value]
    return res.data
  }

  return {
    areaList,
    eventTypeList,
    getDict,
    getDictName,
    getAreaList,
    getEventTypeList
  }
}

export { useUtils }
