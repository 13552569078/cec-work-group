<!--
 * @Description:
 * @Author: qiyongguo
 * @Date: 2022-02-15
-->
<template>
  <div ref="commonList" class="common-page-list">
    <div v-if="$slots.tree" ref="tree" class="left-tree">
      <slot name="tree" />
    </div>
    <div class="right" :style="{ width: contentWidth, overflow: 'hidden' }">
      <div
        v-show="$slots.search"
        id="searchSection"
        ref="searchRef"
        :class="['search-section', { 'has-top-border': hasTopBorder }]"
        :style="{
          'margin-bottom': searchBottom + 'px',
          'margin-left': searchLeft + 'px',
        }"
      >
        <slot name="search" />
      </div>
      <div id="listSection" ref="listSection" class="list-section" :style="contentStyle">
        <slot name="content" />
      </div>
      <div
        v-if="hasFooter"
        id="listFooter"
        ref="foot"
        class="foot-page"
        :style="footerStyle"
      >
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script>
import resizeObserverMixin from '@/mixin/resizeObserverMixin'
export default {
  name: 'CommonPageList',
  mixins: [resizeObserverMixin],
  props: {
    hasFooter: {
      type: Boolean,
      default: true
    },
    hasTopBorder: {
      type: Boolean,
      default: true
    },
    searchBottom: {
      type: Number,
      default: 20
    },
    searchLeft: {
      type: Number,
      default: 0
    },
    heightAuto: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      contentHeight: 'calc(100% - 92px)',
      contentWidth: '100%'
    }
  },
  computed: {
    hasTree() {
      try {
        return this.$slots.tree.length
      } catch (error) {
        return false
      }
    },
    contentStyle() {
      return {
        height: this.heightAuto ? 'auto' : this.contentHeight,
        'margin-left': this.hasTree ? '20px' : ''
      }
    },
    footerStyle() {
      return {
        'margin-left': this.hasTree ? '20px' : ''
      }
    }
  },
  watch: {
    hasFooter() {
      this.$nextTick(() => {
        this.calcHeight()
      })
    }
  },
  async mounted() {
    await this.$nextTick()
    // 创建观察实例
    this.initObServer(document.getElementById('searchSection'), entries => {
      console.log('entries==', entries)
      if (entries[0].target) {
        this.calcHeight()
      }
    })
    // 内容区需要确定的宽度，不然表格的固定不生效
    if (this.$slots.tree) {
      const _treeWidth = this.$refs.tree.offsetWidth
      if (_treeWidth) {
        this.contentWidth = `calc(100% - ${_treeWidth}px)`
      }
    }
    if (!this.$slots.search) {
      this.calcHeight()
    }
    setTimeout(() => {
      this.calcHeight()
    }, 500)
  },
  methods: {
    async calcHeight() {
      await this.$nextTick()
      const sheight = this.$refs.searchRef.offsetHeight // 搜索栏的高度
      let contentHeight = this.$refs.commonList.offsetHeight
      if (sheight) {
        contentHeight = contentHeight - sheight - this.searchBottom
      }
      if (this.$refs.foot) {
        contentHeight -= (this.$refs.foot && this.$refs.foot.offsetHeight) || 0
      }
      // 设置给一个最小高度
      this.contentHeight = contentHeight > 100 ? `${contentHeight}px` : '100%'
    }
  }
}
</script>

<style lang="scss" scoped>
.common-page-list {
  height: 100%;
  display: flex;
  .left-tree {
    width: 272px;
    padding: 23px 14px 14px 12px;
    overflow-y: auto;
    background: #f9fafe;
    ::v-deep {
      .cestc-tree,
      .el-tree {
        background: transparent;
      }
    }
  }
  .right {
    flex: 1;
  }
  .search-section {
    background: #ffffff;
    &.has-top-border {
      border-top: 1px solid #36a4ff;
    }
  }
  .list-section {
    .result-content {
      display: flex;
      height: 100%;
      flex-direction: column;
      .result-list {
        flex: 1;
      }
    }
  }
  .foot-page {
    position: relative; // 解决阴影被遮挡
    height: 76px;
    background: #ffffff;
    display: flex;
    align-items: center;
    padding-right: 35px;
    box-shadow: 0px -2px 7px 0px rgba(0,0,0,0.06);
  }
}
</style>
