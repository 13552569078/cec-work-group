<!--
 * @Description: 树组件 使用场景主要是专题树
  响应事件
  'deleteTree', { 删除树节点 成功后请刷新树数据
        groupId: node.data[this.props.value],
        groupName: node.data[this.props.lable]
      }
  'updateTree',{ 更新树节点 成功后请刷新树数据
        groupId: node.data[this.props.value],
        groupName: node.data[this.props.lable]
      }
  'addTree', { 添加树节点 成功后请刷新树数据
        parentId: node.data[this.props.pid],
        groupName: node.data[this.props.lable]
      }
  'input', [this.valueId]
  'getValue', [node] 点击时返回选中的树节点

 * @Author: liu lianpeng
 * @Date: 2021-05-06
-->

<template>
  <div class="ct-main">
    <div
      v-if="search"
      class="input-div"
      @click.stop="''"
    >
      <div class="search-box">
        <c-input-search
          v-model="filterText"
          placeholder="输入关键字进行过滤"
          clearable
          @blur="handleSearch"
          @clear="handleSearch"
        ></c-input-search>
      </div>
    </div>
    <div class="bg-fff tree-box" :style="' height: '+treeHeight+';'">
      <div v-show="!isview" class="tree-plus">
        <i class="iconfont c-icon-circle-plus-outline"
           @click="addTreeNode({})"
        ></i>
      </div>
      <c-tree
        v-if="!!treeOptions.length"
        id="tree-option"
        ref="selectTree"
        class="ct-tree"
        :highlight-current="true"
        :show-checkbox="multiple"
        :disabled="disabled"
        :accordion="accordion"
        :data="treeOptions"
        :props="treeProps()"
        size="small"
        default-expand-all
        :node-key="props.value"
        :default-expanded-keys="defaultExpandedKey"
        :filter-node-method="filterNode"
        @node-click="handleNodeClick"
        @check-change="handleCheckChange"
      >
        <div
          slot-scope="{ node, data }"
          class="custom-tree-node"
          :class="{isroot: data.isRoot}"
        >
          <node-label :label="node.label">
          </node-label>
          <div v-show="!isview" class="right-node">
            <span class="iconfont icon-c-more icon-operate" />
            <tree-tooltip
            >
              <div
                slot="content"
                class="tree-btn"
              >
                <span
                  class="item"
                  @click.stop="editTree(node)"
                >编辑</span>
                <span
                  class="item"
                  @click.stop="addTreeNode(node)"
                >添加</span>
                <span
                  class="item"
                  @click.stop="deleteTree(node)"
                >删除</span>
              </div>
            </tree-tooltip>
          </div>
        </div>
      </c-tree>

    </div>

    <c-dialog
      :title="title"
      width="424px"
      class="details-dialog"
      top="50vh"
      :visible.sync="dialogVisible"
    >
      <c-form
        v-if="dialogVisible"
        ref="formData"
        :model="formData"
        :rules="rules"
      >
        <c-form-item
          class="group-form-item need-small"
          label="节点名称"
          size="small"
          label-width="75px"
          prop="currentLabel"
        >
          <c-input
            v-model="formData.currentLabel"
            style="width:100%"
            size="small"
            type="text"
            placeholder="请输入节点名称"
          />
        </c-form-item>
      </c-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <c-button
          type=""
          size="small"
          @click="dialogVisible = false"
        >取消</c-button>
        <c-button
          type="primary"
          size="small"
          @click="saveNode()"
        >确定</c-button>
      </div>
    </c-dialog>
  </div>
</template>

<script>
import treeTooltip from './tree-tooltip.vue'
import nodeLabel from './node-label.vue'

export default {
  name: 'Ctree',
  components: {
    treeTooltip,
    nodeLabel
  },
  props: {
    // 默认能维护的层级
    level: {
      type: Number,
      default: 5
    },
    // SelectedTitle 的链接符
    separator: {
      type: String,
      default: () => ','
    },
    // 是否是多选
    multiple: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    // 是否启用本地搜索
    search: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    // 组件大小
    size: {
      type: String,
      default: () => {
        return 'small'
      }
    },
    /* 配置项 */
    props: {
      type: Object,
      default: () => {
        return {
          value: 'id', // ID字段名
          label: 'name', // 显示名称
          children: 'children' // 子级字段名
        }
      }
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    /* 选项列表数据(树形结构的对象数组) */
    options: {
      type: Array,
      default: () => {
        return []
      }
    },
    operatable: {
      type: Boolean,
      default: false
    },
    /* 初始值 */ // 默认选择
    value: {
      type: [Array, Number, String],
      default: () => {
        return []
      }
    },
    /* 是否显示可清空选项 */
    clearable: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    /* 自动收起 */
    accordion: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    placeholder: {
      type: String,
      default: () => {
        return '请选择'
      }
    },
    rootinvalue: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    isview: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    // 是否启用根节点
    useRoot: {
      type: Boolean,
      default: () => {
        return true
      }
    }
  },
  data() {
    return {
      headerTree: '', // 根节点
      valueId: this.value, // 初始值
      valueTitle: '',
      title: '',
      treeHeight: 'calc(100% - 20px)',
      dialogVisible: false,
      defaultExpandedKey: [],
      updateFlag: true, // 更新value的标志
      filterText: '',
      formData: {
        currentLabel: ''
      },
      saveBtnFlag: true,
      rules: {
        currentLabel: [{
          required: true, trigger: 'blur', message: '请输入节点名称'
        }, {
          max: 15, trigger: 'blur', message: '最多输入15个字符'
        }]
      },
      treeProps: () => {
        let { disabled } = this.props
        disabled = !this.rootinvalue ? '' : disabled
        return {
          ...this.props,
          disabled
        }
      }
    }
  },
  computed: {
    treeOptions() {
      if (this.useRoot) {
        const obj = {}
        obj[this.props.value] = ''
        obj[this.props.label] = '全部'
        obj[this.props.children] = this.options
        obj.isRoot = true
        return [obj]
      } else {
        return this.options
      }
    }
  },
  watch: {
    value() {
      this.initValue()
    }
  },
  mounted() {
    this.initValue()
    if (!this.search) {
      this.treeHeight = '100%'
    }
  },
  methods: {
    handleSearch(val) {
      console.log(val, '我执行搜索', this.filterText)
      this.$refs.selectTree && this.$refs.selectTree.filter(this.filterText)
    },
    deleteTree(node) {
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        confirmButtonIsLeft: true,
        type: 'warning',
        iconClass: 'c-ioc-icon-warning'
      }).then(() => {
        this.$emit('deleteTree', {
          groupId: node.data[this.props.value],
          groupName: node.data[this.props.lable]
        })
      })
    },
    saveNode() {
      this.saveBtnFlag = false
      this.$refs.formData.validate(valid => {
        if (!valid) {
          this.saveBtnFlag = true
          return
        }
        if (this.formData.currentTreeId) {
          const params = {
            groupId: this.formData.currentTreeId,
            groupName: this.formData.currentLabel
          }
          this.$emit('updateTree', params)
          this.dialogVisible = false
          this.saveBtnFlag = true
        } else {
          const paramsAdd = {
            parentId: this.formData.parentId || 0,
            groupName: this.formData.currentLabel
          }
          this.$emit('addTree', paramsAdd)
          this.dialogVisible = false
          this.saveBtnFlag = true
        }
      })
    },
    addTreeNode(node) {
      this.formData.currentLabel = ''
      this.formData.parentId = node.data && node.data[this.props.value]
      this.formData.currentTreeId = null
      this.dialogVisible = true
      this.title = '添加节点'
    },
    editTree(node) {
      this.formData.currentTreeId = node.data && node.data[this.props.value]
      this.formData.currentLabel = node.data && node.data[this.props.label]
      this.dialogVisible = true
      this.title = '编辑节点'
    },
    filterNode(value, data) {
      if (!value) return true
      return data[this.props.label] && data[this.props.label].indexOf(value) !== -1
    },
    initValue() {
      // 解决因multiple值更新延迟导致的结果异常
      setTimeout(() => {
        if (this.multiple) {
          this.valueId = Array.isArray(this.value) ? this.value : this.value ? [this.value + ''] : []
        } else {
          this.valueId = Array.isArray(this.value) ? this.value[0] || '' : this.value ? `${this.value}` : ''
        }
        this.initHandle()
      }, 100)
    },
    // 初始化值
    initHandle() {
      if (this.valueId) {
        let temp
        if (this.multiple) {
          this.valueTitle = this.getSelectedTitle(this.valueId)
          this.$refs.selectTree.setCheckedKeys(this.valueId, false)
        } else {
          // 解决因更新延迟导致的结果异常
          setTimeout(() => {
            temp = this.$refs.selectTree.getNode(this.valueId)
            if (temp) {
              this.valueTitle = temp.data[this.props.label] // 初始化显示
            }
            this.$refs.selectTree.setCurrentKey(this.valueId) // 设置默认选中
            // this.defaultExpandedKey = [this.valueId] // 设置默认展开
          }, 100)
        }
      } else {
        this.valueTitle = ''
      }
      this.$nextTick(() => {
        const scrollWrap = document.querySelectorAll(
          '.c-scrollbar .c-select-dropdown__wrap'
        )
        const scrollBar = document.querySelectorAll(
          '.c-scrollbar .c-scrollbar__bar'
        )
        scrollWrap.forEach(ele => { ele.style.cssText = 'margin: 0px; max-height: none; overflow: hidden;' })
        scrollBar.forEach(ele => (ele.style.width = 0))
      })
    },
    getSelectedTitle(arr) {
      const tempArr = []
      if (Array.isArray(arr)) {
        arr.forEach(item => {
          if (Array.isArray(item)) {
            tempArr.push(this.getSelectedTitle(item))
          } else {
            const temp = this.$refs.selectTree.getNode(item)
            if (temp) {
              tempArr.push(temp.data[this.props.label])
            }
          }
        })
      }
      return tempArr.join(this.separator)
    },
    // 切换选项
    handleNodeClick(node) {
      if (!this.multiple && node[this.props.disabled] !== true) {
        this.valueTitle = `${node[this.props.label]}`
        this.valueId = `${node[this.props.value]}`
        if (typeof this.valueId !== 'number') {
          const ary = this.valueId.split('-')
          if (ary.length === 2) {
            this.valueId = ary[1]
          }
        }
        this.$emit('input', [this.valueId])
        this.$emit('getValue', [node])
        this.defaultExpandedKey = []
        this.updateFlag = false
        // this.$refs.selectDefault.blur()
      }
    },
    // 多选check变化
    handleCheckChange(data, checked, indeterminate) {
      if (this.multiple) {
        this.valueId = this.$refs.selectTree.getCheckedKeys(false)
        this.valueId.map(x => {
          if (typeof x === 'number') {
            return x
          } else {
            return x
          }
        })
        let data = this.$refs.selectTree.getCheckedNodes(false)
        const childrenKey = this.props.children
        if (!this.rootinvalue) {
          data = data.filter(d => (!d[childrenKey] || (d[childrenKey] && !d[childrenKey].length)))
          this.valueId = data.map(d => d[this.props.value])
        }
        this.valueTitle = this.getSelectedTitle(this.valueId)
        this.$emit('input', this.valueId)
        this.$emit('getValue', data)
        this.updateFlag = false
      }
    },
    // 清除选中
    clearHandle() {
      this.valueTitle = ''
      this.valueId = null
      this.defaultExpandedKey = []
      this.clearSelected()
      this.$emit('input', [])
      this.$emit('getValue', [])
      if (this.multiple) {
        this.$refs.selectTree.setCheckedKeys([])
      }
    },
    /* 清空选中样式 */
    clearSelected() {
      const allNode = document.querySelectorAll('#tree-option .c-tree-node')
      allNode.forEach(element => element.classList.remove('is-current'))
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../styles/variables.scss';

.search-box {
  .c-input-search {
    width: 232px;
  }
}
.tree-box {
  position: relative;
}
.tree-plus{
  position: absolute;
  padding: 12px;
  right: 20px;
  z-index: 10;
  .iconfont{
    cursor: pointer;
    color: #BDBDBD;
    &:hover {
      color: $primaryColor;
    }
  }
}
.ct-main{
  position: relative;
  height: 100%;
  padding-top: 72px;
  overflow: hidden;
}
.bg-fff {
  background: #fff;
  padding: 0px 20px;
  overflow: auto;
}

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
ul li >>> .c-tree .c-tree-node__content {
  height: auto;
  padding: 0 20px;
}
.c-tree >>> .is-current .c-tree-node__children .c-tree-node__label {
  // color: #666360;
  font-weight: normal;
}

.input-div {
  box-sizing: border-box;
  width: 100%;
  position: absolute;
  padding: 0 20px 20px;
  top: 20px;
  left: 0;
  z-index: 20;
  background-color: #fff;
}

.c-tree-node__label {
  font-weight: normal;
  line-height: 20px;
}
.c-tree .is-current > .c-tree-node__content > .c-tree-node__label {
  color: $primaryColor;
  font-weight: 600;
}
.ct-tree {
  &::v-deep .c-tree-node__content {
    height: 40px;
  }
  .custom-tree-node {
    display: flex;
    justify-content: space-between;
    flex: 1;
    width: 100%;
    height: 26px;
    align-items: center;
    &:hover {
      .right-node{
        display: block;
        &:hover {
          ::v-deep .tree-tooltip {
            display: block;
          }
        }
      }
    }
    &.isroot:hover .right-node {
      display: none;
    }
    img {
      width: 16px;
      height: 16px;
    }
    .right-node {
      position: absolute;
      right: 8px;
      display: none;
      &:hover {
        .icon-c-more {
          color: $primaryColor;
        }
      }
    }
  }
  .c-tree-node__content {
    line-height: 40px;
    height: 40px;
    font-size: 14px;
  }
}
::v-deep .details-dialog .c-form-item__label:before {
  display: none !important;
}
.group-form-item {
  margin-bottom: 0;
}
::v-deep .details-dialog .c-dialog {
  position: relative;
  top: -98px;
}
</style>
