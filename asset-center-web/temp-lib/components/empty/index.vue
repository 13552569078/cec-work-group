<!--
 * @Description:空组件，可用于无数据或者404的显示
 * @Author: wyh19
 * @Date: 2020-09-14
-->
<template>
  <div
    class="empty-wrapper"
    :style="{width:width}"
  >
    <img
      class="empty-image"
      :src="imgPath"
    >
    <div class="empty-text">
      {{ text }}
    </div>
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
      default: '暂无任何内容'
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
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.empty-image {
  width: 100%;
}
.empty-text {
  font-size: 14px;
  color: #d6d6d6;
  margin-top: 20px;
}
</style>
