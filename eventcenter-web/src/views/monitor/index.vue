<!--
 * @description 事件监控
 * @date 2023-11-06
 * @author lism
-->
<template>
  <div class="container-wrapper">
    <!-- keep-alive 只对动态组件起效果 -->
    <keepAlive>
      <component :is="dyRoute" v-if="$route.meta.keepAlive" />
    </keepAlive>
    <component :is="dyRoute" v-if="!$route.meta.keepAlive" />
  </div>
</template>

<script>
import monitorInflow from './inflow'
import monitorEventAccess from './event-access'
import monitorInflowView from './inflow-view'
import monitorOutView from './out-view'
import monitorOutflow from './outflow'
import thirdInflow from './third-inflow.vue'
import monitorEventStatus from './event-status'
import monitorEventAccessDetail from './event-access/viewThirdSystemInterface.vue'

export default {
  name: 'EventWrapper',
  computed: {
    dyRoute() {
      const { name = 'monitorInflow' } = this.$route
      const map = {
        monitorInflow,
        monitorEventAccess,
        monitorInflowView,
        monitorOutView,
        monitorOutflow,
        monitorEventStatus,
        thirdInflow,
        monitorEventAccessDetail
      }
      return map[name]
    }
  }

}
</script>

<style lang="scss" scoped>
  .container-wrapper {
    height: 100%;
  }
</style>
