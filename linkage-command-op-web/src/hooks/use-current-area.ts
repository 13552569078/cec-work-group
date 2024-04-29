import { ref, computed, watch } from 'vue';
import { GlobalAPI } from '@/common';

const currentArea = ref({} as CurrentArea);
function useCurrentArea(callback?: (code: string) => void) {
  const { areaCode: defaultAreaCode, areaName: defaultAreaName, center: defaultCenter } = GlobalAPI.config.MAP_CONFIG_LINKAGE_COMMAND_ONEPIC;
  const userInfo = GlobalAPI.userInfo as any;

  const areaCode = computed<string>(() => currentArea.value.areaCode || userInfo.areaCode || defaultAreaCode);
  const areaName = computed<string>(() => currentArea.value.areaName || userInfo.areaName || defaultAreaName);
  const areaCenter = computed<Array<string | number>>(() => {
    if (currentArea.value.longitude && currentArea.value.latitude) {
      return [+currentArea.value.longitude, +currentArea.value.latitude];
    } else if (userInfo.longitude && userInfo.latitude) {
      return [+userInfo.longitude, +userInfo.latitude];
    } else {
      return [...defaultCenter];
    }
  });

  const setAreaCode = (code: string) => {
    currentArea.value.areaCode = code;
  };
  const setCenter = (longitude: string | number, latitude: string | number) => {
    currentArea.value.longitude = longitude;
    currentArea.value.latitude = latitude;
  };
  const setArea = (area: CurrentArea) => {
    currentArea.value = area;
  };

  watch(areaCode, area => {
    callback?.(area);
  }, {
    immediate: true,
  });

  return {
    areaCode,
    areaName,
    areaCenter,
    currentArea,
    setAreaCode,
    setArea,
    setCenter,
  };
}

type CurrentArea = {
  areaCode: string;
  areaName?: string;
  longitude?: string | number;
  latitude?: string | number;
};

export {
  useCurrentArea
};
