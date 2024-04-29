<template>
  <hl-button :class="['btn-expandable', 'm-l-xs']" @click="buttonClick">
    <template #icon>
      <hl-icon>
        <TwoMinus v-if="expandable" />
        <TwoPlus v-else />
      </hl-icon>
    </template>
  </hl-button>
</template>
<script lang="ts" setup>
import { computed, inject } from 'vue';
import { ExpandableCardParamsKey } from '@/common';
import { ExpandableCardParams } from '@/types';

const expandableParams = inject<ExpandableCardParams>(ExpandableCardParamsKey)!;

const props = defineProps({
  mark: {
    type: String,
    required: true,
  }
});

const expandable = computed(() => expandableParams[props.mark].value);

const buttonClick = () => {
  expandableParams[props.mark].value = !expandableParams[props.mark].value;
};
</script>
<style lang="scss" scoped>
.btn-expandable {
  width: calc(var(--xxs) * 7);
  height: calc(var(--xxs) * 7);
  background-image: url('@/assets/images/button/button-icon.png');
  background-repeat: no-repeat;
  background-size: cover;
  border: none;
}
</style>
