<template>
  <cestc-dialog
    v-bind="$attrs"
    title="实时视频"
    width="960px"
    top="10vh"
    v-on="$listeners"
  >
    <div class="live-video">
      <video-player class="cus-video" :sources="vSrc" is-live />
    </div>
    <div slot="footer" class="cus-foot">
      <el-button @click.stop="_cancle">关闭</el-button>
    </div>
  </cestc-dialog>
</template>

<script>
import service from '@/api/dispatch'

export default {
  name: 'GovernancePictureWebVideoLive',
  props: {
    videoObj: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      vSrc: []
    }
  },
  mounted() {
    this.getDetail()
  },

  methods: {
    getDetail() {
      if (this.videoObj.cameraIndexCode) {
        service.getStreamUrl({ cameraIndexCode: this.videoObj.cameraIndexCode || '' }).then(res => {
          if (res.data) {
            this.vSrc = [{ type: 'application/x-mpegURL', src: res.data || [] }]
          }
        })
      } else {
        this.$message.error('未获取到视频流编码')
      }
    },
    _cancle() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
    .live-video {
        // height: 500px;
        .cus-video{
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
        }

    }
    .cus-foot {
          margin-top: 20px;
        }
</style>
