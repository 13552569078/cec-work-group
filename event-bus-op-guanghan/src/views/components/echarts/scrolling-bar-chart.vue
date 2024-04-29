<template>
  <hl-scrollbar class="scrolling-bar-chart-container" :style="{ height, '--bar-color': barStyle?.color }">
    <div class="scrolling-bar-chart">
      <div class="title-wrap" v-if="title">
        <span class="title-icon m-r-xxs"></span>
        {{ title }}
      </div>
      <div v-for="(barItem, idx) in chartData" :key="idx" class="bar-item" :style="{ margin }">
        <div class="label-value m-b-xxs">
          <span class="label" :style="getLabelStyle(barItem)">
            <span class="m-r-xs rank-idx common-font-BQ" :class="{ rank1: idx === 0, rank2: idx === 1, rank3: idx === 2 }">{{ idx + 1 }}</span>
            {{ labelFormatter(barItem.label) }}
          </span>
          <!-- <span class="value font-din" :style="getValueStyle(barItem)">{{ valueFormatter(getBarItemTotal(barItem)) }}</span> -->
          <span class="bar-value p-r-md">
            <span class="bar-unit-wrap common-font-BQ"
              >{{ barItem.value }} <span class="unit">{{ unit }}</span></span
            >
            <span class="deliver m-l-md m-r-md" v-if="showPrecent"></span>
            <span class="bar-precent-wrap common-font-BQ" v-if="showPrecent">{{ barItem?.precent }} <span class="unit">%</span></span>
          </span>
        </div>
        <!-- height: barItem?.barStyle?.width || barStyle?.width -->
        <div
          :class="['bar-bg', isStack ? 'stack' : '']"
          :style="{
            background: barItem?.barStyle?.background || barStyle?.background
          }"
        >
          <template v-if="isStack">
            <div
              v-for="(subBarItem, sidx) in barItem.value"
              :key="sidx"
              class="bar"
              :style="{
                background: subBarItem?.barStyle?.color || barStyle?.color,
                width: `${maxVal === 0 ? 0 :(subBarItem.value / maxVal) * 100}%`
              }"
            ></div>
          </template>
          <div
            v-else
            class="bar"
            :style="{
              background: barItem?.barStyle?.color || barStyle?.color,
              width: `${maxVal === 0 ? 0 :(barItem.value / maxVal) * 100}%`
            }"
          ></div>
        </div>
      </div>
    </div>
  </hl-scrollbar>
</template>
<script lang="ts" setup>
import { CSSProperties, PropType, computed } from 'vue';

const props = defineProps({
  height: {
    type: String,
    required: true
  },
  margin: {
    type: String,
    default: '20px 0 0'
  },
  title: {
    type: String,
    default: ''
  },
  unit: {
    type: String,
    default: '件'
  },
  showPrecent: {
    type: Boolean,
    default: false
  },
  barStyle: {
    type: Object as PropType<{ width: string; color: string; background: string }>,
    default: () => ({
      width: '1em',
      color: '#71F8FC',
      background: 'rgba(47,71,110,0.12)'
    })
  },
  labelStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => ({
      fontSize: '1.125em',
      color: '#ffffff'
    })
  },
  valueStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => ({
      fontSize: '1.2em',
      color: '#B5CEE3'
    })
  },
  chartData: {
    type: Array as PropType<ScrollingBarChartData[]>,
    default: () => []
  },
  labelFormatter: {
    type: Function as PropType<(label: string) => string>,
    default: (label: string) => label
  },
  valueFormatter: {
    type: Function as PropType<(value: number) => string>,
    default: (value: number) => value
  }
});

const isStack = computed(() => props.chartData.every(d => Array.isArray(d.value)));
const maxVal = computed(() => {
  return props.chartData.reduce((pre, current) => {
    return pre + Number(current.value);
  }, 0);
});

const getLabelStyle = (charItem: ScrollingBarChartData) => ({ ...props.labelStyle, ...(charItem?.labelStyle ?? {}) });

export interface ScrollingBarChartData {
  value: number | ScrollingBarChartData[];
  label: string;
  precent?: string;
  barStyle?: Record<string, unknown>;
  valueStyle?: CSSProperties;
  labelStyle?: CSSProperties;
}
</script>
<style lang="scss" scoped>
.scrolling-bar-chart-container {
  font-size: calc(var(--xl) * 0.48);
  width: 100%;
}
.scrolling-bar-chart-container .scrollbar-bar.is-vertical {
  width: 2px;
}
.scrolling-bar-chart-container .scrolling-bar-chart .bar-item .label-value {
  display: flex;
  justify-content: space-between;
}
.scrolling-bar-chart-container .scrolling-bar-chart .bar-item .bar-bg {
  width: 100%;
  position: relative;
  height: calc(var(--xl) * 0.22);
}
.scrolling-bar-chart-container .scrolling-bar-chart .bar-item .bar-bg .bar {
  position: absolute;
  top: 0;
  height: 100%;
  width: 0;
}
.scrolling-bar-chart-container .scrolling-bar-chart .bar-item .bar-bg.stack .bar {
  position: static;
  display: inline-block;
}
.rank-idx {
  color: #ffffff;
  font-weight: bold;
  font-size: calc(var(--xl) * 0.57);
  &.rank1 {
    color: #fe7e00;
  }
  &.rank2 {
    color: #fecb00;
  }
  &.rank3 {
    color: #19ecad;
  }
}
.bar-value {
  font-size: calc(var(--xl) * 0.64);
  color: #ffffff;
  // font-weight: bold;
  .unit {
    font-size: calc(var(--xl) * 0.42);
    font-weight: normal;
    font-family: SourceHanSansCN-Light, SourceHanSansCN;
  }
  .deliver {
    display: inline-block;
    width: calc(var(--xl) * 0.06);
    height: calc(var(--xl) * 0.48);
    background: linear-gradient(180deg, rgba(86, 109, 126, 0) 0%, #cfeaff 50%, rgba(43, 59, 72, 0) 100%);
  }
}
.title-wrap {
  color: #ffffff;
  font-size: calc(var(--xl) * 0.6);
  .title-icon {
    display: inline-block;
    width: calc(var(--xl) * 0.52);
    height: calc(var(--xl) * 0.46);
    background: url('@/assets/images/eventCenter/trend-title.png') no-repeat;
    background-size: 100% 100%;
  }
}
.common-font-BQ {
  font-family: AkzidenzGroteskBQ-Cnd, AkzidenzGroteskBQ;
}
</style>
