import { ref } from 'vue';
import { apiEventTypeObj as api } from '@/apis/modules/eventType'

const useEventType = () => {

  const getEventTypeList = async () => {
    const res = await api.getListEventTypeListVOsEventType();
    return res.data;
  }

  return {
    getEventTypeList
  }
}

export { useEventType }