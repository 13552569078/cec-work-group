import { ref } from 'vue';
import { apiDictCenterObj as api } from '@/apis/modules/dictCenter'

const useDict = () => {

  const getDictByType = async (dictType: string) => {
    const res = await api.getListDictCustomVOs(dictType);
    return res.data;
  }

  return {
    getDictByType
  }
}

export { useDict }