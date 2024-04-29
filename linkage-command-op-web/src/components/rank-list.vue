<template>
  <hl-scrollbar height="100%">
    <div class="rank-list">
      <div
        v-for="(t, idx) in ranks"
        :key="t.name"
        :class="['cursor-pointer rank-item', 'r' + (idx+1)]"
        @click="$emit('click', t)"
      >
        <span class="left">
          <span :class="['rank-icon', 'r' + (idx+1)]" :data-rank="paddingRank(idx + 1)"></span>
          <span class="name text-ellipsis">{{ t.name }}</span>
          <span class="bar" :style="{
            '--rankPercent': `${t.count / maxCount * 100}%`,
            backgroundSize: 'var(--rankPercent)'
          }"></span>
        </span>
        <span class="mid-num">{{ t.count }}</span>
      </div>
    </div>
  </hl-scrollbar>
</template>
<script lang="ts" setup>
import { ref, computed, PropType } from 'vue';

const props = defineProps({
  ranks: {
    type: Array as PropType<RankItem[]>,
    default: () => []
  }
});

const maxCount = computed(() => Math.max(...props.ranks.map(s => s.count)));

const paddingRank = (num: number) => String(num).padStart(2, '0');

export type RankItem = { name: string; count: number };
</script>
<style lang="scss" scoped>
.rank-list {
  display: flex;
  flex-direction: column;
  row-gap: var(--xxs);
  .rank-item {
    height: calc(var(--xxs) * 11);
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding-right: var(--md);
    background-image: url('@/assets/images/overview/right-1/specialist-bg-n.png');
    background-repeat: no-repeat;
    background-size: cover;
    .left {
      flex: 1;
      display: flex;
      align-items: center;
    }
    &.r1 {
      background-image: url('@/assets/images/overview/right-1/specialist-bg-1.png');
    }
    &.r2 {
      background-image: url('@/assets/images/overview/right-1/specialist-bg-2.png');
    }
    &.r3 {
      background-image: url('@/assets/images/overview/right-1/specialist-bg-3.png');
    }
    .rank-icon {
      --icon-height: calc(var(--xxl) + var(--xxs) / 2);
      position: relative;
      width: calc(var(--xxs) * 12.5);
      height: var(--icon-height);
      &::before {
        text-align: center;
        line-height: var(--icon-height);
        font-family: YouSheBiaoTiHei;
        position: absolute;
        content: attr(data-rank);
        background-image: url('@/assets/images/overview/right-1/specialist-icon-n.png');
        background-size: 100%;
        width: 100%;
        height: 100%;
      }
      &.r1::before {
        background-image: url('@/assets/images/overview/right-1/specialist-icon-1.png');
      }
      &.r2::before {
        background-image: url('@/assets/images/overview/right-1/specialist-icon-2.png');
      }
      &.r3::before {
        background-image: url('@/assets/images/overview/right-1/specialist-icon-3.png');
      }
    }
    .name {
      width: 4em;
      margin-left: var(--xxs);
      font-size: var(--font-lg);
      line-height: var(--font-xxxl);
    }
    .bar {
      --bar-icon-size: calc(var(--xxs) * 10);
      position: relative;
      flex: 1;
      height: var(--xxs);
      margin-left: var(--md);
      margin-right: var(--md);
      background: linear-gradient(270deg, #71F8FC 0%, rgba(6,137,150,0.5) 100%);
      background-repeat: no-repeat;
      border-radius: 0px var(--xxs) var(--xxs) 0px;
      &::before {
        content: "";
        position: absolute;
        top: calc(-1 * var(--bar-icon-size) / 2 + var(--xxs) / 2);
        left: calc(var(--rankPercent) - var(--bar-icon-size) / 2);
        width: var(--bar-icon-size);
        height: var(--bar-icon-size);
        background-image: url('@/assets/images/overview/light-icon.png');
        background-size: 100%;
      }
    }
  }
}
</style>
