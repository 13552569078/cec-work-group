<template>
  <div class="lmits-area">
    <el-cascader
      ref="address"
      v-model="activeId"
      style="width: 100%"
      :show-all-levels="showAllLevels"
      :disabled="disabled"
      clearable
      :props="treeProps"
      @change="_handleChange"
    /></div>
  <!-- @change="_handleChange" -->
</template>
<script>
import { omit } from 'lodash'
import eventAnalysisApi from '@/api/eventAnalysis'

import { mapGetters } from 'vuex'
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
    },
    // 叶子节点是否禁用
    leafDisabled: {
      type: Boolean,
      default: false
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
      activeId: [],
      deptTree: [],
      treeProps: {
        lazy: true,
        value: 'id',
        label: 'name',
        checkStrictly: true,
        multiple: false,
        lazyLoad: async(node, resolve) => {
          console.log(node.root, 'root')
          if (node.root) {
            const { data } = await eventAnalysisApi.getGridById({ id: this.selectedOrgRole.org.gridId })
            resolve([omit(data, 'geom', 'geomCenter', 'sparseGeom')])
          } else {
            if (node.data.leaf) return resolve([])
            const { data } = await eventAnalysisApi.getChildGridList({ parentId: node.data.id })
            const data1 = data.map((item) => {
              return {
                ...item,
                leaf: item.level === '07'
              }
            })
            resolve(data1)
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters(['allGrids', 'selectedOrgRole'])
    // deptTree() {
    //   if (this.leafDisabled) {
    //     return setDisabledByLeaf(this.allGrids)
    //   }
    //   console.log(this.allGrids, 22)
    //   return this.allGrids
    // }
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
  async mounted() {
    // console.log(this.selectedOrgRole.org.gridId)
    // 回填查询的区域
    const { data } = await eventAnalysisApi.getGridById({ id: this.selectedOrgRole.org.gridId })
    this.$nextTick(() => {
      this.$emit('update:cityId', data.id)
      this.$emit('update:deptId', data.id)
      this.$emit('update:nodeNames', [data.name])
      this.$emit('update:levels', [data.level])
      this.activeId = [data.id]
      this.$emit('init')
    })
  },
  methods: {
    async  _handleChange(checked) {
      console.log('click', val)
      const val = checked.slice(-1)
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
        const nodes = this.$refs.address?.getCheckedNodes() || []
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
    }
  }
}
</script>
<style lang="scss" scoped>
.lmits-area{
    width: 100%;
    ::v-deep{
    .el-cascader-menu {
      padding-left: 10px !important;
    }
  }
}
</style>
