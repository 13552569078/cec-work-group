import { ref } from 'vue';

function useExpandableCard() {
  const expandable = ref(false);

  const toggle = () => {
    expandable.value = !expandable.value;
  };
  return {
    expandable,
    toggle
  };
}
export {
  useExpandableCard
};
