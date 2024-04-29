<template>
  <div class="bg-fff">
    <div
      v-if="search && !disabled"
      class="input-div"
    >
      <el-input
        v-model="filterText"
        :size="size"
        placeholder="输入关键字进行过滤"
        prefix-icon="c-icon-search"
        class="filter-input"
      />
    </div>
    <el-tree
      id="tree-option"
      ref="selectTree"
      class="cestcTreeSelect-tree"
      :show-checkbox="multiple"
      :accordion="accordion"
      :data="options"
      :props="treeProps"
      size="small"
      :node-key="props.value"
      :default-expanded-keys="defaultExpandedKey"
      :filter-node-method="filterNode"
      @node-click="handleNodeClick"
      @check-change="handleCheckChange"
    />
  </div>
</template>

<script>
export default {
  name: 'TreeSearch',
  props: {
    multiple: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    search: {
      type: Boolean,
      default: () => {
        return false
      }
    },
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
    disabled: {
      type: Boolean,
      default: false
    },
    /* 选项列表数据(树形结构的对象数组) */
    options: {
      type: Array,
      default: () => {
        return []
      }
    },
    /* 初始值 */
    value: {
      type: [Array, Number, String],
      default: () => {
        return []
      }
    },
    /* 自动收起 */
    accordion: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    rootinvalue: {
      type: Boolean,
      default: () => {
        return true
      }
    }
  },
  data() {
    return {
      valueId: this.value, // 初始值
      defaultExpandedKey: [],
      updateFlag: true, // 更新value的标志
      filterText: ''
    }
  },
  computed: {
    treeProps() {
      const getDisabled = (data) => {
        return !!data.id
      }
      let { disabled } = this.props
      disabled = this.disabled ? getDisabled : (!this.rootinvalue ? '' : disabled)
      return {
        ...this.props,
        disabled
      }
    }
  },
  watch: {
    value() {
      this.initValue()
    },
    filterText(val) {
      this.$refs.selectTree.filter(val)
    }
  },
  mounted() {
    this.initValue()
  },
  methods: {
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
        if (this.multiple) {
          this.$refs.selectTree.setCheckedKeys(this.valueId, false)
        } else {
          // 解决因更新延迟导致的结果异常
          setTimeout(() => {
            this.$refs.selectTree.setCurrentKey(this.valueId) // 设置默认选中
            this.defaultExpandedKey = [this.valueId] // 设置默认展开
          }, 100)
        }
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
    // 切换选项
    handleNodeClick(node) {
      if (!this.multiple && node[this.props.disabled] !== true) {
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
        this.$refs.selectDefault.blur()
      }
    },
    // 多选check变化
    handleCheckChange() {
      console.log('this.$refs', this.$refs)
      console.log('this.$refs.selectTree', this.$refs.selectTree)
      if (this.multiple) {
        this.valueId = this.$refs.selectTree.getCheckedKeys(false)
        // 获取选中的节点
        const data = this.$refs.selectTree.getCheckedNodes(false)
        console.log('data,,,,', data)
        // 获取所有选中和半选中的所有key
        const dataMore = this.$refs.selectTree.getCheckedKeys().concat(this.$refs.selectTree.getHalfCheckedKeys())
        if (!this.rootinvalue) {
          // 如果只需要展示叶子节点，需放开以下代码
          // data = data.filter(d => (!d[childrenKey] || (d[childrenKey] && !d[childrenKey].length)))
          this.valueId = data.map(d => d[this.props.value])
        }
        this.$emit('input', this.valueId)
        this.$emit('getValue', data)
        this.$emit('getMoreValue', dataMore)
        this.updateFlag = false
      }
    },
    clearNodes() {
      this.$emit('getValue', [])
      this.$emit('getMoreValue', [])
      this.$refs.selectTree.setCheckedKeys([])
    },
    cancelSingle(item) {
      this.$refs.selectTree.setChecked(item.deptUserId, false)
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@/styles/variables.scss';

.bg-fff{
  background: #fff;
  height: 250px;
  overflow: auto;
  .filter-input {
    ::v-deep .c-input__inner {
      border: 1px solid #E7E7E7;  // 覆盖表单验证时红色边框
    }
  }
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

::v-deep {
  .c-checkbox__input.is-disabled.is-checked .c-checkbox__inner::after {
    border-color: #000;
  }
}
</style>

<style lang="scss">
.c-tree-node__label {
  font-weight: normal;
  line-height: 20px;
}
.c-tree .is-current > .c-tree-node__content  > .c-tree-node__label {
  font-weight: 600;
}
.cestcTreeSelect-tree{

  margin-top: 10px;
  .c-tree-node__content{
    height: 30px;
  }
}
</style>
