<template>
  <div :class="{'has-logo':showLogo}">
    <div class="home">
      <a class="home-title" @click="openRoot">
        <!-- <svg-icon class="home-icon" icon-class="home" /> -->
        <span v-show="showTitle">{{ title }}</span>
      </a>
      <template v-if="showCollapse">
        <c-tooltip placement="bottom" :content="sidebar.opened ? '折叠菜单栏':'展开菜单栏'">
          <i class="collapsible-icon" :class="{'isactive' : sidebar.opened}" @click="toggleSideBar"></i>
        </c-tooltip>
      </template>
    </div>
    <div class="menu-wrapper">
      <c-menu mode="vertical" :default-active="activeMenu" :collapse="isCollapse"
              :unique-opened="false" :collapse-transition="false">
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :collapse="isCollapse"
                      :base-path="route.path" class="" />
      </c-menu>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './sidebar-item'
import variables from '../../../styles/variables.scss'
import $bus from '@/utils/bus'
import { settingsConf } from '../../../settings'
export default {
  components: { SidebarItem },
  props: {
    showCollapse: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      title: settingsConf.title,
      showTitle: true
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'routes']),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },

    showLogo() {
      // 是否显示menubar的logo不考参数控制，以后如果扩展了新的头部再自动判断
      return true
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  created() {
    this.showTitle = this.sidebar.opened
  },
  methods: {
    openRoot() {
      // this.$router.push({
      //   path: '/home'
      // })
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
      $bus.$emit('sideBar-on-off')
      setTimeout(() => {
        this.showTitle = this.sidebar.opened
      }, 100)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../styles/mixin.scss';
@import '../../../styles/variables.scss';
.has-logo {
  position: relative;
  .home {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    // top: $navbarHeight;
    right: 0;
    left: 0;
    height: 64px;
    background: url('../../../assets/frame/first-bg.svg') no-repeat 0 0 / 100% 100%;
    // background: linear-gradient(180deg, #F9FAFE 0%, #FFFFFF 100%);
    background-color: #fff;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #4b4b4b;
    z-index: 2;
  }
  .home-icon {
    margin: 0 12px 0 24px;
    width: 20px;
    height: 20px;
    vertical-align: middle;
  }
  .collapsible-icon {
    width: 16px;
    height: 16px;
    margin-right: 16px;
    background: url('../../../assets/frame/collapsible.svg') no-repeat 0 0 / 100% 100%;
    cursor: pointer;
    transform: rotate(180deg);
    &.isactive {
      transform: rotate(0);
    }
  }
}
.has-logo ::v-deep .logo.collapse .sidebar-logo-link {
  img.sidebar-logo {
    width: 40px;
    height: 40px;
  }
}

.menu-wrapper {
  height: 100%;
  padding-top: 66px;
  overflow-y: auto;
  background: #fff;
  &::-webkit-scrollbar {
    display: none;
  }
}
.menu-wrapper ::v-deep .c-menu {
  background-color: transparent;
  border: none;
}
.menu-wrapper ::v-deep .c-menu-item {
  height: $menuItemHeight;
  line-height: $menuItemHeight;
  color: $menuText;
  font-size: $menuFontSize;
  &:not(.is-active):hover {
    opacity: 1;
    background: #F1F5F9;
  }
}
.menu-wrapper ::v-deep .router-link-active .c-menu-item {
  position: relative;
  background: #9EAECD !important;
  color: $menuActiveText;
  font-weight: 600;
  &::after {
    content: '';
    height: $menuItemHeight;
    width: 28px;
    position: absolute;
    top: 0;
    right: 0;
    background-image: url(../../../assets/frame/active-menu.png);
    background-size: 10px 10px;
    background-repeat: no-repeat;
    background-position: 0 center;
    // border-right: 3px solid #36A4FF;
  }
}

.menu-wrapper ::v-deep .c-submenu .c-submenu__title {
  height: $menuItemTitleHeight;
  line-height: $menuItemTitleHeight;
  font-size: $menuFontSize;
  color: $menuText;
  &:hover {
    background-color: $menuHover;
  }
}
.menu-wrapper ::v-deep .c-submenu.is-active .c-submenu__title {
  color: $menuText;
}
.menu-wrapper ::v-deep .c-menu--collapse {
  width: 100% !important;
  .c-submenu,
  .c-menu-item {
    text-align: center;
  }
  .c-submenu__title {
    span,
    .c-submenu__icon-arrow {
      display: none;
    }
  }
  .c-submenu.is-active {
    background-image: url(../../../assets/frame/sidebar-item.png);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 0 center;
    color: $menuActiveText;
    border-radius: 8px;
    .svg-icon.ishover {
      display: inline-block;
    }
    .svg-icon.nothover {
      display: none;
    }
  }
  .icon-menu-drop {
    display: none;
  }
  .c-menu-item {
    padding: 0;
    border-radius: 8px;
    &::after {
      display: none;
    }
  }
  .c-menu-item-router {
    padding: 10px 26px;
    .sub-c-icon {
      margin-right: 0px;
      margin-left: -6px;
    }
  }
}
.home-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-family: PingFangSC-Medium;
  font-weight: 600;
  span {
    padding-left: 28px;
  }
}
</style>

<style lang="scss">
@import '../../../styles/variables.scss';
.c-menu--vertical {
  .c-menu {
    background-size: 100% 100%;
    background-repeat: no-repeat;
    min-width: 176px;
    padding: 0 0 8px 0;
    margin: 0 0 0 16px;
  }

  .c-menu-item {
    height: 40px;
    line-height: 40px;
    color: #4b4b4b;
    font-size: 14px;

    &:hover {
      opacity: 1;
      background: #F1F5F9;
    }
  }
  .router-link-active .c-menu-item{
      // background-color: $primaryColor;
      background: #9EAECD !important;
      color: #ffffff;
      border-radius: 2px;
      &:hover {
        opacity: 1;
      }
  }
}
</style>
