<!--
 * @description 任务中心
 * @date 2020-11-17
 * @author lism
-->
<template>
  <div class="task-container">
    <component :is="dyRoute" />
  </div>
</template>

<script>
import taskList from './todo'
import taskConfig from './config'
import manage from './manage'
import log from './config/log'
export default {
  name: 'Task',
  computed: {
    dyRoute() {
      const { name = 'taskList' } = this.$route
      const map = {
        taskList,
        taskConfig,
        manage,
        log
      }
      return map[name]
    }
  }
}
</script>

<style lang="scss" scoped>
.task {
  &-container {
    flex: 1; // 如果需要兼容，则需要使用 calc 动态的计算高度
    > div {
      @extend %event_content_flex;
    }
  }
}
</style>
