<!--
  footerMargin: 分页组件距离左侧sidebar长度
  footerHeight：分页组件高度
 -->
<template>
  <div class="fixed-page-wrapper-shell" :style="{ height: '100%' }">
    <div class="fixed-page-wrapper">
      <div v-if="!noheader" class="fixed-page-header">
        <slot name="header" />
      </div>
      <div class="content">
        <div ref="bodyWrapper" class="fixed-page-body" :style="_bodyContentHeight">
          <slot />
        </div>
        <div
          v-if="!nofooter"
          class="fixed-page-footer"
          :style="{ height: _footerContentHeight, width: _footerContentWidth }"
        >
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { sideBarWidth, sideBarCollapseWidth } from '@/styles/variables.scss'
export default {
  name: 'FixedPage',
  props: {
    noheader: {
      type: Boolean,
      default: false
    },
    nofooter: {
      type: Boolean,
      default: false
    },
    footerMargin: {
      type: Number,
      default: 0
    },
    footerHeight: {
      type: Number,
      default: 64
    }
  },
  computed: {
    _bodyContentHeight() {
      return this.nofooter
        ? `height: calc(100% - 20px)`
        : `height: calc(100% - ${this.footerHeight}px - 36px)`
    },
    _footerContentHeight: function() {
      return this.nofooter ? '0px' : this.footerHeight + 'px'
    },
    sidebarOpened() {
      return this.$store.getters.sidebar.opened
    },
    _footerContentWidth() {
      return this.sidebarOpened ? `calc(100% - ${sideBarWidth} - 20px - ${this.footerMargin}px)`
        : `calc(100% - ${sideBarCollapseWidth} - 20px - ${this.footerMargin}px)`
    }
  }
}
</script>
<style scoped lang="scss">
.fixed-page-wrapper-shell {
  height: 100%;
  overflow: hidden;
  background-color: transparent;
  .fixed-page-wrapper {
    height: 100%;
    display: flex;
    flex-flow: column;
    .fixed-page-header {
      background-color: #fff;
      border-top: 1px solid #36a4ff;
    }
    .content {
      flex: 1;
      .fixed-page-body {
        margin: 10px 0;
        background-color: #fff;
        overflow: hidden;
      }
      .fixed-page-footer {
        background-color: #fff;
        position: fixed;
        bottom: 16px;
        z-index: 10;
        overflow: hidden;
        padding-right: 32px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
    }
  }
}
</style>
