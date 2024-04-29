<!--
    /**
     * 树形下拉选择组件，下拉框展示树形结构，提供选择某节点功能，方便其他模块调用
     * @author huke
     * @date 2023-11-23
     */
-->
<template>
  <div>
    <div v-show="isShowSelect" class="mask" @click="isShowSelect = !isShowSelect" />
    <el-popover
      v-model="isShowSelect"
      placement="bottom-start"
      trigger="manual"
      style="padding: 12px 0;"
      @hide="popoverHide"
    >
      <el-tree
        ref="tree"
        class="common-tree"
        :style="style"
        :data="treeData"
        :props="defaultProps"
        :show-checkbox="multiple"
        :node-key="nodeKey"
        :check-strictly="checkStrictly"
        :default-expand-all="false"
        :expand-on-click-node="false"
        :check-on-click-node="multiple"
        :highlight-current="true"
        @node-click="handleNodeClick"
        @check-change="handleCheckChange"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <div class="org-tree-node" @mouseover="hoverId = data.id" @mouseleave="hoverId = ''">
            <span class="org-label ellipsis">{{ data.name }}</span>
            <span v-if="!node.isLeaf" v-show="hoverId === data.id" class="org-tree-all">
              <span @click.stop="selectAllChildNodes(data)">下级全选</span>
              <span @click.stop="unSelectAllChildNodes(data)">取消全选</span>
            </span>
          </div>
        </span>
      </el-tree>
      <el-select
        slot="reference"
        ref="select"
        v-model="selectedData"
        :style="selectStyle"
        :size="size"
        :multiple="multiple"
        :clearable="clearable"
        :disabled="disabled"
        :collapse-tags="collapseTags"
        class="tree-select"
        @click.native="isShowSelect = !isShowSelect"
        @remove-tag="removeSelectedNodes"
        @clear="removeSelectedNode"
        @change="changeSelectedNodes"
      >
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-popover>
  </div>
</template>

<script>
export default {
  props: {
    // 树结构数据
    treeData: {
      type: Array,
      default() {
        return []
      }
    },
    defaultProps: {
      type: Object,
      default() {
        return {
          children: 'children',
          label: 'name'
        }
      }
    },
    // 配置是否可多选
    multiple: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 配置是否可清空选择
    clearable: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 配置是否禁用
    disabled: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 配置多选时是否将选中值按文字的形式展示
    collapseTags: {
      type: Boolean,
      default() {
        return false
      }
    },
    nodeKey: {
      type: String,
      default() {
        return 'id'
      }
    },
    // 显示复选框情况下，是否严格遵循父子不互相关联
    checkStrictly: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 默认选中的节点key数组
    checkedKeys: {
      type: Array,
      default() {
        return []
      }
    },
    size: {
      type: String,
      default() {
        return 'medium'
      }
    },
    popWidth: {
      type: Number,
      default() {
        return 250
      }
    },
    selectWidth: {
      type: [Number, String],
      default() {
        return 250
      }
    },
    height: {
      type: Number,
      default() {
        return 300
      }
    }
  },
  data() {
    return {
      isShowSelect: false, // 是否显示树状选择器
      options: [],
      selectedData: [], // 选中的节点
      style: 'width:' + (this.popWidth - 24) + 'px;' + 'height:' + this.height + 'px;',
      selectStyle: 'width:calc(' + (this.selectWidth + 24) + ')px;',
      checkedIds: [],
      checkedData: [],
      childrenKey: [],
      hoverId: ''
    }
  },
  watch: {
    isShowSelect(val) {
      // 隐藏select自带的下拉框
      this.$refs.select.blur()
    },
    checkedKeys: {
      handler(val) {
        if (!val) return
        this.checkedKeys = val
        this.initCheckedData()
      },
      deep: true,
      immediate: true
    }

  },
  mounted() {
    this.initCheckedData()
  },
  methods: {
    // 单选时点击tree节点，设置select选项
    setSelectOption(node) {
      const tmpMap = {}
      tmpMap.value = node.key
      tmpMap.label = node.label
      this.options = []
      this.options.push(tmpMap)
      this.selectedData = node.key
    },
    // 单选，选中传进来的节点
    checkSelectedNode(checkedKeys) {
      const item = checkedKeys[0]
      this.$refs.tree.setCurrentKey(item)
      const node = this.$refs.tree.getNode(item)
      this.setSelectOption(node)
    },
    // 多选，勾选上传进来的节点
    checkMultipleSelectedNodes(checkedKeys, delay = 500) {
      const that = this
      that.$nextTick(() => {
        setTimeout(() => {
          that.$refs.tree.setCheckedKeys(checkedKeys)
          that.setOptions(checkedKeys)
        }, delay)
      })
    },
    // 单选，清空选中
    clearSelectedNode() {
      this.selectedData = []
      this.$refs.tree.setCurrentKey(null)
    },
    // 多选，清空所有勾选
    clearSelectedNodes() {
      this.$nextTick(() => {
        const checkedKeys = this.$refs?.tree.getCheckedKeys() // 所有被选中的节点的 key 所组成的数组数据
        for (let i = 0; i < checkedKeys.length; i++) {
          this.$refs.tree.setChecked(checkedKeys[i], false)
        }
      })
    },
    initCheckedData() {
      if (this.multiple) {
        // 多选
        if (this.checkedKeys.length > 0) {
          this.checkMultipleSelectedNodes(this.checkedKeys)
        } else {
          this.clearSelectedNodes()
        }
      } else {
        // 单选
        if (this.checkedKeys.length > 0) {
          this.checkSelectedNode(this.checkedKeys)
        } else {
          this.clearSelectedNode()
        }
      }
    },
    popoverHide() {
      if (this.multiple) {
        this.checkedIds = this.$refs.tree.getCheckedKeys() // 所有被选中的节点的 key 所组成的数组数据
        this.checkedData = this.$refs.tree.getCheckedNodes() // 所有被选中的节点所组成的数组数据
      } else {
        this.checkedIds = this.$refs.tree.getCurrentKey()
        this.checkedData = this.$refs.tree.getCurrentNode()
      }
      this.$emit('popoverHide', this.checkedIds, this.checkedData)
    },
    // 单选，节点被点击时的回调,返回被点击的节点数据
    handleNodeClick(data, node) {
      if (!this.multiple) {
        this.setSelectOption(node)
        this.isShowSelect = !this.isShowSelect
        this.$emit('change', this.selectedData)
      }
    },
    // 多选，节点勾选状态发生变化时的回调
    handleCheckChange() {
      const checkedKeys = this.$refs?.tree?.getCheckedKeys() // 所有被选中的节点的 key 所组成的数组数据
      this.setOptions(checkedKeys)
    },
    setOptions(checkedKeys) {
      this.$nextTick(() => {
        this.options = checkedKeys.map((item) => {
          const node = this.$refs.tree.getNode(item)
          const tmpMap = {}
          tmpMap.value = node.key
          tmpMap.label = node.label
          return tmpMap
        })
        this.selectedData = this.options.map((item) => {
          return item.value
        })
        this.$emit('change', this.selectedData)
      })
    },
    // 多选,删除任一select选项的回调
    removeSelectedNodes(val) {
      this.$refs.tree.setChecked(val, false)
      const node = this.$refs.tree.getNode(val)
      if (!this.checkStrictly && node.childNodes.length > 0) {
        this.treeToList(node).map(item => {
          if (item.childNodes.length <= 0) {
            this.$refs.tree.setChecked(item, false)
          }
        })
        this.handleCheckChange()
      }
      this.$emit('change', this.selectedData)
    },
    treeToList(tree) {
      let queen = []
      const out = []
      queen = queen.concat(tree)
      while (queen.length) {
        const first = queen.shift()
        if (first.childNodes) {
          queen = queen.concat(first.childNodes)
        }
        out.push(first)
      }
      return out
    },
    // 单选,清空select输入框的回调
    removeSelectedNode() {
      this.clearSelectedNode()
      this.$emit('change', this.selectedData)
    },
    // 选中的select选项改变的回调
    changeSelectedNodes(selectedData) {
      // 多选,清空select输入框时，清除树勾选
      if (this.multiple && selectedData.length <= 0) {
        this.clearSelectedNodes()
      }
      this.$emit('change', this.selectedData)
    },
    // 下级全选
    selectAllChildNodes(data) {
      this.childrenKey = []
      this.getChildrenOrgCode(data.children)
      const currentCheckedKeys = [...new Set(this.$refs?.tree?.getCheckedKeys().concat(this.childrenKey))]
      this.checkMultipleSelectedNodes(currentCheckedKeys, 0)
    },
    // 取消全选
    unSelectAllChildNodes(data) {
      this.childrenKey = []
      this.getChildrenOrgCode(data.children)
      const currentCheckedKeys = this.$refs?.tree?.getCheckedKeys().filter(item => !this.childrenKey.includes(item))
      this.checkMultipleSelectedNodes(currentCheckedKeys, 0)
    },
    getChildrenOrgCode(arr) {
      arr.forEach(e => {
        if (e?.children?.length) {
          e.children.forEach(j => {
            this.childrenKey.push(j.id)
          })
          this.getChildrenOrgCode(e.children)
        }
        if (this.childrenKey.findIndex(i => i === e.id) === -1) this.childrenKey.push(e.id)
      })
    }
  }

}
</script>

<style scoped lang="scss">
  .mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    opacity: 0;
    z-index: 11;
  }

  .org-tree-node {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: #4b4b4b;
    .org-label {
      max-width: 158px;
    }
    .org-tree-all {
      color: #36a4ff;
      margin-left: 20px;
      width: 101px;
      color: #36a4ff;
      font-size: 12px;
      display: flex;
      justify-content: space-between;
    }
  }

  .common-tree {
    overflow: auto;
    min-width: 422px;
  }

  .tree-select {
    z-index: 111;
    width: 100%;
  }
  ::v-deep {
    .el-select .el-tag.el-tag--info {
      background: rgba(54,164,255,0.2);
    }
    .el-tree-node__content>label.el-checkbox {
      margin-bottom: 2px !important;
    }
  }
</style>
