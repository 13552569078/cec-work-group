<template>
  <div class="site-personnel-tab h-full display-flex flex-col">
    <div v-show="!expandable" class="buttons">
      <div
        v-for="item in buttons"
        :key="item"
        class="button"
        :class="item.class"
        @click="openUserListDlg(item)"
      >
        <div class="total big-num">
          {{ item.total }}
        </div>
        <div class="txt font-16">
          {{ item.name }}({{item.unit}})
        </div>
      </div>
    </div>
    <div v-show="!eventIsFinished && !expandable" class="add-button">
      <hl-button size="md" type="primary" class="m-r-md" @click="addAssemblepoint">创建集结点</hl-button>
      <hl-button size="md" type="primary" @click="addAssembleInstruct">创建集结指令</hl-button>
    </div>
    <hl-scrollbar class="self-grow">
      <assemble-point-list
        v-if="!expandable"
        ref="assemblePointListRef"
        @update="getAssimbleStat(currentEvent)"
        @show-users="openUserListDlgByPoint"
      />
      <assemble-instruct-list
        v-if="expandable"
        @update="getAssimbleStat(currentEvent)"
      />
    </hl-scrollbar>
    <create-assemble-instruct-dlg
      v-if="showCreateAssembleInstructDlg"
      @cancel="showCreateAssembleInstructDlg = false"
      @ok="getAssimbleStat(currentEvent)"
    />
    <assemble-user-list-dlg
      v-if="showUserListDlg"
      :tab="userTab"
      :id="assemblePointId"
      @cancel="showUserListDlg = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { inject, reactive, ref, watch } from 'vue';
import { HlMessage } from 'hongluan-ui';
import { CreateAssemblePointParamsKey, ExpandableCardParamsKey } from '@/common';
import { CreateAssemblePointParams, ExpandableCardParams } from '@/types';
import { useCurrentEvent, useDataRefresher, useMapLayer } from '@/hooks';
import { apiSitePersonnelObj } from '@/apis/modules/site-personnel';
import { IpostFindEventDetailByIdSpace } from '@/apis/modules/event-condition/model';
import AssemblePointList from './site-personnel/assemble-point-list.vue';
import AssembleInstructList from './site-personnel/assemble-instruct-list.vue';
import AssembleUserListDlg from './site-personnel/assemble-user-list-dlg.vue';
import CreateAssembleInstructDlg from './site-personnel/create-assemble-instruct-dlg/index.vue';
import type { IpostFindCommandCenterAssemblePointListSpace } from '@/apis/modules/site-personnel/model';

const { waitingRefreshLayerMarkers } = useMapLayer();

const { right2: expandable } = inject<ExpandableCardParams>(ExpandableCardParamsKey)!;
const createAssemblePointParams = inject<CreateAssemblePointParams>(CreateAssemblePointParamsKey)!;

const buttons = reactive([
  {
    name: '集结点',
    total: 0,
    class: '',
    unit: '个',
  },
  {
    name: '已集结',
    tab: 'assembled',
    total: 0,
    class: 'cursor-pointer',
    unit: '人',
  },
  {
    name: '待集结',
    tab: 'assembling',
    total: 0,
    class: 'cursor-pointer',
    unit: '人',
  },
]);
const showUserListDlg = ref(false);
const showCreateAssembleInstructDlg = ref(false);
const userTab = ref('');
const assemblePointId = ref('');
const assemblePointListRef = ref();

const getAssimbleStat = (event: IpostFindEventDetailByIdSpace.Data) => {
  apiSitePersonnelObj.postEventAssembleStat(event.id as string).then(res => {
    buttons[0].total = res.data.assemblePointNum;
    buttons[1].total = res.data.assembled;
    buttons[2].total = res.data.assembling;
  });
  assemblePointListRef.value?.getAssemblePointList(currentEvent);
};

const openUserListDlg = (item: typeof buttons[number]) => {
  if (!item.class) return;

  userTab.value = item.tab!;
  assemblePointId.value = '';
  showUserListDlg.value = true;
};
const openUserListDlgByPoint = (tab: string, item: IpostFindCommandCenterAssemblePointListSpace.Data) => {
  userTab.value = tab;
  assemblePointId.value = item.id;
  showUserListDlg.value = true;
};

const addAssemblepoint = () => {
  createAssemblePointParams.title = '创建集结点';
  createAssemblePointParams.type = 'add';
  createAssemblePointParams.show = true;
};
const addAssembleInstruct = () => {
  apiSitePersonnelObj.postWhetherAssemblePoint(currentEvent.id as string).then(res => {
    if (res.data === true) {
      showCreateAssembleInstructDlg.value = true;
    } else {
      HlMessage.warning('请先创建集结点');
    }
  });
};

watch(waitingRefreshLayerMarkers, val => { // 地图更新，删除集结点
  if (val.includes('EventAssemblePoints')) {
    getAssimbleStat(currentEvent);
  }
});

const { eventIsFinished, currentEvent } = useCurrentEvent(getAssimbleStat);
useDataRefresher(() => {
  getAssimbleStat(currentEvent);
});
</script>

<style lang="scss" scoped>
.site-personnel-tab {
  .buttons {
    position: relative;
    display: flex;
    column-gap: calc(var(--xxs) * 8);
    align-items: center;
    justify-content: space-around;
    margin-bottom: calc(var(--xxs) * 11);
    .button {
      display: flex;
      flex-direction: column;
      row-gap: calc(var(--xxs) * 1.5);
      align-items: center;
      .total {
        display: flex;
        justify-content: center;
        background: url("@/assets/images/event-handling/right-2/site-personnel/assemble-stat-bg.png") no-repeat center;
        background-size: 100%;
        width: calc(var(--xxs) * 16);
        height: calc(var(--xxs) * 17);
      }
      .txt {
        display: flex;
        align-items: center;
        justify-content: center;
        background: url("@/assets/images/event-handling/right-2/site-personnel/assemble-stat-txt.png") no-repeat center;
        background-size: 100%;
        width: calc(var(--xxs) * 30);
        height: calc(var(--xxs) * 10);
      }
    }
    .button:not(:last-child) {
      .total {
        color: white;
      }
    }
    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: calc(var(--xxs) * -7.5);
      width: 100%;
      height: calc(var(--xxs) * 15);
      background-image: url('@/assets/images/overview/left-1/bottom.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
  }
  .add-button {
    display: flex;
    align-items: center;
    justify-content: end;
    margin-bottom: calc(var(--xxs) * 4.5);
  }
  .summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: calc(var(--xxs) * 2);
    margin-bottom: calc(var(--xxs) * 4);
    height: calc(var(--xxs) * 11);
    .item {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 48%;
      height: calc(var(--xxs) * 11);
      padding: calc(var(--xxs) * 2.5) calc(var(--xxs) * 3) calc(var(--xxs) * 2.5) calc(var(--xxs) * 9);
      background: url("@/assets/images/event-handling/right-2/site-personnel/summary-bg.png") no-repeat center;
      background-size: 100%;
      &:before {
        position: absolute;
        left: 0;
        content: '';
        width: calc(var(--xxs) * 6);
        height: calc(var(--xxs) * 6);
        background: url("@/assets/images/event-handling/right-2/site-personnel/summary-icon.png") no-repeat center;
        background-size: 100%;
      }
      span.text {
        font-size: var(--font-lg);
        font-weight: 400;
        color: #FFFFFF;
      }
      span.number {
        font-size: var(--font-xxxl);
        font-family: Impact;
        color: #FFEA44;
      }
    }
    .assembled {
      span.number {
        color: #fff;
      }
    }
    .wait-assemble {
      span.number {
        color: #FFEA44;
      }
    }
  }
}
</style>
