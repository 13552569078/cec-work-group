<template>
  <div class="workbench-container">
    <keepAlive>
      <component :is="dyRoute" v-if="$route.meta.keepAlive" />
    </keepAlive>
    <component :is="dyRoute" v-if="!$route.meta.keepAlive" />
  </div>
</template>

<script>
import workbenchHandle from './handle'
import workbenchTodo from './todo'
import workbenchAssist from './assist'
import workbenchNotify from './notify'
import workbenchWhistle from './whistle'
import EventInfo from '@/components/EventInfo'
import workbenchHome from './home'
import eventFocus from './focus'
import { mapActions } from 'vuex'

export default {
  name: 'Workbench',
  computed: {
    dyRoute() {
      const { name = 'workbenchHandle' } = this.$route
      const map = {
        workbenchHandle,
        workbenchTodo,
        workbenchAssist,
        workbenchNotify,
        WorkbenchEventInfo: EventInfo,
        WorkbenchTodoInfo: EventInfo,
        WorkbenchAssistInfo: EventInfo,
        WorkbenchNotifyInfo: EventInfo,
        workbenchWhistle,
        workbenchWhistleInfo: EventInfo,
        workbenchHome,
        eventFocus
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
.workbench {
  &-container {
    height: 100%;
  }
}
</style>
