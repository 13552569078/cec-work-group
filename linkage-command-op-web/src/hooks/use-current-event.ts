import { computed, nextTick, onBeforeUnmount, onMounted, reactive, watch, ref } from 'vue';
import { useRoute } from 'vue-router';
import { HlMessage } from 'hongluan-ui';
import { apiEventConditionObj } from '@/apis/modules/event-condition/index';
import { IpostFindEventDetailByIdSpace } from '@/apis/modules/event-condition/model';
import { useMapBuffer } from './map/use-map-buffer';

const currentEvent = reactive({} as IpostFindEventDetailByIdSpace.Data);
const currentEventListeners: Callback[] = [];
const CHEMICAL_MARK = '危险化学品';

function useCurrentEvent(callback?: Callback) {
  const route = useRoute();
  const { initBuffer } = useMapBuffer();

  const isChemicalEvent = computed(() => `${currentEvent.eventTypeName}`.indexOf(CHEMICAL_MARK) > -1);
  const eventIsFinished = computed(() => currentEvent.eventState === 'FINISHED'); // 事件是否办结

  /**
   * 更新事件信息
   * @param id 事件id
   * @param enforce 是否强制刷新事件，默认false
   * @param notify 是否回调所有监听的函数，默认true
   */
  const fetchEvent = async(id: string, enforce = false, notify = true) => {
    if (id !== currentEvent.id || enforce) {
      const event = await apiEventConditionObj.getEventDetailById(id);
      if (id !== currentEvent.id) {
        initBuffer(event.data.longitude, event.data.latitude);
      }
      Object.assign(currentEvent, event.data);
      notify && currentEventListeners.forEach(cb => cb(currentEvent));
    }
  };

  const updateEvent = async(info: Record<string, any>) => {
    try {
      await apiEventConditionObj.postModifyEventInfo({
        id: route.query.id,
        ...info
      });
      await fetchEvent(`${route.query.id}`, true);
      HlMessage.success('编辑成功');
    } catch {
      HlMessage.error('编辑失败');
    }
  };

  const clearEvent = () => {
    currentEvent.id = undefined;
  };

  onMounted(() => {
    callback && currentEventListeners.push(callback);
    currentEvent.id && callback?.(currentEvent);
  });
  onBeforeUnmount(() => {
    callback && currentEventListeners.splice(currentEventListeners.indexOf(callback), 1);
  });

  return {
    currentEvent,
    isChemicalEvent,
    fetchEvent,
    updateEvent,
    clearEvent,
    eventIsFinished,
  };
}

type Callback = (event: IpostFindEventDetailByIdSpace.Data) => void;

export {
  useCurrentEvent
};
