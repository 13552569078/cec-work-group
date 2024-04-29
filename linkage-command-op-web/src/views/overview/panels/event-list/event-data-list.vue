<template>
  <div class="event-list">
    <div v-for="item in events" :key="item.id" :class="['event-item']">
      <div class="left-content">
        <span class="event-detail">
          <h5 class="text-ellipsis cursor-pointer m-r-xxs event-title" @mouseover="showTooltip">{{ item.name }}</h5>
          <hl-tag size="sm" class="event-tag p-x-xxs event-state-tag" :class="item.eventState">
            {{ item.eventStateName }}
          </hl-tag>
        </span>
        <span class="font-lg">{{ item.happenTime }}</span>
      </div>
      <hl-button
        type="primary"
        class="hover-style normal-width"
        @click="handleEvent(item)"
      >
        {{ item.eventState === 'FINISHED' ? '事件复盘' : '进入处置' }}
      </hl-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, PropType } from 'vue';
import { useRouter } from 'vue-router';
import { useTextOverflow } from '@/hooks';
import { IpostFindEventListSpace } from '@/apis/modules/event-list/model';

const props = defineProps({
  events: {
    type: Array as PropType<IpostFindEventListSpace.List[]>,
    default: () => [],
  }
});

const router = useRouter();
const { showTooltip } = useTextOverflow();

const handleEvent = (item: IpostFindEventListSpace.List) => {
  router.push({
    name: 'event-handling',
    query: {
      id: item.id
    }
  });
};

</script>
<style lang="scss" scoped>
.event-list {
  display: flex;
  flex-direction: column;
  row-gap: calc(var(--xxs) * 2);
  .event-item {
    height: calc(var(--xxs) * 20);
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding-right: var(--md);
    padding-left: var(--md);
    background-image: url('@/assets/images/overview/left-2/background-img.png');
    background-repeat: no-repeat;
    background-size: cover;
    cursor: pointer;
    &:hover, &.active {
      background-image: url('@/assets/images/overview/left-2/background-img-hover.png');
    }
    .left-content {
      display: flex;
      flex-direction: column;
      row-gap: var(--xxs);
      .event-detail {
        display: flex;
        row-gap: var(--xxs);
        .event-title {
          max-width: 12em;
        }
      }
    }
  }
}
</style>
