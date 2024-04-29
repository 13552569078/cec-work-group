<template>
  <left-right-layout :leftWidth="80" isInDialog class="plan-wrap">
    <template #left>
      <left-tree
        :id="id"
        @updatePage="updatePage"
      ></left-tree>
    </template>
    <template #right>
      <pdf-view ref="pdfViewRef" :pdfUrl="pdfUrl"></pdf-view>
    </template>
  </left-right-layout>
</template>
<script lang="ts" setup>
import { ref, defineAsyncComponent, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { GlobalAPI } from '@/common';
import { apiReservePlanManageObj } from '@/apis/modules/reserve-plan';
import LeftRightLayout from './left-right-layout.vue';
import LeftTree from './tree.vue';

const PdfView = defineAsyncComponent(() => import('./pdf-view.vue'));

const props = defineProps({
  id: String
});

const route = useRoute();

const monitorPointId = ref('');
const pdfViewRef = ref();
const pdfUrl = ref('');

const getUrl = async() => {
  const res = await apiReservePlanManageObj.postFindReservePlanById(props.id!);
  const planFileUrl = res.data.planFileUrl;
  if (planFileUrl?.length > 0) {
    // url是否为相对地址
    if (!/^http(s)?:\/\//.test(planFileUrl)) {
      pdfUrl.value = GlobalAPI.config.FILE_VIEW + '/' + planFileUrl;
    } else {
      pdfUrl.value = GlobalAPI.config.FILE_VIEW + planFileUrl.substring(planFileUrl.indexOf('/minio') + 6);
    }
  }
};

const updatePage = (page: number) => {
  pdfViewRef.value && pdfViewRef.value.gotoPage(page);
};

onMounted(() => {
  getUrl();
});
</script>
<style lang="scss" scoped>
.plan-wrap {
  padding: calc(var(--xxs) * 5) calc(var(--xxs) * 5) 0 calc(var(--xxs) * 5);
  :deep(.left) {
    background: rgba(0,158,247,0.1);
  }
  :deep(.right) {
    border: 1px solid rgba(0,158,247,0.16);
  }
}
</style>
