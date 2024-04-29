import { ref } from 'vue';
import { debounce } from 'lodash-es';

const tooltipTextRef = ref();
const tooltipText = ref('');
const tooltipVisible = ref(false);
function useTextOverflow() {
  const showTooltip = (e: MouseEvent, text?: string) => {
    const el = (e.currentTarget || e) as unknown as HTMLElement;
    tooltipVisible.value = el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight; // 单行，多行文本
    if (tooltipVisible.value) {
      tooltipTextRef.value = el;
      tooltipText.value = e.currentTarget ? el.innerText : text || '';
    } else {
      clearTooltip();
    }
    // console.log('text', e, el.scrollWidth, el.clientWidth);
  };

  const clearTooltip = () => {
    // console.log('clearTooltip');
    tooltipTextRef.value = '';
    tooltipTextRef.value = null;
    tooltipVisible.value = false;
  };

  return {
    tooltipTextRef,
    tooltipText,
    tooltipVisible,
    showTooltip,
    clearTooltip
  };
}

export {
  useTextOverflow
};
