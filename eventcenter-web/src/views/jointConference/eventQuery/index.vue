<template>
  <div>
    <router-view v-if="$route.meta.menuType === 'details'" />
    <event-list
      :event-type="EVENT_TYPE_ENUM.filter"
    >
      <template v-slot="{ row }">
        <span class="action-btn" @click="_showInfo(row, 'view')">查看</span>
        <span :class="['action-btn', {'disable-btn': filterSendBtn(row)}]" @click="_showInfo(row, 'send')">发起会议</span>
      </template>
    </event-list>
  </div>
</template>

<script>
import eventList from './eventList'
import { EVENT_TYPE_ENUM } from '@/views/event/components/eventTypeEnum'

export default {
  name: 'FilterEvent',
  components: {
    eventList
  },
  data() {
    return {
      EVENT_TYPE_ENUM
    }
  },
  methods: {
    filterSendBtn(info) {
      // canCreateMeeting 1不置灰 2置灰canCreateMeeting 1不置灰 2置灰
      const { canCreateMeeting } = info
      if (canCreateMeeting === '2') {
        return true
      }
      return false
    },
    // 事件过滤详情
    _showInfo(row, type) {
      if (type === 'send' && this.filterSendBtn(row)) {
        return
      } else {
        this.$router.push({
          path: '/joint-conference/meeting-event/info',
          query: {
            id: row.id,
            type
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.disable-btn{
  color: #BDBDBD!important;
}
</style>
