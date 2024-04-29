<template>
  <cestc-cascader
    ref="cascader"
    v-model="eventType"
    :options="getAllEventTypes"
    :show-all-levels="showAllLevels"
    :disabled="disabled"
    clearable
    :props="{
      value: 'id',
      label: 'name',
      children: 'childList',
      checkStrictly: currentCheckStrictly,
      multiple,
    }"
    @change="_handleChange"
    @expand-change="_expand"
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
    eventTypeIdFour: {
      type: [Number, String],
      default: undefined
    },
    eventTypeIdFive: {
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
    },
    // 是否disable禁用
    disableForbidden: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      eventType: '',
      expandLastNode: {} // 展开的最新一级节点
    }
  },
  computed: {
    // 根据路由的专项类型参数去筛选
    getAllEventTypes() {
      if ((this.$route.query.speType && this.$route.query.speType !== 'all')) {
        return this.$store.getters.getAllEventTypesBySpe(this.$route.query.speType === 'all' ? '' : this.$route.query.speType)
      }
      return this.$store.getters.getAllEventTypes
    },
    currentCheckStrictly() { // 如果是联动指挥dispatchDeal=1，表示哪一个级别都可以选
      return this.checkStrictly
    }
  },
  watch: {
    nodeName(val, old) {
      // 如果事件类型清空的时候，nodeName 为空
      if (!val) {
        // 清空
        this.eventType = []
      }
    },
    // 小类发生变化
    childType(val) {
      if (val) {
        this.updateEcho()
      }
    },
    eventTypeIdFour(val) {
      if (val) {
        this.updateEcho()
      }
    },
    eventTypeIdFive(val) {
      if (val) {
        this.updateEcho()
      }
    }
  },
  created() {
    this.updateEcho()
  },
  methods: {
    async resetCascaderRef() {
      await this.$nextTick()
      // 清空所选项，源码有 bug, 方法不能直接用
      try {
        const cascaderRef = this.$refs.cascader.$refs.cascaderRef
        cascaderRef.$refs.panel.clearCheckedNodes()
        // 设置为空可以让节点不高亮显示
        cascaderRef.$refs.panel.activePath = []
        this.eventType = []
      } catch (error) {
        console.log('reset error', error)
      }
    },
    async updateEcho() {
      await this.$nextTick()
      await this.resetCascaderRef()

      let arr = []
      // 任选一级
      const temp = this.eventTypeIdFive || this.eventTypeIdFour || this.childType || this.middleType || this.parentType
      arr = getTreeParent(this.getAllEventTypes, temp, 'parentId', 'childList')
      this.expandLastNode = arr[arr.length - 1]
      // 延迟赋值，用来回显
      setTimeout(() => {
        this.eventType = arr.map((item) => item.id)
      }, 10)
    },
    async getNode() {
      await this.$nextTick()
      const cascaderRef = this.$refs.cascader.$refs.cascaderRef
      const nodes = cascaderRef.getCheckedNodes()
      return nodes
    },
    // 当展开节点发生变化时触发
    async _expand(val) {
      await this.$nextTick()
      if (val?.length) {
        const node = getTreeParent(this.getAllEventTypes, val[val.length - 1], 'parentId', 'childList')
        try {
          this.expandLastNode = node[node.length - 1]
        } catch (error) {
          console.log('_expand error', error)
        }
      }
    },
    async _handleChange(val) {
      const node = await this.getNode()
      // console.log('node===', node)
      if (val?.length > 0) {
        if (val.length === 1) {
          this.$emit('update:parentType', val[0])
          this.$emit('update:middleType', '')
          this.$emit('update:childType', '')
          this.$emit('update:eventTypeIdFour', '')
          this.$emit('update:eventTypeIdFive', '')
        } else if (val.length === 2) {
          this.$emit('update:parentType', val[0])
          this.$emit('update:middleType', val[1])
          this.$emit('update:childType', '')
          this.$emit('update:eventTypeIdFour', '')
          this.$emit('update:eventTypeIdFive', '')
        } else if (val.length === 3) {
          this.$emit('update:parentType', val[0])
          this.$emit('update:middleType', val[1])
          this.$emit('update:childType', val[2])
          this.$emit('update:eventTypeIdFour', '')
          this.$emit('update:eventTypeIdFive', '')
        } else if (val.length === 4) {
          this.$emit('update:parentType', val[0])
          this.$emit('update:middleType', val[1])
          this.$emit('update:childType', val[2])
          this.$emit('update:eventTypeIdFour', val[3])
          this.$emit('update:eventTypeIdFive', '')
        } else if (val.length === 5) {
          this.$emit('update:parentType', val[0])
          this.$emit('update:middleType', val[1])
          this.$emit('update:childType', val[2])
          this.$emit('update:eventTypeIdFour', val[3])
          this.$emit('update:eventTypeIdFive', val[4])
        }
        this.$emit('update:nodeName', node[0].label)
      } else {
        this.$emit('update:parentType', '')
        this.$emit('update:middleType', '')
        this.$emit('update:childType', '')
        this.$emit('update:eventTypeIdFour', '')
        this.$emit('update:eventTypeIdFive', '')
      }
    }
  }
}
</script>
