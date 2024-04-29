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
        this.$store.dispatch('pageTop/setTabList')
      })
    }
  }
}
</script>
