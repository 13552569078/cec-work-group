<!--
 * @description 事件管理-重复事件过滤
 * @date 2022-01-05
 * @author zhangchi
-->
<template>
  <event-common-list
    :event-type="EVENT_TYPE_ENUM.filter"
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
  name: 'FilterEvent',
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
    // 事件过滤详情
    _showInfo(row) {
      this.$router.push({
        path: '/event/filter/filterInfo',
        query: {
          id: row.id
        }
      })
    }
  }
}
</script>
