import { ref, reactive, watch } from 'vue';

// 事件详情 显示/隐藏开关
const repeatEventVisible = ref(false);
// 当前显示的事件 id
const currentRepeatEventId = ref('');

function useRepeatEvent(params?: any) {

  // 显示事件详情弹窗
  const handleShowRepeatEvent = (eventId: string) => {
    currentRepeatEventId.value = eventId;
    repeatEventVisible.value = true;
  }
  // 关闭事件详情弹窗
  const handleCloseRepeatEvent = () => {
    currentRepeatEventId.value = '';
    repeatEventVisible.value = false;
  }


  return {
    currentRepeatEventId,
    repeatEventVisible,
    handleShowRepeatEvent,
    handleCloseRepeatEvent,
  }
}

export { useRepeatEvent }
