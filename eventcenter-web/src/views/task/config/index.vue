<!--
 * @description 任务中心-计划任务配置
 * @date 2020-09-08
 * @author lism
-->
<template>
  <div class="task-config">
    <fixed-page padding="0" :footer-height="76" :footer-margin="0">
      <template v-slot:header>
        <search-panel @search="resultList" @reset="reset">
          <panel-item label="计划名称">
            <el-input v-model="form.name" placeholder="请输入内容" />
          </panel-item>
        </search-panel>
      </template>
      <!-- 结果 -->
      <div ref="result" class="result mt16">
        <search-tips ref="searchTips" :total="page.total" show-actions>
          <el-button
            type="primary"
            class="add-btn common-action-btn"
            icon="custom-add common-icon"
            @click="
              dialog = true;
              planInfo = {};
            "
          >制定任务计划</el-button>
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
            <template v-if="item.prop === 'planStatus'">
              <el-table-column
                :key="item.id"
                :label="item.label"
                :prop="item.prop"
                :width="item.width"
                show-overflow-tooltip
              >
                <template v-slot="{ row }">
                  <el-switch
                    v-model="row.planStatus"
                    active-color="#4CC09E"
                    inactive-color="#BDBDBD"
                    :active-value="0"
                    :inactive-value="1"
                    @change="_handleSwitch(row)"
                  />
                </template>
              </el-table-column>
            </template>
            <el-table-column
              v-else
              :key="index"
              :label="item.label"
              :prop="item.prop"
              :width="item.width"
              :formatter="_formatter"
              show-overflow-tooltip
            />
          </template>
          <el-table-column width="200" fixed="right" class-name="table-column-action">
            <template #header>
              <span>操作</span>
            </template>
            <template v-slot="{ row }">
              <span class="action-group">
                <span class="action-btn" @click="_action('handle', row)">执行</span>
                <span class="action-divider">|</span>
                <!-- 运行中不可以删除 -->
                <span
                  :class="['action-btn', { 'is-disabled': row.planStatus === 0 }]"
                  @click="_action('edit', row)"
                >编辑</span>
                <span class="action-divider">|</span>
                <span class="action-btn" @click="_action('log', row)">日志</span>
                <span class="action-divider">|</span>
                <span :class="['action-btn', { 'is-disabled': row.planStatus === 0 }]" @click="_action('del', row)">删除</span>

              </span>
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
    <!-- 定制任务计划、编辑任务计划 -->
    <add
      v-if="dialog"
      :visible.sync="dialog"
      :info="planInfo"
      :range-map="rangeMap"
      @success="_success"
    />
  </div>
</template>

<script>
import pageMixin from '@/mixin/page.mixin'
import tableMixin from '@/mixin/table.mixin'
import add from './add'
import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'Config',
  components: {
    add
  },
  mixins: [pageMixin, tableMixin],
  data() {
    return {
      form: {},
      planInfo: {}, // 详情信息
      tableColumn: [
        {
          prop: 'name',
          label: '计划名称',
          visible: true
        },
        {
          prop: 'limitTimeunit',
          label: '计划周期',
          visible: true
        },
        {
          prop: 'createBy',
          label: '计划定制人',
          visible: true
        },

        {
          prop: 'planStartTime',
          label: '开始时间',
          visible: true
        },
        {
          prop: 'planEndTime',
          label: '结束时间',
          visible: true
        },
        {
          prop: 'planNextTime',
          label: '下次执行时间',
          visible: true
        },
        {
          prop: 'planStatus',
          label: '当前状态',
          visible: true
        }
      ],
      dialog: false,
      rangeMap: []
    }
  },
  created() {
    // 从 mixin 触发方法
    // 先获取弹窗需要使用的机构数据，要是放到弹窗中获取，会出现一些意想不到的错误
    this.initSelectMap()
  },
  methods: {
    // 发布范围字典数据
    initSelectMap() {
      moduleSrv.getNotifyMap().then((res) => {
        if (res.code === SUCCESS_CODE) {
          this.rangeMap = res.data || []
        } else {
          this.rangeMap = []
          console.warn('发布范围字典数据获取报错')
        }
      })
    },
    // 添加、编辑成功后，进行列表更新
    _success() {
      this.dialog = false
      this.resultList()
    },
    resultList() {
      this.tableData = []
      const { pageNum = 1, pageSize = 10 } = this.page
      const params = {
        ...this.form,
        pageNum,
        pageSize
      }
      moduleSrv.getFormulateList(params).then((res) => {
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
    // 任务起停
    _handleSwitch(row) {
      // 0 开启， 1 关闭, switch 组件已经把值给修改好了，无需重新修改，直接获取状态值
      const params = {
        id: row.id,
        planStatus: row.planStatus
      }
      moduleSrv.changeStatusFormulate(params).then((res) => {
        if (res.code === SUCCESS_CODE) {
          this.$message({
            type: 'success',
            message: '更新成功'
          })
          this.resultList()
        } else {
          this.$message({
            type: 'error',
            message: '更新失败'
          })
        }
      })
    },
    // 删除
    delfn(row) {
      // 需要用 formdate 传
      const form = new FormData()
      form.append('id', row.id)
      moduleSrv.deleteFormulate(form).then((res) => {
        if (res.code === SUCCESS_CODE) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.resultList()
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
      })
    },
    // 操作触发
    _action(action, row) {
      if (action === 'edit') {
        if (row.planStatus === 0) return
        moduleSrv.getFormulateInfoById(row.id).then((res) => {
          if (res.code === SUCCESS_CODE) {
            this.$nextTick(() => {
              this.planInfo = res.data
              this.dialog = true
            })
          } else {
            console.warn('getFormulateInfoById 接口报错')
          }
        })
      } else if (action === 'del') {
        if (row.planStatus === 0) return
        // 二次提示
        this.$confirm('确定要删除该计划任务吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'cestc-confirm-warning'
        }).then(() => {
          this.delfn(row)
        })
      } else if (action === 'log') {
        this.$router.push({
          path: '/task/config/log',
          query: { jobId: row.jobId, id: row.id }
        })
      } else {
        // 执行
        this.$confirm('确定要执行该计划任务吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'cestc-confirm-warning'
        }).then(() => {
          this.runFormulate(row)
        })
      }
    },
    // 执行计划
    runFormulate(row) {
      const params = {
        id: row.id
      }
      moduleSrv.runFormulate(params).then((res) => {
        if (res.code === SUCCESS_CODE) {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.resultList()
        } else {
          this.$message({
            type: 'error',
            message: res.message || '操作失败!'
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.result {
  .el-dropdown-link {
    cursor: pointer;
  }
}
</style>
