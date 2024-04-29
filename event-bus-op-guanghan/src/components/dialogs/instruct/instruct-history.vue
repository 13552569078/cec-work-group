<template>
  <common-dialog title="指令历史" width="calc(var(--xl) * 20)" @close="$emit('close')">
    <hl-group class="w-full" gap="var(--md)" dir="vertical">
      <hl-group align="items-middle">
        <span class="static m-r-md">时间选择</span>
        <hl-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          block
          :clearable="false"
          @change="fetchData"
        />
      </hl-group>
      <hl-group gap="var(--md)" class="w-full">
        <hl-group align="items-middle" style="width: 40%">
          <span class="static m-r-md">指令状态</span>
          <hl-group>
            <hl-select v-model="searchParams.commandStatus" clearable>
              <hl-option v-for="option in options" :key="option.label" :label="option.label" :value="option.value" />
            </hl-select>
          </hl-group>
        </hl-group>
        <hl-group align="items-middle" style="width: 60%" full>
          <span class="static m-r-md">事件编号</span>
          <hl-group>
            <hl-input v-model="searchParams.eventCode" placeholder="请输入内容" class="w-full"/>
          </hl-group>
        </hl-group>
      </hl-group>
    </hl-group>
    <template v-if="historyList.length">
      <hl-scrollbar :style="`height: calc(var(--xl) * 15);`" class="m-t-lg">
        <hl-group v-for="(item, index) in historyList" :key="index" class="event-list w-full" dir="vertical" style="position: relative" :style="`height: calc(var(--xl) * 3.2);background-size:cover;`">
          <hl-group class="event-top cursor-pointer" align="items-between" @click="handleShowDetail(item)">
            <hl-group align="items-middle">
              <div class="event-index">
                {{ index + 1 }}
              </div>
              <hl-popover placement="bottom" :content="item.title" :disabled="item.title?.length < 22" trigger="hover" popper-style="--popover-bg-color:rgba(14,23,38,0.96);">
                <template #reference>
                  <span class="event-title ellipsis m-l-md">
                    {{ item.title }}
                  </span>
                </template>
              </hl-popover>
            </hl-group>
            <hl-group class="p-r-md" align="items-middle">
              {{ item.commandTime }}
            </hl-group>
          </hl-group>
          <hl-group class="event-middle m-t-md p-l-md p-r-md cursor-pointer" align="items-middle">
            <hl-group>
              <span class="label">接收人：</span>
              <span class="label-con">{{ item.receiveUserName }}</span>
            </hl-group>
            <hl-group>
              <span class="label">事件编号：</span>
              <span class="label-con">{{ item.eventCode }}</span>
            </hl-group>
            <hl-group>
              <span class="label-state" :class="[item?.commandStatus === 1 ? 'count-green' : 'count-red']">{{ item.commandStatusName }}</span>
            </hl-group>
          </hl-group>

        </hl-group>
      </hl-scrollbar>
      <hl-group dir="horizontal" class="page-content m-t-lg w-full" align="items-between">
        <hl-group align="items-middle">
          <span>事件数/</span>
          <span class="page-count">{{ total }}</span>
          件
        </hl-group>
        <hl-pagination size="sm" hide-on-single-page :current-page="currentPage" :page-size="pageSize" layout="prev, pager, next" :total="total" align="items-between" @size-change="handleSizeChange" @current-change="handleCurrentChange"> </hl-pagination>
      </hl-group>
    </template>
    <hl-group v-else :style="`height: calc(var(--xl) * 17.3);`" full>
      <hb-empty image-size="0" description="暂无数据" />
    </hl-group>
  </common-dialog>

  <!-- 弹窗：指令历史 -->
  <instruct-detail v-if="instructDetailVisiable" @close="instructDetailVisiable = false" :instruct-Id="instructId" />
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { cloneDeep } from 'lodash-es';
import dayjs from 'dayjs';
import { GlobalAPI } from '@/common/global-api';
import { DEFAULT_SET_TIME, getQuarterAndMonthTime } from '@/common';
import { apiInstructObj } from '@/apis/modules/instruct';
import { IpostHistorySpace } from '@/apis/modules/instruct/model';
import { useGlobalState } from '@/hooks';

const { userInfo, currentEventCode } = useGlobalState();

const historyList = ref<IpostHistorySpace.List[]>([]);
const total = ref(0);
const pageSize = ref(10);
const currentPage = ref(1);

const instructId = ref();

const instructDetailVisiable = ref(false);
// 初始化搜索时间,默认为当年当月
const initTime = [
  dayjs().add(-30, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
  dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')
];
const dateRange = ref<string[]>(initTime);

const searchParams = ref({
  startTime: dateRange.value[0],
  endTime: dateRange.value[1],
  commandStatus: '',
  userId: userInfo?.id || JSON.parse(GlobalAPI.config.DEFAULT_USER).id,
  eventCode: currentEventCode.value
});

// 指令状态
const options = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '待反馈',
    value: 0
  },
  {
    label: '已反馈',
    value: 1
  }
];

watch(
  searchParams,
  () => {
    currentPage.value = 1;
    fetchData();
  },
  {
    deep: true
  }
);

const handleShowDetail = (data: IpostHistorySpace.List) => {
  instructId.value = data.id;
  instructDetailVisiable.value = true;
};
const handleSizeChange = () => {
  fetchData();
};
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  fetchData();
};
const fetchData = async () => {
  if (dateRange.value) {
    searchParams.value.startTime = dateRange.value[0];
    searchParams.value.endTime = dateRange.value[1];
  }
  const params = {
    ...searchParams.value,
    pageSize: pageSize.value,
    pageNum: currentPage.value
  };
  const { data } = await apiInstructObj.postHistory(params);
  total.value = data.totalRow;
  historyList.value = data.list;
};

fetchData();
</script>

<style lang="scss" scoped>
.page-content {
  justify-content: space-between;
  font-size: calc(var(--xl) * 0.48);
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  .page-count {
    color: #36b7ff;
  }
}
.count-green {
  color: #19ecad;
}
.count-red {
  color: #ff4b00;
}
</style>
