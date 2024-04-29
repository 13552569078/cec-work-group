<!--
 * @Description:组件入口，主要是利用v-if进行渲染dom，
 * 否则要监听pageBlock属性，由于该属性包含大量dom节点，无法deep-watch
 * @Author: wyh19
 * @Date: 2021-03-29
-->
<template>
  <anchor v-if="pageBlock" ref="anchor" :page-block="pageBlock" :no-tip="noTip" :color="color" />
</template>

<script>
import Anchor from './anchor'
export default {
  components: {
    Anchor
  },
  props: {
    pageBlock: HTMLElement,
    color: {
      type: String,
      default: '#38f'
    },
    noTip: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    reRender() {
      this.$nextTick(() => {
        this.$refs['anchor'].reRender()
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
