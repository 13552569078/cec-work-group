<!--
 * @description 流程管理--节点配置--左侧树
 * @date 2020-09-08
 * @author lism
-->
<template>
  <div class="process-task-left-tree">
    <el-input
      v-model="filterText"
      placeholder="请输入"
      class="tree-search mb20"
    >
      <el-button slot="append" icon="el-icon-search" @click.stop="_toSearch" />
    </el-input>
    <ul class="fs14 list">
      <li
        v-for="item in innerNode"
        :key="item.id"
        :class="['task-item', { 'is-current': item.id === currentNodeId }]"
        @click.stop="_nodeClick(item)"
      >
        <span>{{ item.name }}</span>
        <span class="right">{{ item.id }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'LeftTree',
  props: {
    nodeData: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      filterText: '',
      currentNode: null, // 默认第一个节点
      innerNode: []
    }
  },
  computed: {
    currentNodeId() {
      return this.currentNode && this.currentNode.id
    }
  },
  watch: {
    nodeData: {
      handler(val) {
        if (val.length) {
          this.currentNode = val[0]
          this.innerNode = this.nodeData
        }
      },
      immediate: true
    },
    currentNode(val) {
      this.$emit('nodeChange', val)
    }
  },
  created() {},
  methods: {
    _toSearch() {
      this.innerNode = this.nodeData.filter(
        (item) => item.name.indexOf(this.filterText) > -1
      )
    },
    // 点击 node 切换
    _nodeClick(node) {
      if (node.id === this.currentNode.id) return
      this.currentNode = node
    }
  }
}
</script>

<style lang="scss" scoped>
.process-task-left-tree {
  padding: 20px 0;
  height: 100%;
  ::v-deep{
    .tree-search {
      padding: 0 20px;
      .el-input-group__append {
        width: 32px;
        text-align: center;
        background-color: $inputAppendBg;
        padding: 0;
      }
    }
  }
  .list {
    padding: 0 4px;
    max-height: calc(100% - 72px);
    overflow-y: auto;
  }
  .task-item {
    padding: 0 16px;
    height: 40px;
    display: flex;
    align-items: center;
    color: #4b4b4b;
    &:hover,
    &.is-current {
      background-color: #f9fafe;
      cursor: pointer;
    }
    .right {
      margin-left: auto;
      color: #8a8a8a;
    }
  }
}
</style>
