<template>
  <hl-group dir="vertical" class="w-full h-full" full>
    <hl-group gap="var(--xxs)" class="w-full m-b-md static box-styled-short p-t-xxs" full>
      <hl-group class="p-xs p-l-lg" align="items-between" style="width: 50%" dir="vertical"  gap="var(--xxs)">
        <span class="label">流程用时</span>
        <span class="standard-text">{{ handleEmptyStr(data.process?.processTime) }}</span>
      </hl-group>
      <hl-group class="p-xs" align="items-between" style="width: 50%" dir="vertical"  gap="var(--xxs)">
        <span class="label">流程时限</span>
        <span class="standard-text">{{ handleEmptyStr(data.process?.processTimeLimit) }}</span>
      </hl-group>
    </hl-group>

    <hl-group class="time-line-box m-l-md p-sm" dir="vertical">
      <hl-group v-for="(node, index) in data.process?.activityList" :key="index" class="node-cell w-full static m-b-md"
        dir="vertical">
        <hl-group align="items-between" class="w-full m-b-md">
          <hl-group class="node" :class="index === 0 ? 'current' : ''">
            <div class="m-l-sm">
              <span class="m-l-xs small-text">{{ handleEmptyStr(node.activityName) }}</span>
            </div>
          </hl-group>
          <hl-group gap="var(--md)">
            <span class="label">处置用时</span>
            <span class="standard-text">{{ handleEmptyStr(node.timeUse) }}</span>
          </hl-group>
        </hl-group>
        <hl-group class="msg p-md m-l-lg" dir="vertical" gap="var(--xs)">
          <!-- <hl-group gap="var(--md)">
            <span class="label">处置时限</span>
            <span class="standard-text">{{ handleEmptyStr(node.timeLimit) }}</span>
          </hl-group> -->
          <hl-group gap="var(--md)">
            <span class="label">处理状态</span>
            <span class="standard-text">{{ handleEmptyStr(node.action) }}</span>
          </hl-group>
          <hl-group gap="var(--md)">
            <span class="label">处理时间</span>
            <span class="standard-text">{{ handleEmptyStr(node.startTime) }}</span>
          </hl-group>
          <hl-group gap="var(--md)">
            <span class="label">处理人</span>
            <span class="standard-text">{{ handleEmptyStr(node.roleName) }}</span>
          </hl-group>
          <hl-group gap="var(--md)">
            <span class="label">处理意见</span>
            <span class="standard-text">{{ handleEmptyStr(node.comment) }}</span>
          </hl-group>
        </hl-group>
      </hl-group>
    </hl-group>
  </hl-group>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { handleEmptyStr } from '@/common';
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
});
</script>

<style lang="scss" scoped>
:deep(.font-lg) {
  line-height: 1.8rem !important;
}

:deep(.font-md) {
  line-height: 1.8rem !important;
}

.bg-cell {
  background-color: rgba(43, 59, 72, 0.58);
}

.label {
  color: #d7ebff;
  font-size: calc(var(--xl) * 0.58);
}

.time-line-box {
  border-left: 1px solid #385d76;
}

.node {
  position: relative;

  &:before {
    content: '';
    display: block;
    width: calc(var(--xxl) * 0.57 / 1.3);
    height: calc(var(--xxl) * 0.57 / 1.3);
    background-color: #141b28;
    border: 1px solid #3d5b6c;
    position: absolute;
    left: 0;
    transform: translate(-118%, -3%);
    border-radius: 50%;
  }

  &:after {
    content: '';
    display: block;
    width: calc(var(--xxl) * 0.32 / 1.3);
    height: calc(var(--xxl) * 0.32 / 1.3);
    background-color: #3d5b6c;
    position: absolute;
    left: -21%;
    transform: translate(-37%, 37%);
    border-radius: 50%;
  }

  &.current {
    &:before {
      content: '';
      display: block;
      width: calc(var(--xxl) * 0.57);
      height: calc(var(--xxl) * 0.57);
      background-color: #141b28;
      border: 2px solid #71ccfc;
      position: absolute;
      left: 0;
      transform: translate(-105%, 0);
      border-radius: 50%;
    }

    &:after {
      content: '';
      display: block;
      width: calc(var(--xxl) * 0.32);
      height: calc(var(--xxl) * 0.32);
      background-color: #71ccfc;
      position: absolute;
      left: -21%;
      transform: translate(-37%, 37%);
      border-radius: 50%;
    }
  }

  >div {
    width: calc(var(--xxl) * 1.3693513);
    height: calc(var(--xxl) * 0.62078);
    background-image: url('@/assets/images/dialog/node.png');
    background-size: contain;
    text-align: center;
  }
}

.msg {
  background-color: rgba(10, 32, 56, 0.78);
}</style>
