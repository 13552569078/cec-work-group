<template>
  <hl-dialog
    :model-value="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="calc(var(--xxs) * 300)"
    height="calc(var(--xxs) * 241.5)"
    body-padding="var(--md)"
    custom-class="full-body"
    title="辅助决策方案"
    append-to-body
    @close="$emit('cancel')"
  >
    <div class="content-wrap">
      <div class="left">
        <div class="head-box">
          <div class="title">方案列表</div>
          <hl-button v-if="!eventIsFinished" type="primary" class="hover-style" :loading="loading" @click="addPlan">创建新处置方案</hl-button>
        </div>
        <hl-scrollbar v-if="planList.length" class="plan-list">
          <div
            class="left-link-box"
            :class="{
              'is-active': curPdfInfo?.id === item.id,
            }"
            v-for="item in planList"
            :key="item.id"
            @click="showPdf(item)"
          >
            {{ item.name }}
          </div>
        </hl-scrollbar>
      </div>
      <div v-if="curPdfInfo?.curPdfUrl" class="right">
        <div class="pdf-box">
          <pdf-view :pdfUrl="curPdfInfo?.curPdfUrl" />
        </div>
        <div class="button-box">
          <hl-button type="primary" class="hover-style" :loading="loading" @click="deletePlan">&nbsp;&nbsp;&nbsp;删除&nbsp;&nbsp;&nbsp;</hl-button>
          <hl-button type="primary" class="hover-style" :loading="loading" @click="downloadPlan">预览下载</hl-button>
          <hl-button type="primary" class="hover-style" :loading="loading" @click="sendNotice">发送通知</hl-button>
        </div>
      </div>
      <div v-else class="no-data">
        <hb-empty :image="NoDataImg" class="big"></hb-empty>
      </div>
    </div>
    <send-msg-dlg v-if="msgDlgVisible" message-title="辅助决策方案通知" :content="msgContent" @cancel="msgDlgVisible=false" />
  </hl-dialog>
</template>
<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent, watch } from 'vue';
import { CommonUtils } from 'fx-front-utils';
import { HlMessage, HlMessageBox } from 'hongluan-ui';
import { getRemoteFilePath, GlobalAPI } from '@/common';
import { SendMsgDlg } from '@/components';
import { useCurrentEvent } from '@/hooks';
import { apiDisposeSuggestObj } from '@/apis/modules/dispose-suggest';
import NoDataImg from '@/assets/images/empty/no-data.png';
import { useAssistPlan } from './use-assist-plan';

import type { IpostFindEventPolicyDecisionPageSpace } from '@/apis/modules/dispose-suggest/model';

const PdfView = defineAsyncComponent(() => import('@/components/digital-reserve-plan/pdf-view.vue'));

const emit = defineEmits(['showAddDlg', 'cancel']);

const { currentEvent, eventIsFinished } = useCurrentEvent();
const { updateAssistPlanListDateStamp } = useAssistPlan();

const planList = ref<IpostFindEventPolicyDecisionPageSpace.List[]>([]);
const curPdfInfo = ref();
const msgDlgVisible = ref(false);
const msgContent = ref('');
const loading = ref(false);

const showPdf = (item: IpostFindEventPolicyDecisionPageSpace.List) => {
  const { pdfFileUrl: url } = item;
  curPdfInfo.value = item;
  curPdfInfo.value.curPdfUrl = getRemoteFilePath(url);
};

const addPlan = () => {
  emit('showAddDlg', { dlgName: 'showAddPlanDlg', type: 4 });
};
const deletePlan = async() => {
  if (loading.value) return;
  await HlMessageBox.confirm('您确定要删除此方案吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  });
  loading.value = true;
  try {
    await apiDisposeSuggestObj.postDeleteEventPolicyDecision(curPdfInfo.value.id);
    HlMessage.success('删除成功');
  } catch {
    HlMessage.error('删除失败');
  } finally {
    loading.value = false;
    await getList();
  }
};
const downloadPlan = () => {
  const { curPdfUrl, name } = curPdfInfo.value;
  CommonUtils.downloadFile(name, curPdfUrl);
};
const sendNotice = () => {
  msgContent.value = `方案：【${curPdfInfo.value.name}】`;
  msgDlgVisible.value = true;
};

const getList = async() => {
  const params = {
    currentPage: -1,
    pageSize: 9999,
    eventInfoId: currentEvent.id
  };
  const res = await apiDisposeSuggestObj.postFindEventPolicyDecisionPage(params);
  planList.value = res.data.list;
  if (planList.value.length) {
    showPdf(planList.value[0]);
  } else {
    curPdfInfo.value = {};
  }
};

watch(updateAssistPlanListDateStamp, val => {
  val && getList();
});

onMounted(() => {
  getList();
});
</script>
<style lang="scss" scoped>
.content-wrap {
  display: flex;
  justify-content: space-between;
  height: 100%;
  overflow: hidden;
  padding: var(--lg);
  box-sizing: border-box;

  .left {
    width: 25%;
    margin: 0;
    height: 100%;
    overflow: hidden;
    flex-shrink: 0;
    .head-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: calc(var(--xxs) * 10.5);
      background: url('@/assets/images/event-handling/left-2/title-bg.png') no-repeat center;
      background-size: 100%;
      .title {
        position: relative;
        font-size: var(--font-lg);
        font-weight: var(--font-weight-bold);
        color: #fff;
        line-height: 1.375;
        padding-left: calc(var(--xxs) * 11);
        &:before {
          position: absolute;
          content: '';
          width: var(--lg);
          height: calc(var(--xxs) * 4.5);
          background: url('@/assets/images/event-handling/left-2/icon1.png') no-repeat center;
          background-size: 100%;
          left: var(--md);
          top: calc(var(--xxs) * 0.5);
        }
      }
    }
    .plan-list {
      height: calc(100% - var(--xxs) * 10.5);
      overflow-y: auto;
      margin-top: calc(var(--xxs) * 2.5);
      .left-link-box {
        //height: calc(var(--xxs) * 15);
        font-size: var(--font-lg);
        padding: calc(var(--xxs) * 2.5) calc(var(--xxs) * 4);
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #FFFFFF;
        line-height: 1.375;
        word-break: break-all;
        background: url('@/assets/images/event-handling/left-2/plan-name-bg.png') no-repeat center;
        background-size: 100%;
        cursor: pointer;
        margin-bottom: var(--xxs);
      }
      .is-active {
        font-weight: 600;
        font-size: var(--font-lg);
        background: url('@/assets/images/event-handling/left-2/plan-name-active-bg.png') no-repeat center;
        background-size: 100%;
      }
    }
  }
  .right {
    width: 75%;
    height: 100%;
    overflow: hidden;
    margin-left: calc(var(--xxs) * 2.5);
    .pdf-box {
      height: 90%;
      border: calc(var(--xxs) * 0.25) solid rgba(0,158,247,0.16);
    }
    .button-box {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      height: 10%;
      .hl-button:not(:last-child) {
        margin-right: calc(var(--xxs) * 2.5);
      }
    }
  }
}
.no-data {
  width: 100%;
  height: 80%;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateX(-12.5%);
}
</style>
