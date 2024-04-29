<template>
  <div class="event-analysis-container">
    <component :is="dyRoute" />
  </div>
</template>

<script>

import { mapActions } from 'vuex'
// import eventQuantityAnalysis from './eventQuantityAnalysis'
// import eventAppraiseAnalysis from './eventAppraiseAnalysis'
// import eventTypeAnalysisNew from './eventType/index.vue'
import deptAnalysis from './deptAnalysis/index.vue'
import areaAnalysis from './areaAnalysis/index.vue'
import eventTypeAnalysis from './eventType/index.vue'

export default {
  name: 'EventAnalysis',
  components: {
    eventTypeAnalysis,
    deptAnalysis,
    areaAnalysis
  },
  computed: {
    dyRoute() {
      const { name = 'eventTypeAnalysis' } = this.$route
      const map = {
        eventTypeAnalysis,
        deptAnalysis,
        areaAnalysis
      }
      return map[name]
    }
  },
  async created() {
    await this.getEventType()
  },
  methods: {
    ...mapActions('dispatch', ['getEventType'])
  }
}
</script>

<style lang="scss" scoped>
.event-analysis {
  &-container {
    height: 100%;
  }
}
</style>
