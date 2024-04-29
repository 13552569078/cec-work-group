<template>
  <section class="app-main">
    <Breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <router-view>
      <template #default="{ Component }">
        <transition name="fade-transform" mode="out-in" appear>
          <component :is="Component" :key="$route.fullPath" />
        </transition>
      </template>
    </router-view>
    <!-- vue2.0写法
      <transition name="fade-transform" mode="out-in">
      <router-view :key="$route.fullPath" />
    </transition> -->
  </section>
</template>

<script lang="ts" setup>
import Breadcrumb from '/@/components/Breadcrumb/index.vue'
</script>

<style lang="scss" scoped>
.app-main {
  flex: 1;
  width: calc(100% - #{$sideBarWidth});
  margin-left: $sideBarWidth;
  position: relative;
  overflow: auto;
  display: flex;
  flex-direction: column;
  padding-top: 64px; // 撑开面包屑的高度

  & > div {
    min-width: calc(1024px - #{$sideBarWidth} - 20px - 32px);
  }
}
.fixed-header + .app-main {
  padding-top: 74px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
