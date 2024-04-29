<template>
  <hl-group
    dir="vertical"
    class="w-full"
  >
    <hl-group
      class="title-wrap m-t-xs"
      v-if="title"
      align="items-middle"
    >
      <span class="title-icon m-r-xxs"> </span>
      {{ title }}
    </hl-group>
    <hl-group
      :class="['item-wrap','w-full','m-t-sm', isCursor ? 'cursor-item': '']"
      v-for="(barItem, idx) in chartData"
      :key="idx"
      align="items-center"
      @click="clickBarItem(barItem)"
    >
      <hl-group
        class="icon-wrap"
        align="items-center items-middle"
        :class="{ thr: idx <= 2, more: idx > 2 }"
      >{{ `${idx + 1}`.padStart(2, '0') }} </hl-group>
      <hl-group
        class="m-l-md w-full h-full con-wrap"
        dir="vertical"
      >
        <hl-group
          class="w-full"
          align="items-between items-middle"
        >
          <span class="name">{{ labelFormatter(barItem.label) }}</span>
          <hl-group align="items-middle">
            <div>
              <span class="label-value DINAlternateBold">{{ barItem.value }}</span>
              <span class="unit">{{ unit }}</span>
            </div>
            <template v-if="showPrecent">
              <span class="deliver m-l-md m-r-md"></span>
              <div>
                <span class="label-percent DINAlternateBold">{{ barItem?.precent }}</span>
                <span class="unit">%</span>
              </div>
            </template>
          </hl-group>
        </hl-group>
        <div class="slider-wrap">
          <div
            class="slider-con"
            :style="{
              width: `${maxVal === 0 ? 0 : (barItem?.value / maxVal) * 100}%`
            }"
          >
            <img
              src="~@/assets/images/eventCenter/bar-dot.png"
              alt=""
              class="bar-dot"
              v-if="(barItem?.value / maxVal) * 100 > 0"
            />
          </div>
        </div>
      </hl-group>
    </hl-group>
  </hl-group>
</template>
<script lang="ts" setup>
import { CSSProperties, PropType, computed } from 'vue';

const props = defineProps({
  height: {
    type: String,
    required: true,
  },
  isCursor: {
    type: Boolean,
    default: false,
  },
  margin: {
    type: String,
    default: '20px 0 0',
  },
  title: {
    type: String,
    default: '',
  },
  unit: {
    type: String,
    default: '件',
  },
  showPrecent: {
    type: Boolean,
    default: false,
  },
  barStyle: {
    type: Object as PropType<{
      width: string;
      color: string;
      background: string;
    }>,
    default: () => ({
      width: '1em',
      color: '#71F8FC',
      background: 'rgba(47,71,110,0.12)',
    }),
  },
  labelStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => ({
      fontSize: '1.125em',
      color: '#ffffff',
    }),
  },
  valueStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => ({
      fontSize: '1.2em',
      color: '#B5CEE3',
    }),
  },
  chartData: {
    type: Array as PropType<ScrollingBarChartData[]>,
    default: () => [],
  },
  labelFormatter: {
    type: Function as PropType<(label: string) => string>,
    default: (label: string) => label,
  },
  valueFormatter: {
    type: Function as PropType<(value: number) => string>,
    default: (value: number) => value,
  },
});

const emit = defineEmits(['clickBar']);

const isStack = computed(() =>
  props.chartData.every(d => Array.isArray(d.value))
);
const maxVal = computed(() => {
  return props.chartData.reduce((pre, current) => {
    return pre + Number(current.value);
  }, 0);
});

const getLabelStyle = (charItem: ScrollingBarChartData) => ({
  ...props.labelStyle,
  ...(charItem?.labelStyle ?? {}),
});

export interface ScrollingBarChartData {
  value: number | ScrollingBarChartData[];
  label: string;
  precent?: string;
  barStyle?: Record<string, unknown>;
  valueStyle?: CSSProperties;
  labelStyle?: CSSProperties;
}

const clickBarItem = (barData: ScrollingBarChartData) => {
  if (props.isCursor) {
    emit('clickBar', barData);
  }
};
</script>
<style lang="scss" scoped>
.title-wrap {
  color: #ffffff;
  font-size: calc(var(--xl) * 0.6);
  font-weight: 600;
  color: #ffffff;
  font-size: calc(var(--xl) * 0.48);

  .title-icon {
    display: inline-block;
    width: calc(var(--xl) * 0.52);
    height: calc(var(--xl) * 0.46);
    background: url("@/assets/images/eventCenter/trend-title.png") no-repeat;
    background-size: 100% 100%;
  }
}

.item-wrap {
  // width: calc(var(--xl) * 1.6);
  // height: calc(var(--xl) * 1.6);
  .icon-wrap {
    width: calc(var(--xl) * 1.6);
    height: calc(var(--xl) * 1.6);
    font-weight: bold;
    color: #ffffff;

    &.thr {
      background: url("@/assets/images/eventCenter/rank-thr-bg.png") no-repeat;
      background-size: contain;
      background-position: center center;
    }

    &.more {
      background: url("@/assets/images/eventCenter/rank-more-bg.png") no-repeat;
      background-size: contain;
      background-position: center center;
    }
  }
}
.cursor-item {
  cursor: pointer;
}

.con-wrap {
  .name {
    font-weight: 600;
    color: #ffffff;
    font-size: calc(var(--xl) * 0.48);
  }

  .label-value {
    font-size: calc(var(--xl) * 0.8);
    font-weight: bold;
    color: #ffc97a;
  }

  .label-percent {
    font-size: calc(var(--xl) * 0.8);
    font-weight: bold;
    color: #82ffa1;
  }

  .deliver {
    display: inline-block;
    width: calc(var(--xl) * 0.06);
    height: calc(var(--xl) * 0.48);
    background: linear-gradient(
      180deg,
      rgba(86, 109, 126, 0) 0%,
      #cfeaff 50%,
      rgba(43, 59, 72, 0) 100%
    );
  }

  .unit {
    font-size: calc(var(--xl) * 0.42);
    font-weight: normal;
    margin-left: calc(var(--xl) * 0.1);
  }

  .slider-wrap {
    width: 100%;
    height: calc(var(--xl) * 0.2);
    background: rgba(56, 75, 103, 0.24);
    position: relative;
    z-index: 1;

    .slider-con {
      position: absolute;
      height: 100%;
      z-index: 9;
      background: linear-gradient(
        270deg,
        #71f8fc 0%,
        #31b5bf 35%,
        rgba(6, 137, 150, 0.5) 100%
      );
      border-radius: 0px 15px 15px 0px;
    }
    .bar-dot {
      position: absolute;
      height: calc(var(--xxs) * 17);
      top: 50%;
      right: 0;
      transform: translate(50%, -50%);
      z-index: 10;
    }
  }
}
</style>
