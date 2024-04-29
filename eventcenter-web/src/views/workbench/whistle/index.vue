<!--
 * @description 工作台-吹哨事件查询
 * @date 2022-06-28
 * @author lism
-->
<template>
  <event-common-list
    :event-type="EVENT_TYPE_ENUM.workWhistle"
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
  name: 'WorkWhistle',
  components: {
    EventCommonList
  },
  data() {
    return {
      EVENT_TYPE_ENUM,
      hiddenSearchList: ['areaCascader', 'overtimeFlag', 'eventState', 'eventDesc'], // 隐藏的搜索条件
      hiddenColumnsList: ['applyType', 'endTime', 'eventDesc'] // 隐藏的展示列
    }
  },
  methods: {
    // 查看详情
    _showInfo(row) {
      // 跳转详情页面, 详情页面，请求操作按钮的时候需要用到 taskId
      this.$router.push({
        path: '/workbench/whistle/info',
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
