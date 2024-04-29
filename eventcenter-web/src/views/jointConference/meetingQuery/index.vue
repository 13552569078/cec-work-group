<template>
  <div>
    <router-view v-if="$route.meta.menuType === 'details'" />
    <meeting-common-list
      v-else
      event-type="meeting"
    >
      <template v-slot="{ row }">
        <span class="action-btn" @click="_showInfo(row)">查看</span>
      </template>
    </meeting-common-list>

  </div>
</template>

<script>
import meetingCommonList from '../components/meetingCommonList.vue'
// import { EVENT_TYPE_ENUM } from '@/views/event/components/eventTypeEnum'

export default {
  name: 'FilterEvent',
  components: {
    meetingCommonList
  },
  data() {
    return {
      // EVENT_TYPE_ENUM
    }
  },
  created() {
    console.log('this.$route', this.$route)
  },
  methods: {
    // 事件过滤详情
    _showInfo(row) {
      this.$router.push({
        path: '/joint-conference/meeting-query/info',
        query: {
          id: row.eventId
        }
      })
    }
  }
}
</script>
