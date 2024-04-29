import { ref } from 'vue';

const updateTaskTimeStamp = ref(0);
function useTaskUpdater() {
  return {
    updateTaskTimeStamp,
  };
}

export {
  useTaskUpdater
};
