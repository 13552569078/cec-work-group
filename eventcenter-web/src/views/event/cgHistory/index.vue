<!--
 * @description 事件管理-城管查询
 * @date 2020-08-19
 * @author lism
-->
<template>
  <event-common-list
    :event-type="EVENT_TYPE_ENUM.cgHistory"
  >
    <template v-slot="{ row }">
      <span class="action-btn" @click="_showInfo(row)">查看</span>
    </template>
  </event-common-list>
</template>

<script>
import EventCommonList from '../components/EventCommonList'
import { EVENT_TYPE_ENUM } from '@/views/event/components/eventTypeEnum'
import { mapActions } from 'vuex'

export default {
  name: 'CgHistory',
  components: {
    EventCommonList
  },
  data() {
    return {
      EVENT_TYPE_ENUM
    }
  },
  created() {
    this.getEventTypesHistory({ 'code': 'DJSJ001' })
  },
  methods: {
    ...mapActions('dispatch', ['getEventTypesHistory']),
    // 查看详情
    _showInfo(row) {
      this.$router.push({
        path: '/event/cgHistory/info',
        query: {
          taskId: row.taskId,
          id: row.id,
          type: '城管历史事件查询',
          refresh: true
        }
      })
    }
  }
}
</script>
