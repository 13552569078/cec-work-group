<!--/*
* @Author: dingli
* @Desc: 头部轮播图
* @Date: 2022-2-21
*/-->
<template>
  <div class="top-carousel">
    <div class="top" :style="`background-image:url(${dataApp[0].img});`">
      <div class="width">
        <p class="text">{{ dataApp[0].text }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import imgApp from '@/assets/imgs/bunner-app.png'
export default {
  name: 'TopCarousel',
  data() {
    return {
      searchVal: '',
      dataApp: [
        { key: 4, text: '基于数字化平台，提供应用快速构建服务，赋能伙伴及生态', img: imgApp }
      ],
      currentIndex: 0
    }
  },
  methods: {
    handleSearch() {
      this.$emit('search', this.searchVal)
      this.searchVal = ''
    },
    change(n) {
      this.currentIndex = n
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/styles/variables.scss';
.top-carousel {
  position: relative;
  height: 360px !important;
}
.width {
  width: 1280px;
  margin: auto;
}
.top {
  width: 100%;
  height: 360px;
  padding-top: 116px;
  background-repeat: no-repeat;
  background-position: bottom;
  text-align: left;
  .text {
    font-size: 28px;
    color: #FFFFFF;
  }
}
</style>
