<template>
  <hl-scrollbar :style="`height: ${height};`" class="m-t-xs">
    <hl-group v-for="(item, index) in list" :key="index" class="event-list w-full" :class="platTypeStyle === 'other' ? 'no-line' : ''" dir="vertical" style="position: relative">
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
          {{ item.time }}
        </hl-group>
      </hl-group>
      <!-- 暂时去掉定位功能-start -->
      <!-- <hl-group class="event-middle m-t-xs p-l-md p-r-md cursor-pointer" align="items-middle" @click="handleLocateEvent(item)">
        <hl-popover placement="bottom" :content="item.name" :disabled="item.name?.length<16" trigger="hover" popper-style="--popover-bg-color:rgba(14,23,38,0.96);">
          <template #reference>
            <span class="event-name ellipsis">
              {{ item.name }}
            </span>
          </template>
        </hl-popover>
        <hl-group align="items-middle">
          <hl-popover placement="bottom" :content="item.address" :disabled="item.address?.length<18" trigger="hover" popper-style="--popover-bg-color:rgba(14,23,38,0.96);">
            <template #reference>
              <span class="event-address ellipsis">
                <hl-group v-if="item.showPosition"  class="pos-icon" align="items-center">
                  <hl-icon class="static" type="primary" width="calc(var(--xl) * 0.48)" height="calc(var(--xl) * 0.48)" color="#D7EBFF">
                    <FillPoint />
                  </hl-icon>
                </hl-group>
                {{ item.address }}
              </span>
            </template>
          </hl-popover>
        </hl-group>
      </hl-group> -->
      <hl-group class="event-middle m-t-xs p-l-md p-r-md cursor-pointer" align="items-middle">
        <hl-popover placement="bottom" :content="item.name" :disabled="item.name?.length < 16" trigger="hover" popper-style="--popover-bg-color:rgba(14,23,38,0.96);">
          <template #reference>
            <div class="event-name standard-text">
              {{ item.name }}
            </div>
          </template>
        </hl-popover>
        <hl-group align="items-middle">
          <hl-popover placement="bottom" :content="item.address" :disabled="item.address?.length < 18" trigger="hover" popper-style="--popover-bg-color:rgba(14,23,38,0.96);">
            <template #reference>
              <span class="event-address standard-text">
                {{ item.address }}
              </span>
            </template>
          </hl-popover>
        </hl-group>
      </hl-group>
      <!-- 暂时去掉定位功能-end -->
      <hl-group v-if="platTypeStyle === 'mix'" class="event-bottom full p-l-md p-r-md" align="items-middle">
        <hl-group class="plat-start static" align="items-left">
          <span class="bottom-title m-r-xs">发起平台:</span>
          <hl-popover placement="bottom" :content="item.value1" trigger="hover" popper-style="--popover-bg-color:rgba(14,23,38,0.96);">
            <template #reference>
              <span class="bottom-count ellipsis cursor-pointer">{{ item.value1 }}</span>
            </template>
          </hl-popover>
        </hl-group>
        <hl-group class="plat-end" align="items-left">
          <hl-group class="bottom-title m-r-xs" align="items-middle">接收平台:</hl-group>
          <hl-group class="plat-list" align="items-middle">
            <div class="p-l-xs p-r-xs" v-if="item.value2?.length === 0">--</div>
            <div class="plat-normal p-l-xs p-r-xs" v-else-if="item.value2?.length === 1">
              {{ item.value2[0] }}
            </div>
            <hl-group class="plat-more" v-else>
              <hl-popover placement="bottom" trigger="hover" popper-style="--popover-bg-color:rgba(14,23,38,0.96);">
                <template #reference>
                  <hl-group class="circle-list">
                    <hl-group class="plat-normal plat-circle cursor-pointer" v-for="ele in item.value2.slice(0, platSize)" :key="ele" align="items-center">
                      {{ ele.slice(0, 1) }}
                    </hl-group>
                    <hl-group v-if="item.value2?.length > platSize" align="items-middle"> ··· </hl-group>
                  </hl-group>
                </template>
                <hl-group dir="vertical">
                  <hl-group v-for="ele in item.value2" :key="ele" align="items-center">
                    {{ ele }}
                  </hl-group>
                </hl-group>
              </hl-popover>
            </hl-group>
          </hl-group>
        </hl-group>
        <hl-group class="overtime-area" align="items-right">
          <span class="bottom-title m-r-xs">超时情况</span>
          <hl-group align="items-center">
            <hl-group v-for="(ele, index) in item.overtimeList" :key="ele.name + index" align="items-middle">
              <hl-group align="items-middle">
                <img class="arrow-right" src="@/assets/images/eventCenter/arrow-right.png" v-if="index !== 0" />
              </hl-group>
              <hl-group class="overtime-item" align="items-middle" :style="{ 'background-image': `url(${require('@/assets/images/eventCenter/overtime_' + ele.value + '.png')}` }">
                {{ ele.name }}
              </hl-group>
            </hl-group>
          </hl-group>
        </hl-group>
      </hl-group>
      <hl-group v-if="platTypeStyle === 'simple'" class="event-bottom full p-l-md p-r-md" align="items-middle">
        <hl-group class="plat-start static" align="items-left">
          <span class="bottom-title m-r-xs">{{ item.label1 }}</span>
          <hl-popover placement="bottom" :content="item.value1" trigger="hover" popper-style="--popover-bg-color:rgba(14,23,38,0.96);">
            <template #reference>
              <span class="simple-bottom-count ellipsis cursor-pointer">{{ item.value1 }}</span>
            </template>
          </hl-popover>
        </hl-group>
        <hl-group class="plat-end" align="items-left">
          <hl-group class="bottom-title m-r-xs" align="items-middle">{{ item.label2 }}</hl-group>
          <hl-popover placement="bottom" :content="item.value2" trigger="hover" popper-style="--popover-bg-color:rgba(14,23,38,0.96);">
            <template #reference>
              <span class="simple-bottom-count-mid ellipsis cursor-pointer">{{ item.value2 }}</span>
            </template>
          </hl-popover>
        </hl-group>
        <hl-group class="overtime-area" align="items-right" v-if="item.label3">
          <span class="bottom-title m-r-xs">{{ item.label3 }}</span>
          <hl-popover placement="bottom" :content="item.value3" trigger="hover" popper-style="--popover-bg-color:rgba(14,23,38,0.96);">
            <template #reference>
              <span class="simple-bottom-count ellipsis cursor-pointer">{{ item.value3 }}</span>
            </template>
          </hl-popover>
        </hl-group>
      </hl-group>
      <hl-group v-if="platTypeStyle === 'progress'" style="position: absolute; bottom: calc(var(--xl) * 0.5); width: 100%">
        <progress-bar :percent="item.confidence" :progress-name="progressName" />
      </hl-group>
      <hl-group v-if="platTypeStyle === 'other'" class="p-l-md p-r-md p-t-md" style="position: absolute; bottom: calc(var(--xl) * 0.3); width: 100%" align="items-between">
        <hl-group align="items-middle" gap="var(--sm)">
          <span class="standard-text">事件状态</span>
          <event-status-tag :event-status="item.eventStatus" />
        </hl-group>
        <hl-group align="items-middle" gap="var(--sm)">
          <span class="standard-text">超时情况</span>
          <span :class="['standard-text', item.overtimeFlag !== null && item.overtimeFlag === 1 ? 'text-primary' : 'text-danger']">{{ item.overtimeFlag === null ? '--' : item.overtimeFlag === 1 ? '未超时' : '已超时' }}</span>
        </hl-group>
      </hl-group>
    </hl-group>
    <hb-empty image-size="0" v-if="list?.length === 0" description="暂无数据" />
  </hl-scrollbar>
</template>

<script lang="ts" setup>
import { useMapTools, useGlobalState, useRepeatEvent } from '@/hooks';
import { MAP_POINT } from '@/common';
import { ProgressBar } from '@/components';

const props = defineProps({
  list: {
    type: Array,
    default: () => {
      return [];
    }
  },
  platSize: {
    type: Number,
    default: 4
  },
  height: {
    type: String,
    default: 'calc(var(--xl) * 17.3)'
  },
  overtimeType: {
    type: String,
    default: 'flag'
  },
  platTypeStyle: {
    type: String,
    // simple-简单  mix-混合样式 progress进度条
    default: 'mix'
  },
  progressName: {
    type: String,
    default: '置信度'
  }
});

const emit = defineEmits(['clickLocation']);

const { flyTo } = useMapTools();
const { layerSwitch, isLastLevelArea, currentEventId, handleShowEventDetail, handleShowSelfHandleEventDetail } = useGlobalState();
const { repeatEventVisible, handleShowRepeatEvent, currentRepeatEventId } = useRepeatEvent();

const handleLocateEvent = (item: any) => {
  if (!isLastLevelArea.value) return;
  if (!item.showPosition) return;
  emit('clickLocation');
  layerSwitch.mode = MAP_POINT;
  currentEventId.value = item.id || item.eventId;
  flyTo({
    center: item.location,
    zoom: 14,
    duration: 2000
  });
};

const handleShowDetail = (item: any) => {
  console.log(item, 'eventshow');
  if (item.showRepeat) {
    handleShowRepeatEvent(item.id || item.eventId);
  } else if (item.showSelfHandle) {
    handleShowSelfHandleEventDetail(item.id || item.eventId);
  } else {
    handleShowEventDetail(item.id || item.eventId);
  }
};
</script>
<style lang="scss">
.event-list {
  margin-bottom: calc(var(--xl) * 0.32);
  height: calc(var(--xl) * 4.06);
  background-image: url('@/assets/images/eventCenter/event-list-bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  font-size: calc(var(--xl) * 0.56);
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  &.no-line {
    background-image: url('@/assets/images/eventCenter/event-bg-self.png');
  }
  .event-top {
    height: calc(var(--xl) * 1.2);
    line-height: 100%;
    // font-family: AkzidenzGroteskBQ-Cnd, AkzidenzGroteskBQ;
    .event-index {
      width: calc(var(--xl) * 1.2);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .event-title {
      width: calc(var(--xl) * 9);
      line-break: anywhere;
    }
  }
  .event-middle {
    height: calc(var(--xl) * 1.12);
    line-height: 100%;
    font-size: calc(var(--xl) * 0.48);
    font-family: AkzidenzGroteskBQ-Cnd, AkzidenzGroteskBQ;
    justify-content: space-between;
    .pos-icon {
      width: calc(var(--xl) * 0.72);
      height: calc(var(--xl) * 0.72);
      align-items: center;
      margin-right: calc(var(--xl) * 0.12);
      background: rgba(42, 61, 80, 0.5);
      border: 1px solid rgba(79, 114, 153, 1);
      border-radius: 3px;
    }
    .event-name {
      width: calc(var(--xl) * 7.5);
      height: calc(var(--xl) * 0.6);
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
      line-break: anywhere;
    }
    .event-address {
      text-align: right;
      width: calc(var(--xl) * 8.8);
      height: calc(var(--xl) * 0.6);
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
      line-break: anywhere;
    }
  }
  .event-bottom {
    font-size: calc(var(--xl) * 0.48);
    justify-content: space-between;
    height: calc(var(--xl) * 1.39);
    .bottom-title {
      font-family: PingFangSC-Regular, PingFang SC;
      color: #b5cee3;
    }
    .plat-start {
      width: calc(var(--xxl) * 4);
    }
    .bottom-count {
      width: calc(var(--xl) * 2.68);
    }
    .simple-bottom-count {
      width: calc(var(--xl) * 2.68);
    }
    .simple-bottom-count-mid {
      width: calc(var(--xl) * 3);
    }
    .plat-end {
      .plat-list {
        width: calc(var(--xl) * 2.68);
        .plat-normal {
          background: #1c2d3d;
          border-radius: calc(var(--xxl));
          border: 1px solid rgba(112, 178, 247, 1);
        }
        .plat-circle {
          &:first-child {
            margin: 0;
          }
          width: calc(var(--lg) * 1.2);
          margin-left: calc(var(--lg) * -0.3);
        }
      }
      .plat-more {
        .circle-list {
          width: calc(var(--xl) * 3.78);
        }
      }
    }
    .overtime-area {
      .arrow-right {
        width: calc(var(--xs));
        height: calc(var(--xs));
      }
      .overtime-item {
        padding-left: calc(var(--xl) * 0.08);
        width: calc(var(--xl) * 1.04);
        height: calc(var(--xl) * 0.54);
        background-repeat: no-repeat;
        background-size: cover;
        font-size: calc(var(--xl) * 0.38);
      }
    }
  }
}
</style>
