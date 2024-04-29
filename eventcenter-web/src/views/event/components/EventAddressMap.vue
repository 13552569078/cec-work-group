<template>
  <cestc-cascader
    ref="address"
    v-model="activeId"
    :options="deptTree"
    :show-all-levels="showAllLevels"
    :disabled="disabled"
    :clearable="clearable"
    :props="{
      value: 'id',
      label: 'name',
      checkStrictly,
      multiple,
      expandTrigger
    }"
    @change="_handleChange"
  />
</template>
<script>
import { setDisabledByLeaf, getTreeParent } from '@/utils'
import { mapGetters } from 'vuex'
export default {
  name: 'EventAddressMap',
  props: {
    cityId: {
      type: [Number, String],
      default: undefined
    },
    areaId: {
      type: [Number, String],
      default: undefined
    },
    streetId: {
      type: [Number, String],
      default: undefined
    },
    communityId: {
      type: [Number, String],
      default: undefined
    },
    deptId: {
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
    clearable: {
      type: Boolean,
      default: false
    },
    // 叶子节点是否禁用
    leafDisabled: {
      type: Boolean,
      default: false
    },
    expandTrigger: {
      type: String,
      default: 'click'
    },
    nodeNames: {
      type: Array,
      default: () => []
    },
    levels: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      activeId: []
    }
  },
  computed: {
    ...mapGetters(['allGrids']),
    deptTree() {
      if (this.leafDisabled) {
        return setDisabledByLeaf(this.allGrids)
      }
      return this.allGrids
    }
  },
  watch: {
    nodeNames(val, _old) {
      // 如果事件区域清空的时候，nodeName 为空
      if (!val || val.length === 0) {
        // 清空
        this.activeId = []
      }
    }
  },
  created() {
    if (!this.allGrids.length) {
      this.$store.dispatch('dispatch/getAllGrids')
    }
  },
  mounted() {
    // 回填查询的区域
    this.$bus.$on('setDefautRoot', (val) => {
      if (this.checkStrictly) {
        // 现在区域有个组的概念，parentId 跟父亲组件的 id 不一样导致无法正确回显
        const nodes = getTreeParent(this.deptTree, val)
        this.activeId = nodes.map(item => item.id)
      }
    })
  },
  methods: {
    getCheckedNodes() {
      const nodes = this.$refs.address?.$refs?.cascaderRef?.getCheckedNodes() || []
      return nodes
    },
    async  _handleChange(val) {
      await this.$nextTick()
      if (val?.length) {
        if (val.length === 1) {
          this.$emit('update:cityId', val[0])
          this.$emit('update:deptId', val[0])
          this.$emit('update:areaId', '')
          this.$emit('update:streetId', '')
          this.$emit('update:communityId', '')
        } else if (val.length === 2) {
          this.$emit('update:cityId', val[0])
          this.$emit('update:areaId', val[1])
          this.$emit('update:deptId', val[1])
          this.$emit('update:streetId', '')
          this.$emit('update:communityId', '')
        } else if (val.length === 3) {
          this.$emit('update:cityId', val[0])
          this.$emit('update:areaId', val[1])
          this.$emit('update:streetId', val[2])
          this.$emit('update:deptId', val[2])
          this.$emit('update:communityId', '')
        } else if (val.length === 4) {
          this.$emit('update:cityId', val[0])
          this.$emit('update:areaId', val[1])
          this.$emit('update:streetId', val[2])
          this.$emit('update:communityId', val[3])
          this.$emit('update:deptId', val[3])
        } else if (val.length === 5) {
          this.$emit('update:cityId', val[0])
          this.$emit('update:areaId', val[1])
          this.$emit('update:streetId', val[2])
          this.$emit('update:communityId', val[3])
          this.$emit('update:deptId', val[4])
        } else {
          this.$emit('update:deptId', val[val.length - 1])
        }
        const nodes = this.$refs.address?.$refs?.cascaderRef?.getCheckedNodes() || []
        this.$emit('update:nodeNames', nodes.map(v => v.label))
        this.$emit('update:levels', nodes.map(v => v.data.level))
      } else {
        this.$emit('update:cityId', '')
        this.$emit('update:deptId', '')
        this.$emit('update:areaId', '')
        this.$emit('update:streetId', '')
        this.$emit('update:communityId', '')
        this.$emit('update:levels', [])
      }
      this.$emit('changeActiveId', this.activeId)
      this.$refs.address.$refs.cascaderRef.dropDownVisible = false
    }
  }
}
</script>
