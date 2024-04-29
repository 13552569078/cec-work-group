<template>
  <cestc-cascader
    ref="cascader"
    v-model="eventType"
    :options="getAllEventTypesHistory"
    :show-all-levels="showAllLevels"
    :disabled="disabled"
    clearable
    :props="{
      value: 'id',
      label: 'name',
      children: 'childList',
      checkStrictly,
      multiple,
    }"
    @change="_handleChange"
  />
</template>
<script>
import { getTreeParent } from '@/utils/index'
import { mapGetters } from 'vuex'
export default {
  name: 'EventTypeCascaderHistory',
  props: {
    parentType: {
      type: [Number, String],
      default: undefined
    },
    middleType: {
      type: [Number, String],
      default: undefined
    },
    childType: {
      type: [Number, String],
      default: undefined
    },
    nodeName: {
      type: String,
      default: ''
    },
    // 是否取消级联
    checkStrictly: {
      type: Boolean,
      default: false
    },
    // 是否显示全路径
    showAllLevels: {
      type: Boolean,
      default: false
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 事件类型中是否包含隐藏项目
    showHidden: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      eventType: ''
    }
  },
  computed: {
    ...mapGetters(['getAllEventTypesHistory'])
  },
  watch: {
    nodeName(val, old) {
      // 如果事件类型清空的时候，nodeName 为空
      if (!val) {
        // 清空
        this.eventType = []
      }
    },
    eventTypeToTree(val, old) {
      // 如果有数据的时候，也需要重新进行回填，修复了已经有回填数据，但是整体数据后续再获取的场景
      this.updateEcho() // 更新回显
    },
    // 小类发生变化
    childType(val) {
      if (val) {
        this.updateEcho()
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.updateEcho()
    })
  },
  methods: {
    async updateEcho() {
      await this.$nextTick()
      try {
        const _el = this.$refs.cascader?.$refs.cascaderRef
        // 清空所选项，源码有 bug, 方法不能直接用
        _el.$refs.panel.clearCheckedNodes()
        // 设置为空可以让节点不高亮显示
        _el.$refs.panel.activePath = []
        this.eventType = ''
      } catch (error) {
        console.log('updateEcho--error', error)
      }
      let arr = []
      if (!this.checkStrictly) {
        // 到最后一级
        arr = getTreeParent(this.getAllEventTypesHistory, this.childType, 'parentId', 'childList')
      } else {
        // 任选一级
        const temp = this.childType || this.middleType || this.parentType
        arr = getTreeParent(this.getAllEventTypesHistory, temp, 'parentId', 'childList')
      }
      this.eventType = arr.map((item) => item.id)
    },

    async _handleChange(val) {
      await this.$nextTick()
      const _el = this.$refs.cascader?.$refs.cascaderRef
      const node = _el.getCheckedNodes()
      console.log('node===', node)
      if (val && val.length) {
        if (val.length === 1) {
          this.$emit('update:parentType', val[0])
          this.$emit('update:middleType', '')
          this.$emit('update:childType', '')
        } else if (val.length === 2) {
          this.$emit('update:parentType', val[0])
          this.$emit('update:middleType', val[1])
          this.$emit('update:childType', '')
        } else if (val.length === 3) {
          this.$emit('update:parentType', val[0])
          this.$emit('update:middleType', val[1])
          this.$emit('update:childType', val[2])
        }
        this.$emit('update:nodeName', node[0].label)
      } else {
        this.$emit('update:parentType', '')
        this.$emit('update:middleType', '')
        this.$emit('update:childType', '')
      }
    }
  }
}
</script>
