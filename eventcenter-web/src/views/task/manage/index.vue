<!--
 * @description 任务中心-待办任务
 * @date 2020-09-08
 * @author lism
-->
<template>
  <div class="task-todo">
    <fixed-page padding="0" :footer-height="76" :footer-margin="0">
      <template v-slot:header>
        <search-panel @search="resultList" @reset="reset">
          <panel-item label="任务标题">
            <el-input v-model="form.taskTitle" placeholder="请输入内容" />
          </panel-item>
          <panel-item label="任务状态">
            <el-select v-model="form.status" placeholder="活动区域">
              <el-option
                v-for="(item, index) in taskStatus"
                :key="item.key || index"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </panel-item>
          <panel-item label="任务类型">
            <el-select
              v-model="form.taskType"
              placeholder="活动区域"
              @change="changeTaskType"
            >
              <el-option
                v-for="(item, index) in taskTypeOptions"
                :key="item.id || index"
                :label="item.dictDesc"
                :value="item.dictValue"
              />
            </el-select>
          </panel-item>
          <panel-item label="任务对象">
            <el-select
              v-model="form.taskObject"
              placeholder="活动区域"
              @change="$forceUpdate()"
            >
              <el-option
                v-for="(item, index) in taskPersonOptions"
                :key="item.id || index"
                :label="item.dictDesc"
                :value="item.dictValue"
              />
            </el-select>
          </panel-item>
          <panel-item label="截止时间" class="panel-item-two">
            <cestc-date-picker
              v-model="dateRange"
              class="form-time"
              type="daterange"
              clearable
            />
          </panel-item>
        </search-panel>
      </template>
      <!-- 结果 -->
      <div ref="result" class="result mt16">
        <search-tips ref="searchTips" :total="page.total" :show-actions="false" />
        <el-table
          ref="tableHeight"
          :height="tableContentHeight"
          :data="tableData"
          style="width: 100%"
          tooltip-effect="light"
        >
          <el-table-column
            type="index"
            width="55"
            :index="indexMethod"
            class-name="table-column-index"
          />
          <template v-for="(item, index) in columns">
            <el-table-column
              :key="index"
              :label="item.label"
              :prop="item.prop"
              :width="item.width"
              :formatter="_formatter"
              show-overflow-tooltip
            />
          </template>
        </el-table>
      </div>
      <template v-slot:footer>
        <cestc-pagination
          :current-page.sync="page.pageNum"
          :page-size="page.pageSize"
          :total="page.total"
          layout="total,prev,pager,next,jumper,sizes"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </template>
    </fixed-page>
  </div>
</template>

<script>
import pageMixin from '@/mixin/page.mixin'
import tableMixin from '@/mixin/table.mixin'
import moduleSrv from '@/api/dispatch'
import { setDefaultTimeRange } from '@/utils/index'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'Todo',
  components: {},
  mixins: [pageMixin, tableMixin],
  data() {
    return {
      form: {},
      dateRange: null, // 事件时间
      tableColumn: [
        {
          prop: 'taskCode',
          label: '任务编码',
          visible: true
        },
        {
          prop: 'taskTitle',
          label: '任务标题',
          visible: true
        },
        {
          prop: 'taskType',
          label: '任务类型',
          visible: true
        },
        {
          prop: 'taskObject',
          label: '任务对象',
          visible: true
        },
        {
          prop: 'taskDesc',
          label: '任务内容',
          visible: true
        },
        {
          prop: 'taskSendUser',
          label: '任务派发人',
          visible: true
        },
        {
          prop: 'userName',
          label: '任务处理人',
          visible: true
        },
        {
          prop: 'startTime',
          label: '开始时间',
          visible: true
        },
        {
          prop: 'endTime',
          label: '结束时间',
          visible: true
        }
      ],
      taskId: '',
      taskPersonKey: '',
      taskStatus: [
        {
          key: 1,
          value: '未完成'
        },
        {
          key: 2,
          value: '完成'
        }
      ]
    }
  },
  computed: {
    taskTypeOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('plan_task_type')
    },
    taskPersonOptions() {
      return this.$store.getters.getBsDictsByType(this.taskPersonKey)
    }
  },

  methods: {
    resultList() {
      const { pageNum = 1, pageSize = 10 } = this.page
      const params = {
        ...this.form,
        pageNum,
        pageSize
      }
      moduleSrv.getTaskManageList(params).then((res) => {
        const { list = [], total = 0 } = res.data
        if (res.code === SUCCESS_CODE) {
          this.tableData = list
          this.page.total = total
        }
      })
    },
    changeTaskType(val) {
      this.form.taskObject = ''
      this.taskPersonKey = val
    },
    // 表格内容格式化
    _formatter(row, column, cellValue) {
      if (column.property === 'limitTimeunit') {
        const map = {
          1: '时',
          2: '日',
          3: '周',
          4: '月'
        }
        return map[cellValue]
      }
      return cellValue || '-'
    },
    // 重置
    reset() {
      this.form = {}
      this.dateRange = setDefaultTimeRange()
      this.resultList()
    }
  }
}
</script>
<style scoped lang="scss">
.task-todo {
  .panel-item-two {
    ::v-deep {
      .el-date-editor {
        width: 285.25px;
      }
    }
  }
}
</style>
