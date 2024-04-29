/* eslint-disable @typescript-eslint/no-empty-function */
import { onBeforeUnmount, ref } from 'vue';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import { useRzt } from './use-rzt';
import { HlMessage } from 'hongluan-ui';

dayjs.extend(durationPlugin);

const currentCallingUser = ref({} as Record<string, string>);
function useCalling(options?: { cancelCb?: () => void, okCb?: () => void }) {
  const { websdk, init } = useRzt();

  let timer: number | undefined;
  const startDate = Date.now();

  const duration = ref('正在呼叫...');
  const audioDomRef = ref();

  const startCounter = () => {
    timer = window.setInterval(() => {
      const d = dayjs.duration(Date.now() - startDate, 'ms');
      const result: number[] = [];
      d.hours() && result.push(d.hours());
      result.push(d.minutes());
      result.push(d.seconds());
      duration.value = result.map(n => n.toString().padStart(2, '0')).join(':');
    }, 1000);
  };

  const startCalling = async(phone: string) => {
    await init();
    websdk.value.sip.setParams({ remoteTag: audioDomRef.value });
    websdk.value.event.JsSip.callAudio(phone, function(res: Record<string, any>) {
      console.log(res);
    });
    websdk.value.event.rtcsdk.remoteAnswerCall = function() { // 来电监听
      startCounter();
      options?.okCb?.();
    };
    websdk.value.event.rtcsdk.remoteHangupCall = function() {
      HlMessage.info('对方已挂断');
      options?.cancelCb?.();
    };
    websdk.value.event.rtcsdk.callEstablishFailed = function() {
      HlMessage.info('呼叫失败');
      options?.cancelCb?.();
    };
  };

  const hangup = () => {
    try {
      websdk.value.event.JsSip.callSingleHangup();
    } catch (e) {
      console.log('hangup', e);
    }
  };

  onBeforeUnmount(() => {
    timer && window.clearInterval(timer);
    if (websdk.value.event) {
      websdk.value.event.rtcsdk.remoteAnswerCall = function() {};
      websdk.value.event.rtcsdk.callEstablishFailed = function() {};
      websdk.value.event.rtcsdk.callEstablishFailed = function() {};
    }
  });

  return {
    currentCallingUser,
    audioDomRef,
    duration,
    startCalling,
    hangup
  };
}

export { useCalling };
