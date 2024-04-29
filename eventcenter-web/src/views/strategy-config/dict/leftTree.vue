<template>
  <el-scrollbar style="height: 100%">
    <div class="cestc-dict-tree fs14">
      <el-input
        v-model="filterText"
        placeholder="请输入"
        class="tree-search mb20"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click.stop="_toSearch"
        />
      </el-input>
      <el-tree
        ref="tree"
        :data="treeData"
        v-bind="$attrs"
        highlight-current
        :expand-on-click-node="false"
        :props="{ label: 'dictName', children: 'children' }"
        icon-class-fold="el-icon-caret-right"
        icon-class-unfold="el-icon-caret-bottom"
        :filter-node-method="filterNode"
        v-on="$listeners"
        @node-click="handleNodeClick"
      >
        <!-- 自定义 node 内容 -->
        <div slot-scope="{ node, data }" class="tree-item">
          <span>{{ node.label }}</span>
          <i
            v-if="node.key === 'all'"
            class="el-icon-circle-plus-outline mr-auto"
            @click.stop.self="_addDict"
          />
          <div v-else class="mr-auto" @click.stop>
            <el-dropdown
              trigger="click"
              @visible-change="_handleVisible"
              @command="_handleAction"
            >
              <i class="el-icon-more" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="{ type: 'edit', data }"
                >编辑</el-dropdown-item>
                <el-dropdown-item
                  :command="{ type: 'del', data }"
                >删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </el-tree>
    </div>
  </el-scrollbar>
</template>
<script>
export default {
  name: 'DictTree',
  props: {
    dictData: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      filterText: ''
    }
  },
  computed: {
    treeData() {
      const data = this.dictData || []
      const obj = {
        id: '',
        dictName: '全部',
        dictType: 'all',
        children: data
      }
      return [obj]
    }
  },
  methods: {
    _toSearch() {
      this.$refs.tree.filter(this.filterText)
    },
    filterNode(value, data) {
      if (!value) return true
      const label =
        (this.$attrs.props && this.$attrs.props.label) || 'dictName'
      return data[label] && data[label].indexOf(value) !== -1
    },
    handleNodeClick(data, Node) {
      console.log('data==', data)
      console.log('Node==', Node)
      this.$emit('handleNodeClick', data)
    },
    // 新增字典
    _addDict() {
      this.$emit('addDict')
    },
    // 下拉显示隐藏改变的时候触发
    _handleVisible(val) {
      console.log('val===', val)
    },
    _handleAction(obj) {
      this.$emit('handleAction', obj)
    }
  }
}
</script>
<style lang="scss">
.cestc-dict-tree {
  padding: 20px;
  .tree-item {
    width: 100%;
    display: flex;
    .mr-auto {
      margin-left: auto;
      color: #bdbdbd;
    }
    .el-icon-more {
      transform: rotate(90deg);
      color: #bdbdbd;
    }
  }
}
</style>
