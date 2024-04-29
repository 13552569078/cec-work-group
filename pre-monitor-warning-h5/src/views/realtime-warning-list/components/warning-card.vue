<template>
  <div class="warning-content" @click="goDetail(props.warning)">
    <img v-if="props.warning?.handleStatus" src="@/assets/images/warning/disposed.png" class="handle-status"/>
    <div class="title">{{ props.warning?.alarmTitle }}</div>
    <div class="level-event">
      <div :class="['tag', props.warning?.alarmLevelCode]">
        {{ props.warning?.alarmLevelName }}
      </div>
      <div class="event">{{ props.warning?.eventTypeName }}</div>
    </div>
    <ul>
      <li>
        <div class="label">主体名称：</div>
        <div class="value">{{ props.warning?.regionName }}</div>
      </li>
      <li>
        <div class="label">监测点名称：</div>
        <div class="value">{{ props.warning?.monitorUnitName }}</div>
      </li>
      <li>
        <div class="label">预警时间：</div>
        <div class="value">{{ props.warning?.startTime }}</div>
      </li>
    </ul>
    <div>
      <div class="attachment" @click.stop="goAttachment(props.warning)">
        <TwoLink class="icon16 attachment-icon" color="#36A4FF" />附件（{{
          props.warning?.attachmentNum
        }}）
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useRouter } from "vue-router";

const props = defineProps({
  warning: Object,
});

const router = useRouter();

const goDetail = (item: any) => {
  router.push({
    name: "RealtimeWarningDetail",
    query: {
      id: item.id,
      handleStatus: item.handleStatus
    },
  });
};
const goAttachment = (item: any) => {
  router.push({
    name: "WarningAttachment",
    query: {
      id: item.id,
    },
  });
};

</script>
<style lang="scss" scoped>
.warning-content {
  padding: 16px;
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
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    color: #202020;
    margin-bottom: 8px;
  }
  .level-event {
    height: 22px;
    display: flex;
    justify-content: flex-start;
    margin-bottom: 8px;
    .tag {
      line-height: 22px;
      background: #fff0ed;
      text-align: center;
      border-radius: 4px;
      height: 22px;
      width: 35px;
      color: #ff4d4f;
      font-size: 11px;
      margin-right: 8px;
    }
    .ALARM_LEVEL_CODE_1 {
      color: rgba(249, 80, 80, 1);
      background: rgba(249, 80, 80, 0.2);
    }
    .ALARM_LEVEL_CODE_2 {
      color: rgba(241, 231, 35, 1);
      background: rgba(241, 231, 35, 0.2);
    }
    .ALARM_LEVEL_CODE_3 {
      color: rgba(247, 191, 76, 1);
      background: rgba(247, 191, 76, 0.2);
    }
    .ALARM_LEVEL_CODE_4 {
      color: rgba(0, 158, 247, 1);
      background: rgba(0, 158, 247, 0.2);
    }
    .event {
      line-height: 22px;
      background: #f2f5fa;
      text-align: center;
      border-radius: 4px;
      height: 22px;
      width: auto;
      color: #4b4b4b;
      font-size: 11px;
      padding-right: 8px;
      padding-left: 8px;
    }
  }
  ul {
    padding-left: 0 !important;
    li {
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
