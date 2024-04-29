<template>
  <div v-if="!expandable" class="collapsed h-full">
    <div class="left-part">
      <div class="task-progress">
        <div class="progress">{{ taskCompletePercent }}</div>
        <div class="text">完成进度</div>
      </div>
    </div>
    <div class="right-part">
      <div
        v-for="item in taskStateItems"
        :key="item"
        class="task-summary1 cursor-pointer"
        :style="{backgroundImage: `url(${item.bgImgName})`}"
        @click="switchExpandView(item)"
      >
        <span class="name">{{ item.name }}</span>
        <span :class="['count', `count${item.taskState}`]">{{ item.value }}</span>
      </div>
    </div>
  </div>
  <div v-else class="expanded h-full">
    <div class="top-part">
      <div
        v-for="item in taskStateItems"
        :key="item"
        :class="['task-summary2', item.taskState === activeTaskState ? 'active-card' : '']"
        @click="changeTaskState(item.taskState)"
      >
        <span :class="['count', `count${item.taskState}`]">{{ item.value }}</span>
        <span class="name">{{ item.name }}</span>
      </div>
    </div>
    <hl-scrollbar class="buttom-part">
      <hl-collapse
        v-model="collapseData.active"
        gap="var(--xxs)"
        content-padding="0"
        style="
            --form-icon-color: transparent;
            --collapse-title-bg-color-active: rgba(56, 75, 103, 0.32);
          "
        @change="val => collapseActive = val"
      >
        <hl-collapse-item v-for="item in collapseData.list" :key="item.id" :name="item.id">
          <template #title>
            <hl-group class="task-item-title" full="full-x" align="items-middle">
              <hl-group align="items-middle">
                <hl-icon size="xxxs" class="m-r-xs">
                  <fill-start :style="`transform: rotateZ(${collapseActive.includes(item.id) ? 90: 0}deg)`"/>
                </hl-icon>
                <hb-text-overflow method="length" :length="14" effect="dark">{{ item.taskTitle }}</hb-text-overflow>
              </hl-group>
              <hl-group
                class="h-full"
                align="items-middle items-right"
                gap="var(--xxs)"
                style="margin-right: calc(var(--md) * -2)"
              >
                <hl-group @click.stop="taskDynamic(item)">
                  <div class="font-sm text-primary m-r-xxs">任务动态</div>
                </hl-group>
                <hl-group @click.stop="taskDetail(item)" align="items-middle">
                  <div class="font-sm text-primary m-r-xxs">查看详情</div>
                  <hl-icon size="xxxs" type="primary">
                    <two-chevrons-right />
                  </hl-icon>
                </hl-group>
              </hl-group>
            </hl-group>
          </template>
          <hl-simple-table
            :cols="collapseData.cols"
            :data="item.taskUserInfoDetailDTOList"
            :show-header="false"
            border="borderless"
            padding="var(--md)"
            gap-y="0"
            hover
          >
            <template #orgName="{ row }">
              {{ row.orgName }}
            </template>
            <template #mobile="{ row }">
              <hl-group v-if="row.mobile" align="items-middle" class="cursor-pointer" @click="currentCallingUser=row">
                <img
                  class="icon"
                  style="width: var(--sm); height: var(--sm); margin-right: var(--xxs)"
                  :src="mobileIcon"
                >
                {{ row.mobile }}
              </hl-group>
            </template>
            <template #taskState="{ row }">
              <hl-popover placement="top" trigger="hover" :content="userStateIcons[row.taskState].text">
                <template #reference>
                  <img
                    class="icon"
                    style="width: var(--md); height: var(--md); margin-right: 0"
                    :src="userStateIcons[row.taskState].url"
                  >
                </template>
              </hl-popover>
            </template>
          </hl-simple-table>
        </hl-collapse-item>
      </hl-collapse>
      <hb-empty
        v-if="collapseData.list.length === 0"
        :image="NoDataImg"
        description="暂无数据"
      />
    </hl-scrollbar>
  </div>
  <task-detail-dlg v-if="isShow.details" :id="detailsId" @cancel="isShow.details = false" />
  <task-dynamic-dlg v-if="isShow.dynamic" :id="detailsId" @cancel="isShow.dynamic = false" />
</template>
<script setup lang="ts">
import { inject, ref, watch, reactive, nextTick } from 'vue';
import { ExpandableCardParams } from '@/types';
import { ExpandableCardParamsKey } from '@/common';
import { useCurrentEvent, useDataRefresher, useIcons, useCalling } from '@/hooks';
import { apiTaskObj } from '@/apis/modules/task';
import taskStatus1 from '@/assets/images/event-handling/right-3/task-statistics/task-status1.png';
import taskStatus2 from '@/assets/images/event-handling/right-3/task-statistics/task-status2.png';
import taskStatus5 from '@/assets/images/event-handling/right-3/task-statistics/task-status5.png';
import NoDataImg from '@/assets/images/empty/no-data.png';
import { TaskDetailDlg, TaskDynamicDlg } from './task-statistics';
import { useTaskUpdater } from './use-task-updater';

import type { IpostFindListByEventIdSpace } from '@/apis/modules/task/model';

const { left3: expandable } = inject<ExpandableCardParams>(ExpandableCardParamsKey)!;

const { userStateIcons, mobileIcon } = useIcons();
const { updateTaskTimeStamp } = useTaskUpdater();
const { currentCallingUser } = useCalling();

const isShow = reactive({
  addTask: false,
  details: false,
  dynamic: false,
});
const taskCompletePercent = ref('0%');
const taskStateItems = ref([
  {
    'taskState': 1,
    'name': '执行中',
    'value': 0,
    'rateProgress': 100,
    'bgImgName': taskStatus1,
  },
  {
    'taskState': 2,
    'name': '已完成',
    'value': 0,
    'rateProgress': 0,
    'bgImgName': taskStatus2,
  },
  {
    'taskState': 3,
    'name': '已终止',
    'value': 0,
    'rateProgress': 0,
    'bgImgName': taskStatus5,
  }
]);
const activeTaskState = ref(1); // 默认执行中
const detailsId = ref('');

const collapseActive = ref('');
const collapseData = ref({
  active: '',
  list: [] as IpostFindListByEventIdSpace.Data[],
  cols: [
    { title: '姓名', prop: 'userName', width: '8em', showTooltip: true, },
    { title: '单位', prop: 'orgName', slotName: 'orgName', showTooltip: true, },
    { title: '电话', prop: 'mobile', slotName: 'mobile', width: '10em', showTooltip: true, },
    { title: '状态', prop: 'taskState', slotName: 'taskState', align: 'right' },
  ],
});

const getStatTask = async() => {
  const res = await apiTaskObj.postProcess(currentEvent.id as string);
  taskStateItems.value.forEach(el => {
    const resObj = res.data.data.filter((r: any) => +r.code === +el.taskState);
    el.value = +resObj[0].count;
  });
  taskCompletePercent.value = `${res.data.rateProgress || 0}%`;
};

const switchExpandView = (taskItem: typeof taskStateItems.value[number]) => {
  expandable.value = true;
  changeTaskState(taskItem.taskState);
};

const changeTaskState = (state: number) => {
  activeTaskState.value = state;
  getTaskList(state, currentEvent.id as string);
};

const getTaskList = async(val: number, eventId: string) => {
  const res = await apiTaskObj.postFindListByEventId({
    eventId,
    taskState: [val],
  });
  collapseData.value.list = res.data.list;
};

const taskDynamic = (item: IpostFindListByEventIdSpace.Data) => {
  isShow.dynamic = true;
  detailsId.value = item.id || '';
};

const taskDetail = (item: IpostFindListByEventIdSpace.Data) => {
  isShow.details = true;
  detailsId.value = item.id || '';
};

const initData = () => {
  getStatTask();
  getTaskList(activeTaskState.value, currentEvent.id as string);
};

watch(updateTaskTimeStamp, val => {
  val && initData();
});

const { currentEvent } = useCurrentEvent(initData);
useDataRefresher(() => {
  initData();
});
</script>
<style lang="scss" scoped>
.collapsed {
  display: flex;
  justify-content: space-between;
  .left-part {
    width: calc(var(--xxs) * 40);
    height: calc(var(--xxs) * 50);
    .task-progress {
      width: 100%;
      height: 100%;
      background: url("@/assets/images/event-handling/right-3/task-statistics/task-progress-bg.png") no-repeat center;
      background-size: 100%;
      text-align: center;
      .progress {
        color: #72f5ac;
        font-size: calc(var(--font-xl) * 2);
        font-family: Impact;
        padding-top: calc(var(--xxs) * 5);
      }
      .text {
        font-size:var(--font-xl);
      }
    }
  }
  .right-part {
    display: flex;
    flex-direction: column;
    width: calc(var(--xxs) * 65);
    margin-top: calc(var(--xxs) * 2);
    .task-summary1 {
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: calc(var(--xxs) * 14);
      margin-top: calc(var(--xxs) * 2);
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100%;
      padding: 0 calc(var(--xxs) * 6) 0 calc(var(--xxs) * 25);
      .name {
        font-size: var(--font-lg);
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 2.625;
      }
      .count {
        font-size: var(--font-xxxl);
        font-family: Impact;
        line-height: 1.75;
      }
      .count1 {
        color: #FFEA44;
      }
      .count2 {
        color: #72F5AC;
      }
      .count3 {
        color: #B5CEE3;
      }
    }
  }
}
.expanded {
  display: flex;
  flex-direction: column;
  .top-part {
    display: flex;
    column-gap: var(--md);
    .task-summary2 {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: calc(var(--xxs) * 35);
      height: calc(var(--xxs) * 20);
      padding-top: calc(var(--xxs) * 3.5);
      background-image: url('@/assets/images/event-handling/right-3/task-statistics/task-status-bg2.png');
      background-size: 100%;
      background-repeat: no-repeat;
      background-position: center;
      background-color: #15457e;
      cursor: pointer;
      .count {
        font-size: var(--font-xxxl);
        font-family: Impact;
        line-height: 1.2;
      }
      .count1 {
        color: #FFEA44;
      }
      .count2 {
        color: #72F5AC;
      }
      .count3 {
        color: #B5CEE3;
      }
      .name {
        font-size: var(--font-lg);
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
      }
    }
    .task-summary2.active-card {
      background-image: url('@/assets/images/event-handling/right-3/task-statistics/task-status-bg1.png');
    }
  }
  .buttom-part {
    flex: 1;
    margin-top: calc(var(--xxs) * 4);
    :deep(.hl-collapse-item) {
      .item-header {
        padding: 0;
        background: url('@/assets/images/event-handling/right-2/site-personnel/list-item-title-bg.png') no-repeat center;
        background-size: 100%;
      }
      .item-wrap .item-content {
        background-color: rgba(0, 158, 247, 0.12);
      }
    }
    .task-item-title {
      padding: 0 calc(var(--xxs) * 3);
    }
  }
}
</style>
