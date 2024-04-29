<!--
 * @description 值班管理layout
 * @date 2020-08-19
 * @author lism
-->
<template>
  <div class="work-manage-container-wrapper">
    <component :is="dyRoute" />
  </div>
</template>

<script>
import arrange from './arrange'
import workList from './workList'

export default {
  name: 'EventWrapper',
  computed: {
    dyRoute() {
      const { name = 'dispatch' } = this.$route
      const map = {
        arrange,
        workList
      }
      return map[name]
    }
  }
}
</script>

<style lang="scss" scoped>
.work-manage {
  &-container-wrapper {
    height: calc(100% - 16px);
    padding: 10px 10px 0 10px;
    flex: 1; // 如果需要兼容，则需要使用 calc 动态的计算高度
    > div {
      @extend %event_content_flex;
    }
  }
}
</style>
