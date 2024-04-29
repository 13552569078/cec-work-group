<template>
  <div class="not-permission">
    <img src="../../assets/404_images/暂无任何内容.png" alt="" width="800px">
    <div class="no-data-text">用户无相关权限或者平台未配置菜单</div>
  </div>
</template>

<script>
export default {
  name: 'NoPermission'
}
</script>
<style lang="scss" scoped>
.not-permission {
  padding-bottom: 20px;
  height: 100%;
  flex-direction: column;
  @include centerTocenter;
  .no-data-text {
    color: #666;
    margin-top: 20px;
  }
}
</style>
