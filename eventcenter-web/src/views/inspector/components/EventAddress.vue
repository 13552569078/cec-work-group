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
import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'
export default {
  name: 'EventAddress',
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
    }
  },
  data() {
    return {
      deptTree: [],
      activeId: []
    }
  },
  watch: {
    cityId(val, old) {
      // 如果父节点为空，则一定是空的
      if (!val) {
        this.activeId = ''
      }
    },
    deptId(val, old) {
      if (val && !old) {
        this.echoChild(val)
      }
    }
  },
  async created() {
    await this.getDeptTree()
  },
  methods: {
    async echoChild(val) {
      await this.$nextTick()
      const _el = this.$refs.address?.$refs.cascaderRef
      // 清空所选项，源码有 bug, 方法不能直接用
      _el.$refs.panel.clearCheckedNodes()
      // 设置为空可以让节点不高亮显示
      _el.$refs.panel.activePath = []
      const arr = [
        this.cityId,
        this.areaId,
        this.streetId,
        this.communityId,
        this.deptId
      ].filter((item) => !!item)
      // 做去重处理
      this.activeId = [...new Set(arr)]
    },
    // 获取发生地址
    getDeptTree() {
      moduleSrv.getParentDepts().then((res) => {
        if (res.code === SUCCESS_CODE) {
          this.deptTree = res.data
        } else {
          console.warn('getDeptTree 接口报错')
        }
      })
    },
    _handleChange(val, node) {
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
        }
      }
    }
  }
}
</script>
