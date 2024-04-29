<!--
 * @description 视频组件，支撑 mp4、ogg 等视频文件, m3u8, rtmp等直播流文件
 * videojs-flash  //播放rtmp视频要安装; videojs-contrib-hls  //播放m3u8视频要安装
 * @date 2022-01-11
 * @author lism
-->
<template>
  <video-player
    ref="videoPlayer"
    class="video-player vjs-custom-skin"
    :playsinline="true"
    :options="playerOptions"
    @play="onPlayerPlay($event)"
    @pause="onPlayerPause($event)"
    @ended="onPlayerEnded($event)"
    @waiting="onPlayerWaiting($event)"
    @playing="onPlayerPlaying($event)"
    @loadeddata="onPlayerLoadeddata($event)"
    @timeupdate="onPlayerTimeupdate($event)"
    @canplay="onPlayerCanplay($event)"
    @canplaythrough="onPlayerCanplaythrough($event)"
    @statechanged="playerStateChanged($event)"
    @ready="playerReadied"
  />
</template>

<script>
import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'

import 'videojs-flash'
import 'videojs-contrib-hls'

export default {
  name: 'CestcVideo',
  components: {
    videoPlayer
  },
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      playerOptions: {}, // 视频播放配置
      // 基本配置
      options: {
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
        autoplay: false, // 如果为true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 是否视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: 'video/mp4', // 类型
            src: '' // url地址
          }
        ],
        poster: '', // 封面地址
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: false, // 是否显示剩余时间功能
          fullscreenToggle: true // 是否显示全屏按钮
        }
      }
    }
  },
  computed: {
    // 当前播放对象实例
    videoObj() {
      return this.$refs.videoPlayer.player
    },
    // 根据传过来的视频地址，判断是否直播流
    isLive() {
      return this.src.indexOf('m3u8') > -1 || this.src.indexOf('rtmp') > -1
    },
    videoType() {
      let type = 'video/mp4'
      if (this.src.indexOf('m3u8') > -1) {
        type = 'application/x-mpegURL'
      } else if (this.src.indexOf('rtmp') > -1) {
        // TODO: 有问题，
        type = 'rtmp/hls'
      } else {
        type = 'video/mp4'
      }
      return type
    }
  },
  watch: {
    src(val) {
      if (val) {
        this.initPlayer()
      }
    }
  },
  mounted() {
    this.initPlayer()
  },
  methods: {
    initPlayer() {
      this.playerOptions = Object.assign(this.options, {
        sources: [
          {
            type: this.videoType,
            src: this.src
          }
        ]
      })
    },
    // 播放回调
    onPlayerPlay(player) {
      console.log('player play!', player)
    },

    // 暂停回调
    onPlayerPause(player) {
      console.log('player pause!', player)
    },

    // 视频播完回调
    onPlayerEnded($event) {
      console.log('onPlayerEnded!')
    },

    // DOM元素上的readyState更改导致播放停止
    onPlayerWaiting($event) {
      console.log('onPlayerWaiting!')
    },

    // 已开始播放回调
    onPlayerPlaying($event) {
      console.log('onPlayerPlaying!')
    },

    // 当播放器在当前播放位置下载数据时触发
    onPlayerLoadeddata($event) {
      console.log('onPlayerLoadeddata!')
    },

    // 当前播放位置发生变化时触发。
    onPlayerTimeupdate($event) {
      // console.log('onPlayerTimeupdate!');
    },

    // 媒体的readyState为HAVE_FUTURE_DATA或更高
    onPlayerCanplay(player) {
      // console.log('player Canplay!', player)
    },

    // 媒体的readyState为HAVE_ENOUGH_DATA或更高。这意味着可以在不缓冲的情况下播放整个媒体文件。
    onPlayerCanplaythrough(player) {
      // console.log('player Canplaythrough!', player)
    },

    // 播放状态改变回调
    playerStateChanged(playerCurrentState) {
      // console.log('player current update state', playerCurrentState);
    },

    // 将侦听器绑定到组件的就绪状态。与事件监听器的不同之处在于，如果ready事件已经发生，它将立即触发该函数。。
    playerReadied(player) {
      console.log('example player 1 readied', player)
    }
  }
}
</script>

<style scoped lang="scss">
.video-player {
  width: 100%;
  height: 100%;
}
</style>
