<!--/*
* @Author: dingli
* @Desc: 布局组件
* @Date: 2021-8-20
*/-->
<template>
  <div class="page-wrap" :class="classObj">
    <page-top class="page-top"></page-top>
    <app-main class="page-main-container-c"></app-main>

    <!-- <div class="page-main">
      <sidebar v-if="!embed" class="page-main-left" />
      <div class="page-main-container">
        <breadcrumb />
      </div>
    </div> -->
  </div>
</template>
<script>
import { PageTop, AppMain } from '@l/layout/components'
export default {
  name: '',
  components: { PageTop, AppMain },
  data() {
    return {
      embed: window.embed
    }
  },
  computed: {
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
  created() {},
  mounted() {},
  destroyed() {},
  methods: {}
}
</script>
<style scoped lang="scss">
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';
.page-wrap {
  position: relative;
  height: 100%;
  background: $pageBgColor;
}
.page-top {
  width: 100%;
  height: $navbarHeight;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
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
  background: #ffffff;
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
  padding: 66px 0 0 ;
  height: 100% !important;
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
