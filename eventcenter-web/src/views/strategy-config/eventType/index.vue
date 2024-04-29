<template>
  <div class="inspector-list">
    <inspector-common-list
      ref="eventCommon"
      action-width="300"
    />
  </div>
</template>

<script>
import InspectorCommonList from './components/evenTypeList'

export default {
  name: 'EventType',
  components: {
    InspectorCommonList
  },
  data() {
    return {
      dialogVisible: false, // 弹窗开关
      dialogData: null, // 弹窗编辑或详情数据
      dialogType: 'add' // 弹窗类型
    }
  },
  methods: {
    // 操作处理
    _handle_action(action, row) {
      if (action === 'detail') {
        if (!row.superviseCode) {
          return
        }
        this.dialogType = 'view'
        this.dialogData = row
        this.dialogVisible = true
      } else {
        if (row.superviseCode) {
          return
        }
        this.dialogType = 'add'
        this.dialogData = row
        this.dialogVisible = true
      }
    },
    viewEventDetail(row) {
      this.$router.push({
        path: '/inspector/list/info',
        query: {
          taskId: row.taskId,
          id: row.id,
          refresh: true
        }
      })
    },
    // 关闭弹窗
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
