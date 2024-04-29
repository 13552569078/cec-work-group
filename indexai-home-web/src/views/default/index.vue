<template>
  <div class="default-page">
    <div class="no-data-img"></div>
    <div class="no-data-text">用户无相关权限或者平台未配置菜单</div>
  </div>
</template>

<style lang="scss" scoped>
.default-page {
  padding-bottom: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .no-data-img {
    width: 370px;
    height: 230px;
    background: url('/@/assets/images/common/no-data.png') no-repeat;
    background-size: 100% 100%;
  }
  .no-data-text {
    color: #666;
    margin-top: 20px;
  }
}
</style>
