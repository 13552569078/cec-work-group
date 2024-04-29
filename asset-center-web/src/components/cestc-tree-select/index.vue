<!--
 * @Description: 下拉树选择
 * @Author: liu lianpeng
 * @Date: 2021-05-07
-->
<!--
 * @Description: 基于elementui的树形下拉控件
 * @Author: shijianzhong
 * @Date: 2020-03-20
 -->
<template>
  <c-select ref="selectDefault"
            :specific-suffix="true"
            :value="valueTitle"
            :clearable="clearable"
            :disabled="disabled"
            :size="size"
            :multiple="multiple"
            :placeholder="placeholder"
            collapse-tags
            class="cestcTreeSelect"
            popper-class="cestcTreeSelect-popper"
            @change="selectChange"
            @clear="clearHandle"
  >
    <c-option
      value=""
    >
      <div class="bg-fff">

        <div
          v-if="search"
          class="input-div"
          @click.stop="''"
        >
          <c-input
            v-model="filterText"
            :size="size"
            placeholder="输入关键字进行过滤"
          />
        </div>

        <c-tree
          id="tree-option"
          ref="selectTree"
          class="cestcTreeSelect-tree"
          :show-checkbox="multiple"
          :disabled="disabled"
          :accordion="accordion"
          :data="options"
          :props="props"
          size="small"
          :node-key="props.value"
          :default-expanded-keys="defaultExpandedKey"
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
          @check-change="handleCheckChange"
        />
      </div>
    </c-option>
    <c-option
      v-for="item in selectedList"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    ></c-option>

  </c-select>
</template>

<script>
export default {
  name: 'CTreeSelect',
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
    /* 初始值 */
    value: {
      type: [Array, Number, String],
      default: () => {
        return []
      }
    },
    /* 可清空选项 */
    clearable: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    // 是否只获取选中的叶子节点
    getLeafOnly: {
      type: Boolean,
      default: () => {
        return false
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
        return '请选择通知人员'
      }
    }
  },
  data() {
    return {
      selectedList: [],
      valueId: this.value, // 初始值
      valueTitle: null,
      defaultExpandedKey: [],
      updateFlag: true, // 更新value的标志
      filterText: ''
    }
  },
  watch: {
    value() {
      this.initValue()
    },
    filterText(val) {
      console.log(this.$refs.selectTree)
      this.$refs.selectTree.filter(val)
    }
  },
  mounted() {
    this.initValue()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      console.log(data[this.props.label], 'data')
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
    selectChange(item) {
      this.valueTitle = item
      // this.selectedList = this.selectedList.filter(_item => item.indexOf(_item) !== -1)
      this.$refs.selectTree.setCheckedKeys(item, false)
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
      console.log(arr, 'arr')
      const tempArr = []
      if (Array.isArray(arr)) {
        arr.forEach(item => {
          if (Array.isArray(item)) {
            tempArr.push(this.getSelectedTitle(item))
          } else {
            const temp = this.$refs.selectTree.getNode(item)
            if (temp) {
              tempArr.push({ value: item, label: temp.data[this.props.label] })
            }
          }
        })
      }
      this.selectedList = tempArr
      return tempArr.map(item => item.value)
    },
    // 切换选项
    handleNodeClick(node) {
      if (!this.multiple && node.disabled !== true) {
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
        this.$refs.selectDefault.blur()
      }
    },
    // 多选check变化
    handleCheckChange(data, checked, indeterminate) {
      if (this.multiple) {
        this.valueId = this.$refs.selectTree.getCheckedKeys(this.getLeafOnly)
        // this.valueId.map(x => {
        //   if (typeof x === 'number') {
        //     return x
        //   } else {
        //     // console.log(x)
        //     // const ary = x.split('-')
        //     // if (ary.length === 3) {
        //     //   if (ary[2] === 'user') {
        //     //     return ary[1]
        //     //   }
        //     // } else {
        //     return x
        //     // }
        //   }
        // })
        this.valueTitle = this.getSelectedTitle(this.valueId)
        this.$emit('input', this.valueId)
        this.$emit('getValue', this.$refs.selectTree.getCheckedNodes(false))
        this.updateFlag = false
      }
    },
    // 清除选中
    clearHandle() {
      this.valueTitle = null
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

.bg-fff{
  background: #fff;
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
  color: #666360;
  font-weight: normal;
}

.input-div {
  padding: 0 10px;
}
</style>

<style lang="scss">
@import '@/styles/variables.scss';
.cestcTreeSelect-popper{
  .c-select-item__checkbox{
    display: none;
  }
  .c-select-dropdown__item{
    display: none;
  }
  .c-select-dropdown__item:first-child{
    display: list-item;
  }
}
.c-tree-node__label {
  font-weight: normal;
  line-height: 20px;
}
.c-tree .is-current > .c-tree-node__content  > .c-tree-node__label {
  color: $primaryColor;
  font-weight: 700;
}
.cestcTreeSelect-tree{

  margin-top: 10px;
  .c-tree-node__content{
    height: 30px;
    &:hover{
      background-color: $hoverColor;
    }
  }
}
</style>

