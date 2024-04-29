<template>
  <div class="page-content-wrapper" :class="{'page-wrapper-mini': isMiniLayout, 'has-iframe': hasIframe}">
    <section class="app-main">
      <router-view :key="key" />
      <!-- <transition name="fade-transform" mode="out-in">
      </transition> -->
    </section>
  </div>
</template>

<script>
export default {
  name: 'AppMain',
  props: {
    isMiniLayout: {
      type: Boolean,
      default: false
    },
    hasIframe: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.page-content-wrapper {
  box-sizing: border-box;
  width: 100%;
  padding: 16px 20px;
  height: calc(100% - 66px);
  overflow: auto;
}
.has-iframe {
  padding: 0;
  height: 100%;
}
.page-wrapper-mini {
  height: 100%;
}
.app-main {
  height: 100%;
  width: 100%;
  position: relative;
  min-width: 1024px;
  min-height: 600px;
  overflow: auto;
  z-index: 2;
}
</style>

