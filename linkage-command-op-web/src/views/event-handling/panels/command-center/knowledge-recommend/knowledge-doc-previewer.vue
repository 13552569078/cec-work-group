<template>
  <div class="doc-preview">
    <div class="text-right">
      <hl-button type="primary" class="hover-style" @click="downloadDoc">下载文档</hl-button>
    </div>
    <img :src="separatorImg" class="separator" />
    <div class="view-content">
      <hl-spinner class="loading" size="calc(var(--xxs) * 10)" v-if="loading" />
      <iframe :src="viewUrl" :onload="loadHandle" :onerror="errorHandle"></iframe>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, PropType, onMounted, reactive, watch } from 'vue';
import { encodeURI } from 'js-base64';
import { GlobalAPI } from '@/common';
import { apiKnowledgeRecommendObj } from '@/apis/modules/knowledge-recommend';
import separatorImg from '@/assets/images/event-handling/left-2/separator.png';

const props = defineProps({
  url: String,
  knowledgeFileId: String,
});

const viewUrl = ref('');
const loading = ref(false);

const downloadDoc = async() => {
  await apiKnowledgeRecommendObj.getDownload(`${props.knowledgeFileId}`);
};

const loadDoc = () => {
  loading.value = true;
  const hostUrl = import.meta.env.PROD ? window.location.origin : 'https://www.jczhdemo.etcc.group';
  const onlineViewUrl = '/file-view/onlinePreview?url=';
  const base64Url = encodeURI(GlobalAPI.config.FILE_PREVIEW_URL! + props.url);
  const result = hostUrl + onlineViewUrl + base64Url + '&t=' + Math.random();
  console.log('----result---', result);
  viewUrl.value = result;
};

const loadHandle = () => {
  loading.value = false;
};
const errorHandle = (e: Error) => {
  loading.value = false;
  console.error('load knowledge doc failed!', e);
};

watch(() => [props.knowledgeFileId, props.url], ([knowledgeFileId, url]) => {
  if (knowledgeFileId && url) {
    loadDoc();
  }
}, {
  immediate: true,
});
</script>
<style scoped lang="scss">
.doc-preview {
  border: 1px solid rgba(0,158,247,0.16);
  padding: var(--px20) var(--px20) 0 var(--px20);
  .separator {
    margin-top: var(--px20);
    margin-bottom: var(--px20);
    height: 1px;
    width: 100%;
  }
  .view-content {
    height: 87%;
    .loading {
      position: absolute;
      top: 50%;
      left: 50%;
    }
    iframe {
      width: 100%;
      height: 100%;
      border: 0px;
    }
  }
}
</style>
