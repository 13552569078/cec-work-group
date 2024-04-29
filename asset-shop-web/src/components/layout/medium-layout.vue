<!--/*
* @Author: dingli
* @Desc: 布局组件
* @Date: 2022-1-20
*/-->
<template>
  <div class="page-wrap" :class="classObj">
    <div class="page-top-wrap">
      <page-top class="page-top"></page-top>
    </div>
    <app-main class="page-main-container-c"></app-main>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { AppMain } from '@l/layout/components'
import PageTop from './page-top.vue'
export default {
  name: '',
  components: { PageTop, AppMain },
  data() {
    return {
      embed: window.embed
    }
  },
  computed: {
    ...mapState({
      pageTop: state => state.pageTop
    }),
    sidebar() {
      return this.$store.state.app.sidebar
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        noheader: this.embed
      }
    }
  },
  mounted() {},
  destroyed() {},
  methods: {}
}
</script>
<style scoped lang="scss">
@import '~@/styles/mixin.scss';
@import '~@l/styles/variables.scss';
@import '~@/styles/variables.scss';
.navbar {
  background-image: none;
  border-bottom: none;
}
.page-top-wrap {
  width: 100%;
  height: $navbarHeight;
  background-image: url(~@/assets/navbar-bg.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  // background: rgba(0,26,79,0.6);
  backdrop-filter: blur(8px);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 3000;
}
.page-wrap {
  position: relative;
  height: 100%;
  background: $pageBgColor;
}
.page-top {
  // width: 1280px;
  padding: 0 28px;
  margin: auto;
  height: 100%;
}
.page-main {
  width: 100%;
  height: 100%;
  padding-top: $navbarHeight;
}
.page-main-left {
  position: absolute;
  top: 0;
  left: 0;
  padding-top: $navbarHeight;
  width: $sideBarWidth;
  height: 100%;
  transition: width 0.28s;
  background: #F9FAFE;
  border-right: 1px solid #E2E9F2;
  z-index: 1;
  overflow: hidden;
}
.page-main-container {
  width: 100%;
  height: 100%;
  padding-left: $sideBarWidth;
}
.page-main-container-c {
  padding: $navbarHeight 0 0 ;
  height: 100%;
}
.hideSidebar {
  .page-main-left {
    width: $sideBarHideWidth;
  }
  .page-main-container {
    padding-left: $sideBarHideWidth;
  }
}
</style>
