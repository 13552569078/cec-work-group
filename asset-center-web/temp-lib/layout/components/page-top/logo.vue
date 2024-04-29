<template>
  <div class="sidebar-logo-container">
    <router-link key="collapse" class="sidebar-logo-link" to="/">
      <img v-if="logo" :src="logo" class="sidebar-logo">
      <!-- <transition name="sidebarLogoFade">
        <h1 class="sidebar-title">
          {{ title }}
        </h1>
      </transition> -->
    </router-link>
  </div>
</template>

<script>
import { settingsConf } from '../../../settings'
export default {
  name: 'SidebarLogo',
  data() {
    return {
      title: settingsConf.title,
      logo: require('../../../assets/frame/logo-top.png')
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
  background: transparent;
  text-align: center;
  overflow: hidden;
  box-sizing: border-box;
  & .sidebar-logo-link {
    display: block;

    & .sidebar-logo {
      // width: 228px;
      height: 36px;
      vertical-align: middle;
      margin-right: 24px;
      margin-left: 32px;
      margin-top: 2px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      vertical-align: middle;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #FFFFFF;
      padding-left: 16px;
      border-left: 1px solid rgba(255, 255, 255, 0.65);
    }
  }
}
</style>
