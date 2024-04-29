<template>
  <hl-group class="stat-panel display-flex items-between" gap="var(--md)" v-if="currentName === 'event-center'">
    <hl-group class="stat-item display-flex items-around" dir="vertical" align="items-middle"
      :class="{ 'active': searchParams.eventStatus === ALL }" @click="changeEventStatus(ALL)">
      <div class="title text-center">
        接入事件
        <div class="text text1 m-t-xxl">{{ statusAnalysis.eventNum }}</div>
      </div>
    </hl-group>
    <hl-group class="stat-item display-flex items-around" dir="vertical" align="items-middle"
      :class="{ 'active': searchParams.eventStatus === PENDING }" @click="changeEventStatus(PENDING)">
      <div class="title text-center">待调度
        <div class="text text2 m-t-xxl">{{ statusAnalysis.dispatchNum }}</div>
      </div>
    </hl-group>
    <hl-group class="stat-item display-flex items-around" dir="vertical" align="items-middle"
      :class="{ 'active': searchParams.eventStatus === WAITING }" @click="changeEventStatus(WAITING)">
      <div class="title text-center">处置中
        <div class="text text2 m-t-xxl">{{ statusAnalysis.dealingNum }}</div>
      </div>
    </hl-group>
    <hl-group class="stat-item display-flex items-around" dir="vertical" align="items-middle"
      :class="{ 'active': searchParams.eventStatus === FINISHED }" @click="changeEventStatus(FINISHED)">
      <div class="title text-center">已办结
        <div class="text text4 m-t-xxl">{{ statusAnalysis.endNum }}</div>
      </div>
    </hl-group>
  </hl-group>
</template>

<script lang="ts" setup>
import { reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { pick } from 'lodash-es';
import { useGlobalState } from '@/hooks';
import { ALL, WAITING, PENDING, FINISHED } from '@/views/event-center/constant';
import { apiFactorManagementObj } from '@/apis';
import { IgetEventStatusAnalysisSpace } from '@/apis/modules/dy-factor-management/model';

const router = useRouter();

// 要素分析 卡片统计
const statusAnalysis = reactive<IgetEventStatusAnalysisSpace.Data>({
  'dealingNum': 0,
  'dispatchNum': 0,
  'endNum': 0,
  'eventNum': 0
});

const currentName = computed(() => {
  return router.currentRoute.value.name;
});

const getData = async (params:any) => {
  const searchParams = pick(params, 'startTime', 'endTime', 'district');
  const { data } = await apiFactorManagementObj.getEventStatusAnalysis(searchParams.district, searchParams.startTime, searchParams.endTime);
  Object.assign(statusAnalysis, data);
};

const changeEventStatus = (eventStatus: string) => {
  searchParams.eventStatus = eventStatus;
};

const { searchParams } = useGlobalState({
  handleWatch: (params: any) => {
    getData({ ...params });
  },
  immediate: true,
});
</script>

<style lang="scss" scoped>
.stat-panel {
  width: calc(var(--xxs) * 601/4);
  height: calc(var(--xxs) * 128/4);
  background-image: url('@/assets/images/deyang/header/sub-header.png');
  background-size: 100% 100%;
  padding: 0 calc(var(--xxs) * 18/4);

  .stat-item {
    width: calc(var(--xxs) * 133/4);
    // height: calc(var(--xxs) * 122/4);
    // padding:calc(var(--xxs) * 31/4) calc(var(--xxs) * 16/4);

    &.active {
      background-image: url('@/assets/images/deyang/header/stat-active.png');
      background-size: 100% 100%;
    }

    .title {
      font-size: calc(var(--xxs) * 18/4);
      font-family: PingFangSC, PingFang SC;
      font-weight: normal;
      color: #FFFFFF;
      line-height: 14px;
      color: #ffffff;
      font-weight: bold;
    }

    .text {
      font-size: calc(var(--xxs) * 38/4);
      ;
      font-family: PangMenZhengDao;
      color: #4CFBFF;
      cursor: pointer;
      margin-top: calc(var(--xxs) * 14/4);

      &.text1 {
        color: #4CFBFF;
      }

      &.text2 {
        color: #FEF897;
      }

      &.text3 {
        color: #FFC120;
      }

      &.text4 {
        color: #7DFFA0;
      }
    }
  }
}
</style>
