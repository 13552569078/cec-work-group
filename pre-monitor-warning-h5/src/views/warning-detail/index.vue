<template>
   <van-nav-bar :title="navCurTitle" style="--van-nav-bar-icon-color: var(--van-text-regular)" >
    <template #left>
      <van-icon name="arrow-left" size="18" color="var(--van-text-regular)"
        @click="$router.go(-1)" />
    </template>
  </van-nav-bar>
<div class="trend-content">
    <div class="title">{{ trend?.title }}</div>
    <van-tabs v-model:active="active" @click-tab="onClickTab" v-if="tabList&&tabList.length" color="var(--primary)" type="card">
      <van-tab v-for="(k, i) in tabList" :key="i" :title="k.targetDataName">
        <div class="table-scroll" style="height: calc(var(--xxs) * 60)">
          <hl-simple-table :cols="cols" :data="targetDatalist"
          fixed-header
          :border="'bordered'">
            <template #tableIndex="{ rowIndex }">
              <span>{{ rowIndex + 1 }}</span>
            </template>
            <template #collectTime="scope">
              <span class="collect-time">{{scope.row.collectTime}}</span>
            </template>
            <template #handle="scope">
              <a>{{scope.row.dataValue}}<span v-if="scope.row.measureUnitName">（{{ scope.row.measureUnitName }}）</span></a>
            </template>
          </hl-simple-table>
        </div>
      </van-tab>
    </van-tabs>
    <div v-else>
      暂无数据
    </div>
  </div>
  <div class="warning-content">
    <img v-if="warning?.handleStatus==='1'" src="@/assets/images/warning/disposed.png" class="handle-status"/>
    <div class="title">{{ warning?.title }}</div>
    <ul>
      <li>
        <div class="label">预警标题：</div>
        <div class="value">{{ warning?.alarmTitle || '--' }}</div>
      </li>
      <li>
        <div class="label">预警等级：</div>
        <div class="value">{{ warning?.alarmLevelName || '--'  }}</div>
      </li>
      <li>
        <div class="label">预警分类：</div>
        <div class="value">{{ warning?.eventTypeName || '--'  }}</div>
      </li>
      <li>
        <div class="label">预警时间：</div>
        <div class="value">{{ warning?.startTime || '--'  }}</div>
      </li>
      <li>
        <div class="label">预警地点：</div>
        <div class="value">{{ warning?.alarmAddress || '--'  }}</div>
      </li>
      <li>
        <div class="label">行政区划：</div>
        <div class="value">{{ warning?.areaCodeName || '--'  }}</div>
      </li>
      <li>
        <div class="label">监测主体：</div>
        <div class="value">{{ warning?.regionName || '--'  }}</div>
      </li>
      <li>
        <div class="label">监测点名称：</div>
        <div class="value">{{ warning?.monitorUnitName || '--'  }}</div>
      </li>
      <li>
        <div class="label">预警描述：</div>
        <div class="value">{{ warning?.alarmDesc || '--'  }}</div>
      </li>
    </ul>
    <div>
      <div class="attachment"  @click.stop="goAttachment">
        <TwoLink class="icon16 attachment-icon" color="#36A4FF" />附件（{{
          warning?.attachments?.length
        }}）
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { DateUtils } from "fx-front-utils";
import { HlSimpleTable } from "hongluan-ui";
import "hongluan-ui/theme/base.css";
import "hongluan-ui/theme/hl-simple-table.css";
import { apiWarningObj } from "@/apis/modules/warning";
import { IgetFindAlarmTargetDataListSpace, IgetAlarmSpace } from "@/apis/modules/warning/model";

const router = useRouter();
const route = useRoute();

const navCurTitle = ref('预警详情');

const trend = ref({
  title: '指标数据'
});

const active = ref(0);

const cols = ref([
  { title: '#', slotName: 'tableIndex' },
  { title: '指标时间', prop: 'collectTime', slotName: 'collectTime' },
  { title: '指标值', prop: 'value', slotName: 'handle' },
]);

const targetDatalist = ref();

const warning = ref({
  title: '详情信息',
  regionName: '',
  attachmentNumber: 0,
  handleStatus: "",
  attachments: []
});
warning.value.handleStatus = route.query.handleStatus as string;
const tabList = ref<IgetFindAlarmTargetDataListSpace.Data[]>([]);

const getDetail = async() => {
  const res1 = await apiWarningObj.getAlarm(route.query.id as string);
  warning.value = Object.assign(warning.value, res1.data);
  const res2 = await apiWarningObj.getFindAlarmTargetDataList(route.query.id as string);
  tabList.value = res2.data;
  // tabList.value = [...res2.data, ...res2.data, ...res2.data, ...res2.data, ...res2.data, ...res2.data];
  if (tabList.value.length) {
    targetDatalist.value = tabList.value[0].dataList;
    if (tabList.value[0].dataList[0].measureUnitName) {
      cols.value[2].title = `指标值（${tabList.value[0].dataList[0].measureUnitName}）`;
    }
  }
};
const onClickTab = tabRow => {
  active.value = tabRow.name;
  targetDatalist.value = tabList.value[active.value].dataList;
  if (tabList.value[active.value].dataList[0].measureUnitName) {
    cols.value[2].title = `指标值（${tabList.value[active.value].dataList[0].measureUnitName}）`;
  } else {
    cols.value[2].title = '指标值';
  }
};
const goDetail = (item: IgetAlarmSpace.Data) => {
  router.push({
    name: "RealtimeWarningDetail",
    query: {
      id: item.id,
    },
  });
};
const goAttachment = (item: IgetFindAlarmTargetDataListSpace.Data) => {
  router.push({
    name: "WarningAttachment",
    query: {
      id: route.query.id,
    },
  });
};
getDetail();

</script>
<style lang="scss" scoped>
:deep(.van-tabs__wrap){
  margin-bottom: 16px;
}
.trend-content {
  margin: 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 4px;
  align-self: stretch;
  background: #ffffff;
  .title {
    font-size: 14px;
    font-weight: 600;
    line-height: 24px;
    color: #202020;
    margin-bottom: 8px;
  }
  .collect-time {
    font-size: 10px;
  }
  ::v-deep(.hl-simple-table>thead>tr>th .cell) {
    font-size: 10px;
  }
}
.warning-content {
  margin: 16px;
  border-radius: 8px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 4px;
  align-self: stretch;
  background: #ffffff;
  position: relative;
  .handle-status {
    position: absolute;
    top: 0;
    right: 0;
    width: 92px;
    height: 87px;
  }
  .title {
    font-size: 14px;
    font-weight: 600;
    line-height: 24px;
    color: #202020;
    margin-bottom: 8px;
  }

  ul {
    padding-left: 0 !important;
    li {
      font-size: 14px;
      display: flex;
      height: auto;
      margin-bottom: 2px;
      .label {
        width: 90px;
        color: #8a8a8a;
      }
      .value {
        flex: 1;
        color: #4b4b4b;
      }
    }
  }
  .attachment {
    height: 32px;
    line-height: 32px;
    text-align: center;
    padding-left: 8px;
    padding-right: 8px;
    background: #ebf9ff;
    color: #36a4ff;
    border-radius: 100px;
    font-size: 14px;
    float: right;
    .attachment-icon {
      vertical-align: sub;
      margin-right: 6px;
      margin-left: 4px;
    }
  }
}
</style>
