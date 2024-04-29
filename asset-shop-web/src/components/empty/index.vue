<!--
 * @Description:空组件，可用于无数据或者404的显示
 * @Author: wyh19
 * @Date: 2020-09-14
-->
<template>
  <div class="empty-wrapper" :style="{width:width}">
    <img class="empty-image"
         alt="empty" :src="imgPath">
    <div class="empty-text">{{ text }}</div>
  </div>
</template>

<script>

export default {
  props: {
    type: {
      type: String,
      default: 'no-content'
    },
    text: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '100%'
    }
  },
  computed: {
    imgPath() {
      return require(`./components/${this.type}.png`)
    }
  }
}
</script>

<style scoped lang="scss">

.empty-wrapper {
  position: relative;
  text-align: center;
}
.empty-image {
  max-width: 520px;
  // width: 100%;
  // margin-top: 10vh;
}
.empty-text {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  font-size: 16px;
  color: #8A8A8A;
  text-align: center;
}
</style>
