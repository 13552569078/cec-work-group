<template>
  <div class="sidebar-logo-container fs14" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <!-- 收起 -->
      <div v-if="collapse" key="collapse" class="sidebar-logo-item">
        <span class="sidebar-title">
          <svg-icon style="margin-left: 0" icon-class="工作台icon" />
          <span class="menu-home-title">首页</span>
        </span>
        <i class="el-icon-upload2 fs18" @click.stop="_toggleCollapse" />
      </div>
      <!-- 展开 -->
      <div v-else key="expand" class="sidebar-logo-item">
        <span class="sidebar-title">
          <!-- <span class="menu-item-icon" /> -->
          <svg-icon icon-class="工作台icon" />
          <span class="menu-home-title">首页</span>
        </span>
        <i class="el-icon-upload2 fs18" @click.stop="_toggleCollapse" />
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
    }
  },
  methods: {
    // 切换菜单显示、隐藏
    _toggleCollapse() {
      this.$store.dispatch('app/toggleSideBar')
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 64px;
  line-height: 64px;
  .menu-home-title {
    font-size: 16px;
    color: #36A4FF;
    font-weight: 500;
    margin-left: 20px;
  }
  .el-icon-upload2 {
    color: #36A4FF;
    transform: rotate(-90deg);
    margin-left: auto;
    cursor: pointer;
    margin-right: 15px;
  }
  &.collapse {
    // 收起的样式
    .el-icon-upload2 {
      transform: rotate(90deg);
    }
    .menu-home-title {
      display: none;
    }
  }
  & .sidebar-logo-item {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
  }
  .sidebar-title {
    display: inline-block;
    color: #36A4FF;
    font-weight: 600;
    margin-left: 24px;
    font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
    vertical-align: middle;
    display: flex;
    align-items: center;
    .svg-icon {
      width: 20px;
      height: 20px;
    }
  }
  .menu-item-icon {
    display: inline-block;
    vertical-align: middle;
    background: url('/assets/home_menu.png') no-repeat;
    width: 20px;
    height: 20px;
    margin-right: 12px;
  }
}
</style>
