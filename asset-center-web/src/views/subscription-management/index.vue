<!--
 * @Description: 流程资源管理
 * @Author: liu lianpeng
 * @Date: 2022-03-17
-->
<template>
  <router-page-layout :path="myPath">
    <div class="statistic-wrap">
      <c-tabs v-model="activeTab" class="tab-list-own">
        <c-tab-pane label="接口资源" name="interface" />
        <c-tab-pane label="体征资源" name="ti" />
        <c-tab-pane label="模型资源" name="model" />
        <c-tab-pane label="支撑应用" name="app" />
      </c-tabs>
      <div class="tree-box" :style="'height: calc(100% - 55px)'">
        <!-- 接口 -->
        <interfacePage v-if="activeTab ==='interface'" />
        <tiPage v-if="activeTab ==='ti'" />
        <modelPage v-if="activeTab ==='model'" />
        <!-- 支撑应用 -->
        <appPage v-if="activeTab ==='app'"></appPage>

      </div>

    </div>
  </router-page-layout>

</template>
<script>

import interfacePage from './interface-list.vue'
import appPage from './app-list.vue'
import tiPage from './ti-list.vue'
import modelPage from './model-list.vue'

import clearCacheMx from '@/mixin/index-clear-cache-mixin'
export default {
  name: 'FlowAsset',
  components: {
    interfacePage,
    appPage,
    tiPage,
    modelPage
  },
  mixins: [clearCacheMx],
  data() {
    return {
      myPath: '/subscription-management/asset-subscription',
      activeTab: window.sessionStorage.getItem('subAssetactiveTab') || 'interface'
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
      window.sessionStorage.setItem('subAssetactiveTab', this.activeTab)
    },
    clearQueryCache() {
      window.sessionStorage.setItem('subAssetactiveTab', '')
    }
  }

}
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';
.tree-box{
  margin-top: 4px;
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
