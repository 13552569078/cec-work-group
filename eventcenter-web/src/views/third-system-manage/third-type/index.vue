<template>
  <div class="strategy-config-third-type">
    <div class="search-tree">
      <!-- 需要添加内部滚动 -->
      <el-scrollbar style="height: 100%">
        <cestc-tree
          ref="tree"
          :data="thirdSystemList"
          :status-list="statusList"
          check-strictly
          node-key="platformCode"
          :highlight-current="true"
          :props="treeProps"
          icon-class-fold="el-icon-caret-right"
          icon-class-unfold="el-icon-caret-bottom"
          @handleNodeClick="handleNodeClick"
        />
      </el-scrollbar>
    </div>
    <div class="content-right">
      <eventType :selected-third-system="selectedThirdSystem" />
    </div>
  </div>
</template>

<script>
import eventType from '@/views/third-system-manage/third-type/eventType/index.vue'

import thirdSystemMixin from '@/mixin/thirdSystemMixin'

export default {
  name: 'ThirdType',
  components: {
    eventType
  },
  mixins: [thirdSystemMixin],
  data() {
    return {
      statusList: [
        {
          type: 1,
          key: 'sourcePlatform',
          label: '来源'
        },
        {
          type: 2,
          key: 'handlePlatform',
          label: '处置'
        }
      ]
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.strategy-config-third-type {
  width: 100%;
  display: flex;

  .search-tree {
    flex: 0 0 272px;
    width: 272px;
    margin: 0 20px 0 0;

    .el-scrollbar {
      background-color: $white;
    }
  }

  .content-right {
    flex: 1;
    width: calc(100% - 292px);
    overflow-y: auto;
  }
}
</style>
