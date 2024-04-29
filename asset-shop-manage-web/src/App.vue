<template>
  <div id="app">
    <transition name="fade-transform" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import { configInfo } from '@/api/index'
export default {
  name: 'App',
  created() {
    this.getSystemConfig()
  },
  methods: {
    getSystemConfig() {
      window.__systemConfig = JSON.parse(localStorage.getItem('__systemConfig'))
      configInfo().then(res => {
        console.log('__systemConfig', res.data)
        localStorage.setItem('__systemConfig', JSON.stringify(res.data || {}))
        window.__systemConfig = res.data || {}
      })
    }
  }
}
</script>
<style>
.page-content-wrapper {
  height: calc(100% - 67px) !important;
  position: relative;
}
.list-tabs-bg {
  background-image: url(~@/assets/img/wrap-bg.png);
  background-size: 100% 100%;
  width: 100%;
  height: 300px;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 1;
}
</style>

