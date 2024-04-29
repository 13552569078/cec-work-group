<template>
  <div class="small-title">
    <div class="title">
      <div class="main-title">
        <div class="title-icon"></div>
        <div class="title-name"><TextTooltip :text="titleName" /></div>
      </div>
      <div class="sub-title-name">{{ subTitleName }}</div>
    </div>
    <div class="operation"><slot></slot></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    titleName: {
      type: String
    },
    subTitleName: {
      type: String,
      required: false
    }
  }
})
</script>

<style lang="scss" scoped>
.small-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  .title {
    display: flex;
    flex-direction: column;
    .main-title {
      display: flex;
      align-items: center;
      .title-icon {
        width: 4px;
        height: 14px;
        background: #6e9ecc;
        margin-right: 8px;
        flex-shrink: 0;
      }
      .title-name {
        font-size: 16px;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        line-height: 24px;
      }
    }
    .sub-title-name {
      margin-left: 12px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #8a8a8a;
    }
  }
  .operation {
    margin-left: 16px;
  }
}
</style>
