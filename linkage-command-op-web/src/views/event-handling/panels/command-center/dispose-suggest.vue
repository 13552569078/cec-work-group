<template>
  <div class="dispose-suggest-tab h-full">
    <div
      v-for="item in buttons"
      :key="item"
      class="button"
      :style="{backgroundImage: `url(${item.bgImgName})`}"
    >
      <div @click="showDialog(item)">
        <span class="name">{{ item.name }}</span>
        <span class="count">{{ item.total }}</span>
      </div>
    </div>
    <assist-plan-list-dlg v-if="isShow.assistPlanListDlg" @cancel="closeAssistPlanListDlg" @showAddDlg="showAddDlg" />
    <add-assist-plan-dlg v-if="isShow.showAddPlanDlg" @cancel="isShow.showAddPlanDlg = false" @ok="afterCreateAssist" />
    <comment-advice-dlg
      v-if="commentAdviceDlgType"
      :type="commentAdviceDlgType"
      :eventId="currentEvent.id"
      @cancel="commentAdviceDlgType=false;getAdviceStat(currentEvent);"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useCurrentEvent, useDataRefresher } from '@/hooks';
import assistPlanBg from '@/assets/images/event-handling/left-2/assist-plan-bg.png';
import expertSuggestBg from '@/assets/images/event-handling/left-2/expert-suggest-bg.png';
import departmentSuggestBg from '@/assets/images/event-handling/left-2/department-suggest-bg.png';
import { apiDisposeSuggestObj } from '@/apis/modules/dispose-suggest';
import { AssistPlanListDlg, AddAssistPlanDlg } from './dispose-suggest/index';
import CommentAdviceDlg from './components/comment-advice-dlg/index.vue';

import type { IgetAdviceStatSpace } from '@/apis/modules/dispose-suggest/model';
import type { IpostFindEventDetailByIdSpace } from '@/apis/modules/event-condition/model';

const buttons = reactive([
  {
    name: '辅助决策方案',
    total: 0,
    showFlag: false,
    type: 1,
    bgImgName: assistPlanBg,
  },
  {
    name: '专家建议',
    total: 0,
    showFlag: false,
    type: 2,
    bgImgName: expertSuggestBg,
  },
  {
    name: '部门建议',
    total: 0,
    showFlag: false,
    type: 3,
    bgImgName: departmentSuggestBg,
  },
]);
const isShow = reactive({
  assistPlanListDlg: false,
  commentAdviceDlg: false,
  showAddPlanDlg: false,
});
const commentAdviceDlgType = ref('');

const showDialog = (item: typeof buttons[number]) => {
  switch (item.type) {
    case 1:
      isShow.assistPlanListDlg = true;
      break;
    case 2:
      isShow.commentAdviceDlg = true;
      commentAdviceDlgType.value = 'expert';
      break;
    case 3:
      isShow.commentAdviceDlg = true;
      commentAdviceDlgType.value = 'department';
      break;
    case 4:
      isShow.showAddPlanDlg = true;
      break;
    default:
      break;
  }
};

const showAddDlg = (item: typeof buttons[number]) => {
  showDialog(item);
};

const getAdviceStat = async(event: IpostFindEventDetailByIdSpace.Data) => {
  const result = await apiDisposeSuggestObj.getAdviceStat(event.id as string);
  buttons[0].total = result.data.decisionNum;
  buttons[1].total = result.data.expertAdviceNum;
  buttons[2].total = result.data.departmentAdviceNum;
};

const closeAssistPlanListDlg = () => {
  isShow.assistPlanListDlg = false;
  getAdviceStat(currentEvent);
};
const afterCreateAssist = () => {
  isShow.showAddPlanDlg = false;
  getAdviceStat(currentEvent);
};

const { currentEvent } = useCurrentEvent(getAdviceStat);

useDataRefresher(() => {
  getAdviceStat(currentEvent);
});
</script>
<style lang="scss" scoped>
.dispose-suggest-tab {
  width: 100%;
  height: 100%;
  padding-bottom: calc(var(--xxs) * 3);
  position: relative;
  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: calc(var(--xxs) * 22);
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
    margin-top: var(--xxs);
    div {
      display: flex;
      align-items: flex-end;
      width: calc(var(--xxs) * 33.5);
      justify-content: space-between;
      margin-left: calc(var(--xxs) * 8.5);
      margin-top: calc(var(--xxs) * -6);
      cursor: pointer;
      .name {
        height: calc(var(--xxs) * 5.5);
        font-size: var(--font-lg);
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 1.375;
      }
      .count {
        font-size: var(--font-xxxl);
        font-family: Impact;
        color: #fff;
        line-height: 1.21;
      }
    }
  }
}
</style>
