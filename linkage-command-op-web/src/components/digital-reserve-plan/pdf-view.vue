<template>
  <hl-group ref="pdfContainer" dir="vertical" class="h-100">
    <div v-if="!showAllPages && allPages" class="p-xs">
      <hl-link type="primary" class="m-r-xs" :disabled="nowPage<=1" @click="gotoPage(nowPage - 1)">上一页</hl-link>
      <hl-input v-model="inputPage" size="sm" style="width:calc(var(--xl) * 2)"/> / {{ allPages }}
      <hl-link type="primary" class="m-l-xs" @click="gotoPage(nowPage + 1)">下一页</hl-link>
    </div>
    <hl-scrollbar
      ref="scrollbar"
      class="static right"
      v-show="showPdf"
      style="width: 100%;"
    >
      <div ref="inner" style="width: 100%;" class="display-flex items-center">
        <vue-pdf-embed
          v-if="pdfWidth > 0"
          :width="pdfWidth"
          :source="source"
          :page="nowPage"
          @loading-failed="loadingFailedPdf"
          @rendered="finishRender"
          @loaded="loadedPdf"
        />
      </div>
    </hl-scrollbar>
    <hl-group
      class="w-full h-full bg-content text-secondary"
      style="padding-top: calc(var(--xxl) * 3);"
      align="items-center"
      v-if="!showPdf"
    >
      暂无文件数据
    </hl-group>
  </hl-group>
</template>
<script lang="ts" setup>
import { ref, watch, onBeforeUnmount, nextTick, computed, onMounted, getCurrentInstance } from 'vue';
import { HlLoading } from 'hongluan-ui';
import VuePdfEmbed from 'vue-pdf-embed';
import { GlobalAPI } from '@/common';

const props = defineProps({
  pdfUrl: String,
  curPage: Number
});

const currentInst = getCurrentInstance();
const ALL_PAGES_LIMIT = 50;
const PDF_PRE_SRC = process.env.NODE_ENV === 'production' ? `${GlobalAPI.config.PDF_CMAP_URL}/cmaps/` : '/cmaps/';

const allPages = ref();
const pdfContainer = ref<{ $el: HTMLDivElement }>();
const scrollbar = ref();
const inner = ref();
const source = ref<object | string | Uint8Array>('');
const pdfAllHeight = ref(0);
const pdfWidth = ref(0);
const nowPage = ref<number | null>(1);
const inputPage = ref(1);
const showPdf = ref(false);

const showAllPages = computed(() => !Number.isNaN(+allPages.value) && allPages.value <= ALL_PAGES_LIMIT);

const loading = HlLoading.service({
  lock: true,
  text: 'Loading',
  spinner: { size: '30px', color: 'yellow' },
  background: 'rgba(0, 0, 0, 0.7)',
});
const timer = setTimeout(() => {
  loading.close();
}, 5000);

const gotoPage = (page: number) => {
  if (page < 1) return;
  console.log('pdfview goPage start');
  nextTick(() => {
    if (allPages.value < 1 || !allPages.value) return;
    if (showAllPages.value) {
      const singlePageHeight = pdfAllHeight.value / allPages.value;
      scrollbar.value.setScrollTop(singlePageHeight * (page - 1));
    } else {
      nowPage.value = page;
      inputPage.value = page;
    }
    console.log('pdfview', pdfAllHeight.value, allPages.value, scrollbar.value);
  });
};

const loadedPdf = (pdfContent: any) => {
  allPages.value = pdfContent._pdfInfo.numPages;
};
const finishRender = () => {
  pdfAllHeight.value = inner.value?.clientHeight;
  loading.close();
  nextTick(() => {
    if (allPages.value <= ALL_PAGES_LIMIT) {
      nowPage.value = null;
    }
  });
};

const loadingFailedPdf = () => {
  showPdf.value = false;
  loading.close();
};

watch(
  () => props.pdfUrl,
  async(newVal: string | void) => {
    if (newVal) {
      source.value = {
        url: newVal,
        cMapUrl: PDF_PRE_SRC,
        cMapPacked: true,
      };
      showPdf.value = true;
    }
  }, {
    immediate: true,
    deep: true,
  }
);
watch(
  () => props.curPage,
  async(newVal: number | void) => {
    if (newVal) {
      gotoPage(newVal);
    }
  }, {
    immediate: true,
    deep: true,
  }
);
watch(inputPage, val => {
  const num = +val;
  if (!isNaN(num) && num >= 1 && num <= allPages.value) {
    nowPage.value = num;
  }
});

onMounted(() => {
  pdfWidth.value = pdfContainer.value!.$el.parentElement!.clientWidth;
}, currentInst);
onBeforeUnmount(() => {
  timer && clearTimeout(timer);
  loading.close();
}, currentInst);

defineExpose({ gotoPage });
</script>
<style lang="scss" scoped>
:deep(.vue-pdf-embed>div) {
  margin-bottom: calc(var(--xxs) * 5);
}
:deep(.hl-link.primary) {
  &:hover{
    color: var(--primary);
  }
}
</style>
