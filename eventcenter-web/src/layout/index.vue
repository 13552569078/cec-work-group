<template>
  <div :class="classObj" class="app-wrapper">
    <el-container>
      <el-header class="app-header" :height="headerHeight">
        <app-header />
      </el-header>
      <el-main :class="{ 'is-collapse': !sidebar.opened }">
        <app-side-bar v-if="isShowSidebar" class="sidebar-container" />
        <app-main class="app-main" />
      </el-main>
      <!-- 暂时取消footer, 目前给的业务系统中都没有 footer -->
      <!-- <el-footer height="78px"><app-footer /></el-footer> -->
    </el-container>
  </div>
</template>

<script>
import { AppMain, AppHeader, AppSideBar } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { headerHeight } from '@/styles/variables.scss'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain,
    AppHeader,
    // AppFooter,
    AppSideBar
  },
  mixins: [ResizeMixin],
  data() {
    return {
      isShowSidebar: false,
      embed: window.embed,
      isWindowOpenFromWujie: window.isWindowOpenFromWujie,
      headerHeight
    }
  },
  computed: {
    ...mapState({
      sidebar: (state) => state.app.sidebar
    }),
    classObj() {
      return {
        'embed-mode': this.embed || this.isWindowOpenFromWujie
      }
    }
  },
  watch: {
    $route(to, from) {
      // 监听路由发生变化判断是否显示侧边栏
      this.handleShowSide()
    }
  },
  mounted() {
    // 判断路由是否是帐号管理并显示侧边栏
    this.handleShowSide()
  },
  methods: {
    handleShowSide() {
      this.isShowSidebar = true
    }
  }
}
</script>

<style lang="scss" scoped>
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.embed-mode {
    .app-header {
      display: none;
    }
    .sidebar-container {
      display: none;
    }
    .app-main {
      height: 100%;
      width: 100%;
      padding-top: 0;
      margin-left: 0;
      ::v-deep {
        .main-content {
          padding: 0;
          // background-color: transparent;
          position: relative;
        }
        .breadcrumb-container {
          display: none;
        }
      }
    }
  }
}

.el-container {
  height: 100%;
}

.el-header {
  z-index: 1002;
  padding: 0;
  background-color: $navBg;
  color: $navFontColor;
  line-height: 50px;
  box-shadow: 0 3px 8px 0 rgba(41, 48, 64, 0.2);
}
.el-main {
  padding: 0;
  margin: 0;
  display: flex;
  overflow: hidden;
  position: relative;
}
</style>
