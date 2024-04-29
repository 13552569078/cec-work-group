<!--
 * @Description:
 * @Author: wyh19
 * @Date: 2020-11-26
-->
<template>
  <div ref="roDiv" class="ro-div">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'RoDiv',
  data() {
    return {
      observer: null
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    if (this.observer) {
      this.observer.disconnect()
    }
  },
  methods: {
    init() {
      if (window.ResizeObserver) {
        const element = this.$refs['roDiv']
        this.observer = new window.ResizeObserver((a) => {
          this.$emit('resize')
        })
        this.observer.observe(element)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.ro-div {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
