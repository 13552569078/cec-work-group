<!--
 * @Description: 对象资源管理
 * @Author: liu lianpeng
 * @Date: 2022-03-17
-->
<template>
  <router-page-layout :path="myPath">
    <div class="statistic-wrap">
      <c-tabs v-model="activeTab" class="tab-list-own">
        <c-tab-pane v-for="tab in tabList" :key="tab.value" :label="tab.label" :name="tab.value" />
      </c-tabs>
      <div class="tree-box" :style="'height: calc(100% - 55px);margin-top:4px;'">
        <!-- 实体对象 -->
        <entry-list v-if="activeTab ==='entry'" />
        <!-- 监测模型 -->
        <model-list v-if="activeTab ==='model'" />
        <!-- 监测策略 -->
        <strategy-list v-if="activeTab ==='strategy'" />
        <!-- 监测布控 -->
        <control-list v-if="activeTab ==='control'" />
      </div>

    </div>
  </router-page-layout>

</template>
<script>

import entryList from './entry-list.vue'
import clearCacheMx from '@/mixin/index-clear-cache-mixin'
import modelList from '../monitor-asset/model-list.vue'
import controlList from '../monitor-asset/control-list.vue'
import strategyList from '../monitor-asset/strategy-list.vue'
import { getUserPermissionByKey } from '@/utils'
export default {
  name: 'ObjectAsset',
  components: {
    modelList, controlList, strategyList,
    entryList
  },
  mixins: [clearCacheMx],
  data() {
    let tabList = [
      { label: '实体对象', value: 'entry', hide: !getUserPermissionByKey('objectAssetEntity') },
      { label: '监测模型', value: 'model', hide: !getUserPermissionByKey('monitorModel') },
      { label: '监测策略', value: 'strategy', hide: !getUserPermissionByKey('monitorPolicy') },
      { label: '监测布控', value: 'control', hide: !getUserPermissionByKey('monitorDeploy') }
    ]
    tabList = tabList.filter(d => !d.hide)
    let activeTab = window.sessionStorage.getItem('objectAssetactiveTab')
    if (!activeTab || !tabList.find(d => d.value === activeTab)) {
      activeTab = tabList[0].value
    }
    return {
      myPath: '/asset-management/object-asset',
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
      window.sessionStorage.setItem('objectAssetactiveTab', this.activeTab)
    },
    clearQueryCache() {
      window.sessionStorage.setItem('objectAssetactiveTab', '')
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
