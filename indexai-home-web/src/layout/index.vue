<template>
  <div class="app-wrapper" :class="{ 'embed-mode': embed }">
    <el-container>
      <el-header height="56px" class="app-header">
        <page-header />
      </el-header>
      <el-main :class="{ 'is-collapse': collapsed }">
        <aside-menu
          :collapsed="collapsed"
          :active-menu="activeMenu"
          class="sidebar-container app-sidebar"
        />
        <page-main class="app-main" />
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useAppStore } from '/@/store/modules/app'
import AsideMenu from './menu/index.vue'
import PageHeader from './header/index.vue'
import PageMain from './main/index.vue'

const collapsed = computed(() => !useAppStore().sidebar.opened)
const embed = computed(() => !!(window as any).embed)

const route = useRoute()
const activeMenu = computed(() => {
  const { meta, path } = route
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return path
})
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
    .app-sidebar {
      display: none;
    }
    .app-main {
      height: 100%;
      width: 100%;
      margin-left: 0;
      padding-top: 0;
      :deep() {
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
}
.el-header,
.el-footer {
  background-color: $navBg;
  color: $navFontColor;
  line-height: 70px;
}

.el-main {
  padding: 0;
  margin: 0;
  display: flex;
  overflow: hidden;
}
</style>
