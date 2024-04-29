<template>
  <div :class="['c-tabs',isFull ? 'full-tabs' : '', mini ? 'mini' : '', compact ? 'compact' : '']">
    <div :class="['c-tabs-wrapper',isFull ? 'full-tabs' : '']">
      <div
        v-for="tab in tabs"
        class="tab"
        :class="[modelValue === tab.value ? 'on' : '', isFull ? 'full-flex-item' : '', compact ? 'standard-text' : '']"
        @click="handleClick(tab.value)"
        :key="tab.value">
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
  [key: string]: string|number;
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
    }
    .tab {
      position: relative;
      font-size: var(--font-md);
      color: #D0DEEE;
      cursor: pointer;
      min-width: calc(var(--xxs) * 17.5);
      padding: 0 calc(var(--xl) * 0.20);
      height: calc(var(--xxl) * 0.9);
      line-height: calc(var(--xxl) * 0.9);
      text-align: center;
      // background-image: url(@/assets/images/tabs/tab-normal.png)!important;
      // background-size: 100% 100%!important;
      // box-shadow: inset 0px 34px 32px 0px rgba(21,154,255,0.5), inset 0px 0px 12px 0px rgba(46,102,255,0.5);
      // opacity: 0.7;
      background: #042441;
      border: 1px solid #159AFF;
      margin-left: calc(var(--xl) * 0.2);
      color: #96BEE0;
      &:first-child {
        margin-left: 0;
      }
      &.on {
        color: white;
        // background-image: url(@/assets/images/tabs/tab-active.png)!important;
        // opacity: 1;
        background: rgba(21,154,255,0.25);
        box-shadow: inset 0px calc(var(--xxl) * 0.34) calc(var(--xxl) * 0.32) 0px rgba(21,154,255,0.5), inset 0px 0px 12px 0px rgba(46,102,255,0.5);
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
  }
</style>
