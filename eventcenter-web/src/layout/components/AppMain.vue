<template>
  <section class="app-main">
    <breadcrumb
      id="breadcrumb-container"
      class="breadcrumb-container"
    />
    <div :class="['main-content', { noPaddingBottom: noPaddingBottom, 'no-padding': key.includes('external-page') || noPaddingSelf}]">
      <transition name="fade-transform" mode="out-in">
        <keepAlive :exclude="excludeRoute">
          <router-view :key="key" />
        </keepAlive>
      </transition>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      const route = this.$route
      if (!Array.isArray(route.matched) || route.matched.length === 0) {
        return route.path
      }
      // console.log('route.match==', route.matched)
      return route.matched[0].path
    },
    noPaddingBottom() {
      const whiteArray = ['/tag1To30/add-population']
      return whiteArray.includes(this.key)
    },
    noPaddingSelf() {
      const whiteArray = ['/one-click-search']
      return whiteArray.includes(this.key)
    },
    excludeRoute() {
      // 不缓存的页面集合
      return ['StrategyConfig']
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  flex: 1;
  width: calc(100% - #{$sideBarWidth});
  margin-left: $sideBarWidth;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding-top: 64px;

  & > div {
    min-width: calc(1024px - #{$sideBarWidth} - 20px - 32px);
  }
  .main-content {
    height: 100%;
    padding: 20px;
    background: #EBF1FA;
    position: relative;
    &.noPaddingBottom {
      padding-bottom: 0;
    }
    &.no-padding {
      padding: 0;
    }
    >div{
       height: 100%;
    }
  }
}
.fixed-header + .app-main {
  padding-top: 50px;
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
