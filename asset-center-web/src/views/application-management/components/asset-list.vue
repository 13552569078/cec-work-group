<!--
 * @Description: 资源列表
 * @Author: lianpeng
 * @Date: 2021-09-13
-->
<template>
  <div class="main">
    <ul class="item-content">
      <li class="wid-trans" :class="currIndex === 1 ? 'item bg1':'item-normal bg1-1'"
          @click="currIndex === 1?'':changeIndex(1)">
        <div v-if="currIndex === 1" class="bet ">
          <div class="item-left ">
            <p class="name">资源类型</p>
            <p class="info">资源分类管理，统一标准和规范</p>
          </div>
          <img class="item-right" src="@/assets/swiper/zclx.png" />
        </div>
        <div v-else>
          <img class="item-top" src="@/assets/swiper/zclx.png" />
          <p class="item-bottom">资源类型</p>
        </div>
      </li>
      <li class="wid-trans" :class="currIndex === 2 ? 'item bg2':'item-normal bg2-1'"
          @click="currIndex === 2?'':changeIndex(2)">
        <div v-if="currIndex === 2" class="bet ">
          <div class="item-left">
            <p class="name">资源标签</p>
            <p class="info">自定义标签，提高资源检索效率</p>
          </div>
          <img class="item-right" src="@/assets/swiper/zcbq.png" />
        </div>
        <div v-else>
          <img class="item-top" src="@/assets/swiper/zcbq.png" />
          <p class="item-bottom">资源标签</p>
        </div>
      </li>
      <li class="wid-trans" :class="currIndex === 3 ? 'item bg3':'item-normal bg3-1'"
          @click="currIndex === 3?'':changeIndex(3)">
        <div v-if="currIndex === 3" class="bet ">
          <div class="item-left">
            <p class="name">场景归属</p>
            <p class="info">场景化归属，便于资源共享和复用</p>
          </div>
          <img class="item-right" src="@/assets/swiper/cjgs.png" />
        </div>
        <div v-else>
          <img class="item-top" src="@/assets/swiper/cjgs.png" />
          <p class="item-bottom">场景归属</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    defaultIndex: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      currIndex: -1
    }
  },
  mounted() {
    this.currIndex = this.defaultIndex
  },
  methods: {
    changeIndex(index) {
      this.currIndex = index
      this.$emit('getCurrIndex', index)
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  width: 70%;
  .info {
    animation-name: moveRight;
    animation-duration: 1s;
    animation-fill-mode: forwards;
  }
  .name {
    animation-name: nameMoveRight;
    animation-duration: 1s;
    animation-fill-mode: forwards;
  }
  .item-right {
    animation-name: imgMoveRight;
    animation-duration: 1s;
    animation-fill-mode: forwards;
  }
}
@keyframes imgMoveRight {
  from {
    width: 0;
  }
  to {
    width: 210px;
  }
}
@keyframes moveRight {
  from {
    font-size: 0;
  }
  to {
    font-size: 18px;
  }
}
@keyframes nameMoveRight {
  from {
    font-size: 0;
  }
  to {
    font-size: 32px;
  }
}
.item-content {
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}
.item {
  width: 70%;
}
.bet {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.item-normal {
  width: 15%;
  height: 232px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.item-top {
  display: block;
  width: 116px;
  margin-bottom: 10px;
}
.item-bottom {
  width: 100%;
  text-align: center;
  font-size: 26px;
  font-weight: 500;
  color: #ffffff;
  line-height: 36px;
  text-shadow: 0px 2px 20px rgba(0, 0, 0, 0.5);
}
.item-right {
  display: block;
  width: 210px;
  height: 210px;
}

.bg1 {
  background-image: url('~@/assets/swiper/cjgsbg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.bg2 {
  background-image: url('~@/assets/swiper/zcbqbg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.bg3 {
  background-image: url('~@/assets/swiper/zclxbg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.bg1-1 {
  background-image: url('~@/assets/swiper/zclx1.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.bg2-1 {
  background-image: url('~@/assets/swiper/zcbq1.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.bg3-1 {
  background-image: url('~@/assets/swiper/cjgs1.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.wid-trans {
  border-right: 2px solid #fff;
  transition: width 1s;
  &:last-child {
    border: 0;
  }
}
.name {
  font-size: 32px;
  font-weight: 600;
  color: #202020;
  line-height: 45px;
}
.info {
  font-size: 18px;
  font-weight: 400;
  color: #4b4b4b;
  margin-top: 10px;
}
</style>
