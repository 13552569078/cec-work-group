<template>
  <div class="bread-routes">
    <!-----固定不可删菜单项----->
    <div
      v-for="item in fixedRoutes"
      :key="item.path"
      :class="[
        'route-item',
        item.path == activePath ? 'active-route-item' : '',
      ]"
      @click="toPath(item)"
    >
      {{ (item.meta && item.meta.title) || "" }}
    </div>
    <!-----缓存菜单项----->
    <div
      v-for="item in cacheRoutes"
      :key="item.path"
      :class="[
        'route-item',
        item.path == activePath ? 'active-route-item' : '',
      ]"
      @click="toPath(item)"
    >
      {{ (item.meta && item.meta.title) || "" }}
      <i class="el-icon-close" @click.stop="delPath(item)" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    fixedRoutes: {
      // 固定显示的菜单项，不可删除
      type: Array,
      default: () => []
    },
    max: {
      // 最多显示几个菜单项
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      cacheRoutes: [],
      activePath: ''
    }
  },
  watch: {
    $route: {
      handler(val) {
        this.dealwithCacheRoutes(val)
      },
      immediate: true
    }
  },
  created() {
    // 监听删除面包屑
    this.$bus.$on('del-bread', (route) => {
      const idx = this.cacheRoutes.findIndex(
        (item) => item.path === route.path
      )
      if (idx > -1) {
        this.cacheRoutes.splice(idx, 1)
      }
    })
  },
  methods: {
    dealwithCacheRoutes(cRoute) {
      this.activePath = cRoute.path
      if (cRoute.path === '/') return
      if (this.fixedRoutes.some((item) => item.path === cRoute.path)) return
      // 如果存在该菜单则不push
      const idx = this.cacheRoutes.findIndex(
        (item) => item.path === cRoute.path
      )
      if (idx === -1) {
        const count = this.fixedRoutes.concat(this.cacheRoutes).length
        if (count >= this.max) {
          this.cacheRoutes.splice(0, 1)
        }
        this.cacheRoutes.push(cRoute)
      } else {
        this.cacheRoutes.splice(idx, 1, cRoute)
      }
    },
    // 打开页面
    toPath(route) {
      // 如果是当前页面，页面不动
      if (route.path === this.activePath) {
        return
      } else {
        this.$router.push({ path: route.path, query: route.query })
      }
    },
    // 删除路由
    delPath(route) {
      if (this.cacheRoutes.length === 1) return // 只剩一个时暂时不允许删除
      const idx = this.cacheRoutes.findIndex(
        (item) => item.path === route.path
      )
      if (idx > -1) {
        // 删除的是当前页面路由时 进行跳转
        if (route.path === this.$route.path) {
          let jumpRoute = idx > 0 ? jumpRoute = this.cacheRoutes[idx - 1] : this.cacheRoutes[idx + 1]
          this.$router.push({ path: jumpRoute.path, query: jumpRoute.query })
        }
        this.cacheRoutes.splice(idx, 1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bread-routes {
  font-size: 14px;
  line-height: #{$breadCrumbHeight};
  height: #{$breadCrumbHeight};
  background: #f9fafe;
  padding-left: 28px;
  // 吸顶
  position: fixed;
  top: $headerHeight;
  width: 100%;
  z-index: 100;
  display: flex;
  align-items: center;
  .route-item {
    height: 40px;
    background: #e6eeff;
    border-radius: 4px;
    line-height: 40px;
    padding: 0 12px;
    margin-right: 16px;
    font-size: 16px;
    color: #4b4b4b;
    cursor: pointer;
    &.active-route-item {
      background: #f2f6ff;
      color: #36a4ff;
      border: 1px solid #36a4ff;
    }
    .el-icon-close {
      margin-left: 6px;
      cursor: pointer;
      &:hover {
        color: #36a4ff;
        background: #fff;
      }
    }
  }
}
</style>
