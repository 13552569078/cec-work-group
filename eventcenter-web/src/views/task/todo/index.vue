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
          <panel-item label="计划标题">
            <el-input v-model="form.taskTitle" placeholder="请输入内容" />
          </panel-item>
          <panel-item label="截止时间" class="panel-item-two">
            <cestc-date-picker v-model="dateRange" type="daterange" clearable />
          </panel-item>
        </search-panel>
      </template>
      <!-- 结果 -->
      <div ref="result" class="result mt16">
        <search-tips ref="searchTips" :total="page.total" :show-actions="false">
          <!-- 暂时隐藏 -->
          <!-- <el-button
            type="primary"
            class="add-btn common-action-btn"
            icon="custom-add common-icon"
            @click="addDialog = true"
            >新增任务</el-button
          > -->
        </search-tips>
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
          <el-table-column
            width="100"
            align="left"
            header-align="left"
            fixed="right"
          >
            <template #header>
              <span>操作</span>
            </template>
            <template v-slot="{ row }">
              <span
                :class="['nomal-btn', { 'action-disabled': row.status !== 3 }]"
                @click="handleTask(row)"
              >处理</span>
            </template>
          </el-table-column>
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
    <!-- 新增任务 -->
    <add v-if="addDialog" :visible.sync="addDialog" />
    <!-- 任务处理 -->
    <handle v-if="handleDialog" :id="taskId" :visible.sync="handleDialog" />
  </div>
</template>

<script>
import pageMixin from '@/mixin/page.mixin'
import tableMixin from '@/mixin/table.mixin'
import add from './add'
import handle from './handle'
import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'Todo',
  components: {
    add,
    handle
  },
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
      addDialog: false,
      handleDialog: false,
      taskId: ''
    }
  },
  created() {
    // 从 mixin 触发方法
  },

  methods: {
    resultList() {
      const { pageNum = 1, pageSize = 10 } = this.page
      const params = {
        ...this.form,
        pageNum,
        pageSize
      }
      moduleSrv.getTaskList(params).then((res) => {
        // console.log('-待处理返回结果-', res)
        const { list = [], total = 0 } = res.data
        if (res.code === SUCCESS_CODE) {
          this.tableData = list
          this.page.total = total
        }
      })
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
    // 新增任务、处理任务
    handleTask(row) {
      console.log('row==', row)
      if (row.status === 3) {
        this.taskId = row.id
        this.handleDialog = true
      }
    }
  }
}
</script>
<style scoped lang='scss'>
.nomal-btn {
  &:not(.action-disabled) {
    color: #36a4ff;
    cursor: pointer;
  }
  color: #ccc;
  cursor: not-allowed;
}
</style>
