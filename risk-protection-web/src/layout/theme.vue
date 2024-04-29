<template>
  <iframe
    id="themeFrame"
    :src="src"
    style="width:100%;height:100%"
    frameboder="0"
  />
</template>
<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { HlLoadingService, LoadingInstance } from 'hongluan-ui';
import { useTheme } from '@/hooks';

const src = process.env.NODE_ENV !== 'production' ? 'http://theme.front.etcc.group/' : 'http://theme.front.etcc.group/';

const { isLoading, resetLoading } = useTheme();

let loadingInst: LoadingInstance | undefined;

watch(isLoading, () => {
  !isLoading.value && loadingInst && loadingInst.close();
});

onMounted(() => {
  loadingInst = HlLoadingService({ target: '#themeDialog .panel-body', fullscreen: false });
});

onBeforeUnmount(() => {
  resetLoading();
  loadingInst = undefined;
});
</script>
