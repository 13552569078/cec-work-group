<template>
  <div class="multi-video-player">
    <div
      :class="[items.length === 1 ? 'item-one' : (items.length === 2 ? 'item-two' : 'item-other'), 'item']"
      v-for="(item, index) in items"
      :key="index + 'index'"
    >
      <video :src="item.videoUrl" controls/>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { PropType } from 'vue';
import { IpostFindEventFixedDeviceListSpace } from '@/apis/modules/fixed-video/model';

defineProps({
  items: {
    type: Array as PropType<IpostFindEventFixedDeviceListSpace.Data[]>,
    default: () => []
  }
});
</script>
<style lang="scss" scoped>
.multi-video-player {
  width: 40vw;
  height: 50vh;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  column-gap: var(--xs);
  row-gap: var(--xs);
  video {
    width: 100%;
    height: 100% !important;
  }
  .item {
    background-image: url('@/assets/images/event-handling/right-2/video/empty-video-bg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .item-other {
    width: 48%;
    height: 48%;
  }
  .item-one {
    width: 100%;
    height: 100%;
  }
  .item-two {
    width: 48%;
    height: 100%;
  }
}
</style>
