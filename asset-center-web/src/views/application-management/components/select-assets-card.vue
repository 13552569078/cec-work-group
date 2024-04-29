<!--
 * @Description: 资源选择组件 动效
 * @Author: lianpeng
 * @Date: 2021-09-08
-->

<template>
  <div class="s-asset-card" :class="big?'big':''" @mouseover="showList" @mouseleave="hiddenList">
    <div class="sa-card" :class="!show?'move-right width100':'move-left width50'">
      <i :class="show?big?'bg-move-big':'bg-move':''" :style="'background:url('+bgurl+')'"
         class="sa-icon " />
      <div class="sa-btn" :class="!show?'bottom-in':'bottom-out hidden'">选择资源</div>
    </div>
    <div v-show="show" class="icon-right"></div>
    <div v-show="show" class="sa-list">
      <div v-for="item,index in assetTypeList" :key="item.value" class="sa-list-item leftIn"
           :class="'delay'+(index+1)*200" @click.stop="clickAssetType(item.value)">
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<script>
import { assetTypeList } from '@/config'
export default {
  components: {

  },
  props: {
    big: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      assetTypeList: assetTypeList,
      show: false,
      bgurl: this.big ? './static/imgs/start-big.png' : './static/imgs/start.png'
    }
  },
  watch: {
    big() {
      this.bgurl = this.big ? './static/imgs/start-big.png' : './static/imgs/start.png'
    }
  },
  methods: {
    showList() {
      this.show = true
    },
    hiddenList() {
      this.show = false
    },
    clickAssetType(type) {
      this.$emit('checkAssetType', type)
    }
  }

}
</script>

<style lang="scss" scoped>
.big.s-asset-card {
  width: 480px !important;
  height: 300px !important;
}
.big {
  .sa-icon {
    width: 240px !important;
    height: 240px !important;
  }
  .icon-right {
    margin-right: 16px;
  }
  .bg-move-big {
    animation: test_anim_big steps(50) 1s forwards;
  }
  @keyframes test_anim_big {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 0 -12000px;
    }
  }
}
.s-asset-card {
  width: 296px;
  height: 146px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.4s ease;
  .sa-card {
    transition: 1s;
    cursor: pointer;
    .sa-icon {
      display: block;
      width: 90px;
      height: 90px;
      margin: 0px auto 8px;
    }
    .sa-btn {
      width: 96px;
      height: 32px;
      background: #eaf5ff;
      border-radius: 2px;
      border: 1px solid #36a4ff;
      font-size: 14px;
      margin: auto;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #36a4ff;
      transition: 0.5s;
      line-height: 32px;
      text-align: center;
      cursor: pointer;
    }
    .bottom-in {
      animation-name: bottomIn;
      animation-duration: 0.5s;
    }
    .bottom-out {
      display: none;
      // animation-name: bottomOut;
      // animation-duration: 1s;
      // animation-fill-mode: forwards;
    }
  }
  .bg-move {
    animation: test_anim steps(51) 1s forwards;
  }
  @keyframes test_anim {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 0 -4590px;
    }
  }
  .icon-right {
    width: 25px;
    height: 25px;
    background: url(~@/assets/application/assets-icon-right.png) no-repeat;
    margin-right: 13px;
  }
  .sa-list {
    width: 104px;
    .sa-list-item {
      width: 104px;
      height: 28px;
      margin-bottom: 2px;
      background: url(~@/assets/application/assets-type-item.png) no-repeat;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #4b4b4b;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
    .sa-list-item:hover {
      width: 104px;
      height: 28px;
      margin-bottom: 2px;
      background: url(~@/assets/application/assets-type-item-hover.png)
        no-repeat;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
    .leftIn {
      animation-name: leftIn;
      animation-duration: 0.5s;
    }

    .delay200 {
      animation-delay: 200ms;
      animation-fill-mode: backwards !important;
    }
    .delay400 {
      animation-delay: 300ms;
      animation-fill-mode: backwards !important;
    }
    .delay600 {
      animation-delay: 400ms;
      animation-fill-mode: backwards !important;
    }
    .delay800 {
      animation-delay: 500ms;
      animation-fill-mode: backwards !important;
    }
    .delay1000 {
      animation-delay: 600ms;
      animation-fill-mode: backwards !important;
    }
  }
  .move-right {
    animation-name: moveRight;
    animation-duration: 0.5s;
    animation-fill-mode: forwards;
  }
  .width100 {
    width: 100%;
  }
  .width50 {
    width: 50%;
  }
  @keyframes moveRight {
    from {
      transform: translateX(-50px);
    }
    to {
      transform: translateX(0px);
    }
  }
  @keyframes leftIn {
    from {
      transform: translateX(-50px);
      opacity: 0;
    }
    to {
      transform: translateX(0px);
      opacity: 1;
    }
  }
  @keyframes bottomIn {
    from {
      transform: translateY(-50px);
      opacity: 0;
    }
    to {
      transform: translateY(0px);
      opacity: 1;
    }
  }
  @keyframes bottomOut {
    from {
      transform: translateY(0px);
      color: transparent;
      opacity: 1;
      display: static;
    }
    to {
      transform: translateY(-20px);
      height: 0;
      opacity: 0;
      color: transparent;
      display: none;
    }
  }
}
</style>
