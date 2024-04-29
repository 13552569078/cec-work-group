<template>
  <!-- 树形搜索组件封装 -->
  <div class="cestc-tree">
    <el-input v-model="filterText" placeholder="请输入" class="tree-search">
      <el-button slot="append" icon="el-icon-search" @click.stop="_toSearch" />
    </el-input>
    <div v-show="breadcrumbArr.length > 1" class="breadcrumbbox">
      <i v-for="(val, idx) in breadcrumbArr" :key="val[nodeId]">
        <a v-if="idx !== breadcrumbArr.length - 1" @click="getBreadcrumbAndUseNodeData(val)">{{ val.name }}</a>
        <b v-else>{{ val.name }}</b>
        <span v-if="idx !== breadcrumbArr.length - 1">&gt;</span>
      </i>
    </div>
    <el-tree
      v-if="!lazy"
      ref="tree"
      :data="useNodeData"
      :filter-node-method="filterNode"
      :node-key="nodeId"
      :default-expanded-keys="defaultKeys"
      v-bind="$attrs"
      @node-click="handleNodeClick"
    >
      <template v-slot="{ node, data }">
        <!-- 插槽传数据给父级，父级需要用 template 接收 -->
        <slot :slot-scope="{ node, data }" />
      </template>
    </el-tree>
    <el-tree
      v-else
      ref="lazyTree"
      lazy
      :filter-node-method="filterNode"
      :node-key="nodeId"
      :default-expanded-keys="defaultKeys"
      v-bind="$attrs"
      @node-click="handleNodeClick"
    >
      <template v-slot="{ node, data }">
        <!-- 插槽传数据给父级，父级需要用 template 接收 -->
        <slot :slot-scope="{ node, data }" />
      </template>
    </el-tree>
  </div>
</template>

<script>
export default {
  name: 'CestcNewTreeName',
  props: {
    nodeId: {
      type: String,
      default: () => 'id'
    },
    lazy: {
      type: Boolean,
      default: false
    },
    parentId: {
      type: String,
      default: () => 'parentId'
    },
    groupId: {
      type: String,
      default: () => 'groupId'
    },
    treeData: {
      type: Array,
      default: () => []
    },
    defaultExpandedKeys: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      filterText: '',
      AllNodeData: [],
      useNodeData: [],
      breadcrumbArr: [],
      defaultKeys: [0]
    }
  },
  watch: {
    treeData: {
      deep: true,
      handler(nval) {
        this.initTree(nval)
      }
    },
    defaultExpandedKeys: {
      deep: true,
      handler(nval) {
        this.defaultKeys = nval
      }
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
    initTree(nval) {
      this.AllNodeData = nval
      this.useNodeData = nval
      this.breadcrumbArr = []
    },
    handleNodeClick(clickNodeData) {
      this.getBreadcrumbAndUseNodeData(clickNodeData)
    },
    getBreadcrumbAndUseNodeData(clickNodeData) {
      // console.log('clickNodeData::::', clickNodeData)
      this.$emit('node-click', clickNodeData)
      const isFirst = this.AllNodeData.some(val => {
        if (val[this.nodeId] === clickNodeData[this.nodeId]) {
          return true
        }
      })
      if (isFirst) {
        this.useNodeData = [...this.AllNodeData]
      } else {
        this.useNodeData = [clickNodeData]
      }
      this.defaultKeys = []
      this.defaultKeys.push(clickNodeData[this.nodeId])
      this.breadcrumbArr = []
      const loopFn = (UseAllNodeData, UseclickNodeData_id) => {
        return UseAllNodeData.some(val => {
          if (Math.abs(val[this.nodeId]) === Math.abs(UseclickNodeData_id) || val[this.nodeId] === UseclickNodeData_id) {
            this.breadcrumbArr.push(val)
            if (val[this.parentId] !== 0 && val[this.parentId] !== null && val[this.parentId] !== undefined) {
              loopFn(this.AllNodeData, val[this.parentId])
            } else if (val[this.parentId] === 0) {
              loopFn(this.AllNodeData, val[this.groupId])
            } else if (val[this.parentId] === null) {
              loopFn(this.AllNodeData, 0)
            }
            return true
          } else if (val.children && val.children.length > 0) {
            return loopFn(val.children, UseclickNodeData_id)
          }
        })
      }
      loopFn(this.AllNodeData, clickNodeData[this.nodeId])
      this.breadcrumbArr.reverse()
      this.$nextTick(() => {
        document.querySelector('.breadcrumbbox').scrollLeft = 1000
      })
      // console.log('this.breadcrumbArr', this.breadcrumbArr)
    }
  }
}
</script>

<style lang="scss" scoped>
.cestc-tree {
  width: 100%;
  padding: 0px;
  background-color: #ffffff;
  height: auto;
  .tree-search {
    margin-bottom: 20px;
    .el-input-group__append {
      width: 32px;
      text-align: center;
      background-color: $inputAppendBg;
      padding: 0;
    }
  }
  ::v-deep {
    .el-tree {
      .el-tree-node__content {
        height: 40px;
      }
      .el-tree-node__label {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #4B4B4B;
        font-weight: 400;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .el-icon-caret-right:before {
        color: #b5b5b5;
        font-size: 15px;
      }
      .el-tree-node__expand-icon.expanded:before {
        color: #000;
        font-size: 15px;
      }
      .el-tree-node__expand-icon.is-leaf {
        margin-right: 16px;
      }
    }
  }
  .breadcrumbbox {
    width: 100%;
    padding: 0px 0px 10px 0;
    margin: 0px;
    overflow-x: auto;
    white-space: nowrap;
    i {
      font-style: normal;
    }
    b {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #36A4FF;
      font-weight: normal;
    }
    span {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #cccccc;
      margin: 0 4px;
    }
    a {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #4B4B4B;
    }
  }
}
</style>
