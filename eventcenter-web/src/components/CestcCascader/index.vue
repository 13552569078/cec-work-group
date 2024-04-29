<!--
 * @description 全局统一级联组件
 * @date 2023-07-06
 * @author lism
 * 节点点击，则进行raido 点击
-->
<template>
  <el-cascader
    ref="cascaderRef"
    v-bind="$attrs"
    :popper-class="checkStrictly ? 'cascader-hidden-radio' : popperClass ? popperClass : ''"
    v-on="$listeners"
    @visible-change="visibleChange"
    @expand-change="elCascaderOnlick"
  />
</template>

<script>
import cascaderFixMixin from '@/mixin/cascaderFix.mixin'

export default {
  mixins: [cascaderFixMixin],
  computed: {
    // 是否单选模式
    checkStrictly() {
      return this.$attrs?.props?.checkStrictly
    },
    popperClass() {
      return this.$attrs?.props?.popperClass
    }
  },
  methods: {
    computePresentText() {
      // alert(1)
      this.$refs.cascaderRef.computePresentText()
    }
  }
}
</script>

<style lang="scss" >
.cascader-hidden-radio {

    .el-cascader-node {
        .el-radio {
          &:not(.is-disabled) {
            display: none;
          }
          // 禁用后面的 label 也禁用
          &.is-disabled + .el-cascader-node__label {
            color: $disabled;
            cursor: not-allowed;
          }
        }
    }
}
</style>
