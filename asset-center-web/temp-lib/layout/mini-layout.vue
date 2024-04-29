<template>
  <div :class="classObj" class="app-wrapper">
    <div class="main-container"
         :class="{nosidebar:true,'main-container-has-navbar':showNavbar && !embed}">
      <div v-if="showNavbar && !embed" class="navbar-wrapper">
        <page-top show-goback :show-collapse="false" />
      </div>
      <app-main :is-mini-layout="true" />
    </div>
  </div>
</template>

<script>
import { PageTop, AppMain } from './components'

export default {
  name: 'Layout',
  components: {
    PageTop,
    AppMain
  },
  data() {
    return {
      embed: window.embed
    }
  },
  computed: {
    showNavbar() {
      return this.$store.state.settings.showNavbar
    },
    classObj() {
      return {
        noheader: this.embed
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/mixin.scss';
@import '../styles/variables.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}
.noheader {
  padding-top: 0;
}
.nosidebar {
  margin-left: 0 !important;
}
.main-container {
  height: 100%;
  transition: margin-left 0.28s;
  margin-left: $sideBarWidth;
  position: relative;
  overflow: hidden;
}
.main-container-has-navbar {
  padding-top: $navbarHeight;
}
.navbar-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: $navbarHeight;
}
</style>
