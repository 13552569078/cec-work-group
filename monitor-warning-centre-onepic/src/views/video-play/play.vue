<template>
  <video controls autoplay style="object-fit: fill">
    <source :src="videoUrl" type="video/mp4" />
    您的浏览器不支持Video标签。
  </video>
</template>

<script lang="ts" setup>

defineProps({
  videoUrl: {
    type: String,
    default: ''
  }
});
</script>
