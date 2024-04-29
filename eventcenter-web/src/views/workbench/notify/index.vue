<!--
 * @description 工作台-知会事件
 * @date 2020-11-17
 * @author lism
-->
<template>
  <event-common-list
    :event-type="EVENT_TYPE_ENUM.workNotify"
    :hidden-search-list="hiddenSearchList"
    :hidden-columns-list="hiddenColumnsList"
  >
    <template v-slot="{ row }">
      <span class="action-btn" @click="_showInfo(row)">查看</span>
    </template>
  </event-common-list>
</template>

<script>
import EventCommonList from '@/views/event/components/EventCommonList'
import { EVENT_TYPE_ENUM } from '@/views/event/components/eventTypeEnum'

export default {
  name: 'WorkNotify',
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
    // 查看详情
    _showInfo(row) {
      // 跳转详情页面, 详情页面，请求操作按钮的时候需要用到 taskId
      this.$router.push({
        path: '/workbench/notify/info',
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
