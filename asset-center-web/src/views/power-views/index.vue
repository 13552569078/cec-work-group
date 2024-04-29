<template>
  <component :is="cmpName" v-if="!url" />
  <web-page v-else :url="url" />
</template>

<script>
export default {
  data() {
    return {
      cmpName: '',
      url: ''
    }
  },
  created() {
    const { cmpName, url } = this.$route.meta
    if (url) {
      this.url = url
      return
    }
    this.cmpName = resolve => require([`./${cmpName}`], resolve)
  }
}
</script>

<style scoped lang="scss">
</style>
