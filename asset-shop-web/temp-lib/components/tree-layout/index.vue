<!--
 * @Description: 带有树的左右布局
 * @Author: liu lianpeng
 * @Date: 2021-05-06
-->

<template>
  <div class="c-tree-layout">
    <section v-if="showTree" class="left-section-tree">
      <slot name="tree" />
    </section>
    <section class="right" :style="'width: '+rightWidth+';'">
      <search-list-page v-loading="setting.loading" @contentHeightChange="setTableHeight">
        <template v-slot:header>
          <slot name="header"></slot>
        </template>
        <template v-slot:btns>
          <slot name="btns"></slot>
        </template>
        <div slot="content" class="lp-page-content">
          <slot name="table"></slot>
          <slot name="footer"></slot>
        </div>
      </search-list-page>
    </section>
  </div>

</template>
<script>

export default {
  name: 'CtreeLayout',
  props: {
    setting: {
      type: Object,
      default: () => {
        return {
          tableHeight: 0,
          headerHeight: 63,
          headerMargin: 0,
          footerMargin: 0,
          footerHeight: 76,
          loading: false
        }
      }
    },
    showTree: {
      type: Boolean,
      default: true
    }

  },
  data() {
    return {
      rightWidth: 'calc(100% - 288px)'
    }
  },
  mounted() {
    if (!this.showTree) {
      this.rightWidth = '100%'
    }
  },
  methods: {
    setTableHeight(val) {
      // 计算表格高度
      this.$emit('contentHeightChange', val)
    }
  }
}
</script>
<style lang="scss" scoped>
.c-tree-layout {
    height: 100%;
  display: flex;
  .left-section-tree {
    width: 272px;
        height: 100%;
    margin-right: 16px;
    background: #FFFFFF;
  }
  .right {
    flex: 1;
    .table-body {
      padding: 0px 24px 16px;
    }
  }
  &::after{
    content: '';
    clear: both;
  }
}
</style>
