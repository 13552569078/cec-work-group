<!--
 * @Description: 提供给路由页面的2级或更多级路由页面的嵌套
 * @Author: zs
 * @Date: 2021-11-12
-->
<template>
  <div class="router-page-wrap">
    <div v-if="showContent" class="page-content">
      <slot />
    </div>
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'RouterPageLayout',
  components: {
  },
  props: {
    path: {
      type: String,
      default: '',
      required: true
    }
  },
  data() {
    return {
      showContent: false
    }
  },
  computed: {
  },
  created() {
    this.showContent = this.$route.path.replace(/\/$/, '') === this.path.replace(/\/$/, '')
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style scoped lang='scss'>
.router-page-wrap, .page-content {
  width: 100%;
  height: 100%;
}
</style>
