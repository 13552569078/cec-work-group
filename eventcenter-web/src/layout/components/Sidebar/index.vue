<template>
  <div class="sidebar-container">
    <logo :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        mode="vertical"
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="false"
        :collapse-transition="false"
      >
        <sidebar-item
          v-for="route in menuList"
          :key="route.path + route.name"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(['sidebar', 'menuList']),
    activeMenu() {
      const route = this.$route
      const { meta } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return meta.title
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
