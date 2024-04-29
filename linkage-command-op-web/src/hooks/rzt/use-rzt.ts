import { useUser } from 'fx-front-ucenter';
import { GlobalAPI } from '@/common';
import { shallowRef } from 'vue';

function useRzt() {
  const [pwd, https, wss1, wss2, userType] = GlobalAPI.config.RTZ_SDK_CONFIG.split(',');
  const websdk = shallowRef<Record<string, any>>({});

  const { getUserInfo } = useUser();

  const init = () => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<void>(async resolve => {
      if (!websdk.value.sip) {
        const user = await getUserInfo();
        // eslint-disable-next-line new-cap
        websdk.value = new WEBSDK.websdk(user.userName, pwd, https, wss1, wss2, +userType);
        websdk.value.event.rtcsdk.eventHandler = function(event: string, data: Record<string, any>) {
          console.log('eventHandler', event, data);
          switch (event) {
            case 'registered':
              resolve();
              break;
          }
        };
      } else {
        resolve();
      }
    });
  };

  return {
    init,
    websdk
  };
}

export { useRzt };
