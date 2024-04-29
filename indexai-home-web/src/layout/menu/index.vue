<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapsed="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu :collapse="isCollapse" :default-active="activeMenu" :unique-opened="false">
        <sidebar-item
          v-for="item in menudatas"
          :key="item.path"
          :item="item"
          :base-path="item.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import SidebarItem from './SidebarItem.vue'
import Logo from '../logo/index.vue'
import { useUserStore } from '/@/store/modules/user'
import { useAppStore } from '/@/store/modules/app'
import { useRoute } from 'vue-router'

const showLogo = ref(true)
const userStore = useUserStore()
const appStore = useAppStore()
const menudatas = computed(() => userStore.getMenudatas)

const isCollapse = computed(() => {
  // 目前默认的菜单都是展开状态
  return !appStore.sidebar.opened
})

// 默认选中菜单
const route = useRoute()
const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta.activeMenu) {
    return meta.activeMenu as string
  }
  return path as string
})
</script>

<style lang="scss" scoped>
.menu-container {
  position: fixed;
  left: 0;
  top: 50px;
  bottom: 0;
  z-index: 1500;
  box-sizing: border-box;
  background-color: #2e3759;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
}
.el-menu {
  border-right: 0;
  padding-bottom: 60px;
  &:not(.el-menu--collapse) {
    width: 220px;
  }
  .iconfont {
    margin-right: 18px;
    text-align: center;
    font-size: 16px;
    vertical-align: middle;
  }
}
.rightMenuBox {
  padding: 0 10px;
  text-align: center;
  .rightMenu {
    cursor: pointer;
  }
}
</style>
