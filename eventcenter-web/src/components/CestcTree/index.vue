<template>
  <!-- 树形搜索组件封装 -->
  <div class="cestc-tree">
    <el-input
      v-if="filterFlag"
      v-model="filterText"
      placeholder="请输入"
      class="tree-search"
      @keyup.enter.native="_toSearch"
    >
      <el-button slot="append" icon="el-icon-search" @click.stop="_toSearch" />
    </el-input>
    <el-tree
      ref="tree"
      v-bind="$attrs"
      :filter-node-method="filterNode"
      :node-key="nodeKey"
      :default-expand-all="expandAll"
      v-on="$listeners"
      @node-click="handleNodeClick"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <template v-if="node.label.length > textLength">
          <el-tooltip class="item" effect="light" :content="node.label" placement="top">
            <span>{{ node.label.substring(0, textLength) + '...' }}</span>
          </el-tooltip>
        </template>
        <span v-else>{{ node.label }}</span>
        <span v-if="statusList.length" class="status-list">
          <template v-for="item in statusList">
            <span v-if="data[item.key]" :key="item.type" :class="['status-tag', 'status-' + item.type]">
              {{ item.label }}
            </span>
          </template>
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
export default {
  name: 'CestcTree',
  props: {
    filterFlag: {
      type: Boolean,
      default: () => true
    },
    expandAll: {
      type: Boolean,
      default: () => false
    },
    multiple: {
      // 是否是多选
      type: Boolean,
      default: () => {
        return false
      }
    },
    nodeKey: {
      type: String,
      default: () => 'id'
    },
    statusList: {
      // 状态列表
      type: Array,
      default: () => {
        return []
      }
    },
    textLength: {
      type: Number,
      default: () => 7
    }
  },
  data() {
    return {
      filterText: ''
    }
  },
  methods: {
    _toSearch() {
      this.$refs.tree.filter(this.filterText)
    },
    filterNode(value, data) {
      if (!value) return true
      const label = (this.$attrs.props && this.$attrs.props.label) || 'label'
      return data[label] && data[label].indexOf(value) !== -1
    },
    handleNodeClick(node, treeNode) {
      this.$emit('handleNodeClick', node, treeNode)
    },
    setCurrentKey(key) {
      this.$refs.tree.setCurrentKey(key)
    },
    setCheckedKeys(key) {
      // 智能派单 默认请求三方数据
      this.$refs.tree.setCurrentKey(key)
      this.$refs.tree.setCheckedKeys([key])
      const nodes = this.$refs.tree.getCheckedNodes()
      nodes.length && this.$emit('handleNodeClick', nodes[0])
    }
  }
}
</script>

<style lang="scss">
.cestc-tree {
  padding: 20px;
  background-color: $white;
  height: 100%;

  .tree-search {
    margin-bottom: 20px;

    .el-input-group__append {
      width: 32px;
      text-align: center;
      background-color: $inputAppendBg;
      padding: 0;
    }
  }

  // v1.0.0 区县新版样式走查，全局样式覆盖
  .el-input-group__append,
  .el-input-group__prepend {
    border-color: #E7E7E7;
  }

  .el-tree {
    color: #4b4b4b;
  }

  .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background-color: #F9FAFE;
  }

  .el-tree-node__content {
    height: 40px;
    position: relative;
    .el-tree-node__expand-icon {
      font-size: 16px;
    }
    &>.el-tree-node__expand-icon {
      padding: 4px;
    }
  }

  .status-list {
    position: absolute;
    right: 16px;
    bottom: 11px;

    .status-tag {
      display: inline-block;
      border-radius: 1px;
      font-size: 12px;
      line-height: 20px;
      margin-left: 4px;
      padding: 0px 4px;
    }

    .status-1 {
      background: #ECEEFD;
      color: #4A72E5;
    }

    .status-2 {
      background: #FFEEDC;
      color: #FA8B16;
    }
  }
}

::v-deep {
  .is-current {
    background-color: #F9FAFE;
  }
}
</style>
