<template>
  <hl-dialog :model-value="videoShow" class="md-dialog" width="650px" title="查看视频" @close="handleClose">
    <video controls id="my-player" muted :autoplay="true"></video>
  </hl-dialog>
</template>

<script>
import flvjs from 'flv.js'

export default {
  name: 'video-flv',
  data() {
    return {
      videoShow: false,
      // src: 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov',
      flvPlayer: null,
      videoMaskShow: true,
      errMsg: '设备不在线',
    }
  },
  props: {
    id: {
      type: String,
      default: new Date().getTime() + '',
    },
    src: {
      type: String,
      default: '',
    },
    videoData: {
      type: Object,
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    src(val) {
      if (val) {
        this.videoShow = true
        // this.flv_destroy('close')
        this.videoMaskShow = true
        this.flv_play()
      }
    },
    videoShow(val) {
      if (!val) this.flv_destroy()
    },
  },
  methods: {
    handleClose() {
      this.videoMaskShow = false
      this.videoShow = false
      this.flv_destroy()
      this.$emit('close')
    },
    init(id, src) {
      let self = this
      // this.flv_destroy()
      let tag = document.getElementById("my-player")
      if (tag && flvjs.isSupported()) {
        this.flvPlayer = flvjs.createPlayer(
          { type: 'flv', url: src, isLive: true, hasAudio: false },
          {
            isLive: true,
            enableWorker: false,
            enableStashBuffer: false,
            stashInitialSize: 128,
            // videoStateMonitorInterval: 1000,
            // decreaseDurationStep: 1,
            // enableDurationMonitor: true,
            // enableVideoFrozenMonitor: true,
          }
        )
        this.flvPlayer.attachMediaElement(tag)
        this.flvPlayer.load()
        this.flvPlayer.play()
      }
    },
    flv_play() {
      this.$nextTick(() => {
        this.init(
          this.id,
          this.src
        )
      })
    },
    flv_destroy() {
      if (this.flvPlayer) {
        this.flvPlayer.pause()
        this.flvPlayer.unload()
        this.flvPlayer.detachMediaElement()
        this.flvPlayer.destroy()
        this.flvPlayer = null
      }
    },
  },
  beforeDestroy() {
    this.flv_destroy()
  }
}
</script>
<style lang="scss" scoped>
#my-player {
  width: 600px;
  height: 500px;
  object-fit: fill;
}
</style>
