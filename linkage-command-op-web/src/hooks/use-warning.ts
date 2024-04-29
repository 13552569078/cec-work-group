import { onBeforeUnmount, ref } from 'vue';
import { MAX_PAGE_SIZE } from '@/common';
import { apiWarningObj } from '@/apis/modules/warning';
import { IpostFindWarningPageSpace } from '@/apis/modules/warning/model';

const showWarning = ref(false);
const currentWarningList = ref<IpostFindWarningPageSpace.Data[]>([]);
function useWarning() {
  const getWarningList = async(params: Record<string, any> = {}) => {
    const result = await apiWarningObj.postFindWarningPage({ currentPage: 1, pageSize: MAX_PAGE_SIZE, status: 1, ...params });
    currentWarningList.value = result.data.list;
    if (currentWarningList.value.length) {
      showWarning.value = true;
    }
  };

  onBeforeUnmount(() => {
    showWarning.value = false;
    currentWarningList.value = [];
  });

  return {
    showWarning,
    currentWarningList,
    getWarningList
  };
}

export {
  useWarning
};
