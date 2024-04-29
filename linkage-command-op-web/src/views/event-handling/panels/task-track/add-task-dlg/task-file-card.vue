<template>
  <div class="wrapper" @mouseenter="hover=true" @mouseleave="hover=false">
    <hl-thumb
      v-if="item.sourceType === 1"
      :src="fileUrl"
      fit="cover"
      class="pic"
    />
    <video
      v-else-if="item.sourceType === 2"
      :src="fileUrl"
      style="object-fit:cover"
      class="pic"
    />
    <hl-icon v-else class="pic file-icon" style="vertical-align: baseline;">
      <svg width="18px" height="20px" viewBox="0 0 18 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <title>编组</title>
        <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="编组" fill-rule="nonzero">
            <path d="M18,7 L18,18.9925 C18,19.5511 17.5552,20 17.0066,20 L0.9934,20 C0.44495,20 0,19.556 0,19.0082 L0,0.9918 C0,0.45531 0.44694,0 0.99826,0 L11,0 L11,6 C11,6.55228 11.4477,7 12,7 L18,7 Z M5,5 L5,7 L8,7 L8,5 L5,5 Z M5,9 L5,11 L13,11 L13,9 L5,9 Z M5,13 L5,15 L13,15 L13,13 L5,13 Z" id="形状" fill="#FFCA28"></path>
            <polygon id="路径" fill="#FFE8A1" points="18 5 13 5 13 0.00318"></polygon>
          </g>
        </g>
      </svg>
    </hl-icon>
  </div>
</template>
<script lang="ts" setup>
import { computed, PropType, ref } from 'vue';
import { PreviewItem } from 'fx-front-framework';
import { GlobalAPI } from '@/common';

const props = defineProps({
  item: {
    type: Object as PropType<PreviewItem>,
    default: () => ({})
  },
});

const hover = ref(false);
const fileUrl = computed(() => props.item.url.startsWith('http:') || props.item.url.startsWith('https:') ? GlobalAPI.config.FILE_VIEW + props.item.url.substring(props.item.url.indexOf('/minio') + 6) : GlobalAPI.config.FILE_VIEW + props.item.url);
</script>
<style lang="scss" scoped>

.wrapper {
  position: relative;
  .actions {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: white;
    z-index: 2;
  }
  .pic {
    width: calc(var(--xxs) * 36);
    height: calc(var(--xxs) * 36);
  }
  .file-icon {
    display: block!important;
    background: #fff;
    width: 100%!important;
    height: 100%!important;
  }
}
</style>
