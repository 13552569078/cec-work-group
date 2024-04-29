<template>
  <div class="work-manage-arrange">
    <fixed-page padding="0" :footer-height="76" :footer-margin="0">
      <template v-slot:header>
        <search-panel label-width="100" @search="resultList" @reset="reset">
          <panel-item label="值班表">
            <el-input v-model="form.name" class="input" placeholder="请输入内容" />
          </panel-item>
          <!-- <panel-item label="流程名称">
            <el-input v-model="form.bpmName" placeholder="请输入流程名称" />
          </panel-item> -->
        </search-panel>
      </template>
      <template>
        <div class="result">
          <search-tips ref="searchTips" :total="page.total" show-actions>
            <el-button
              type="primary"
              class="add-btn common-action-btn"
              icon="custom-add common-icon"
              @click.stop="openSettingDialog({}, 'add')"
            >新增值班表</el-button>
          </search-tips>
          <el-table :data="tableData" style="width: 100%" :height="tableContentHeight" tooltip-effect="light">
            <el-table-column
              type="index"
              width="55"
              :index="indexMethod"
              class-name="table-column-index"
            />
            <template v-for="(item, index) in columns">
              <el-table-column
                v-if="item.prop === 'workedName'"
                :key="index"
                :label="item.label"
                :prop="item.prop"
                :width="item.width"
                show-overflow-tooltip
              >
                <!-- 给不同的状态不同的标记 -->
                <template v-slot="{ row }">
                  <span :class="`${_tranfromState(row)}-wrapper`">
                    <svg-icon :icon-class="_tranfromState(row)" />
                    {{ row.workedName }}
                  </span>
                </template>
              </el-table-column>
              <template v-else-if="item.prop === 'status'">
                <!-- 激活状态 -->
                <el-table-column
                  :key="index"
                  :prop="item.prop"
                  :label="item.label"
                  :width="item.width"
                  show-overflow-tooltip
                >
                  <template v-slot="{ row }">
                    <el-switch
                      v-model="row.status"
                      active-color="#4CC09E"
                      inactive-color="#BDBDBD"
                      active-value="0"
                      inactive-value="1"
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
            <el-table-column width="180" class-name="table-column-action">
              <template #header>
                <span>操作</span>
              </template>
              <template v-slot="{ row }">
                <span class="action-group">
                  <span class="action-btn" @click="openSettingDialog(row)">编辑</span>
                  <span class="action-divider">|</span>
                  <span class="action-btn" @click="patchRemove(row)">删除</span>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
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
import moduleSrv from '@/api/dispatch'
import { mapActions } from 'vuex'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'Setting',
  components: {},
  data() {
    return {
      form: {},
      tableData: [],
      tableColumn: [
        {
          prop: 'name',
          label: '值班表',
          visible: true
        },
        {
          prop: 'remark',
          label: '描述',
          visible: true
        },
        {
          prop: 'workedName',
          label: '当前状态',
          visible: true
        },
        {
          prop: 'status',
          label: '状态开关',
          visible: true
        }
      ],
      page: {
        pageNum: 1,
        total: 0,
        pageSize: 10
      },
      dialogType: 'add',
      dialogVisible: false, // 值班配置弹窗
      searchTipsHeight: 0
    }
  },
  computed: {
    columns() {
      return this.tableColumn.filter((item) => item.visible)
    },
    tableContentHeight() {
      return `calc(100% - ${this.searchTipsHeight}px - 20px)`
    }
  },
  async created() {
    // 事件类型所有模块都要使用，故此在这里进行请求
    await this.getEventType()
    await this.getProcess()
    this.resultList()
  },
  mounted() {
    this.$nextTick(() => {
      this.searchTipsHeight = this.$refs?.searchTips?.$el?.clientHeight
    })
  },
  methods: {
    ...mapActions('dispatch', ['getEventType', 'getProcess']),
    // 列表查询
    resultList() {
      const { pageNum = 1, pageSize = 10 } = this.page
      const params = {
        ...this.form,
        pageNum,
        pageSize
      }
      moduleSrv.getDutyList(params).then((res) => {
        const { list = [], total = 0 } = res.data
        if (res.code === SUCCESS_CODE) {
          this.tableData = list
          this.tableData.forEach((item) => {
            item.workedName = item.status === '0' ? '生效' : '失效'
          })
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
    _tranfromState(row) {
      const state = row.status || '0'
      if (state === '0') {
        // 生效
        return 'svg-success'
      } else {
        return 'svg-disabled'
      }
    },
    // 删除接口
    patchRemove(row) {
      this.$confirm('确定要删除该数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'cestc-confirm-warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        moduleSrv.deleteRota(params).then((res) => {
          if (res.code === SUCCESS_CODE) {
            this.$message({
              message: '操作成功！',
              type: 'success'
            })
            this.resultList()
          } else {
            this.$message({
              message: res.message || '操作失败!',
              type: 'error'
            })
          }
        })
      })
    },
    // 新增、编辑值班配置
    openSettingDialog(row, type) {
      if (type === 'add') {
        // 新增
        this.$router.push({ path: '/workManage/arrange/add', query: { type: 'add' }})
      } else {
        // 编辑
        this.$router.push({
          path: '/workManage/arrange/edit',
          query: { type: 'edit', rotaObj: row }
        })
      }
      this.dialogVisible = true
    },
    // reset search
    reset() {
      this.form = {}
      this.resultList()
    },
    // 翻页查询
    handleCurrentChange(current) {
      this.page.currentPage = current
      this.resultList()
    },
    handleSizeChange(size) {
      this.page.pageSize = size
      this.page.pageNum = 1
      this.resultList()
    },
    // 单条值班起停
    _handleSwitch(val) {
      const params = {
        id: val.id,
        status: val.status
      }
      moduleSrv.updateStatus(params).then((res) => {
        if (res.code === SUCCESS_CODE) {
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
          this.resultList()
        } else {
          this.$message({
            message: res.message || '操作失败！',
            type: 'error'
          })
        }
      })
    },
    dialogClose() {
      this.dialogVisible = false
      // 关闭弹窗，触发更新
      this.resultList()
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";
.work-manage {
  &-arrange {
    height: 100%;
    display: flex;
    flex-direction: column;
    ::v-deep .el-form {
      .el-form-item__label {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #4b4b4b;
        font-weight: 400;
      }
      .el-form-item__content {
        .el-input__inner {
          width: 296px;
          height: 32px;
          background: #fff;
          border: 1px solid #e7e7e7;
          border-radius: 2px;
          &:focus {
            border-radius: 2px;
            border: 1px solid #36a4ff;
          }
        }
      }
    }
    @extend %event_content_flex;
    .svg-success-wrapper {
      color: $success;
    }
    .svg-disabled-wrapper {
      color: #a9a9a9;
    }
  }
}
</style>
