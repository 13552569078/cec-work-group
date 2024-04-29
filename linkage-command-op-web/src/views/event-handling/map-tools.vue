<template>
  <div
    class="map-tools"
    :class="[showMask ? 'map-tools-right-show' : 'map-tools-moving-right']"
  >
    <div class="action buffer" @click="() => toggleBufferShow()">
      <img :src="currentMapBuffer?.show ? bufferShowImg : bufferHideImg" />
      <span>缓冲区</span>
    </div>
    <template v-if="isPlotting">
      <div class="action plotting" @click="terminatePlot">结束标绘</div>
    </template>
    <template v-else>
      <div class="action clear" @click="clearMap">清屏</div>
      <div class="action clear" @click="openEventDlg">切换事件</div>
      <div class="action back" @click="goBack">
        <img :src="backImg" />
        <span>返回</span>
      </div>
    </template>
    <event-list-dlg v-if="eventListDlgVisible" @cancel="eventListDlgVisible = false" />
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { HlMessageBox } from 'hongluan-ui';
import { useLayout, useMapBuffer, useMapPlotting } from '@/hooks';
import backImg from '@/assets/images/map/back.png';
import bufferShowImg from '@/assets/images/map/buffer-show.png';
import bufferHideImg from '@/assets/images/map/buffer-hide.png';
import EventListDlg from '@/views/event-handling/panels/event-overview/components/event-list-dlg.vue';

const emit = defineEmits(['clear-map']);

const router = useRouter();
const { showMask } = useLayout();
const { currentMapBuffer, toggleBufferShow } = useMapBuffer();
const { isPlotting, showPlottingList, stopPlotting } = useMapPlotting();

const isShowBuffer = computed(() => currentMapBuffer.value?.show);

const eventListDlgVisible = ref(false);

const clearMap = () => {
  toggleBufferShow(undefined, false);
  emit('clear-map');
};

const goBack = () => {
  showPlottingList.value = false;
  router.push({ name: 'overview' });
};

const terminatePlot = async() => {
  await HlMessageBox.confirm('确认结束编辑吗？', '提示');
  stopPlotting();
};

const openEventDlg = () => {
  eventListDlgVisible.value = true;
};
</script>
<style lang="scss" scoped>
.map-tools {
  position: absolute;
  top: var(--panels-top);
  height: calc(var(--xxs) * 10);
  display: flex;
  align-items: center;
  column-gap: calc(var(--xxs) * 3);
  .action {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(var(--xxs) * 18);
    height: calc(var(--xxs) * 8);
    background-image: url('@/assets/images/map/clear-btn.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    &.buffer {
      width: calc(var(--xxs) * 20.5);
    }
    img {
      width: var(--md);
      height: var(--md);
      margin-right: var(--xs);
    }
  }
}
</style>
