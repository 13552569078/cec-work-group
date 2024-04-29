<template>
  <hl-scrollbar
    :style="`height: ${height};`"
    class="m-t-xs"
  >
    <hl-group v-for="(item, index) in list" :key="index" class="history-list w-full" dir="vertical" :style="`height:calc(var(--xl) * ${showProgress ? 3.22 : 2.58})`">
      <hl-group class="statistics-top">
        <div class="statistics-index">
          {{index + 1}}
        </div>
        <hl-group class="statistics-title m-l-md" align="items-middle">
          {{item.titleValue}}
        </hl-group>
      </hl-group>
      <hl-group class="statistics-bottom full p-l-md p-r-md"  align="items-middle">
        <hl-group align="items-left">
          <span class="bottom-title m-r-xs">{{item.label1}}</span>
          <span class="bottom-count">{{item.value1}}</span>
        </hl-group>
          <hl-group align="items-center">
          <span class="bottom-title m-r-xs">{{item.label2}}</span>
          <span class="bottom-count count-green">{{item.value2}}</span>
        </hl-group>
          <hl-group align="items-right">
          <span class="bottom-title m-r-xs">{{item.label3}}</span>
          <span class="bottom-count count-red">{{item.value3}}</span>
        </hl-group>
      </hl-group>
      <progress-bar v-if="showProgress" :percent="item.percent"/>
    </hl-group>
  </hl-scrollbar>
</template>

<script lang="ts" setup>
import { defineComponent } from 'vue';
import { ProgressBar } from '@/components';

const props = defineProps({
  list: {
    type: Array,
    default: () => {
      return [];
    },
  },
  height: {
    type: String,
    default: 'calc(var(--xl) * 9.7)',
  },
  showProgress: {
    type: Boolean,
    default: false
  }
});

</script>
<style lang="scss">
 .history-list {
    margin-bottom: calc(var(--xs));
    height: calc(var(--xl) * 2.58);
    background-image: url('@/assets/images/eventCenter/event-list-thin.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    font-size: calc(var(--xl) * 0.56);
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
    .statistics-top {
      height: calc(var(--xl) * 1.2);
      line-height: 100%;
      font-family: AkzidenzGroteskBQ-Cnd, AkzidenzGroteskBQ;
      .statistics-index {
        width: calc(var(--xl) * 1.2);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .statistics-title {
        line-height: 100%;
      }
    }
    .statistics-bottom {
      font-size: calc(var(--xl) * 0.48);
      justify-content: space-between;
      height: calc(var(--xl) * 1.39);
      .bottom-title {
        font-family: PingFangSC-Regular, PingFang SC;
        color: #B5CEE3;
      }
      .bottom-count {
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
      }
      .count-green {
        color: #19ECAD;
      }
      .count-red {
        color: #FF4B00;
      }
    }
  }
</style>
