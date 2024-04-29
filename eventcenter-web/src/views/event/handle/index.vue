<!--
 * @description 事件管理-事件处理
 * @date 2020-08-19
 * @author lism
-->
<template>
  <event-common-list
    :event-type="EVENT_TYPE_ENUM.handle"
    :hidden-search-list="hiddenSearchList"
    :hidden-columns-list="hiddenColumnsList"
  >
    <template v-slot="{ row }">
      <span class="action-btn" @click="_showInfo(row)">查看</span>
    </template>
  </event-common-list>
</template>

<script>
import EventCommonList from '../components/EventCommonList'
import { EVENT_TYPE_ENUM } from '@/views/event/components/eventTypeEnum'

export default {
  name: 'Handle',
  components: {
    EventCommonList
  },
  data() {
    return {
      EVENT_TYPE_ENUM,
      hiddenSearchList: ['areaCascader', 'whistleNum', 'overtimeFlag', 'eventState', 'eventDesc'], // 隐藏的搜索条件
      hiddenColumnsList: ['applyType', 'whistleLevel', 'endTime', 'eventDesc'] // 隐藏的展示列
    }
  },
  methods: {
    // 调度详情
    _showInfo(row) {
      this.$router.push({
        path: '/event/handle/info',
        query: {
          taskId: row.taskId,
          id: row.id,
          refresh: true
        }
      })
    }
  }
}
</script>
