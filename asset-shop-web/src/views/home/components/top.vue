<!--/*
* @Author: dingli
* @Desc: 头部轮播图
* @Date: 2022-2-21
*/-->
<template>
  <div class="top-carousel">
    <c-carousel :autoplay="true" :interval="5000" :class="{current3:currentIndex===2,current4:currentIndex===3}" @change="change">
      <c-carousel-item v-for="item in data" :key="item.key">
        <div class="top" :style="`background-image:url(${item.img});`">
          <div class="width">
            <p class="text">{{ item.text }}</p>
          </div>
        </div>
      </c-carousel-item>
    </c-carousel>
  </div>
</template>
<script>
import img from '@/assets/imgs/home-bg.png'
export default {
  name: 'TopCarousel',
  props: {
    packType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      searchVal: '',
      // 解决2个item时loop方向问题、同时修改css样式
      data: [
        { key: 1, text: '实现资源的快速复用，协助高效开发，支持资源下载使用', img: img },
        { key: 2, text: '数字资源一键式安全共享，充分发挥资源价值', img: img },
        { key: 3, text: '实现资源的快速复用，协助高效开发，支持资源下载使用', img: img },
        { key: 4, text: '数字资源一键式安全共享，充分发挥资源价值', img: img }
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
  // background: url(~@/assets/imgs/home-bg.png) no-repeat center;
  background-repeat: no-repeat;
  background-position: bottom;
  text-align: left;
  .text {
    font-size: 28px;
    color: #FFFFFF;
  }
}
.search {
  position: absolute;
  bottom: 144px;
  width: 750px;
  height: 48px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 34px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  z-index: 99;
  left: calc(50% - 640px);
  input {
    padding-left: 18px;
    padding-right: 50px;
    height: 100%;
    border: none;
    width: 100%;
    font-size: 14px;
    background: transparent;
    outline: none;
    color: white;
    &:focus {
      border: none;
    }
  }
  input::-webkit-input-placeholder{
    color: #FFFFFF;
  }
  .icon {
    position: absolute;
    top: 0;
    right: 0;
    width: 56px;
    height: 100%;
    background: rgba(30, 111, 255, 0.4);
    border-radius: 0px 100px 100px 0px;
    border-left: 1px solid rgba(255, 255, 255, 0.4);
    cursor: pointer;
    text-align: center;
    &::after{
      font-family: element-icons!important;
      content: '\e778';
      line-height: 48px;
      color: white;
    }
  }
}
::v-deep.c-carousel {
  height: 360px !important;
  .c-carousel__container {
    height: 100%;
  }
  .c-carousel__indicators {
    bottom: 182px;
    left: calc(50% - 580px);
  }
  .c-carousel__button {
    width: 56px;
    height: 5px;
    background: rgba(255, 255, 255, 0.5);
    opacity: 1;
  }
  .c-carousel__indicator.is-active button {
    background: $primaryColor;
  }
  /**解决2个item时loop方向问题   start */
  .c-carousel__indicator:nth-child(3), .c-carousel__indicator:nth-child(4){
    display: none;
  }
  &.current3 .c-carousel__indicator:first-child button {
    background: $primaryColor;
  }
  &.current4 .c-carousel__indicator:nth-child(2) button {
    background: $primaryColor;
  }
  /**解决2个item时loop方向问题   end */
}
</style>
