<template>
  <div class="header-toggle-btn cursor-pointer" :class="isShow ? '' : 'hide'" @click="toggle">
    <template v-if="isShow">
      <img :src="CloseUp" />
      <img class="on" :src="CloseUpOn" />
    </template>
    <template v-else>
      <img :src="CloseDown" />
      <img class="on" :src="CloseDownOn" />
    </template>
  </div>
</template>

<script lang='ts' setup>
import { ref, toRef } from 'vue';
import CloseUp from '@/assets/images/header-stat-box/close-up.png';
import CloseUpOn from '@/assets/images/header-stat-box/close-up-on.png';
import CloseDown from '@/assets/images/header-stat-box/close-down.png';
import CloseDownOn from '@/assets/images/header-stat-box/close-down-on.png';

const isShow = ref(true);

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue']);

isShow.value = toRef(props.modelValue);

const toggle = () => {
  isShow.value = !isShow.value;
  emit('update:modelValue', isShow.value);
};

</script>

<style lang='scss' scoped>
.header-toggle-btn {
  width: calc(var(--xxl) * 2.36);
  height: calc(var(--xxl) * 0.54);
  z-index: 999;
  position: absolute;
  top: calc(var(--xxl) * 7.56);
  left: 50%;
  transform: translate(-50%, 0);
  &.hide {
    top: calc(var(--xxl) * 3.76);
  }
  &:hover {
    img {
      display: none;
      &.on {
        display: block;
      }
    }
  }
  img {
    width: 100%;
    height: auto;
    display: block;
    &.on {
      display: none;
    }
  }
}
</style>
