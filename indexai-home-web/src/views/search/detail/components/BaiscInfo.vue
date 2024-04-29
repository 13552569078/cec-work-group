<template>
  <div class="basic-info">
    <div class="title">
      <TextTooltip :text="activeItem?.content" />
    </div>
    <div class="detail">
      <div class="item">
        <svg-icon icon-class="type-icon" /> 资源类型：{{ activeItem?.typeName }}
      </div>
      <div class="item">
        <svg-icon icon-class="dept-icon" /> 所属部门：{{ activeItem?.resManageOrg }}
      </div>
      <div class="item">
        <svg-icon icon-class="time-icon" /> 注册时间：{{ activeItem?.submitTime }}
      </div>
    </div>
    <div class="info">{{ activeItem?.description }}</div>
  </div>
</template>
<script lang="ts" setup>
defineProps({
  activeItem: {
    type: Object,
    default: () => {}
  }
})
</script>
<style lang="scss" scoped>
.basic-info {
  width: 748px;
  height: 239px;
  background: #0e1b5a;
  .title {
    width: 386px;
    height: 54px;
    line-height: 54px;
    background: url('/@/assets/images/search/detail-title-bg.png') no-repeat;
    background-size: 100% 100%;
    .tooltip-wrap {
      padding-left: 20px;
      font-size: 20px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
    }
  }
  .detail {
    height: 70px;
    padding: 24px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    display: flex;
    .item {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 22px;
      margin-right: 24px;
      svg {
        margin-right: 3px;
      }
    }
  }
  .info {
    padding: 24px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 22px;
    height: 114px;
    @include ellipsis(3);
  }
}
</style>
