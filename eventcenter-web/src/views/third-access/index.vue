<template>
  <div class="page-container">
    <component :is="dyRoute" />
  </div>
</template>

<script>
import apiConfig from './api-config'
import config from './config'

export default {
  name: 'ThirdAccess',
  computed: {
    dyRoute() {
      const { name = 'apiConfig' } = this.$route
      const map = {
        apiConfig,
        config
      }
      return map[name]
    }
  }
}
</script>
