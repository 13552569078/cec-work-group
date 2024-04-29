<template>
  <div class="banner-con-wrap">
    <banner-item v-for="(item, index) in list1" :data="item" :key="index"></banner-item>
  </div>
  <!-- <el-carousel indicator-position="none" :interval="LOOP_INTERVAL" class="carousel" arrow="never">
    <el-carousel-item>
      <div class="banner-con-wrap">
        <banner-item v-for="(item, index) in list1" :data="item" :key="index"></banner-item>
      </div>
    </el-carousel-item>
    <el-carousel-item>
      <div class="banner-con-wrap">
        <banner-item v-for="(item, index) in list2" :data="item" :key="index"></banner-item>
      </div>
    </el-carousel-item>
  </el-carousel> -->
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { BannerItem } from './index'
import { LOOP_INTERVAL } from '/@/common/constant'

const list1 = [{
  value: '0',
  unit: '项',
  desc: '市级十四五规划',
  dangerValue: '0',
  normalValue: '0'
}, {
  value: '0',
  unit: '项',
  desc: '市级专项',
  dangerValue: '0',
  normalValue: '0'
}, {
  value: '0',
  unit: '项',
  desc: '区级十四五专项',
  dangerValue: '0',
  normalValue: '0'
}]

const list2 = [{
  value: '4',
  unit: '项',
  desc: '市级十四五规划',
  dangerValue: '1',
  normalValue: '3'
}, {
  value: '6',
  unit: '项',
  desc: '市级专项',
  dangerValue: '2',
  normalValue: '3'
}, {
  value: '8',
  unit: '项',
  desc: '区级十四五专项',
  dangerValue: '3',
  normalValue: '5'
}]

</script>

<style lang="scss" scoped>
.banner-con-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

// ::v-deep(.el-carousel__container) {
//   height: 170px !important;
// }
</style>
