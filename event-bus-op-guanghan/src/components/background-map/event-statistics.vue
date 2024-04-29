<template>
  <hl-group class="stat-panel p-sm header-mode" :dir="isOldMode ? 'vertical' : ''" gap="var(--md)">
    <div class="corner-top"></div>
    <h4>事件统计</h4>
    <img :src="underLine" />
    <hl-group class="item-list" :dir="isOldMode ? 'vertical' : ''" gap="var(--md)" v-if="searchParams.eventStatus === ALL">
      <hl-group
        class="item"
        :class="isOldMode ? 'p-md' : ''"
        :align="isOldMode ? 'items-between items-middle' : 'items-center items-middle'"
        :dir="isOldMode ? '' : 'vertical'"
        :gap="isOldMode ? '' : 'var(--xs)'">
        <span class="standard-text">流入事件数</span>
        <div class="stat-number">
          <span :class="isOldMode ? '' : 'm-t-xxs'"><b class="font-xxl m-r-xxs" :class="isOldMode ? 'gradient-text' : ''">{{ statistics.totalNum }}</b>件</span>
        </div>
      </hl-group>
      <hl-group
        class="item"
        :class="isOldMode ? 'p-md' : ''"
        :align="isOldMode ? 'items-between items-middle' : 'items-center items-middle'"
        :dir="isOldMode ? '' : 'vertical'"
        :gap="isOldMode ? '' : 'var(--xs)'">
        <span class="standard-text">环比</span>
        <div class="stat-number">
          <span :class="isOldMode ? '' : 'm-t-xxs'"><b class="font-xxl m-r-xxs" :class="isOldMode ? 'gradient-text' : ''">{{ statistics.linkRage && statistics.linkRage !== EMPTY_STRING ? statistics.linkRage + '%' : EMPTY_STRING + '%'
        }}</b></span>
        </div>
      </hl-group>

      <hl-group
        class="item"
        :class="isOldMode ? 'p-md' : ''"
        :align="isOldMode ? 'items-between items-middle' : 'items-center items-middle'"
        :dir="isOldMode ? '' : 'vertical'"
        :gap="isOldMode ? '' : 'var(--xs)'">
        <span class="standard-text">待调度</span>
        <div class="stat-number">
          <span :class="isOldMode ? '' : 'm-t-xxs'"><b class="font-xxl m-r-xxs" :class="isOldMode ? 'gradient-text' : ''">{{ statistics.preDispatchNum }}</b>件</span>
        </div>
      </hl-group>

      <hl-group
        class="item"
        :class="isOldMode ? 'p-md' : ''"
        :align="isOldMode ? 'items-between items-middle' : 'items-center items-middle'"
        :dir="isOldMode ? '' : 'vertical'"
        :gap="isOldMode ? '' : 'var(--xs)'">
        <span class="standard-text">处置中</span>
        <div class="stat-number">
          <span :class="isOldMode ? '' : 'm-t-xxs'"><b class="font-xxl m-r-xxs" :class="isOldMode ? 'gradient-text' : ''">{{ statistics.disposalNum }}</b>件</span>
        </div>
      </hl-group>

      <hl-group
        class="item"
        :class="isOldMode ? 'p-md' : ''"
        :align="isOldMode ? 'items-between items-middle' : 'items-center items-middle'"
        :dir="isOldMode ? '' : 'vertical'"
        :gap="isOldMode ? '' : 'var(--xs)'">
        <span class="standard-text">已办结</span>
        <div class="stat-number">
          <span :class="isOldMode ? '' : 'm-t-xxs'"><b class="font-xxl m-r-xxs" :class="isOldMode ? 'gradient-text' : ''">{{ statistics.completedNum }}</b>件</span>
        </div>
      </hl-group>

      <hl-group
        class="item"
        :class="isOldMode ? 'p-md' : ''"
        :align="isOldMode ? 'items-between items-middle' : 'items-center items-middle'"
        :dir="isOldMode ? '' : 'vertical'"
        :gap="isOldMode ? '' : 'var(--xs)'">
        <span class="standard-text">已超时</span>
        <div class="stat-number" :class="isOldMode ? '' : 'red'">
          <span :class="isOldMode ? '' : 'm-t-xxs'"><b class="font-xxl m-r-xxs" :class="isOldMode ? 'gradient-text' : ''">{{ statistics.overTimeNum }}</b>件</span>
        </div>
      </hl-group>

      <hl-group
        class="item"
        :class="isOldMode ? 'p-md' : ''"
        :align="isOldMode ? 'items-between items-middle' : 'items-center items-middle'"
        :dir="isOldMode ? '' : 'vertical'"
        :gap="isOldMode ? '' : 'var(--xs)'">
        <span class="standard-text">超时率</span>
        <div class="stat-number" :class="isOldMode ? '' : 'red'">
          <span :class="isOldMode ? '' : 'm-t-xxs'"><b class="font-xxl m-r-xxs" :class="isOldMode ? 'gradient-text' : ''">{{ statistics.overTimeRate }}</b>%</span>
        </div>
      </hl-group>

    </hl-group>
    <hl-group class="item-list" :dir="isOldMode ? 'vertical' : ''" gap="var(--md)" v-if="searchParams.eventStatus === WAITING">

      <hl-group
        class="item"
        :class="isOldMode ? 'p-md' : ''"
        :align="isOldMode ? 'items-between items-middle' : 'items-center items-middle'"
        :dir="isOldMode ? '' : 'vertical'"
        :gap="isOldMode ? '' : 'var(--xs)'">
        <span class="standard-text">待调度</span>
        <div class="stat-number">
          <span :class="isOldMode ? '' : 'm-t-xxs'"><b class="font-xxl m-r-xxs" :class="isOldMode ? 'gradient-text' : ''">{{ statistics.preDispatchNum }}</b>件</span>
        </div>
      </hl-group>

      <hl-group
        class="item"
        :class="isOldMode ? 'p-md' : ''"
        :align="isOldMode ? 'items-between items-middle' : 'items-center items-middle'"
        :dir="isOldMode ? '' : 'vertical'"
        :gap="isOldMode ? '' : 'var(--xs)'">
        <span class="standard-text">调度未超时</span>
        <div class="stat-number">
          <span :class="isOldMode ? '' : 'm-t-xxs'"><b class="font-xxl m-r-xxs" :class="isOldMode ? 'gradient-text' : ''">{{ statistics.nonTimeoutNum }}</b>件</span>
        </div>
      </hl-group>

      <hl-group
        class="item"
        :class="isOldMode ? 'p-md' : ''"
        :align="isOldMode ? 'items-between items-middle' : 'items-center items-middle'"
        :dir="isOldMode ? '' : 'vertical'"
        :gap="isOldMode ? '' : 'var(--xs)'">
        <span class="standard-text">调度已超时</span>
        <div class="stat-number" :class="isOldMode ? '' : 'red'">
          <span :class="isOldMode ? '' : 'm-t-xxs'"><b class="font-xxl m-r-xxs" :class="isOldMode ? 'gradient-text' : ''">{{ statistics.timeoutNum }}</b>件</span>
        </div>
      </hl-group>

      <hl-group
        class="item"
        :class="isOldMode ? 'p-md' : ''"
        :align="isOldMode ? 'items-between items-middle' : 'items-center items-middle'"
        :dir="isOldMode ? '' : 'vertical'"
        :gap="isOldMode ? '' : 'var(--xs)'">
        <span class="standard-text">调度超时率</span>
        <div class="stat-number" :class="isOldMode ? '' : 'red'">
          <span :class="isOldMode ? '' : 'm-t-xxs'"><b class="font-xxl m-r-xxs" :class="isOldMode ? 'gradient-text' : ''">{{ statistics.timeoutRate }}</b>%</span>
        </div>
      </hl-group>

    </hl-group>
    <hl-group class="item-list" :dir="isOldMode ? 'vertical' : ''" gap="var(--md)" v-if="searchParams.eventStatus === PENDING">

      <hl-group
        class="item"
        :class="isOldMode ? 'p-md' : ''"
        :align="isOldMode ? 'items-between items-middle' : 'items-center items-middle'"
        :dir="isOldMode ? '' : 'vertical'"
        :gap="isOldMode ? '' : 'var(--xs)'">
        <span class="standard-text">处置中</span>
        <div class="stat-number">
          <span :class="isOldMode ? '' : 'm-t-xxs'"><b class="font-xxl m-r-xxs" :class="isOldMode ? 'gradient-text' : ''">{{ statistics.handlingNum }}</b>件</span>
        </div>
      </hl-group>

      <hl-group
        class="item"
        :class="isOldMode ? 'p-md' : ''"
        :align="isOldMode ? 'items-between items-middle' : 'items-center items-middle'"
        :dir="isOldMode ? '' : 'vertical'"
        :gap="isOldMode ? '' : 'var(--xs)'">
        <span class="standard-text">处置未超时</span>
        <div class="stat-number">
          <span :class="isOldMode ? '' : 'm-t-xxs'"><b class="font-xxl m-r-xxs" :class="isOldMode ? 'gradient-text' : ''">{{ statistics.handleNotOverTimeNum }}</b>件</span>
        </div>
      </hl-group>

      <hl-group
        class="item"
        :class="isOldMode ? 'p-md' : ''"
        :align="isOldMode ? 'items-between items-middle' : 'items-center items-middle'"
        :dir="isOldMode ? '' : 'vertical'"
        :gap="isOldMode ? '' : 'var(--xs)'">
        <span class="standard-text">处置已超时</span>
        <div class="stat-number" :class="isOldMode ? '' : 'red'">
          <span :class="isOldMode ? '' : 'm-t-xxs'"><b class="font-xxl m-r-xxs" :class="isOldMode ? 'gradient-text' : ''">{{ statistics.handleOverTimeNum }}</b>件</span>
        </div>
      </hl-group>

      <hl-group
        class="item"
        :class="isOldMode ? 'p-md' : ''"
        :align="isOldMode ? 'items-between items-middle' : 'items-center items-middle'"
        :dir="isOldMode ? '' : 'vertical'"
        :gap="isOldMode ? '' : 'var(--xs)'">
        <span class="standard-text">处置超时率</span>
        <div class="stat-number" :class="isOldMode ? '' : 'red'">
          <span :class="isOldMode ? '' : 'm-t-xxs'"><b class="font-xxl m-r-xxs" :class="isOldMode ? 'gradient-text' : ''">{{ statistics.handleOverTimeRate }}</b>%</span>
        </div>
      </hl-group>

    </hl-group>
    <hl-group class="item-list" :dir="isOldMode ? 'vertical' : ''" gap="var(--md)" v-if="searchParams.eventStatus === FINISHED">

      <hl-group
        class="item"
        :class="isOldMode ? 'p-md' : ''"
        :align="isOldMode ? 'items-between items-middle' : 'items-center items-middle'"
        :dir="isOldMode ? '' : 'vertical'"
        :gap="isOldMode ? '' : 'var(--xs)'">
        <span class="standard-text">已办结</span>
        <div class="stat-number">
          <span :class="isOldMode ? '' : 'm-t-xxs'"><b class="font-xxl m-r-xxs" :class="isOldMode ? 'gradient-text' : ''">{{ statistics.completedNum }}</b>件</span>
        </div>
      </hl-group>

      <hl-group
        class="item"
        :class="isOldMode ? 'p-md' : ''"
        :align="isOldMode ? 'items-between items-middle' : 'items-center items-middle'"
        :dir="isOldMode ? '' : 'vertical'"
        :gap="isOldMode ? '' : 'var(--xs)'">
        <span class="standard-text">办结率</span>
        <div class="stat-number">
          <span :class="isOldMode ? '' : 'm-t-xxs'"><b class="font-xxl m-r-xxs" :class="isOldMode ? 'gradient-text' : ''">{{ statistics.completedRate }}</b>%</span>
        </div>
      </hl-group>
      <hl-group
        class="item"
        :class="isOldMode ? 'p-md' : ''"
        :align="isOldMode ? 'items-between items-middle' : 'items-center items-middle'"
        :dir="isOldMode ? '' : 'vertical'"
        :gap="isOldMode ? '' : 'var(--xs)'">
        <span class="standard-text">超时办结</span>
        <div class="stat-number">
          <span :class="isOldMode ? '' : 'm-t-xxs'"><b class="font-xxl m-r-xxs" :class="isOldMode ? 'gradient-text' : 'red'">{{ statistics.timeoutNum }}</b>件</span>
        </div>
      </hl-group>

      <hl-group
        class="item"
        :class="isOldMode ? 'p-md' : ''"
        :align="isOldMode ? 'items-between items-middle' : 'items-center items-middle'"
        :dir="isOldMode ? '' : 'vertical'"
        :gap="isOldMode ? '' : 'var(--xs)'">
        <span class="standard-text">超时办结率</span>
        <div class="stat-number">
          <span :class="isOldMode ? '' : 'm-t-xxs'"><b class="font-xxl m-r-xxs" :class="isOldMode ? 'gradient-text' : 'red'">{{ statistics.timeoutRate }}</b>%</span>
        </div>
      </hl-group>

    </hl-group>
    <div class="corner-bottom"></div>
  </hl-group>
</template>

<script lang='ts' setup>
import { ref, computed } from 'vue';
import underLine from '@/assets/images/eventStat/underline.png';
import { apiIndexPageObj as api, apiIndexPagePendingObj as apiPending, apiIndexPageFinishedObj as apiFinished, apiIndexPageWaitingObj } from '@/apis';
import { useGlobalState } from '@/hooks';
import { IgetOverviewSpace } from '@/apis/modules/index-page/model';
import {
  ALL,
  WAITING,
  PENDING,
  FINISHED
} from '@/views/event-center/constant';
import { Indexable } from 'fx-front-utils';
import { EMPTY_STRING } from '@/common';
import { GlobalAPI } from '@/common';

const { isHeaderStat } = JSON.parse(GlobalAPI.config.DISPLAY_MODE);

const { searchParams } = useGlobalState({
  handleWatch: (params: any) => {
    getOverview(params);
  }
});

const isOldMode = computed(() => {
  return isHeaderStat !== 'true';
});

const statistics = ref<IgetOverviewSpace.Data>({} as IgetOverviewSpace.Data);

const handleApi: Indexable<any> = {
  all: api.getOverview.bind(api),
  [WAITING]: apiIndexPageWaitingObj.postOverview.bind(apiIndexPageWaitingObj),
  [PENDING]: apiPending.postStat.bind(apiPending),
  [FINISHED]: apiFinished.postEndStat.bind(apiFinished),
};

const getOverview = async (params: any) => {
  let func;
  if (params.eventStatus === '') {
    func = handleApi.all;
  } else {
    func = handleApi[params.eventStatus];
  }
  const res = await func(params);
  statistics.value = res.data;
};

getOverview(searchParams);

</script>

<style lang="scss" scoped>
.stat-panel {
  h4 {
    text-align: center;
  }

  img {
    width: 97%;
  }

  .item {
    background-image: url('@/assets/images/eventStat/bg.png');
    background-size: contain;
    background-repeat: no-repeat;
    height: calc(var(--xxl) * 1.25);
  }
}
</style>
