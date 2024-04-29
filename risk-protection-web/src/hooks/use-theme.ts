import { onBeforeMount, ref } from 'vue';

const isLoading = ref(true);

function useTheme() {
  const completeLoading = () => {
    isLoading.value = false;
  };

  const resetLoading = () => {
    isLoading.value = true;
  };

  return {
    isLoading,
    completeLoading,
    resetLoading,
  };
}

export { useTheme };
