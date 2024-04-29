<template>
  <div class="sidebar-logo-container fs14" :class="{ collapse: collapsed }">
    <transition name="fade-transform">
      <span class="sidebar-title" v-if="!collapsed" @click="goWelcome">{{ title }}</span>
    </transition>
    <svg-icon icon-class="callpsed" class="slideIcon" @click.stop="toggleCollapse()" />
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '/@/store/modules/app'
import { getConfigData } from '/@/utils/storage/auth'

defineProps({
  collapsed: {
    type: Boolean,
    required: true
  }
})
const store = useAppStore()
// 切换菜单显示、隐藏
const toggleCollapse = () => {
  store.toggleSideBar()
}
const configSetting = getConfigData()
const goWelcome = () => {
  if (defaultSettings.isFromOhterPlatform) {
    window.location.href = configSetting.loginUrl
  }
}

const title = computed(() => defaultSettings.title)
</script>

<style lang="scss" scoped>
.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 64px;
  line-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px 0 28px;
  cursor: pointer;
  background: url('/@/assets/images/layout/sidebar-bg.svg') no-repeat;
  background-size: 100% 100%;
  .sidebar-title {
    font-size: 16px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: #4b4b4b;
  }
  .slideIcon {
    color: #4b4b4b;
    cursor: pointer;
    transition: transform 0.28s;
    margin-right: 0 !important;
  }
}
.collapse {
  padding: 0 16px 0 40px;
  .slideIcon {
    transform: rotate(180deg);
  }
}
</style>
