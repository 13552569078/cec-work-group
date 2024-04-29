<!--
 * @Description: 数据资源管理
 * @Author: liu lianpeng
 * @Date: 2021-05-07
-->
<template>
  <router-page-layout :path="myPath">
    <div class="statistic-wrap">
      <c-tabs v-model="activeTab" class="tab-list-own">
        <c-tab-pane v-for="tab in tabList" :key="tab.value" :label="tab.label" :name="tab.value" />
      </c-tabs>
      <div class="tree-box" :style="'height: calc(100% - 55px);margin-top:4px;'">

        <!-- 页面 -->
        <page-list
          v-if="activeTab ==='page'"
        ></page-list>
        <!-- 接口 -->
        <interface-list
          v-if="activeTab ==='interface'"
        ></interface-list>
        <!-- 脚本 -->
        <script-list
          v-if="activeTab ==='script'"
        ></script-list>
      </div>

    </div>
  </router-page-layout>

</template>
<script>

import pageList from './page-list.vue'
import interfaceList from './interface-list.vue'
import scriptList from './script-list.vue'

import clearCacheMx from '@/mixin/index-clear-cache-mixin'
import { getUserPermissionByKey } from '@/utils'

export default {
  name: 'StatisticsAsset',
  components: {

    interfaceList,

    pageList,
    scriptList
  },
  mixins: [clearCacheMx],
  data() {
    let tabList = [
      { label: '接口', value: 'interface', hide: !getUserPermissionByKey('interfaceAsset') },
      { label: '页面', value: 'page', hide: !getUserPermissionByKey('pageAsset') },
      { label: '算法资源', value: 'arithmetic', hide: !getUserPermissionByKey('algorithmAsset') },
      { label: '脚本', value: 'script', hide: !getUserPermissionByKey('script') }
    ]
    tabList = tabList.filter(d => !d.hide)
    let activeTab = window.sessionStorage.getItem('technologyAssetactiveTab')
    if (!activeTab || !tabList.find(d => d.value === activeTab)) {
      activeTab = tabList[0].value
    }
    return {
      myPath: '/asset-management/technology-asset',
      activeTab,
      tabList
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
      window.sessionStorage.setItem('technologyAssetactiveTab', this.activeTab)
    },
    clearQueryCache() {
      window.sessionStorage.setItem('technologyAssetactiveTab', '')
    }
  }

}
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';
.tree-box{

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
