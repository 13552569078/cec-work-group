<template>
  <div v-if="isShow" class="button-group">
    <hl-button
      v-for="(b, idx) in buttons"
      :key="idx"
      :disabled="b.disabled"
      class="btn-word4"
      :class="[idx !== buttons.length -1 ? 'm-r-xs' : '', nowActive === idx && buttons.length > 1 ? 'active' : '']"
      @click="buttonClick(b, idx)"
    >
      {{ b.label }}
    </hl-button>
  </div>
</template>
<script lang="ts" setup>
import { PropType, ref, computed } from 'vue';
import { ButtonItem } from '@/types';

const props = defineProps({
  buttons: {
    type: Array as PropType<ButtonItem[]>,
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

const isShow = computed(() => !props.hideSingle || (props.hideSingle && props.buttons.length > 1));

const buttonClick = (b: ButtonItem, idx: number) => {
  nowActive.value = idx;
  emit('click', b.value);
};
</script>
<style lang="scss" scoped>
.btn-word4 {
  width: calc(var(--xxs) * 18);
  height: calc(var(--xxs) * 7);
  background-image: url('@/assets/images/button/button-normal.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  border: none;
  &:hover, &.active {
    background-image: url('@/assets/images/button/button-active.png');
  }
}
</style>
