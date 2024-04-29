import { ref } from 'vue';
import { GlobalAPI } from '@/common';

const showMask = ref(true); // 首页弹层显示状态
const globalTitle = ref(GlobalAPI.config.PROD_TITLE);
function useLayout() {
  const toggleMask = () => {
    showMask.value = !showMask.value;
  };

  const hideMask = () => {
    showMask.value = false;
  };
  const displayMask = () => {
    showMask.value = true;
  };

  const setGlobalTitle = (t?: string) => {
    globalTitle.value = t || GlobalAPI.config.PROD_TITLE;
  };

  return {
    globalTitle,
    showMask,
    toggleMask,
    hideMask,
    displayMask,
    setGlobalTitle,
  };
}

export {
  useLayout
};
