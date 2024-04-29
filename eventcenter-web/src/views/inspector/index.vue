<!--
 * @description 督查督办模块
 * @date 2020-08-21
 * @author lism
-->
<template>
  <div class="inspector-container">
    <keepAlive>
      <component :is="dyRoute" v-if="$route.meta.keepAlive" />
    </keepAlive>
    <component :is="dyRoute" v-if="!$route.meta.keepAlive" />
  </div>
</template>

<script>
import list from './list'
import feedback from './feedback'
import inspectorSettle from './settle'
import report from './report'
import inspectorInfo from '@/components/EventInfo'
import feedbackInfo from '@/components/EventInfo'
import inspectorSettleInfo from '@/components/EventInfo'
import { mapActions } from 'vuex'
export default {
  name: 'Inspector',
  computed: {
    dyRoute() {
      const { name = 'accrualList' } = this.$route
      const map = {
        list,
        feedback,
        inspectorSettle,
        report,
        inspectorInfo,
        feedbackInfo,
        inspectorSettleInfo
      }
      return map[name] || list
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
.inspector {
  &-container {
    height: 100%;
    &>div {
      height: 100%;
    }
  }
}
</style>
