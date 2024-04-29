<template>
  <div class="dialogs-head-wrap">
    <div class="head-title">
      <span>{{ title }}</span>
    </div>
    <div class="slider">
      <div class="slider-con"></div>
    </div>
    <img :src="imageUrl" @click="preview">
    <!-- <div class="bottom">
      <div class="left"></div>
      <div class="con">{{ year }}</div>
      <div class="right"></div>
    </div> -->
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    default: '/file/nature/1.png'
  },
  reportUrl: {
    type: String,
    default: ''
  },
  year: {
    type: String,
    default: '2018年'
  }
});

const preview = () => {
  window.open(props.reportUrl, '_blank')
}

</script>
<style lang="scss" scoped>
.dialogs-head-wrap {
  color: #ffffff;
  width: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .head-title {
    height: 44px;
    width: 100%;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 44px;
    text-shadow: 0px 0px 6px rgba(0, 188, 194, 0.63);
    display: flex;
    justify-content: center;
    background: url('/@/assets/images/home/report-title-bg.png') no-repeat;
    background-size: contain;
  }

  .slider {
    display: flex;
    justify-content: center;

    .slider-con {
      background: url('/@/assets/images/home/slider-bg.png') no-repeat;
      background-size: contain;
      width: 118px;
      height: 67px;
    }
  }

  img {
    width: 240px;
    height: 316px;
    cursor: pointer;
  }

  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 6px;
    margin-top: 20px;

    .left {
      background: url('/@/assets/images/home/report-right.png') no-repeat;
      background-size: contain;
      width: 82px;
      height: 9px;
    }

    .con {
      font-size: 18px;
      font-family: YouSheBiaoTiHei;
      color: #FFFFFF;
      line-height: 31px;
      font-weight: bold;
      background: linear-gradient(180deg, #FFFFFF 0%, #9BFDF0 100%, #9BFDF0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      flex: 1;
    }

    .right {
      background: url('/@/assets/images/home/report-left.png') no-repeat;
      background-size: contain;
      width: 82px;
      height: 9px;
    }
  }
}
</style>

