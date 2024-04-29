<!--
@Author: lism
@Description: 自定义地图工具操作
@Date: 2024-01-03
-->
<template>
  <ul class="map-control">
    <li class="zoom-in map-control-item" @click="$emit('zoomIn')" />
    <li class="zoom-out map-control-item" @click="$emit('zoomOut')" />
    <li class="reset map-control-item" @click="$emit('reset')" />
  </ul>
</template>

<script>
export default {
  name: 'MapConTrol'
}
</script>

<style scoped lang="scss">
  .map-control {
    position: absolute;
    right: 15px;
    bottom: 15px;
    z-index: 999;
    .map-control-item {
      background-repeat: no-repeat;
      background-size: 14px 14px;
      background-position: center;
      cursor: pointer;
      width: 32px;
      height: 32px;
      margin-bottom: 8px;
      background-color: rgba(#fff, 0.9);
      border-radius: 2px;
      box-shadow: 0px 3px 10px 0px rgba(121,126,137,0.3);
      &.zoom-in {
        background-image: url('~@/assets/map/zoom-in@2x.png');
        &:hover {
          background-image: url('~@/assets/map/zoom-in-hover@2x.png');
        }
      }
      &.zoom-out {
        background-image: url('~@/assets/map/zoom-out@2x.png');
        &:hover {
          background-image: url('~@/assets/map/zoom-out-hover@2x.png');
        }
      }
      &.reset {
        background-image: url('~@/assets/map/reset@2x.png');
        &:hover {
          background-image: url('~@/assets/map/reset-hover@2x.png');
        }
      }
    }
  }
</style>
