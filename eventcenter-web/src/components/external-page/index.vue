<template>
  <div v-loading="loading" class="external-pgae-container">
    <iframe
      v-if="showFrame"
      ref="iframeRef"
      :src="externalPath"
      class="frame"
      frameborder="0"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      externalPath: '',
      showFrame: false,
      loading: false
    }
  },
  created() {
    const path = this.$route?.meta?.externalPath || ''
    this.showFrame = !!path
    if (path.includes('?')) {
      this.externalPath = `${path}&token=${localStorage.getItem('token')}`
    } else {
      this.externalPath = `${path}?token=${localStorage.getItem('token')}`
    }
  },
  mounted() {
    this.iframeLoad()
  },
  methods: {
    async iframeLoad() {
      await this.$nextTick()
      this.loading = true
      const iframe = this.$refs.iframeRef
      if (iframe.attachEvent) {
        // IE
        iframe.attachEvent('onload', () => {
          this.loading = false
        })
      } else {
        // 非IE
        iframe.onload = () => {
          this.loading = false
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.external-pgae-container {
  height: 100%;
  width: 100%;
  .frame {
    height: 100%;
    width: 100%;
  }
}
</style>
