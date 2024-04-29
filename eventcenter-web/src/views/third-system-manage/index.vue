<template>
  <div class="page-container">
    <component :is="dyRoute" />
  </div>
</template>

<script>
import BaseInfo from './base-info/index.vue'
import ElementTransition from './element-transition/index.vue'
import ThirdInterface from './third-interface/index.vue'
import ThirdType from './third-type/index.vue'
import RequestAuth from './request-auth/index.vue'
import EditInterface from './third-interface/interface/editInterface.vue'
import ViewInterface from './third-interface/interface/viewInterface.vue'

export default {
  name: 'ThirdSystemManage',
  computed: {
    dyRoute() {
      const { name = 'BaseInfo' } = this.$route
      const map = {
        BaseInfo,
        ElementTransition,
        ThirdInterface,
        ThirdType,
        RequestAuth,
        EditInterface,
        ViewInterface
      }
      return map[name]
    }
  }
}
</script>
