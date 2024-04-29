<template>
  <!--右下角地图操作-->
  <div class="map-actions" :class="[showMask ? 'map-tools-right-show' : 'map-tools-moving-right']">
    <hl-button equal @click="refreshData">
      <template #icon>
        <hl-icon><FillRefresh /></hl-icon>
      </template>
    </hl-button>
    <hl-button equal @click="show=!show">
      <template #icon>
        <hl-icon><FillEarth /></hl-icon>
      </template>
    </hl-button>
    <hl-button equal @click="resetCenterZoom">
      <template #icon>
        <hl-icon><FillFocus /></hl-icon>
      </template>
    </hl-button>
    <hl-button equal @click="zoomIn">
      <template #icon>
        <hl-icon><FillPlus /></hl-icon>
      </template>
    </hl-button>
    <hl-button equal @click="zoomOut">
      <template #icon>
        <hl-icon><FillMinus /></hl-icon>
      </template>
    </hl-button>
    <card-popover :class="['map-types', show ? '' : 'hide']" @mouseleave="show=false">
      <div class="map-type">
        <div class="map-type-item" :class="{active: mapType === 'img'}" @click="changeTheme('image')">
          <img :src="imgImg" />
          <div class="type-text">影像</div>
        </div>
        <div class="map-type-item" :class="{active: mapType === 'dark'}" @click="changeTheme('dark')">
          <img :src="darkImg" />
          <div class="type-text">深色</div>
        </div>
        <div class="map-type-item" :class="{active: mapType === 'light'}" @click="changeTheme('light')">
          <img :src="lightImg" />
          <div class="type-text">浅色</div>
        </div>
      </div>
    </card-popover>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import darkImg from '@/assets/images/map/dark.png';
import lightImg from '@/assets/images/map/light.png';
import imgImg from '@/assets/images/map/img.png';
import { useLayout, useMap, useDataRefresher } from '@/hooks';
import { HlMessage } from 'hongluan-ui';

const { showMask } = useLayout();
const { mapType, resetCenterZoom, zoomIn, zoomOut, changeTheme } = useMap();
const { refreshOnce } = useDataRefresher();

const show = ref(false);

const refreshData = () => {
  refreshOnce();
  window.setTimeout(() => {
    HlMessage.success('已刷新');
  }, 3000);
};
</script>
<style lang="scss" scoped>
.map-actions {
  display: flex;
  flex-direction: column;
  row-gap: var(--md);
  position: absolute;
  bottom: 5.648148vh;
  // width: calc(var(--xxs) * 9);
  // right: calc(var(--xxs) * 125);
  :deep(.hl-button) {
    background: #042441;
    border: 1px solid #159AFF;
  }
}
.map-types {
  --type-width: calc(var(--xxs) * 20);
  --card-popover-body-paddding: calc(var(--xxs) * 3);
  position: absolute !important;
  opacity: 1;
  top: 0;
  right: calc(var(--type-width) / 1.5);
  transition: opacity .4s;
  .map-type {
    display: flex;
    column-gap: var(--sm);
    .map-type-item {
      width: var(--type-width);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      row-gap: var(--xxs);
      align-items: center;
      justify-content: center;
      img {
        width: 100%;
        height: calc(var(--xxs) * 12);
      }
      .type-text {
        width: 100%;
        height: calc(var(--xxs) * 7);
        display: flex;
        align-items: center;
        justify-content: center;
        background-image: url('@/assets/images/map/map-type-normal.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
      &:hover, &.active {
        img {
          border: 2px solid #F7D481;
        }
        .type-text {
          background-image: url('@/assets/images/map/map-type-active.png');
        }
      }
    }
  }
  &.hide {
    opacity: 0;
    pointer-events: none;
  }
}
</style>
