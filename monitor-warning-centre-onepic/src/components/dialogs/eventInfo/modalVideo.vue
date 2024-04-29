<template>
  <hl-dialog
    :model-value="$props.modelValue"
    title="视频监控"
    full-body width="calc(var(--xxl) * 32)"
    height="calc(var(--xxl) * 20)"
    @closed="handleClosed"
    :append-to-body="true">
    <video-play v-if="$props.modelValue" :equipId="equipId"></video-play>
  </hl-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import VideoPlay from '@/views/video-play/index.vue';

const emit = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: Boolean,
  equipId: Array
});

const dialogVisible = ref(false);
const openDialog = async(data: any) => {
  console.log(data);
  dialogVisible.value = true;
};

// 需要暴露出去给父组件调用
defineExpose({ openDialog });

const handleClosed = () => {
  emit('update:modelValue', false);
};
</script>

<style lang="scss">
</style>
