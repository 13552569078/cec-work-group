<!--
 * @description 事件录入-发生地址专用--只有 deptId
 * @date 2022-03-02
 * @author lism
-->
<template>
  <cestc-cascader
    ref="address"
    v-model="activeId"
    :options="deptTree"
    :show-all-levels="showAllLevels"
    :disabled="disabled"
    clearable
    :props="{
      value: 'id',
      label: 'name',
      checkStrictly,
      multiple,
    }"
    @change="_handleChange"
  />
</template>
<script>
import { setDisabledByLeaf } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  name: 'EventAddress',
  props: {
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
    // 叶子节点是否禁用
    leafDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeId: ''
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
    deptId: {
      immediate: true,
      deep: true,
      handler(val) {
        this.echoChild(val)
      }
    },
    activeId: {
      deep: true,
      async handler(val) {
        await this.$nextTick()
        if (val.length) {
          this.$emit('update:deptId', val[val.length - 1])
        }
        const _el = this.$refs.address?.$refs?.cascaderRef
        // 匹配到该节点，找到对应的 wkt 数据
        const node = _el.getCheckedNodes()
        console.log('node==', node)
        if (node && node.length) {
          this.$emit('updateWkt', node[0]?.data?.geom)
        } else {
          this.$emit('updateWkt', '')
        }
      }
    }
  },
  created() {
    if (!this.allGrids.length) {
      this.$store.dispatch('dispatch/getAllGrids')
    }
  },
  methods: {
    _handleChange(val) {
      if (!val.length) {
        this.$emit('update:deptId', '')
      }
    },
    echoChild(val) {
      this.$nextTick(() => {
        // 清空所选项，源码有 bug, 方法不能直接用
        const _el = this.$refs.address?.$refs?.cascaderRef
        _el.$refs.panel.clearCheckedNodes()
        // 设置为空可以让节点不高亮显示
        _el.$refs.panel.activePath = []
        if (val) {
          this.activeId = val
        }
      })
    }
  }
}
</script>
