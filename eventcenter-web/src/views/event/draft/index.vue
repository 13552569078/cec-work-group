<!--
 * @description 事件管理-事件草稿箱
 * @date 2020-09-08
 * @author lism
-->
<template>
  <div class="page-wrapper">
    <event-common-list
      ref="eventCommonListRef"
      :event-type="EVENT_TYPE_ENUM.draft"
      :hidden-search-list="hiddenSearchList"
      :hidden-columns-list="hiddenColumnsList"
    >
      <template v-slot="{ row }">
        <span
          :class="['action-btn', {'is-disabled' : row.eventState == '6'} ]"
          @click="_supplement(row)"
        >信息补充</span>
        <span
          :class="['action-btn', {'is-disabled' : row.eventState == '6'} ]"
          @click="_cancle(row)"
        >作废</span>
      </template>
    </event-common-list>
    <cancleDialog
      :visible.sync="cancleDialogVisible"
      :echo-data="echoData"
      @refresh="_search"
    />
    <supplementDialog
      :visible.sync="supplementDialogVisible"
      mode="edit"
      :echo-data="echoData"
      @refresh="_search"
    />

  </div>
</template>

<script>
import EventCommonList from '../components/EventCommonList'
import { EVENT_TYPE_ENUM } from '@/views/event/components/eventTypeEnum'
import cancleDialog from './cancle-dialog'
import supplementDialog from './supplement-dialog'

export default {
  name: 'Draft',
  components: {
    EventCommonList,
    cancleDialog,
    supplementDialog
  },
  data() {
    return {
      EVENT_TYPE_ENUM,
      cancleDialogVisible: false,
      supplementDialogVisible: false,
      echoData: null, // 表单回显
      hiddenSearchList: ['areaCascader', 'whistleNum', 'overtimeFlag', 'eventState'], // 隐藏的搜索条件
      hiddenColumnsList: ['eventCode', 'eventTypeText', 'urgentText', 'applyType', 'whistleLevel', 'limitTimeDesc', 'taskLeftTime', 'endTime'] // 隐藏的展示列
    }
  },
  methods: {
    async _search() {
      await this.$nextTick()
      this.$refs.eventCommonListRef?._search()
    },
    // 信息补录
    _supplement(row) {
      if (row.eventState === '6') return
      this.echoData = row
      this.supplementDialogVisible = true
    },
    // 作废
    _cancle(row) {
      if (row.eventState === '6') return
      this.echoData = row
      this.cancleDialogVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.page-wrapper {
  height: 100%;
  @include resultContent;
}
</style>
