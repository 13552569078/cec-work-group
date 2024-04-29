import { ref } from 'vue';


const searchEventListQuery = ref({
  eventType: '',
  overtimeFlag: '',
  eventUrgent: 0
});

function useEventQuery() {
  return {
    searchEventListQuery
  }
}

export { useEventQuery }