import { ref } from 'vue';
import { 
  apiIndexPageObj as api,
  apiSelfHanleObj as apiSelfHandle,
} from '@/apis';
import { useGlobalState } from '@/hooks';
import { IgetDetailSpace } from '@/apis/modules/index-page/model';

const { currentEventCode } = useGlobalState();

function useEventData() {
  const eventDetail = ref<IgetDetailSpace.Data>();
  const eventDetailSelfHandle = ref<any>();

  const getEventDetail = async (id: string) => {
    const res = await api.getDetail(id)
    eventDetail.value = res.data;
    currentEventCode.value = res.data.eventCode;
  }

  // 自处置事件详情
  const getEventSelfHandleDetail = async (id: string) => {
    const res = await apiSelfHandle.detail(id)
    eventDetailSelfHandle.value = res.data;
    currentEventCode.value = res.data.eventCode;
  }

  

  return {
    eventDetail,
    getEventDetail,
    eventDetailSelfHandle,
    getEventSelfHandleDetail
  }
}

export { useEventData }