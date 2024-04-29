<template>
  <div class="page-wrapper">
    <common-page-list has-footer class="common-page-list">
      <search slot="search" ref="searchRef" @searchList="dealwithFilter" @reset="clearFilters" />
      <div slot="content" class="result-content">
        <search-tips
          ref="searchTips"
          :total="page.total"
          show-search-items
          show-actions
          :search-items="filterTips"
          :select-count="selectCount"
          @heightChange="tipHeightChange"
          @delFilter="delFilter"
          @clear="clearFilters"
        >
          <el-button
            type="primary"
            class="add-btn common-action-btn"
            icon="custom-add common-icon"
            @click.stop="openSettingDialog('add')"
          >新增配置策略</el-button>
        </search-tips>
        <div v-loading="loading" class="result-list" :style="resultStyle">
          <el-table
            :data="dataList"
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
              <template v-if="item.prop === 'effect'">
                <!-- 激活状态 -->
                <el-table-column
                  :key="'effect_' + index"
                  :prop="item.prop"
                  :label="item.label"
                  :width="item.width"
                  show-overflow-tooltip
                >
                  <template v-slot="{ row }">
                    <span>{{ row.effect === 0 ? '失效' : '启用' }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  :key="index"
                  :prop="item.prop"
                  label="启停控制"
                  :width="item.width"
                  show-overflow-tooltip
                >
                  <template v-slot="{ row }">
                    <el-switch
                      v-model="row.effect"
                      active-color="#4CC09E"
                      inactive-color="#BDBDBD"
                      :active-value="1"
                      :inactive-value="0"
                      @change="_handleSwitch(row)"
                    />
                  </template>
                </el-table-column>
              </template>
              <el-table-column
                v-else
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                show-overflow-tooltip
              />
            </template>
            <el-table-column class-name="table-column-action">
              <template #header>
                <span>操作</span>
              </template>
              <template v-slot="{ row }">
                <span
                  class="action-btn"
                  @click="_nodeConfig(row)"
                >节点配置</span>
                <span
                  class="action-btn"
                  @click="openSettingDialog(row)"
                >编辑</span>
                <span class="action-btn" @click="patchRemove(row)">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <template v-slot:footer>
        <cestc-pagination
          background
          :current-page="page.pageNum"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total"
          :page-sizes="[10, 20, 50, 100]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </template>
    </common-page-list>
    <setting-dialog
      :visible.sync="dialogVisible"
      :editingdata="dialogData"
      :mode="dialogType"
      top="10vh"
      @cancle="dialogClose"
    />
  </div>
</template>

<script>
import moduleSrv from '@/api/dispatch'
import search from './search'
import pageMixin from '@/mixin/pageMixin'
import searchMixin from '@/mixin/searchMixin'
import settingDialog from './settingDialog'
import { mapActions } from 'vuex'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'Setting',
  components: {
    search,
    settingDialog
  },
  mixins: [pageMixin, searchMixin],
  data() {
    return {
      tableColumn: [
        {
          prop: 'strategyName',
          label: '策略名称',
          visible: true
        },
        {
          prop: 'strategyKeyAndValueList',
          label: '策略因子',
          visible: false
        },
        {
          prop: 'bpmName',
          label: '流程名称',
          visible: true
        },
        {
          prop: 'remark',
          label: '描述',
          visible: true
        },
        {
          prop: 'priorityLevel',
          label: '策略排名',
          visible: true
        },
        {
          prop: 'effect',
          label: '激活状态',
          visible: true
        }
      ],
      dialogType: 'add',
      dialogVisible: false, // 策略配置弹窗
      dialogData: null
    }
  },
  computed: {
    columns() {
      return this.tableColumn.filter((item) => item.visible)
    }
  },
  async created() {
    this._search()
    // 事件类型所有模块都要使用，故此在这里进行请求
    await this.getEventType()
    await this.getProcess()
  },
  methods: {
    ...mapActions('dispatch', ['getEventType', 'getProcess']),
    // 列表查询
    _search() {
      const { pageNum = 1, pageSize = 10 } = this.page
      const params = {
        pageNum,
        pageSize,
        ...this.searchParams
      }
      moduleSrv.getStrategyList(params).then((res) => {
        const { list = [], total = 0 } = res.data
        if (res.code === SUCCESS_CODE) {
          this.dataList = list
          this.page.total = total
        } else {
          console.warn('getStrategyList 接口报错')
        }
      })
    },
    // 自定义序号
    indexMethod(index) {
      return index + 1 > 9 ? index + 1 : `${index + 1}`
    },
    // 删除接口
    patchRemove(row) {
      this.$confirm('确定要删除该策略吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'cestc-confirm-warning'
      }).then(() => {
        const params = {
          ids: row.id
        }
        moduleSrv.removeStrategy(params).then((res) => {
          if (res.code === SUCCESS_CODE) {
            this.$message({
              message: '操作成功！',
              type: 'success'
            })
            this._search()
          } else {
            this.$message({
              message: res.message || '操作失败!',
              type: 'error'
            })
          }
        })
      })
    },
    // 节点配置
    _nodeConfig(row) {
      console.log('row==', row)
      this.$router.push({
        path: '/process/process-list/nodeConfig',
        query: {
          key: row.bpmKey,
          processId: row.procdefId,
          ...row
        }
      })
    },
    // 新增、编辑策略配置
    openSettingDialog(row) {
      if (row === 'add') {
        // 新增
        this.dialogData = []
        this.dialogType = 'add'
      } else {
        // 编辑
        this.dialogType = 'edit'
        this.dialogData = row
      }
      this.dialogVisible = true
    },
    // 单条策略起停
    _handleSwitch(val) {
      moduleSrv.updateStrategy(val).then((res) => {
        if (res.code === SUCCESS_CODE) {
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
        } else {
          this.$message({
            message: res.message || '操作失败！',
            type: 'error'
          })
        }
        this._search()
      })
    },
    dialogClose() {
      this.dialogVisible = false
      // 关闭弹窗，触发更新
      this._search()
    }
  }
}
</script>

<style lang="scss" scoped>
.page-wrapper {
  height: 100%;
  @include resultContent;
  ::v-deep {
    @include oneLineSearch;
  }
}
</style>
