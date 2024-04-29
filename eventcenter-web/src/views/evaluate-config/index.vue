<template>
  <div class="page-container">
    <component :is="dyRoute" />
  </div>
</template>

<script>
import Target from './target/index.vue'
import Model from './model/index.vue'
import EditModel from './model/editModel.vue'

export default {
  name: 'EvaluateConfig',
  computed: {
    dyRoute() {
      const { name = 'Target' } = this.$route
      const map = {
        Target,
        Model,
        EditModel
      }
      return map[name]
    }
  }
}
</script>
