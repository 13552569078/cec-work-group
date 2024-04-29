<!--
 * @Description: 流程资源管理
 * @Author: liu lianpeng
 * @Date: 2022-03-17
-->
<template>
  <router-page-layout :path="myPath">
    <div class="statistic-wrap">
      <!-- <c-tabs v-model="activeTab" class="tab-list-own">
        <c-tab-pane label="业务流程" name="process" />
      </c-tabs> -->
      <div class="tree-box" :style="'height: 100%'">
        <!-- 业务流程 -->
        <process-list />
        <!-- 逻辑流程 -->

      </div>

    </div>
  </router-page-layout>

</template>
<script>

import processList from './process-list'

import clearCacheMx from '@/mixin/index-clear-cache-mixin'
export default {
  name: 'FlowAsset',
  components: {
    processList

  },
  mixins: [clearCacheMx],
  data() {
    return {
      myPath: '/asset-management/flow-asset',
      activeTab: window.sessionStorage.getItem('flowAssetactiveTab') || 'process'
    }
  },
  watch: {
    activeTab() {
      this.cache()
    }
  },
  created() {
    this.div = document.createElement('div')
    this.div.className = 'list-tabs-bg'
    this.div.id = 'list-tabs-bg-flow-index'
    this.$nextTick(() => {
      if (this.$route.path === this.myPath) { document.getElementsByClassName('page-content-wrapper')[0].append(this.div) }
    })
  },
  destroyed() {
    try {
      document.getElementsByClassName('page-content-wrapper')[0].removeChild(this.div)
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    cache() {
      window.sessionStorage.setItem('flowAssetactiveTab', this.activeTab)
    },
    clearQueryCache() {
      window.sessionStorage.setItem('flowAssetactiveTab', '')
    }
  }

}
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';
.tree-box{
  // margin-top: 4px;
}

.has-tree{
  margin-top: 20px;
 &::v-deep .page-header{
    border-top: 0px !important;
  }

}
.statistic-wrap {
  height: 100%;
}
.tagIdList {
  .c-scrollbar .c-scrollbar__view .c-select-dropdown__item {
    height: auto;
    max-height: 274px;
    padding: 0;
    overflow-x: hidden;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 4px;
      background-color: #fff;
      border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb {
      width: 4px;
      background-color: #ccc;
      border-radius: 4px;
    }
  }

  .c-select-dropdown__item.selected {
    font-weight: normal;
  }

}

</style>
