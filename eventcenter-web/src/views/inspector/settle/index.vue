<!--
 * @description 我的督办
 * @date 2020-08-21
 * @author lism
-->
<template>
  <div class="inspector-settle">
    <!-- 引入通用的搜索面板 -->
    <inspector-common-list
      ref="eventCommon"
      :event-type="INSPECTOR_TYPE_ENUM.settle"
      action-width="210"
    >
      <template v-slot="{ row }">
        <!-- 具体流程操作在详情页面展示 -->
        <span class="action-group">
          <span
            :class="['action-btn']"
            @click="_handle_action(row)"
          >督办单详情</span>
          <span class="action-divider">|</span>
          <span class="action-btn" @click="viewEventDetail(row)">事件详情</span>
        </span>
      </template>
    </inspector-common-list>
    <inspector-dialog
      :visible.sync="dialogVisible"
      :editingdata="dialogData"
      :mode="dialogType"
      @cancle="dialogClose"
    />
  </div>
</template>

<script>
import InspectorCommonList from '../components/InspectorCommonList'
import { INSPECTOR_TYPE_ENUM } from '@/views/inspector/components/inspectorTypeEnum'
import inspectorDialog from '../components/inspectorDialog'
export default {
  name: 'InspectorSettle',
  components: {
    InspectorCommonList,
    inspectorDialog
  },
  data() {
    return {
      INSPECTOR_TYPE_ENUM,
      dialogVisible: false, // 弹窗开关
      dialogData: null, // 弹窗编辑或详情数据
      dialogType: 'add' // 弹窗类型
    }
  },
  methods: {
    // 自定义序号
    indexMethod(index) {
      return index + 1 > 9 ? index + 1 : `${index + 1}`
    },
    // 操作处理
    _handle_action(row) {
      this.dialogType = 'view'
      this.dialogData = row
      this.dialogVisible = true
    },
    viewEventDetail(row) {
      this.$router.push({
        path: '/inspector/list/info',
        query: {
          taskId: row.taskId,
          id: row.eventId,
          refresh: true
        }
      })
    },
    dialogClose() {
      this.dialogVisible = false
      this.dialogData = null
      try {
        this.$refs.eventCommon._search()
      } catch (error) {
        console.log('dialogClose==', error)
      }
    }
  }
}
</script>
