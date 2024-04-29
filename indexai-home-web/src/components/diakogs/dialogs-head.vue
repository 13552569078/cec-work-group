<template>
  <div class="dialogs-head-wrap">
    <div class="head-title">
      <span>{{ title }}</span>
      <div class="robote"></div>
    </div>
    <div class="head-con" :class="{ 'large': $props.size === 'large' }">{{ con }}</div>
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
  }
});
</script>
<style lang="scss" scoped>
.dialogs-head-wrap {
  color: #ffffff;
  height: 148px;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #0E1B5A;

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
    font-size: 20px;
  }

  .head-con {
    display: flex;
    align-items: center;
    flex: 1;
    padding: 0 24px;
    font-weight: 400;
    line-height: 24px;
    font-size: 18px;

    &.large {
      font-size: 20px;
    }
  }
}

.robote {
  height: 50px;
  width: 50px;
  cursor: pointer;
  background: url('/@/assets/images/home/robote.png') no-repeat;
  background-size: contain;
  margin: 10px;
}
</style>

