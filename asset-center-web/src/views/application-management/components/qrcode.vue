<template>
  <c-dialog
    :class="'dialog-center'"
    :title="'H5应用'"
    width="460px"
    :visible.sync="dialogFlag"
    append-to-body
    :before-close="cancel"
  >
    <div class="main-box">
      <div ref="qrimg" class="qrimg"></div>

      <span class="info">使用手机扫码访问</span>
      <div class="btn-box">
        <c-button v-copy="url" class="default-btn" style="position:relative;" @click="clickCopy"><span>复制链接</span> </c-button>
        <c-button type="gradual" @click="downloadImg">下载二维码</c-button>
      </div>
    </div>

  </c-dialog>
</template>

<script>
export default {
  props: {
    dialogFlag: {
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      default: ''
    }
  },
  watch: {

  },
  mounted() {
    this.$nextTick(() => {
      var qrcode = new window.QRCode(this.$refs.qrimg, {
        width: 200,
        height: 200,
        correctLevel: window.QRCode.CorrectLevel.Q
      });
      console.log(this.url, 'this.url')
      qrcode.makeCode(this.url);
    })
  },
  methods: {
    clickCopy() {
      this.$message.success('访问地址已复制')
    },
    downloadImg() {
      if (this.$refs.qrimg.querySelectorAll('img')[0]) {
        const imgUrl = this.$refs.qrimg.querySelectorAll('img')[0].src
        const img = new Image()
        img.setAttribute('crossOrigin', 'Anonymous')
        img.onload = function() {
          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d')
          canvas.width = img.width
          canvas.height = img.height
          context.drawImage(img, 0, 0, img.width, img.height)
          const url = canvas.toDataURL('images/png')
          const a = document.createElement('a')
          const event = new MouseEvent('click')
          a.download = 'default.png'
          a.href = url
          a.dispatchEvent(event)
        }
        img.src = imgUrl
      }
    },
    cancel() {
      this.close()
    },
    close(flag = false) {
      console.log('====', flag)
      this.$emit('close', flag)
    }
  }
}
</script>

<style lang="scss" scoped>
.main-box{
  padding: 16px 0;

  .qrimg{
    display: flex;
    justify-content: center;
  }
  .info{
    text-align: center;
    width: 100%;
    display: inline-block;
    margin: 16px 0 24px;
  }
  .btn-box{
    display: flex;
    justify-content: center;
  }
  .default-btn{
    background: #EBF9FF;
    color: #36A4FF;
    border: 1px solid #EBF9FF;
  }
}
</style>
