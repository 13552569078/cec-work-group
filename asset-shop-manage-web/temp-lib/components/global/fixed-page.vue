<template>
  <div
    class="fixed-page-wrapper-shell"
    :style="{padding,height:pageHeight,backgroundColor}"
  >
    <div
      class="fixed-page-wrapper"
      :style="{paddingTop:_headerHeight,paddingBottom:_footerHeight}"
    >
      <div
        v-if="!noheader"
        class="fixed-page-header"
        :style="{height:_headerContentHeight}"
      >
        <slot name="header" />
      </div>
      <div
        ref="bodyWrapper"
        class="fixed-page-body"
      >
        <slot />
      </div>
      <div
        v-if="!nofooter"
        class="fixed-page-footer"
        :style="{height:_footerContentHeight}"
      >
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script>
import variable from '../../styles/variables.scss'
import { debounce } from '../../utils'
export default {
  name: 'FixedPage',
  props: {
    padding: {
      type: String,
      default: '14px'
    },
    pageHeight: {
      type: String,
      default: '100%'
    },
    backgroundColor: {
      type: String,
      default: variable.pageBgColor
    },
    headerMargin: {
      type: Number,
      default: 0
    },
    noheader: {
      type: Boolean,
      default: false
    },
    headerHeight: {
      type: Number,
      default: 64
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
      default: 76
    }
  },
  computed: {
    _headerHeight: function() {
      return this.noheader ? '0px' : this.headerHeight + 'px'
    },
    _headerContentHeight: function() {
      return this.noheader
        ? '0px'
        : this.headerHeight - this.headerMargin + 'px'
    },
    _footerHeight: function() {
      return this.nofooter ? '0px' : this.footerHeight + 'px'
    },
    _footerContentHeight: function() {
      return this.nofooter
        ? '0px'
        : this.footerHeight - this.footerMargin + 'px'
    }
  },
  mounted() {
    this.debouncedGetBodyWrapperHeight = debounce(this.getBodyWrapperHeight, 200)
    window.addEventListener('resize', this.debouncedGetBodyWrapperHeight)
    this.getBodyWrapperHeight()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.debouncedGetBodyWrapperHeight)
  },
  methods: {
    getBodyWrapperHeight() {
      const bodyWrapper = this.$refs['bodyWrapper']
      this.$emit('bodyHeightGeted', bodyWrapper.clientHeight)
    }
  }
}
</script>

<style scoped lang="scss">
@import "~@l/styles/variables.scss";
.fixed-page-wrapper-shell {
  position: relative;
  height: 100%;
  overflow: hidden;
  padding: 14px;
  background: $pageBgColor;
}
.fixed-page-wrapper {
  position: relative;
  height: 100%;
  overflow: hidden;
  padding-bottom: 100px;
}
.fixed-page-header {
  width: 100%;
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  overflow: hidden;
}
.fixed-page-body {
  height: 100%;
  overflow: auto;
}
.fixed-page-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  overflow: hidden;
}
</style>
