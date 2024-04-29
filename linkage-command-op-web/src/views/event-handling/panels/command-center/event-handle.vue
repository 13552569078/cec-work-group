<template>
  <hl-group dir="vertical" full gap-y="var(--xs)">
    <response :event-response="eventResponse" @refresh="(refreshEvent) => getEventResponse(currentEvent, refreshEvent)"/>
    <hl-group full gap-x="var(--xs)">
      <div class="card-item common-card-bg">
        <div class="tips m-b-xxs">执行的策略</div>
        <div class="change-btn cursor-pointer" @click="strategyDlgVisible=true" v-if="eventResponse.eventState!=='FINISHED'"></div>
        <div class="font-bold text-ellipsis" @mouseover="showTooltip">
          {{ eventResponse.strategyName || '--' }}
        </div>
      </div>
      <div class="card-item common-card-bg">
        <div class="tips m-b-xxs">执行的预案</div>
        <div
          class="plan-txt font-bold cursor-pointer text-ellipsis"
          @mouseover="showTooltip"
          @click="eventResponse.planId && (planDlgVisible=true)"
        >{{ eventResponse.planName || '--'}}</div>
      </div>
    </hl-group>
    <hl-group full gap-x="var(--xs)">
      <div class="stat-card-item common-card-bg" @click="commentDlgVisible=true;">
        <span class="stat-num m-b-xxs cursor-pointer">{{ leaderCommentNumber }}</span>
        <span>领导批示(条)</span>
      </div>
      <div class="stat-card-item common-card-bg" @click="openOrgUserDlg('org')">
        <span class="stat-num m-b-xxs cursor-pointer">{{ eventResponse.planOrgNum || 0 }}</span>
        <span>参与单位(家)</span>
      </div>
      <div class="stat-card-item common-card-bg" @click="openOrgUserDlg('user')">
        <span class="stat-num m-b-xxs cursor-pointer">{{ eventResponse.planUserNum || 0 }}</span>
        <span>参与人员(人)</span>
      </div>
    </hl-group>
    <execute-strategy-dlg
      v-if="strategyDlgVisible"
      :event-response="eventResponse"
      @refresh="(refreshEvent) => getEventResponse(currentEvent, refreshEvent)"
      @cancel="strategyDlgVisible=false"
    />
    <digital-plan-dlg v-if="planDlgVisible" :title="eventResponse.planName" :id="eventResponse.planId" @cancel="planDlgVisible = false;" />
    <execute-org-user-dlg
      v-if="orgUserDlgVisible"
      :info="eventResponse"
      :active-tab="activeTab"
      @cancel="getEventResponse(currentEvent);orgUserDlgVisible = false;"
    />
    <comment-advice-dlg
      v-if="commentDlgVisible"
      type="leader"
      @cancel="commentDlgVisible=false;getComments(currentEvent);"
    />
  </hl-group>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCurrentEvent, useDataRefresher, useLayout, useTextOverflow } from '@/hooks';
import { DigitalPlanDlg } from '@/components';
import { apiEventResponseObj } from '@/apis/modules/event-response';
import { IpostFindEventResponseByIdSpace } from '@/apis/modules/event-response/model';
import { apiCommentAdviceStatisticsObj } from '@/apis/modules/comment-advice-statistics';
import { IpostFindEventDetailByIdSpace } from '@/apis/modules/event-condition/model';
import Response from './event-handle/response.vue';
import ExecuteStrategyDlg from './event-handle/execute-strategy-dlg.vue';
import ExecuteOrgUserDlg from './event-handle/execute-org-user-dlg/index.vue';
import CommentAdviceDlg from './components/comment-advice-dlg/index.vue';
import { useMapBuffer } from '@/hooks';

const route = useRoute();
const { setGlobalTitle } = useLayout();
const { initBuffer } = useMapBuffer();
const { showTooltip } = useTextOverflow();

const eventResponse = ref({} as IpostFindEventResponseByIdSpace.Data);
const strategyDlgVisible = ref(false);
const planDlgVisible = ref(false);
const orgUserDlgVisible = ref(false);
const activeTab = ref<string>();
const leaderCommentNumber = ref(0);
const commentDlgVisible = ref(false);

const getEventResponse = async(event: IpostFindEventDetailByIdSpace.Data, refreshEvent: boolean = false) => {
  const res = await apiEventResponseObj.postFindEventResponseByIdNew(`${event.id}`);
  eventResponse.value = res.data;
  if (refreshEvent) {
    await fetchEvent(`${event.id}`, true);
  }

  setGlobalTitle(res.data.wartimeTitle);
  initBuffer(event.longitude, event.latitude, eventResponse.value.rangeNum ? +eventResponse.value.rangeNum : undefined);
};

const openOrgUserDlg = (tab: string) => {
  orgUserDlgVisible.value = true;
  activeTab.value = tab;
};

const getComments = async(event: IpostFindEventDetailByIdSpace.Data) => {
  const params: any = {
    currentPage: 1,
    pageSize: 1,
    eventId: event.id
  };
  const res = await apiCommentAdviceStatisticsObj.postFindLeaderInstructionPage(params);
  leaderCommentNumber.value = res?.data?.totalRow || 0;
};

const loadData = (event: IpostFindEventDetailByIdSpace.Data) => {
  getEventResponse(event);
  getComments(event);
};

const { currentEvent, fetchEvent } = useCurrentEvent(loadData);

useDataRefresher(() => {
  loadData(currentEvent);
});
</script>
<style lang="scss" scoped>
.card-item {
  padding: var(--sm);
  padding-left: calc(var(--xxs) * 9);
  font-size: var(--font-lg);
  line-height: 1.375;
  position: relative;
  flex: 1;
  overflow: hidden;
  &::before {
    display: block;
    content: '';
    position: absolute;
    width: var(--lg);
    height: var(--lg);
    background-image: url(@/assets/images/event-handling/left-1/prefix-icon.png);
    background-size: 100% 100%;
    top: var(--sm);
    left: var(--xs);
  }
  .tips {
    color: #B5CEE3;
  }
  .change-btn {
    position: absolute;
    width: calc(var(--xxs) * 7);
    height: calc(var(--xxs) * 7);
    background-image: url(@/assets/images/event-handling/left-2/e-handle-change.png);
    background-size: 100% 100%;
    right: calc(var(--xxs) * 2.5);
    top: calc(var(--xxs) * 2.5);
  }
  :deep(.plan-txt) {
    color: #FFEA44;
  }
}
.stat-card-item {
  height: calc(var(--xxs) * 19);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: var(--font-lg);
  line-height: 1.375;
  .stat-num {
    font-size: var(--font-xxxl);
    line-height: 1.2084;
    font-family: Impact;
  }
}
</style>
