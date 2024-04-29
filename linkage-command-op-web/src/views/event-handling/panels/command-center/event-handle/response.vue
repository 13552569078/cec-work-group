<template>
  <div class="response-info common-card-bg">
    <hl-group class="items-middle">
      <div class="left">
        <div>
          <span class="response-icon m-r-sm" :class="`response-icon-${eventResponse.responseStatus}`"></span>
          <hl-button v-if="!eventIsFinished" type="primary" class="normal-width hover-style" @click="onClickBtn(getResponseTxtByKey('btnTxt'))">{{ getResponseTxtByKey('btnTxt') }}</hl-button>
        </div>
        <div class="response-tips common-font-normal font-bold" :class="`response-tips-${eventResponse.responseStatus}`">{{ eventIsFinished ? '已办结' : getResponseTxtByKey('tips') }}</div>
      </div>
      <div class="right">
        <div class="display-flex items-middle">
          <span v-if="eventIsFinished && !eventResponse.responseLevel" class="font-bold m-r-xs">事件未启动响应直接办结</span>
          <span v-if="showLevel" class="font-bold m-r-xs">启动{{ eventIsFinished ? '了' : '' }}<span :style="{color: RESPONSE_LEVEL_COLOR[eventResponse.responseLevel]}">{{ eventResponse.responseLevel }}</span>响应</span>
          <template v-if="eventIsFinished">
            <hl-button type="primary" class="normal-width hover-style" @click="onClickBtn('查看响应级别')">查看响应级别</hl-button>
            <hl-button type="primary" class="normal-width hover-style m-l-xxs" @click="summaryReportDlgVisible=true">总结报告</hl-button>
          </template>
          <hl-button v-else type="primary" class="normal-width hover-style" @click="onClickBtn(getResponseTxtByKey('btn2Txt'))">{{ getResponseTxtByKey('btn2Txt') }}</hl-button>
        </div>
        <div v-if="showSuggest" class="font-14 m-t-xxs display-flex items-middle"><hl-icon size="xs" class="m-r-xxs"><fill-info /></hl-icon>建议{{ eventResponse.responseStatus === 'not_started' ? '启动' : '调整为' }}<span :style="{color: RESPONSE_LEVEL_COLOR[eventResponse.matchLevel]}">{{ eventResponse.matchLevel }}</span>响应</div>
      </div>
    </hl-group>
    <response-level-dlg
      v-if="responseLevelDlgVisible"
      :info="eventResponse"
      @show-notice="sendResponseMsg"
      @cancel="responseLevelDlgVisible=false;$emit('refresh');"
    />
    <summary-report-dlg
      v-if="summaryReportDlgVisible"
      @send="sendReportMsg"
      @cancel="summaryReportDlgVisible=false;"
    />
    <send-msg-dlg v-if="sendMsgDlgVisible" :message-title="msgTitle" :content="msgContent" @cancel="sendMsgDlgVisible=false" />
  </div>
</template>
<script setup lang="ts">
import { ref, computed, PropType } from 'vue';
import { HlMessage, HlMessageBox } from 'hongluan-ui';
import { RESPONSE_LEVEL_COLOR } from '@/common';
import { useCurrentEvent } from '@/hooks';
import { SendMsgDlg } from '@/components';
import { apiEventResponseObj } from '@/apis/modules/event-response';
import { IpostFindEventResponseByIdSpace } from '@/apis/modules/event-response/model';
import ResponseLevelDlg from './response-level-dlg.vue';
import SummaryReportDlg from './summary-report-dlg.vue';

const props = defineProps({
  eventResponse: {
    type: Object as PropType<IpostFindEventResponseByIdSpace.Data>,
    default: () => ({})
  }
});
const emit = defineEmits(['refresh']);

const { eventIsFinished, currentEvent } = useCurrentEvent();
const responseLevelDlgVisible = ref(false);
const sendMsgDlgVisible = ref(false);
const summaryReportDlgVisible = ref(false);
//  // todo eventState-FINISHED  事件办结
const responseTxtMap: Record<string, any> = {
  'not_started': {
    tips: '未响应',
    btnTxt: '办结',
    btn2Txt: '立即启动',
  },
  'running': {
    tips: '响应中',
    btnTxt: '结束响应',
    btn2Txt: '调整响应级别',
  },
  'finish': {
    tips: '响应结束',
    btnTxt: '办结',
    btn2Txt: '重新启动'
  },
};

const msgTitle = ref('');
const msgContent = ref('');

const getResponseTxtByKey = (key: string) => {
  return responseTxtMap[props.eventResponse.responseStatus]?.[key];
};
const showLevel = computed(() => {
  return props.eventResponse.responseStatus !== 'not_started' && props.eventResponse.responseLevel;
});
const showSuggest = computed(() => {
  const { matchLevel, responseLevel } = props.eventResponse;
  return matchLevel && responseLevel !== matchLevel && !eventIsFinished.value;
});

// 事件办结
const finishEvent = async() => {
  await HlMessageBox.confirm('您确认办结事件吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  });
  try {
    await apiEventResponseObj.postFinishEventInfo(props.eventResponse?.eventId);
    HlMessage.success('办结事件成功');
    emit('refresh', true);
  } catch {
    HlMessage.error('办结事件失败');
  }
};
const stopEvent = async() => {
  await HlMessageBox.confirm('您确定要结束响应吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  });
  try {
    await apiEventResponseObj.postFinishEventResponseCaseNew(props.eventResponse?.eventId);
    HlMessage.success('结束响应成功');
    emit('refresh');
  } catch {
    HlMessage.error('结束响应失败');
  }
};
// 重新启动
const restartEvent = async() => {
  try {
    const res = await apiEventResponseObj.postRunEventResponseCase({
      eventInfoId: props.eventResponse?.eventId,
      responseLevel: props.eventResponse.responseLevel,
    });
    HlMessage.success('重新启动成功');
    emit('refresh');
  } catch {
    HlMessage.error('重新启动失败');
  }
};

const onClickBtn = (txt: string) => {
  switch (txt) {
    case responseTxtMap.not_started.btnTxt:
    case responseTxtMap.finish.btnTxt:
      finishEvent();
      break;
    case responseTxtMap.running.btnTxt:
      stopEvent();
      break;
    case responseTxtMap.not_started.btn2Txt:
    case responseTxtMap.running.btn2Txt:
    case '查看响应级别':
      responseLevelDlgVisible.value = true;
      break;
    case responseTxtMap.finish.btn2Txt:
      restartEvent();
      break;
    default:
      console.log('其他');
  }
};

const sendResponseMsg = () => {
  msgTitle.value = '事件响应通知';
  msgContent.value = `事件：【${currentEvent.name}】
级别：【${currentEvent.responseLevelName}】
类型：【${currentEvent.eventTypeName}】
地点：【${currentEvent.mainAddress}】
事件响应期间请密切配合调度工作！`;

  sendMsgDlgVisible.value = true;
  responseLevelDlgVisible.value = false;
  emit('refresh');
};
const sendReportMsg = ({ title, content }: { title: string; content: string; }) => {
  msgTitle.value = title;
  msgContent.value = content;
  sendMsgDlgVisible.value = true;
};
</script>
<style lang="scss" scoped>
.response-info {
  padding: calc(var(--xxs) * 3.5) var(--sm) calc(var(--xxs) * 2.25);
  .font-14 {
    font-size: var(--font-md);
    line-height: 1.43;
  }
  .title {
    img {
      width: calc(var(--xxs) * 39);
    }
    .txt {
      flex: none;
      font-size: var(--font-xl);
      line-height: 1.28;
      font-family: YouSheBiaoTiHei;
      color: #fff;
      background: linear-gradient(180deg, #FFFFFF 0%, #9BFDF0 100%, #9BFDF0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .response-icon {
    display: inline-block;
    vertical-align: bottom;
    width: calc(var(--xxs) * 16.25);
    height: calc(var(--xxs) * 11.75);
    background-image: url(@/assets/images/event-handling/left-2/e-handle-default.png);
    background-size: 100% 100%;
    &-running{
      background-image: url(@/assets/images/event-handling/left-2/e-handle-running.png);
      background-size: 100% 100%;
    }
  }
  .response-tips {
    white-space: nowrap;
    width: 4em;
    text-align: center;
    font-family: PingFangSC-Semibold, PingFang SC;
    &-running{
      color: #FFEA44;
    }
  }
  .left {
    margin-right: calc(var(--xxs) * 12);
  }
  .event-finish-wrap {
    height: calc(var(--xxs) * 30);
    position: relative;
    img {
      height: 100%;
    }
    span {
      position: absolute;
      bottom: var(--sm);
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
