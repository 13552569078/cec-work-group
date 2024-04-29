<template>
  <hl-scrollbar
    :style="`height: ${height};max-height: ${height};`"
    ref="treeScrollbarRef"
    class="w-full"
  >
    <hl-simple-table
      class="w-full"
      :cols="cols"
      :data="curTableList"
      stripe
      fixed-header
      v-bind="$attrs"
      @row-click="clickEventRow"
    >
      <template #tableIndex="{ rowIndex }">
        <hl-group align="items-middle">{{ rowIndex + 1 }}</hl-group>
      </template>
      <template #eventProgress="{ row }">
        <hl-group class="progress-area" align="items-center">
          <hl-group
            v-for="(ele, index) in row.eventProgress"
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
      </template>
    </hl-simple-table>
  </hl-scrollbar>
</template>

<script lang="ts" setup>
import { defineComponent, computed, PropType } from 'vue';
import { ProgressBar } from '@/components';
import { IpostPageSpace } from '@/apis/modules/dy-event-monitor/model';

const props = defineProps({
  list: {
    type: Array as PropType<IpostPageSpace.List[]>,
    default: () => {
      return [];
    },
  },
  cols: {
    type: Array,
    default: () => {
      return [
        {
          title: '',
          minWidth: '2em',
          align: 'left',
          slotName: 'tableIndex',
          fixed: 'left',
        },
        {
          title: '发生时间',
          minWidth: '12em',
          prop: 'eventTime',
        },
        {
          title: '事件标题',
          prop: 'title',
          maxWidth: '9em',
          showTooltip: true,
        },
        {
          title: '事件类型',
          prop: 'eventTypeNameText',
          maxWidth: '10em',
          showTooltip: true,
        },
        {
          title: '发起平台',
          prop: 'sendPlatformName',
          maxWidth: '6em',
          showTooltip: true,
        },
        {
          title: '接收平台',
          prop: 'receivePlatform',
          maxWidth: '8em',
          showTooltip: true,
        },
        {
          title: '流入类型',
          prop: 'inflowTypeName',
        },
        {
          title: '事件流程',
          minWidth: '10em',
          slotName: 'eventProgress',
        },
        {
          title: '超时状态',
          prop: 'overtimeStatus',
        },
      ];
    },
  },
  height: {
    type: String,
    default: 'calc(var(--xxl) * 11.3)',
  },
});

const emit = defineEmits(['clickEventRow']);

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
                  value: completeFlag > 0 ? (completeFlag ?? 0) : (cancelFlag ?? 0),
                },
              ],
        ...item,
      };
    });
  } else {
    return [];
  }
});

const clickEventRow = (item: IpostPageSpace.List) => {
  emit('clickEventRow', {
    ...item,
  });
};
</script>
<!-- 透传 -->
<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<style lang="scss" scoped>
@import '@/assets/styles/utils.scss';
:deep(.hl-simple-table) {
  border-collapse: separate; /* 确保边框被分隔开 */
  border-spacing: 0px var(--xxs); /* 调整行之间的间距 */
  color: #ddf2ff;
  thead {
    background-color: #06274c;
    color: #fff;
    th {
      background-color: rgba(0, 126, 203, 0.2) !important;
      // background-color: transparent;
      height: calc(var(--xxs) * 10);
    }
  }
  tbody tr {
    &:nth-child(odd) {
      td {
        background: rgba(71, 132, 255, 0.1) !important;
      }
    }
    &:nth-child(even) {
      td {
        background: rgba(0, 11, 32, 0.15) !important;
      }
    }
    td {
      height: calc(var(--xxs) * 9);
      padding: 0 !important;
      border-top: 1px solid rgba(0, 138, 255, 0.1);
      border-bottom: 1px solid rgba(0, 138, 255, 0.1);
      &:first-child {
        border-left: 1px solid rgba(0, 138, 255, 0.1);
      }
      &:last-child {
        border-right: 1px solid rgba(0, 138, 255, 0.1);
      }
    }
  }
  .fixed-left {
    background-color: transparent;
  }
  .fixed-top::before {
    border: 1px solid rgba(0, 138, 255, 0.1);
    height: calc(var(--xxs) * 10);
    top: var(--xxs);
  }
  .progress-area {
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
}
</style>
