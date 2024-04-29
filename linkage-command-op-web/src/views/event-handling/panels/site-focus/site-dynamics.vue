<template>
  <div class="site-dynamics-tab h-full display-flex flex-col">
    <div class="buttons">
      <button-tabs :tabs="buttons" @click="clickButton" />
    </div>
    <hl-scrollbar ref="scrollbarRef" class="self-grow" @at-end="getEventDynamic(currentEvent, false)">
      <hl-timeline v-if="dynamicList && dynamicList.length > 0" class="p-md">
        <hl-timeline-item v-for="(i,index) in dynamicList" :key="i" hide-timestamp :active="index==0">
          <hl-group dir="vertical" full="full-x">
            <hl-group full="full-x" class="m-b-sm">
              <div>
                <span class="self-full title font-bold">{{ i.processState === '现场'? '现场反馈' : i.title }}</span>
                <span class="tag">{{ i.processState }}</span>
              </div>
              <span class="self-no-full time">{{ i.happenedTime }}</span>
            </hl-group>
            <hl-group dir="vertical" full="full-x" class="dynamic-content p-y-xs p-x-sm">
              <template v-if="i.processState === '现场'">
                <span v-html="JSON.parse(i.content).content" class="p-b-xs" style="word-break:break-all;"></span>
                <hl-group full gap="var(--xs)" class="p-b-xs">
                  <file-card v-for="img in JSON.parse(JSON.parse(i.content)?.image || '[]') || []" :key="img.url" :url="img.url" />
                </hl-group>
                <div class="m-b-xs">
                  <hl-icon class="m-r-xxs">
                    <fill-map/>
                  </hl-icon>
                  {{JSON.parse(i.content)?.location}}</div>
              </template>
              <span v-else v-html="i.content" class="p-b-xs" style="word-break:break-all;"></span>
              <div class="p-t-xs dynamic-users">
              <span v-for="u in i.users" :key="u.id" class="display-inline-flex items-middle">
                <img src="@/assets/images/common/people-icon.png" style="width:var(--md);" alt="" class="m-r-xxs">
                <span class="user-name">{{ u.name }}-{{ u.deport }}</span>
              </span>
              </div>
            </hl-group>
          </hl-group>
        </hl-timeline-item>
      </hl-timeline>
      <hb-empty v-else :image="NoDataImg"></hb-empty>
      <div class="text-center" v-if="isLoading">加载中...</div>
    </hl-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { inject, ref, onMounted, reactive, watch } from 'vue';
import { ExpandableCardParamsKey } from '@/common';
import { ExpandableCardParams } from '@/types';
import { FileCard, ButtonTabs } from '@/components';
import { useCurrentEvent, useDataRefresher } from '@/hooks';
import { IpostFindEventDetailByIdSpace, IpostListForDataViewSpace } from '@/apis/modules/event-condition/model';
import { apiEventConditionObj } from '@/apis/modules/event-condition';
import NoDataImg from '@/assets/images/empty/no-data.png';

const { right2: expandable } = inject<ExpandableCardParams>(ExpandableCardParamsKey)!;

const scrollbarRef = ref();
const buttons = [
  { label: '全部', value: ['SCENE', 'ASSEMBLE'] },
  { label: '现场反馈', value: ['SCENE'] },
  { label: '集结动态', value: ['ASSEMBLE'] },
];
const activeButton = ref<string[]>(buttons[0].value);
const dynamicList = ref<IpostListForDataViewSpace.List[]>([]);
const pagination = reactive({
  pageSize: 20,
  page: 1,
});
const hasMore = ref(true);
const isLoading = ref(false);

const clickButton = (v: string[]) => {
  activeButton.value = v;
  getEventDynamic(currentEvent);
};

const getEventDynamic = async(event: IpostFindEventDetailByIdSpace.Data, isFirstLoad: boolean = true) => {
  if (isFirstLoad) {
    dynamicList.value = [];
    hasMore.value = true;
    pagination.page = 1;
    isLoading.value = false;
  }

  if (isLoading.value || !hasMore.value) return;
  isLoading.value = true;
  const params = {
    eventId: event.id,
    currentPage: pagination.page,
    pageSize: pagination.pageSize,
    typeCodes: activeButton.value
  };
  const res = await apiEventConditionObj.postListForDataView(params);
  dynamicList.value = dynamicList.value.concat(res.data.list || []);
  if (res.data.totalPage <= 1 || pagination.page >= res.data.totalPage) {
    hasMore.value = false;
  }
  isLoading.value = false;
  pagination.page++;
};

watch(expandable, () => {
  scrollbarRef.value.update();
}, {
  flush: 'post'
});

const { currentEvent } = useCurrentEvent(getEventDynamic);

useDataRefresher(() => {
  getEventDynamic(currentEvent);
});
</script>

<style lang="scss" scoped>
.site-dynamics-tab {
  word-break: break-all;
  .buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .button {
      width: calc(var(--xxs) * 33);
      height: calc(var(--xxs) * 8);
      border-radius: calc(var(--xxs) * 0.5);
      font-size: var(--font-lg);
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
    }
    .button.active-button {
      background-image: url('@/assets/images/button/button-active.png');
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
    }
  }
  .hl-scrollbar {
    background-color: rgba(0,158,247,0.12);
    margin-top: calc(var(--xxs) * 4);
    .hl-timeline {
      .title {
        font-size: var(--font-lg);
        line-height: 1.5;
      }
      .tag {
        background: rgba(113, 248, 252, 0.24);
        border-radius: calc(var(--xxs) * 0.5);
        font-size: var(--font-sm);
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #71F8FC;
        margin-left: calc(var(--xxs) * 2);
        padding: calc(var(--xxs) * 0.5) calc(var(--xxs) * 1.5);
      }
      .time {
        font-size: var(--font-md);
      }
      .dynamic-content {
        font-size: var(--font-md);
        line-height: 1.7143;
        background-color: rgba(28,77,133,0.2);
        .dynamic-users {
          border-top: 1px solid #0E3D6C;
          text-align: right;
        }
      }
    }
  }
}
</style>
