<template>
  <hl-select v-model="defaultVal" class="m-l-xs custom-select" popper-class="custom-select-popper" @change="change">
    <hl-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    ></hl-option>
    <template #suffix="{ className }">
      <!--这里必须添加class，用来控制后缀Icon和清除Icon的切换-->
      <hl-icon :class="className">
        <img
          :src="selectIcon"
          alt=""
          style="width: calc(var(--xxs) * 4); height: calc(var(--xxs) * 4)"
        />
      </hl-icon>
    </template>
  </hl-select>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import selectIcon from '@/assets/images/overview/left-1/select-icon.png';
import { forEach } from 'lodash-es';

const props = defineProps({
  options: {
    type: Object,
    default: () => ({}),
  },
  default: String,
});

const emit = defineEmits(['change']);
const defaultVal = ref(props.default);

const change = (val: string) => {
  emit('change', val);
};
</script>
<style lang="scss" scoped>
.custom-select {
  width: calc(var(--xxs) * 24.5) !important;
  background-image: url("@/assets/images/overview/left-1/select-bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  border: none;
  :deep(.hl-input) {
    --input-height: calc(var(--xxs) * 7) !important;
    border: none;
    background-color: transparent;
    &.is-focus {
      border-color: transparent;
    }
    .input-inner {
      padding-right: var(--xxs);
    }
    .input-affixe.suffix {
      margin-right: calc(var(--xxs) * 2);
    }
  }
}
</style>
<style lang="scss">
.custom-select-popper {
  background: rgba(16,51,91,0.9);
  border: 1px solid rgba(0,158,247,0.36);
  box-shadow: none;
  .hl-option.is-selected, .hl-option.hover {
    background: rgba(0,158,247,0.16);
  }
}
</style>
