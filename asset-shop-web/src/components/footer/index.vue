<!--/*
* @Author: dingli
* @Desc: 页脚
* @Date: 2022-1-25
*/-->
<template>
  <div class="footer">
    <span>{{ copyRightInfo.addr }}</span>
    <span>{{ copyRightInfo.copyright }}</span>
  </div>
</template>
<script>
export default {
  name: 'PageFooter',
  components: {},
  data() {
    return {}
  },
  computed: {
    copyRightInfo() {
      if (window.copyRightInfo) return window.copyRightInfo
      return {
        addr: '企业地址 北京市海淀区 万寿路街道 华熙',
        copyright: 'Copyright ©2021SITAPIX | ALL RIGHTS RESERVED 版权所有'
      }
    }
  }
}
</script>
<style scoped lang="scss">
.footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  padding-bottom: 13px;
  padding-left: 15%;
  padding-right: 15%;
  width: 100%;
  height: 340px;
  background: url(~@/assets/footer.png) no-repeat center;
  background-size: 100% 100%;
  color: white;
}
</style>
