<!--
 * @Description: 数据资源管理
 * @Author: liu lianpeng
 * @Date: 2021-05-07
-->
<template>
  <router-page-layout :path="myPath">
    <div class="statistic-wrap">
      <c-tabs v-model="activeTab" class="tab-list-own">
        <c-tab-pane label="监测模型" name="model" />
        <c-tab-pane label="监测策略" name="strategy" />
        <c-tab-pane label="监测布控" name="control" />
        <!-- <c-tab-pane label="逻辑函数" name="function" /> -->
        <!-- <c-tab-pane label="定时任务" name="task" /> -->
      </c-tabs>
      <div class="tree-box" :style="'height: calc(100% - 55px);margin-top:4px;'">
        <model-list
          v-if="activeTab ==='model'"
        ></model-list>
        <strategy-list
          v-if="activeTab ==='strategy'"
        ></strategy-list>
        <control-list
          v-if="activeTab ==='control'"
        ></control-list>
      </div>

    </div>
  </router-page-layout>

</template>
<script>

import clearCacheMx from '@/mixin/index-clear-cache-mixin'
import modelList from './model-list.vue'
import controlList from './control-list.vue'
import strategyList from './strategy-list.vue'
export default {
  name: 'MonitorAsset',
  components: {
    modelList,
    controlList,
    strategyList
  },
  mixins: [clearCacheMx],
  data() {
    return {
      myPath: '/asset-management/monitor-asset',
      activeTab: window.sessionStorage.getItem('monitorAssetactiveTab') || 'model'
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
      window.sessionStorage.setItem('monitorAssetactiveTab', this.activeTab)
    },
    clearQueryCache() {
      window.sessionStorage.setItem('monitorAssetactiveTab', '')
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
