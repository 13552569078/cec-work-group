<template>
  <div :class="['c-tabs', isFull ? 'full-tabs' : '', mini ? 'mini' : '', compact ? 'compact' : '']">
    <div :class="['c-tabs-wrapper', isFull ? 'full-tabs' : '']">
      <div v-for="tab in tabs" class="tab"
        :class="[modelValue === tab.value ? 'on' : '', isFull ? 'full-flex-item' : '', compact ? 'standard-text' : '']"
        @click="handleClick(tab.value)" :key="tab.value">
        <slot :option="tab">
          {{ tab.label }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

interface TabItem {
  [key: string]: string | number;
}

const props = defineProps({
  tabs: {
    type: Array as PropType<TabItem[]>,
    default: () => ([])
  },
  isFull: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  mini: {
    type: Boolean,
    default: false
  },
  compact: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'click']);

const handleClick = (value: string | number) => {
  emit('update:modelValue', value);
  emit('click', value);
};
</script>

<style lang="scss" scoped>
.c-tabs {
  display: flex;
  align-items: center;

  .c-tabs-wrapper {
    display: inline-block;
    display: flex;
    padding: 1px;
    width: 100%;
  }

  .tab {
    flex:1;
    position: relative;
    font-size: var(--font-md);
    color: #D0DEEE;
    cursor: pointer;
    min-width: calc(var(--xxs) * 17.5);
    padding: 0 calc(var(--xl) * 0.20);
    height: calc(var(--xxs) * 28/4);
    line-height: calc(var(--xxs) * 28/4);
    text-align: center;
    background-image: url('@/assets/images/deyang/center/btn_n.png') !important;
    background-size: 100% 100% !important;
    background-repeat: no-repeat;
    margin-left: calc(var(--xl) * 0.2);
    color: #D6F6FF;

    &:first-child {
      margin-left: 0;
    }

    &.on {
      color: #FFFDDA;
      background-image: url('@/assets/images/deyang/center/btn_a.png') !important;
      background-size: 100% 100% !important;
      background-repeat: no-repeat;
    }
  }

  &.compact {
    .tab {
      min-width: calc(var(--xxs) * 9);
      padding: 0 calc(var(--xl) * 0.1);
      margin-left: calc(var(--xxs) / 2 * -1) !important;
    }
  }

  &.mini {
    .tab {
      min-width: auto;
      height: auto;
      line-height: normal;
      margin: 0;
      padding: 0;
      margin-left: -1px;
      padding: 0 calc(var(--xl) * 0.2)
    }
  }
}

.full-tabs {
  width: 100%;

  .full-flex-item {
    flex: 1;
  }
}</style>
