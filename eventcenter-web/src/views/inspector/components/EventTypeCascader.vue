<template>
  <cestc-cascader
    ref="cascader"
    v-model="eventType"
    :options="eventTypeToTree"
    :show-all-levels="showAllLevels"
    :disabled="disabled"
    clearable
    :props="{
      value: 'id',
      label: 'eventTypeName',
      checkStrictly,
      multiple,
    }"
    @change="_handleChange"
  />
</template>
<script>
import { getTreeParent } from '@/utils/index'
export default {
  name: 'EventTypeCascader',
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
      eventType: '',
      eventTypeToTree: []
    }
  },
  computed: {},
  watch: {
    parentType(val, old) {
      // 监听清空清空
      if (!val) {
        // this.eventType = [];
      }
    },
    childType(val, old) {
      this.updateEcho()
    },
    eventTypeToTree(val, old) {
      // 如果有数据的时候，也需要重新进行回填，修复了已经有回填数据，但是整体数据后续再获取的场景
      this.updateEcho() // 更新回显
    }
  },
  async created() {
    // TODO 有 bug , 如果数据获取较慢，则无法正常回显，可再次打开
    this.eventTypeToTree = this.$store.getters.getEventTypeByFlag({
      hasHidden: this.showHidden
    })
  },
  methods: {
    async updateEcho() {
      await this.$nextTick()
      // 清空所选项，源码有 bug, 方法不能直接用
      const _el = this.$refs.cascader?.$refs.cascaderRef
      _el.$refs.panel.clearCheckedNodes()
      // 设置为空可以让节点不高亮显示
      _el.$refs.panel.activePath = []
      let arr = []
      if (!this.checkStrictly) {
        // 到最后一级
        arr = getTreeParent(this.eventTypeToTree, this.childType)
      } else {
        // TODO
      }
      this.eventType = arr.map((item) => item.id)
    },

    _handleChange(val, node) {
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
      } else {
        this.$emit('update:parentType', '')
        this.$emit('update:middleType', '')
        this.$emit('update:childType', '')
      }
    }
  }
}
</script>

