<template>
  <hl-dialog :model-value="true" width="calc(var(--xxs)*329)"
    :append-to-body="true" title="响应等级"
    @closed="$emit('cancel')" :close-on-click-modal="false"
    :close-on-press-escape="false">
    <hl-row layout="grid" count="count-2" gap="var(--md)" class="show-col">
      <hl-col span="col" v-for="i in info?.responseList || []" :key="i.responseLevel">
        <hl-panel class="common-card-bg" :class="{'is-active': i.responseLevel === info?.responseLevel }" borderless
          style="height: calc(var(--xxs) * 105);--panel-header-height:0;" full-body>
          <template #header>
            <div class="panel-title p-t-sm p-b-xs">
            </div>
            <div class="ribbon-box display-flex items-middle items-center" v-if="i.responseLevel === info?.responseLevel && info?.responseStatus !== 'not_started'">
              <span>已启动</span>
            </div>
          </template>
          <hl-group full align="items-top" class="h-100 p-x-xl p-y-lg">
            <hl-group full class="static h-100" align="item-center items-middle" style="width:calc(var(--xxs) * 20) ;"
              dir="vertical">
              <hl-icon :color="RESPONSE_LEVEL_COLOR[i.responseLevel]" width="50" height="50">
                <hl-group full align="items-middle" dir="vertical">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="design-iconfont">
                    <g :fill="RESPONSE_LEVEL_COLOR[i.responseLevel]" fill-rule="evenodd">
                      <path
                        d="M24,9 C33.9411255,9 42,17.0588745 42,27 L42,42 C43.6568542,42 45,43.3431458 45,45 C45,46.6568542 43.6568542,48 42,48 L6,48 C4.34314575,48 3,46.6568542 3,45 C3,43.3431458 4.34314575,42 6,42 L6,27 C6,17.0588745 14.0588745,9 24,9 Z M24.62514,19.9294428 C24.62514,19.5325065 24.1761664,19.3727638 23.9305016,19.6132854 L23.8395658,19.7413475 L18.0418073,31.9011502 C17.9311631,32.1408794 18.0510276,32.4113431 18.2733406,32.4948386 L18.4179978,32.520758 L23.3637956,32.5096936 L23.37486,40.0335024 C23.37486,40.4304386 23.8238336,40.5901813 24.0694984,40.3496597 L24.1604342,40.2215976 L29.9581927,28.0617949 C30.0688369,27.8220657 29.9489724,27.551602 29.7266594,27.4681066 L29.5820022,27.4421871 L24.6362044,27.4532515 L24.62514,19.9294428 Z" />
                      <path
                        d="M5.63766586,10.2254196 L6.78673252,11.189601 C7.73865052,11.988355 7.86281444,13.4075551 7.0640604,14.3594731 C6.26530636,15.3113911 4.84610627,15.435555 3.89418828,14.636801 L2.74512162,13.6726195 C1.79320362,12.8738655 1.6690397,11.4546654 2.46779374,10.5027474 C3.26654778,9.55082943 4.68574787,9.42666552 5.63766586,10.2254196 Z M42.4726667,10.2254196 C43.4245847,9.42666552 44.8437847,9.55082943 45.6425388,10.5027474 C46.3686788,11.3681274 46.3320767,12.619691 45.6042306,13.4402118 L45.3652109,13.6726195 L44.2161442,14.636801 C43.2642262,15.435555 41.8450262,15.3113911 41.0462721,14.3594731 C40.3201321,13.4940931 40.3567342,12.2425295 41.0845803,11.4220087 L41.3236,11.189601 L42.4726667,10.2254196 Z M14.5092761,3.60848476 L15.1432035,4.96794644 C15.6683662,6.09416137 15.181117,7.4328674 14.0549021,7.95803005 C12.9286872,8.48319269 11.5899811,7.99594355 11.0648185,6.86972861 L10.4308911,5.51026693 C9.90572844,4.384052 10.3929776,3.04534597 11.5191925,2.52018332 C12.6454075,1.99502068 13.9841135,2.48226982 14.5092761,3.60848476 Z M33.6848185,3.60848476 C34.2099811,2.48226982 35.5486872,1.99502068 36.6749021,2.52018332 C37.7072658,3.00158242 38.2027207,4.16658394 37.8736184,5.22488007 L37.7632035,5.51026693 L37.1292761,6.86972861 C36.6041135,7.99594355 35.2654075,8.48319269 34.1391925,7.95803005 C33.1068288,7.47663095 32.6113739,6.31162943 32.9404762,5.2533333 L33.0508911,4.96794644 L33.6848185,3.60848476 Z M24,0 C25.2426407,0 26.25,1.00735931 26.25,2.25 L26.25,3.75 C26.25,4.99264069 25.2426407,6 24,6 C22.7573593,6 21.75,4.99264069 21.75,3.75 L21.75,2.25 C21.75,1.00735931 22.7573593,0 24,0 Z"
                        opacity=".31999999" />
                    </g>
                  </svg>
                  <div class="m-t-xs" style="font-size:1.1rem;white-space:nowrap;">{{ i.responseLevel }}</div>
                </hl-group>
              </hl-icon>
              <hl-button class="static m-b-xs primary hover-style" :disabled="info?.responseLevel === i.responseLevel || info?.responseStatus === 'finish' || eventIsFinished"
                @click="start(i.responseLevel)">立即启动</hl-button>
            </hl-group>
            <hl-scrollbar class="h-100">
              <div class="response-desc border-left p-l-md m-l-md" v-for="item in getDescArr(i.responseDesc)" :key="item">{{ item }}</div>
            </hl-scrollbar>
          </hl-group>
        </hl-panel>
      </hl-col>
    </hl-row>
  </hl-dialog>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue';
import { HlMessage, HlMessageBox } from 'hongluan-ui';
import { apiEventResponseObj } from '@/apis/modules/event-response';
import { IpostFindEventResponseByIdSpace } from '@/apis/modules/event-response/model';
import { RESPONSE_LEVEL_COLOR } from '@/common';
import { useCurrentEvent } from '@/hooks';

const props = defineProps({
  info: {
    type: Object as PropType<IpostFindEventResponseByIdSpace.Data>,
    default: () => ({})
  }
});
const emit = defineEmits(['cancel', 'show-notice']);

const { eventIsFinished, fetchEvent } = useCurrentEvent();
const getDescArr = (str: string) => {
  if (!str) return [];
  const arr = str.split(';').filter(item => item !== '').map(item => item + ';');
  return arr;
};

const start = async(responseLevel: string) => {
  HlMessageBox.confirm('是否发送通知?', '提示', {
    distinguishCancelAndClose: true,
    confirmButtonText: '启动响应并发送通知',
    cancelButtonText: '启动响应',
    type: 'success',
    beforeClose: async(action, instance, done) => {
      if (action === 'cancel') {
        instance.cancelButtonLoading = true;
        instance.cancelButtonText = '启动响应中...';
        await startResponse(responseLevel);
        await fetchEvent(props.info?.eventId, true, false);
        instance.cancelButtonLoading = false;
        done();
        emit('cancel');
      } else if (action === 'close') {
        done();
        emit('cancel');
      } else if (action === 'confirm') {
        instance.confirmButtonLoading = true;
        instance.confirmButtonText = '启动响应中......';
        await startResponse(responseLevel);
        await fetchEvent(props.info?.eventId, true, false);
        instance.confirmButtonLoading = false;
        done();
        emit('show-notice');
      }
    }
  }).catch(() => {
    // HlMessage.error('启动响应失败');
  });
};

const startResponse = async(responseLevel: string) => {
  const res = await apiEventResponseObj.postRunEventResponseCase({
    eventInfoId: props.info?.eventId,
    responseLevel: responseLevel,
    planFileUrl: props.info?.planFileUrl,
    planId: props.info?.planId,
    planName: props.info?.planName,
  });
  HlMessage.info(res.desc || '启动成功');
};
</script>

<style lang="scss" scoped>
.ribbon-box {
  width: calc(var(--xxs) * 15);
  height: calc(var(--xxs) * 15);
  background-image: url(@/assets/images/event-handling/left-2/ribbon-bg.png);
  background-size: 100% 100%;
  position: absolute;
  right: 0;
  top: 0;
  span {
    font-size: var(--font-md);
    line-height: 1.42;
    color: #75e7ef;
    transform: rotate(45deg) translateY(-57%);
  }
}
.response-desc {
  margin-bottom: 4px;
  word-break: break-all;
  font-size: var(--md);
  line-height: 1.9rem;
}
.is-active {
  border: 1px solid rgba(0,158,247,0.24);
}
</style>
