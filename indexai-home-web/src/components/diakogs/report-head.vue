<template>
  <div class="dialogs-head-wrap">
    <div class="head-title">
      <span>{{ title }}</span>
      <div class="robote"></div>
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
  }
});
</script>
<style lang="scss" scoped>
.dialogs-head-wrap {
  color: #ffffff;
  height: 54px;
  width: 100%;
  display: flex;
  flex-direction: column;

  .head-title {
    height: 54px;
    font-size: 20px;
    font-weight: 500;
    line-height: 54px;
    padding-left: 24px;
    background: url('/@/assets/images/home/title-bg.png') no-repeat;
    background-size: contain;
    display: flex;
    justify-content: space-between;
  }
}
</style>

