<template>
  <hb-modeless-dialog
    class="common-dialog"
    v-model="visible"
    :width="width"
    destroy-on-close
  >
    <template #header>
      <hl-group class="panel-all">
        <img class="title-start" :src="titleStartIcon" alt=""/>
        <h2 class="panel-title">
          <slot name="title">
            {{ title }}
          </slot>
        </h2>
        <div class="panel-header-right m-r-md">
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
  </hb-modeless-dialog>
</template>

<script lang='ts' setup>
import { ref, withDefaults } from 'vue';
import closeButton from '@/assets/images/dialog/close.png';
import titleStartIcon from '@/assets/images/dialog/title_start_icon.png';

const emit = defineEmits(['close']);

const visible = ref(true);

const props = withDefaults(
  defineProps<{
    title: string;
    width?: string;
    draggable?: boolean;
  }>(),
  {
    title: '',
    width: '50%',
    draggable: false
  }
);

const handleClose = () => {
  visible.value = false;
  emit('close');
};
</script>

<style lang="scss" scoped>
.common-dialog {
  .close {
    img {
      width: calc(var(--xl) * 0.82);
    }
  }
}
</style>
