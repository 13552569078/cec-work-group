import { ref, computed } from 'vue';
import { apiMonitorRegionObj as api } from '@/apis/modules/monitorRegion'

const useRegion = (useFor = 1) => {
  const regionList = ref();

  const getRegionList = async (regionName = '') => {
    const res = await api.getRegionSimpleList(regionName);
    regionList.value = res.data;
    return res.data
  }

  return {
    regionList,
    getRegionList
  }
}

export { useRegion }