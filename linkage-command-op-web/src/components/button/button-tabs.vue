<template>
  <div v-if="isShow" class="button-tabs">
    <hl-button
      v-for="(b, idx) in tabs"
      :key="idx"
      class="btn-tabs"
      :class="[idx !== tabs.length -1 ? 'm-r-md' : '', nowActive === idx ? 'active' : '']"
      @click="buttonClick(b, idx)"
    >
      <slot :tab="b">
        {{ b.label }}
      </slot>
    </hl-button>
  </div>
</template>
<script lang="ts" setup>
import { computed, PropType, ref } from 'vue';
import { ButtonTabItem } from '@/types';

const props = defineProps({
  tabs: {
    type: Array as PropType<ButtonTabItem[]>,
    default: () => [],
  },
  active: {
    type: Number,
    default: 0,
  },
  hideSingle: {
    type: Boolean,
    default: true,
  }
});
const emit = defineEmits(['click']);

const nowActive = ref(props.active);

const isShow = computed(() => !props.hideSingle || (props.hideSingle && props.tabs.length > 1));

const buttonClick = (b: ButtonTabItem, idx: number) => {
  nowActive.value = idx;
  emit('click', b.value);
};
</script>
<style lang="scss" scoped>
.btn-tabs {
  width: calc(var(--xxs) * 34);
  height: calc(var(--xxs) * 9);
  background-image: url('@/assets/images/tab/tab-normal.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  border: none;
  &:hover, &.active {
    background-image: url('@/assets/images/tab/tab-active.png');
  }
}
</style>
