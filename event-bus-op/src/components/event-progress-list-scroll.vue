<template>
  <div>
    <div class="header-wrap">
      <div class="header-item-index"></div>
      <div
        :class="[item.slot ? item.slotClassName : 'header-item']"
        v-for="(item, index) in cols"
        :key="index"
      >
        {{ item.label }}
      </div>
    </div>
    <vue-seamless-scroll
      :data="curTableList"
      class="con-warp"
      :class-option="defaultOption"
      :style="{ height }"
      v-if="curTableList && curTableList.length"
    >
      <div class="data-wrap">
        <div
          class="data-item m-t-xxs"
          v-for="(item, index) in curTableList"
          :key="index"
        >
          <hl-group
            class="data-item-index h-100"
            align="items-center items-middle"
          >{{
            index + 1
          }}</hl-group>
          <hl-group
            :class="[
              'h-100',
              'ellipsis',
              cursorKeys.includes(keys) ? 'data-item-cursor' : '',
              getkeysItem(keys).slot ? '' : 'data-item-col'
            ]"
            align="items-left items-middle"
            v-for="(keys, index) in colsKey"
            :key="index"
            @click="clickEventRow(item, keys)"
          >
            <slot
              v-if="getkeysItem(keys).slot"
              :name="getkeysItem(keys).slot"
              :row="item"
              class="ellipsis"
            >
              <hl-group
                v-if="getkeysItem(keys).slot ==='eventProgress'"
                class="progress-area"
              >
                <hl-group
                  v-for="(ele, index) in item.eventProgress"
                  :key="ele.label + index"
                  align="items-middle"
                >
                  <hl-group align="items-middle">
                    <img
                      class="arrow-right"
                      src="@/assets/images/eventCenter/arrow-right.png"
                      v-if="index !== 0"
                    />
                  </hl-group>
                  <hl-group
                    class="progress-item"
                    align="items-middle"
                    :style="{
                      'background-image': `url(${require('@/assets/images/deyang/progress-time-' +
                        ele.value +
                        '.png')}`,
                    }"
                  >
                    {{ ele.label }}
                  </hl-group>
                </hl-group>
              </hl-group>
            </slot>
            <span
              v-else
              class="ellipsis"
            >{{ item[keys] }}</span>
          </hl-group>
        </div>
      </div>
    </vue-seamless-scroll>
    <hl-group
      :style="{ height }"
      align="items-center items-middle"
      v-else
      class="full-x"
    >暂无数据</hl-group>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import vueSeamlessScroll from 'vue-seamless-scroll/src';
import { IpostPageSpace } from '@/apis/modules/dy-event-monitor/model';

interface TableItem {
  [key: string]: string | number;
}

const props = defineProps({
  cols: {
    type: Array as PropType<TableItem[]>,
    default: () => {
      return [
        {
          title: '发生时间',
          prop: 'eventTime',
          label: '发生时间',
          key: 'eventTime',
        },
        {
          title: '事件标题',
          prop: 'title',
          label: '事件标题',
          key: 'title',
        },
        {
          title: '事件类型',
          prop: 'eventTypeName',
          label: '事件类型',
          key: 'eventTypeName',
        },
        {
          title: '发起平台',
          prop: 'sendPlatformName',
          label: '发起平台',
          key: 'sendPlatformName',
        },
        {
          title: '接收平台',
          prop: 'receivePlatform',
          label: '接收平台',
          key: 'receivePlatform',
        },
        {
          title: '流入类型',
          prop: 'inflowTypeName',
          label: '流入类型',
          key: 'inflowTypeName',
        },
        {
          title: '事件流程',
          minWidth: '2em',
          slotName: 'eventProgress',
          label: '事件流程',
          key: 'eventProgress',
          slot: 'eventProgress',
          slotClassName: 'progress-area'
        },
        {
          title: '超时状态',
          prop: 'overtimeStatus',
          label: '超时状态',
          key: 'overtimeStatus',
        },
      ];
    },
  },
  list: {
    type: Array as PropType<IpostPageSpace.List[]>,
    default: () => {
      return [];
    },
  },
  height: {
    type: String,
    default: 'calc(var(--xl) * 2.58)',
  },
  cursorKeys: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const emit = defineEmits(['clickEventRow']);

const defaultOption = {
  step: window.innerHeight > 3000 ? 5 : 0.5,
  limitMoveNum: 3,
};

const colsKey = computed(() => {
  return props.cols.map(item => {
    return item.key;
  });
});

const curTableList = computed(() => {
  if (props.list?.length > 0) {
    return props.list.map((item: IpostPageSpace.List) => {
      const {
        eventTypeLName,
        eventTypeMName,
        eventTypeName,
        inflowType,
        reportFlag,
        dispatchFlag,
        handleFlag,
        closeFlag,
        completeFlag,
        cancelFlag,
      } = item;
      return {
        eventTypeNameText: `${eventTypeLName ?? '--'}/${eventTypeMName ?? '--'}/${
        eventTypeName ?? '--'
      }`,
        // 如果是流入事件[上报->调度->处置->归档];如果是自处置事件，只有[上报->办结/作废]
        eventProgress:
        inflowType === 1
          ? [
              {
                label: '上报',
                value: reportFlag ?? 0,
              },
              {
                label: '调度',
                value: dispatchFlag ?? 0,
              },
              {
                label: '处置',
                value: handleFlag ?? 0,
              },
              {
                label: '归档',
                value: closeFlag ?? 0,
              },
            ]
          : completeFlag === 0 && cancelFlag === 0
            ? [
                {
                  label: '上报',
                  value: reportFlag ?? 0,
                },
                {
                  label: '办结',
                  value: 0,
                },
              ]
            : [
                {
                  label: '上报',
                  value: reportFlag ?? 0,
                },
                {
                  label: completeFlag > 0 ? '办结' : '作废',
                  value: completeFlag > 0 ? completeFlag ?? 0 : cancelFlag ?? 0,
                },
              ],
        ...item,
      };
    });
  } else {
    return [];
  }
});

const getkeysItem = (keys: string) => {
  return props.cols.filter((item: any) => {
    return item.key === keys;
  })[0];
};

const clickEventRow = (item: TableItem, keys: string) => {
  emit('clickEventRow', {
    clickCol: keys,
    ...item,
  });
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/utils.scss';

.header-wrap {
  height: calc(var(--xl) * 1.2);
  // background: url("@/assets/images/eventCenter/ghleft/table-even.png") no-repeat;
  // background-size: cover;
  // background-position: bottom;
  background: rgba(0, 126, 203, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #ffffff;
  font-size: calc(var(--xxs) * 14 / 4);
  line-height: calc(var(--xl) * 1.2);
  .header-item-index {
    width: calc(var(--xl) * 2);
    text-align: center;
  }
  .header-item {
    flex: 1;
    text-align: left;
  }
}
.data-wrap {
  .data-item {
    cursor: pointer;
    height: calc(var(--xl) * 1.2);
    display: flex;
    justify-content: space-between;
    flex: 1;
    gap: var(--xxs);
    color: #ddf2ff;
    font-size: calc(var(--xxs) * 14 / 4);
    &:nth-child(odd) {
      // background: url("@/assets/images/eventCenter/ghleft/table-even.png") no-repeat;
      background-size: 100% 100%;
      background: rgba(71, 132, 255, 0.1);
    }
    &:nth-child(even) {
      background: rgba(0, 11, 32, 0.15);
      background-size: 100% 100%;
    }
    text-align: left;
  }
  .data-item-index {
    width: calc(var(--xxs) * 12);
    text-align: center;
    color: #d0deee;
  }
  .data-item-col {
    flex: 1;
  }
  .data-item-cursor {
    cursor: pointer;
  }
}
.progress-area {
  min-width: s(186);
  .arrow-right {
    margin: 0 s(4);
    width: s(6);
    height: s(9);
  }
  .progress-item {
    padding-left: s(3);
    width: s(32);
    height: s(17);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    font-size: s(12);
  }
}

.con-warp {
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
}
</style>
