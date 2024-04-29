<template>
  <div v-loading="loading" class="web-page-wrapper">
    <iframe ref="iframe-page" :src="url" frameborder="no" border="0" class="web-page-wrapper" @load="handleLoaded" />
  </div>
</template>

<script>
import { bus } from '@/utils'
import { getWindowParentRef } from '../../utils'
export default {
  name: 'WebPage',
  props: {
    url: String
  },
  data() {
    return {
      loading: true
    }
  },
  created() {
    bus.$on('breadcrumb-iframe', this.getBreadcrumb)
    if (!window.embed) {
      window.addEventListener('message', this.getChildMsg)
    }
  },
  beforeDestroy() {
    bus.$off('breadcrumb-iframe', this.getBreadcrumb)
    window.removeEventListener('message', this.getChildMsg)
  },
  methods: {
    handleLoaded() {
      this.loading = false
    },
    getBreadcrumb(ev) {
      // 对子系统广播 当前点击的面包屑
      this.sendMsgToChild({ type: 'breadcrumb', msg: { item: ev.item }})
    },
    sendMsgToChild(msg) {
      this.$refs['iframe-page'].contentWindow.postMessage(msg, getWindowParentRef())
    },
    getChildMsg(ev) {
      this.$emit('iframeMsg', ev.data)
    }
  }
}
</script>

<style scoped lang="scss">
.web-page-wrapper {
  width: 100%;
  height: 100%;
  border: none;
  overflow: hidden;
}
</style>
