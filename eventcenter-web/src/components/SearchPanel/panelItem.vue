<!--
 * @description 通用页面搜索区域
 * @date 2021-08-13
 * @author lism
 -->
<template>
  <el-form-item
    v-show="visible"
    class="cestc-search-item"
    :label="label"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
  </el-form-item>
</template>

<script>
export default {
  name: 'PanelItem',
  componentName: 'PanelItem',
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    label: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
</style>
