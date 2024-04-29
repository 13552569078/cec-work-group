<!--
 * @Description: 网页全屏控制开关
 * @Author: zs
 * @Date: 2021-11-17
-->
<template>
  <c-tooltip class="item" content="切换全屏" placement="bottom">
    <i class="c-icon-full-screen full-screen" @click="changeFullscreen"></i>
  </c-tooltip>
</template>
<script>
export default {
  name: 'FullScreen',
  data() {
    return {
      status: false
    }
  },
  methods: {
    changeFullscreen() {
      this.status = this.isFullScreen()
      if (this.status) {
        this.exitFullscreen(document.querySelector('body'))
      } else {
        this.launchFullScreen(document.querySelector('body'))
      }
    },
    isFullScreen() {
      return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement
    },
    launchFullScreen(element) {
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen()
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen()
      }
    },
    exitFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      }
    }
  }
}
</script>

<style scoped lang='scss'>
.full-screen {
  font-size: 24px;
  color: #ffffff;
  cursor: pointer;
  margin-right: 20px;
}
</style>
