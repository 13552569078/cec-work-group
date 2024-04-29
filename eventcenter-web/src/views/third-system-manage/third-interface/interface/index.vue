<!--
@Author: lism
@Description: 第三方接口配置
@Date: 2023-11-07
-->
<template>
  <div class="page-wrapper">
    <common-page-list has-footer>
      <search
        slot="search"
        ref="searchRef"
        @searchList="dealwithFilter"
        @reset="clearFilters"
      />
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
          @refresh="_search"
        >
          <el-button
            type="primary"
            class="add-btn common-action-btn"
            icon="custom-add common-icon"
            @click="_action('add')"
          >新增接口配置</el-button>
        </search-tips>
        <div v-loading="loading" class="result-list" :style="resultStyle">
          <el-table
            ref="tableRef"
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
            <template v-for="(item, index) in tableColumn">
              <el-table-column
                :key="index"
                :label="item.label"
                :prop="item.prop"
                :width="item.width"
                :min-width="item.minWidth"
                :formatter="_formatter"
                show-overflow-tooltip
              >
                <template v-slot="{row, column}">
                  <span v-if="item.prop == 'status'">
                    <el-switch
                      v-model="row[column.property]"
                      active-color="#4CC09E"
                      inactive-color="#BDBDBD"
                      :active-text="row[column.property] == 1 ? '启用' : '停用'"
                      active-value="1"
                      inactive-value="2"
                      @change="_action('change-status', row)"
                    />
                  </span>
                  <span v-else> {{ row[column.property] }} </span>
                </template>
              </el-table-column>
            </template>
            <el-table-column
              :width="160"
              fixed="right"
              class-name="table-column-action"
            >
              <template #header>
                <span>操作</span>
              </template>
              <template v-slot="{row}">
                <span class="action-group">
                  <span class="action-btn" @click="_action('view', row)">查看</span>
                  <span class="action-divider">|</span>
                  <span class="action-btn" @click="_action('edit', row)">编辑</span>
                  <span class="action-divider">|</span>
                  <span class="action-btn" @click="_action('del', row)">删除</span>
                </span>
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
    <cmDialog
      v-if="dialogVisible"
      :dialog-visible="dialogVisible"
      :dig-type="digType"
      :dig-data="digData"
      :selected-third-system="selectedThirdSystem"
      @changeTreeSelect="changeTreeSelect"
    />
  </div>
</template>

<script>
import pageMixin from '@/mixin/pageMixin'
import searchMixin from '@/mixin/searchMixin'
import cmDialog from './cmDialog'
import moduleSrv from '@/api/dispatchWhh'
import { SUCCESS_CODE } from '@/constants'
import search from './search'

export default {
  name: 'DeWeight',
  components: {
    search, cmDialog
  },
  mixins: [pageMixin, searchMixin],
  props: {
    selectedThirdSystem: {
      type: Object,
      default: () => {}
    },
    thirdSystemList: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      dialogVisible: false,
      digType: '',
      digData: {},
      tableColumn: [
        {
          prop: 'apiCode',
          label: '接口编码',
          visible: true,
          minWidth: 200
        },
        {
          prop: 'apiName',
          label: '接口名称',
          visible: true,
          minWidth: 200
        },
        {
          prop: 'url',
          label: '接口地址',
          visible: true,
          minWidth: 200
        },
        {
          prop: 'requestMethod',
          label: '请求方式',
          visible: true,
          minWidth: 200
        },
        {
          prop: 'createTime',
          label: '创建时间',
          visible: true,
          minWidth: 200
        },
        {
          prop: 'comment',
          label: '备注',
          visible: true,
          minWidth: 200
        }
      ]
    }
  },
  watch: {
    // 如果只有查看权限，则无需再继续查询按钮权限,
    selectedThirdSystem: {
      immediate: true,
      deep: true,
      handler(val) {
        this._search()
      }
    }
  },
  methods: {
    changeTreeSelect(res) {
      this.$emit('changeTreeSelect', res)
    },
    // 自定义序号
    indexMethod(index) {
      return index + 1 > 9 ? index + 1 : `${index + 1}`
    },

    _search() {
      const { pageNum = 1, pageSize = 10 } = this.page
      let sysCode = ''
      if (this.selectedThirdSystem?.platformCode !== '-999') {
        sysCode = this.selectedThirdSystem?.platformCode
      } else {
        sysCode = this.thirdSystemList[0]?.children?.length > 0 ? this.thirdSystemList[0]?.children.map(e => e.platformCode).join(',') : ''
      }

      const params = {
        pageNum,
        pageSize,
        sysCode,
        ...this.searchParams
      }
      this.loading = true
      moduleSrv.getBusApiPage(params).then((res) => {
        const { list = [], total = 0 } = res.data
        if (res.code === SUCCESS_CODE) {
          this.dataList = list
          this.page.total = total
        }
      }).finally(() => {
        this.loading = false
      })
    },

    _del(row) {
      this.$confirm('删除该接口可能引起与第三方系统间的调用异常，是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'cestc-confirm-warning'
      }).then(() => {
        moduleSrv.deleteThirdApi({
          id: row.id
        }).then((res) => {
          if (res.code === SUCCESS_CODE) {
            this.$message({
              message: '操作成功！',
              type: 'success'
            })
            // 更新数据
            this._search()
          } else {
            this.$message({
              message: res.message || '操作失败！',
              type: 'error'
            })
          }
        })
      })
    },
    // 状态改变
    _changeStatus(row) {
      moduleSrv.editDictData(row).then((res) => {
        if (res.code === SUCCESS_CODE) {
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
          this._search()
        } else {
          this.$message({
            message: res.message || '操作失败！',
            type: 'error'
          })
        }
      })
    },
    _action(action, row) {
      switch (action) {
        case 'add':
          // this.dialogVisible = true
          this.digType = action
          this.digData = row
          this.$router.push({ path: '/third-system-manage/edit-interface', query: { digType: 'add', platformCode: this.selectedThirdSystem.platformCode }})
          break
        case 'view':
          this.digType = action
          this.digData = row
          this.$router.push({ path: '/third-system-manage/view-interface', query: { digType: 'view', id: row.id, platformCode: this.selectedThirdSystem.platformCode }})
          break
        case 'edit':
          // this.dialogVisible = true
          this.digType = action
          this.digData = row
          this.$router.push({ path: '/third-system-manage/edit-interface', query: { digType: action, id: row.id, platformCode: this.selectedThirdSystem.platformCode }})
          break
        case 'del':
          this._del(row)
          break
        case 'change-status':
          this._changeStatus(row)
          break

        default:
          break
      }
    },
    // 表格内容格式化
    _formatter(row, column, cellValue) {
      return cellValue || '-'
    }
  }
}
</script>

<style scoped lang="scss">
.page-wrapper {
  height: 100%;
  @include resultContent;
}
</style>
