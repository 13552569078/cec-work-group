<!--
 * @description iframe 容器, 用来承载第三方平台内部跳转
 * @date 2021-11-11
 * @author lism
-->
<template>
  <div v-loading="loading" class="other-platform">
    <iframe ref="iframe" :src="path" frameborder="0" class="iframe-wrapper" />
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      loading: false
    }
  },
  computed: {
    path() {
      const path = this.$route.query.path
      return path
    }
  },
  mounted() {
    this.iframeLoad()
  },
  methods: {
    iframeLoad() {
      this.loading = true
      const iframe = this.$refs.iframe
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

<style lang="scss" scoped>
.other-platform {
  z-index: 100;
  width: 100%;
  height: 100%;
  .iframe-wrapper {
    width: 100%;
    height: 100%;
  }
}
</style>
