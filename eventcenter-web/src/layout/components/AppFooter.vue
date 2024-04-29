<template>
  <div class="footer">
    <div class="copy" />
    <ul class="statement">
      <li>法律声明 | 隐私保护 | 举报不良信息 | 入网信息安全责任书 </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'AppFooter',
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/variables.scss";
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    height: 100%;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #C3C5C6;
    line-height: 26px;
    .copy {
      display: flex;
      flex-direction: column;
    }
    .statement {
      list-style: none;
    }
  }

</style>
