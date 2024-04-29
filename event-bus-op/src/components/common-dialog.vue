<template>
  <hl-dialog
    class="common-dialog"
    :class="draggable ? '' : 'auto'"
    v-model="visible"
    :width="width"
    destroy-on-close
    :close-on-click-modal="false"
    append-to-body
    :draggable="draggable"
  >
    <template #header>
      <hl-group class="panel-all">
        <!-- <img class="title-start" :src="titleStartIcon" alt=""/> -->
        <h2 class="panel-title" :class="getSizeStyle()">
          <slot name="title">
            <span class="title-text">{{ title }}</span>
          </slot>
        </h2>
        <div class="panel-header-right m-r-md">
          <slot name="right">
            <div class="right-text"></div>
          </slot>
          <slot name="action"></slot>
        </div>
        <div
          class="close cursor-pointer"
          @click="handleClose"
        >
          <img :src="closeButton" />
        </div>
      </hl-group>
    </template>
    <template #default>
      <slot></slot>
    </template>
  </hl-dialog>
</template>

<script lang='ts' setup>
import { ref, withDefaults } from 'vue';
import closeButton from '@/assets/images/deyang/panel/close.png';
import titleStartIcon from '@/assets/images/dialog/title_start_icon.png';

const emit = defineEmits(['close']);

const visible = ref(true);

const props = withDefaults(
  defineProps<{
    title: string;
    width?: string;
    size?: string;
    draggable?: boolean;
  }>(),
  {
    title: '',
    width: '50%',
    draggable: false,
    size: '4',
  }
);

const getSizeStyle = () => {
  return `title-size-${props.size}`;
};

const handleClose = () => {
  visible.value = false;
  emit('close');
};
</script>

<style lang="scss" scoped>
.common-dialog {
  .close {
    img {
      width: calc(var(--xxs) * 55/4);
      position: absolute;
      bottom: calc(var(--xxs) * (4/4)*(-1));
      right: 0;
    }
  }
  .right-text{
    margin-right: calc(var(--xxs) * 160/4);
    display: flex;
    height: 100%;
    font-size: calc(var(--xxs) * 14/4);
    color: #FFFFFF;
  }
}
</style>
