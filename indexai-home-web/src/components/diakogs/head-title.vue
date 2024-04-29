<template>
  <div class="head-title-wrap">
    <div class="head-title" :class="{ 'large': $props.size === 'large' }">
      {{ title }}
      <el-popover placement="left" :width="280" trigger="hover" popper-class="popover">
        <template #reference>
          <div class="help" v-if="showPover"></div>
        </template>
        <template #default>
          <div class="pover-con" style="font-size:20px;">
            {{ poverMsg }}
          </div>
        </template>
      </el-popover>
    </div>
    <div>
      <slot name="right"></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  con: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'large'
  },
  showPover: {
    type: Boolean,
    default: false
  },
  poverMsg: {
    type: String,
    default: ''
  },
});
</script>
<style lang="scss" scoped>
.head-title-wrap {
  font-weight: 500;
  color: #FFFFFF;
  font-size: 18px;
  margin-bottom: 10px;
  display: flex;
  height: 30px;
  justify-content: space-between;
  align-items: center;
  position: relative;

  .large {
    font-size: 20px;
  }

  .head-title {
    padding-left: 16px;
    display: flex;
    align-items: center;

    // border-left: 4px solid #6E9ECC;
    // padding-left: 16px;
    &:before {
      position: absolute;
      top: 8px;
      left: 0;
      content: '';
      width: 4px;
      height: 14px;
      background: #6E9ECC;
    }
  }
}

.help {
  color: #ffffff !important;
  cursor: pointer;
  width: 17px;
  height: 16px;
  background: url('/@/assets/images/home/more.png') no-repeat;
  background-size: 100% 100%;
  margin-left: 10px;
}

.pover-con {
  width: 260px;
  background: rgba(6, 18, 79, 0.93);
  backdrop-filter: blur(6px);
  font-weight: 400;
  color: #ffffff;
  line-height: 22px;
  font-size: 14px;
}
</style>

