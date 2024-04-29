import { GlobalAPI } from '@/common';
import { ref, watch } from 'vue';

const refreshTimer = ref<number>(0);
function useDataRefresher(cb?: () => void) {
  const autoInterval = GlobalAPI.config.OP_DATA_REFRESH_INTERVAL;
  let timer: any;

  const refreshOnce = () => {
    refreshTimer.value = Date.now();

    window.setTimeout(() => {
      refreshTimer.value = 0;
    }, 0);
  };

  const startAutoRefresh = () => {
    const interval = +autoInterval;
    if (!Number.isNaN(interval) && interval > 0) {
      timer = window.setInterval(() => {
        refreshTimer.value = Date.now();
      }, interval * 60 * 1000);
    }
  };

  const stopAutoRefresh = () => {
    timer && window.clearInterval(timer);
  };

  watch(refreshTimer, t => {
    t && cb && cb();
  });

  return {
    refreshOnce,
    startAutoRefresh,
    stopAutoRefresh
  };
}

export { useDataRefresher };
