<!--
 * @description 工作台-待处理事件
 * @date 2020-09-08
 * @author lism
-->
<template>
  <div class="event-todo">
    <event-common-list
      ref="eventCommon"
      :event-type="EVENT_TYPE_ENUM.todo"
      :hidden-search-list="hiddenSearchList"
      :hidden-columns-list="hiddenColumnsList"
    >
      <template #button>
        <div class="head mr16">
          <el-button
            type="default"
            class="add-btn common-action-btn mr16"
            icon="custom-top common-icon common-icon-32"
            @click.stop="_handle_action('customizeTop')"
          >置顶配置
          </el-button>
          <el-dropdown @visible-change="handleVisibleChange">
            <el-button
              type="default"
              class="add-btn common-action-btn"
              icon="custom-config common-icon common-icon-32"
            >定制表格
            </el-button>
            <el-dropdown-menu slot="dropdown" class="todo-dropdown">
              <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选
              </el-checkbox>
              <el-checkbox-group v-model="checkedColumns" @change="handleCheckedColumnsChange">
                <el-checkbox
                  v-for="(item, index) in columnsList"
                  :key="item.id || index"
                  :label="item.id"
                  :value="item.id"
                >{{ item.name }}</el-checkbox>
              </el-checkbox-group>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </template>
      <template v-slot="{ row }">
        <span class="action-btn" @click="_showInfo(row)">查看</span>
      </template>
    </event-common-list>
    <todo-dialog
      :visible.sync="dialogVisible"
      :editingdata="dialogData"
      :mode="dialogType"
      @cancle="dialogClose"
    />
  </div>
</template>

<script>
import EventCommonList from '@/views/event/components/EventCommonList'
import todoDialog from '@/views/workbench/todo/todoDialog'
import { EVENT_TYPE_ENUM } from '@/views/event/components/eventTypeEnum'
import { mapState } from 'vuex'

export default {
  name: 'Todo',
  components: {
    EventCommonList,
    todoDialog
  },
  data() {
    // 定制表格配置，初始化默认全选
    const checkedColumns = JSON.parse(JSON.stringify(this.$store.state.dispatch.customizeTableConfig))
    return {
      EVENT_TYPE_ENUM,
      dialogVisible: false, // 弹窗开关
      dialogType: 'customizeTop', // 弹窗类型
      isIndeterminate: true,
      checkAll: true,
      checkedColumns,
      hiddenSearchList: ['areaCascader', 'whistleNum', 'eventDesc'], // 隐藏的搜索条件
      hiddenColumnsList: ['applyType', 'whistleLevel', 'endTime', 'eventDesc'] // 隐藏的展示列
    }
  },
  computed: {
    ...mapState({
      dialogData: (state) => state.dispatch.customizeTopConfig,
      columnsList: (state) => state.dispatch.tableColumnsList // 定制表格列表
    })
  },

  methods: {
    /**
     * 下拉消失,判断勾选指标与缓存比是否改变，统一触发定制表格
     * @param val
     */
    handleVisibleChange(val) {
      if (!val) {
        const curConfig = this.checkedColumns.sort().toString()
        const cacheConfig = this.$store.state.dispatch.customizeTableConfig.sort().toString()
        if (curConfig !== cacheConfig) this.$store.commit('dispatch/SET_TODO_CUSTOMIZE_TABLE_CONFIG', [...this.checkedColumns])
      }
    },
    handleCheckAllChange(val) {
      this.checkedColumns = val ? this.columnsList.map(({ id }) => id) : []
      this.isIndeterminate = false
    },
    handleCheckedColumnsChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.columnsList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.columnsList.length
    },
    // 操作处理
    _handle_action(action) {
      this.dialogType = action
      this.dialogVisible = true // 打开弹窗
    },
    // 关闭弹窗
    dialogClose() {
      this.dialogVisible = false
      try {
        this.$refs.eventCommon._search()
      } catch (error) {
        console.log('dialogClose==', error)
      }
    },
    // 查看详情
    _showInfo(row) {
      // 跳转详情页面, 详情页面，请求操作按钮的时候需要用到 taskId
      this.$router.push({
        path: '/workbench/todo/info',
        query: {
          taskId: row.taskId,
          id: row.id
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.event-todo {
  height: inherit;

  .mr16 {
    margin-right: 16px;
  }
  .head {
    display: flex;
    .el-button--text {
      color: #4b4b4b;

      &.is-current {
        color: #36a4ff;
        border-bottom: 2px solid #36a4ff;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.todo-dropdown {
  width: 160px;
  padding-left: 24px;
  label {
    line-height: 30px;
  }
}
</style>
