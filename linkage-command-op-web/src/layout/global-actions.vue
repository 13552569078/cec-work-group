<template>
  <div class="global-actions" :class="[showMask ? 'map-tools-right-show' : 'map-tools-moving-right']">
    <div class="action meeting" @click="showMeetingDlg=true">
      <img src="@/assets/images/common/meeting-icon.png" />
      <span class="h3">协同会商</span>
    </div>
    <div v-if="isEventPage" class="action plotting" @click="showPlottingList=true">
      <img src="@/assets/images/common/plotting-icon.png" />
      <span class="h3">协同标绘</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useLayout, useMapPlotting, useMeeting } from '@/hooks';

const route = useRoute();
const { showMask } = useLayout();
const { showMeetingDlg } = useMeeting();
const { showPlottingList } = useMapPlotting();

const isEventPage = computed(() => route.name === 'event-handling');
</script>
<style lang="scss" scoped>
.global-actions {
  display: flex;
  flex-direction: column;
  row-gap: var(--md);
  position: absolute;
  top: calc(var(--panels-top) + var(--xxs) * 11);
  background-image: url('@/assets/images/common/top-right-icons-bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  padding: var(--px20);
  .action {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #FFFFFF;
    cursor: pointer;
    img {
      width: calc(var(--xxs) * 16.5);
      height: calc(var(--xxs) * 16.5);
    }
    span {
      margin-top: calc(-1.2 * var(--sm));
      font-weight: 600;
    }
  }
}
</style>
