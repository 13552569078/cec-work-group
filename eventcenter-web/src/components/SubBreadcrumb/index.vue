<!--
 * @description 内容区
 * @date 2020-08-16
 * @author lism
 -->
<template>
  <div class="sub-breadcrumb">
    {{ currentRoute }}
    <el-divider />
  </div>
</template>

<script>
export default {
  data() {
    return {
      levelList: []
    }
  },
  computed: {
    currentRoute() {
      // 从levelList 取最后一个路由的标题
      const currentRoute = this.levelList[this.levelList.length - 1]
      return currentRoute && currentRoute.meta && currentRoute.meta.title
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      // only show routes with meta.title
      const matched = this.$route.matched.filter(
        (item) => item.meta && item.meta.title
      )

      this.levelList = matched.filter(
        (item) => item.meta && item.meta.title && item.meta.breadcrumb !== false
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.el-divider {
  margin: 16px 0;
}
</style>
