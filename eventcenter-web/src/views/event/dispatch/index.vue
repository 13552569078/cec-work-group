<!--
 * @description 事件管理-事件调度、事件处理、事件结案、事件审查列表页面信息差距不大，对其进行封装
 * @date 2020-08-19
 * @author lism
-->
<template>
  <event-common-list
    :event-type="EVENT_TYPE_ENUM.dispatch"
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
  name: 'Dispatch',
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
        path: '/event/dispatch/info',
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

