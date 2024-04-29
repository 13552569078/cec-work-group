<template>
  <div class="overview-tab" h-full>
    <div class="display-flex online-time m-b-md">
      <div class="left-bg"></div>
      <div class="txt m-l-sm m-r-sm text-center"> 自系统上线<span>{{ onlineTime }}</span> &gt;</div>
      <div class="right-bg"></div>
    </div>
    <div class="display-flex flex-col items-between" style="height: calc(100% - var(--xxs) * 9.5);">
      <div class="self-top display-flex day text-center items-center items-middle">
        <div class="m-r-sm">连续</div>
        <div class="num m-l-xxs" v-for="i in day" :key="i">
          <span>{{ i }}</span>
        </div>
        <div class="m-l-sm">天，无较大（敏感）事件</div>
      </div>
      <div class="self-bottom display-flex items-center items-middle overview-type text-center">
        <div v-for="(item, index) in types" :key="item.value + item.name" class="cursor-pointer" @click="showEventDlg(item)">
          <div class="type-item m-b-xs">
            <overview-anim />
            <span class="type-num xmid-num" :style="`color:${numColor[index]}`">{{ item.value }}</span>
          </div>
          <div class="type-name">{{ item.name }}</div>
        </div>
      </div>
    </div>
    <div class="bottom-section" />
    <event-detail-list-dlg v-if="showDlg" v-bind="dlgParams" @cancel="showDlg=false"/>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import dayjs from 'dayjs';
import { useCurrentArea, useDataRefresher } from '@/hooks';
import { DATE_FORMAT, EVENT_HANDLING, TIME_END_STR, TIME_START_STR } from '@/common';
import { apiEventStatisticsObj } from '@/apis/modules/event-statistics';
import EventDetailListDlg from '@/views/overview/panels/event-list/event-detail-list-dlg.vue';
import OverviewAnim from './overview-anim.vue';

const onlineTime = ref('');
const day = ref('');
const types = ref([
  { name: '事件总数', value: '', showDlg: true, params: {} },
  { name: '处置中', value: '', showDlg: true, params: { eventStates: EVENT_HANDLING.split(',') } },
  { name: '办结率', value: '', showDlg: false, params: {} },
  { name: '当月新增',
    value: '',
    showDlg: true,
    params: {
      happenTimeStart: dayjs(`${new Date().getFullYear()}-${new Date().getMonth() + 1}`).format(DATE_FORMAT) + TIME_START_STR,
      happenTimeEnd: dayjs(Date.now()).format(DATE_FORMAT) + TIME_END_STR
    }
  },
]);

const showDlg = ref(false);
const dlgParams = ref<Record<string, any>>({});
const numColor = ['#FFFFFF', '#FD6161', '#FFEA44', '#72F5AC'];

const getEventOverview = async(areaCode: string) => {
  const result = await apiEventStatisticsObj.postEventOverview({ areaCode });

  types.value[0].value = `${result.data.totalNum}`;
  types.value[1].value = `${result.data.handleNum}`;
  types.value[2].value = `${result.data.completionRateNum}`;
  types.value[3].value = `${result.data.monthAddNum}`;
  day.value = `${result.data.dayNum}`;
  onlineTime.value = result.data.startDate;
};

const showEventDlg = (item: typeof types.value[number]) => {
  dlgParams.value = item.params;
  showDlg.value = item.showDlg;
};

const { areaCode } = useCurrentArea(getEventOverview);

useDataRefresher(() => {
  getEventOverview(areaCode.value);
});
</script>
<style lang="scss" scoped>
.overview-tab {
  width: 100%;
  height: 100%;
  padding-bottom: calc(var(--xxs) * 3);
  position: relative;
  .online-time {
    height: calc(var(--xxs) * 5.75);
  }

  .left-bg,
  .right-bg {
    width: calc(var(--xxl) * 2.425);
    background-image: url("@/assets/images/overview/left-1/time-left-bg.png");
    background-size: 100% calc(var(--xxs) * 2.25);
    background-repeat: no-repeat;
    background-position: left calc(var(--xxs) * 2.25);
  }
  .right-bg {
    background-image: url("@/assets/images/overview/left-1/time-right-bg.png");
  }
  .txt {
    height: calc(var(--xxs) * 5.75);
    flex: 1;
    font-family: YouSheBiaoTiHei;
    font-size: var(--font-xl);
    background: linear-gradient(180deg, #ffffff 0%, #9bfdf0 100%, #9bfdf0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .day {
    width: 100%;
    font-size: calc(var(--xxs) * 4.5);
    color: #ffffff;
    margin-bottom: calc(var(--xxs) * 3.5);
    .num {
      width: calc(var(--xxs) * 7);
      height: var(--xxl);
      line-height: var(--xxl);
      font-size: calc(var(--xxs) * 7);
      font-family: Impact;
      background: rgba(58, 40, 17, 0.6);
      border: 1px solid;

      box-shadow: inset 0px 0px 5px 0px rgba(255, 163, 0, 0.5);
      border-radius: var(--xxs);
      border-image: linear-gradient(
          360deg,
          rgba(252, 187, 16, 1),
          rgba(255, 195, 0, 1),
          rgba(255, 250, 162, 1)
        )
        1 1;
      span {
        background: linear-gradient(180deg, #ffffff 0%, #fcbb0f 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }

  .bottom-section {
    position: absolute;
    left: 0;
    bottom: calc(var(--xxs) * -1);
    width: 100%;
    height: calc(var(--xxs) * 15);
    background-image: url('@/assets/images/overview/left-1/bottom.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .overview-type {
    width: 100%;
    column-gap: calc(var(--xxs) * 7.5);
  }
  .type-item {
    position: relative;
    width: calc(var(--xxs) * 17);
    height: calc(var(--xxs) * 18.25);
    // background-image: url("@/assets/images/overview/left-1/type-item-bg.png");
    // background-size: 100% 100%;
    // background-repeat: no-repeat;
  }
  .type-name {
    font-size: var(--font-lg);
  }
}
</style>
