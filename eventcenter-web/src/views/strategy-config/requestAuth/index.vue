<!--
@Author: lism
@Description: 请求鉴权配置
@Date: 2023-11-09
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
          >新增请求鉴权配置</el-button>
        </search-tips>
        <div v-loading="loading" class="result-list" :style="resultStyle">
          <el-table ref="tableRef" :data="dataList" style="width: 100%" tooltip-effect="light">
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
                <!-- 对事件处理状态特殊处理，给不同的状态不同的标记 -->
                <template v-slot="{ row, column }">
                  <span v-if="item.prop == 'status'">
                    <el-switch
                      v-model="row[column.property]"
                      active-color="#4CC09E"
                      inactive-color="#BDBDBD"
                      :active-text="row[column.property] == 1 ? '启用' : '停用'"
                      :active-value="1"
                      :inactive-value="0"
                      @change="_action('change-status', row)"
                    />
                  </span>
                  <span v-else-if="item.prop === 'apiAuth'" class="tag-read" :data-clipboard-text="row.apiAuth" @click="copy">{{ row.apiAuth }}</span>
                  <span v-else> {{ row[column.property] }} </span>
                </template>
              </el-table-column>
            </template>
            <el-table-column :width="120" fixed="right" class-name="table-column-action">
              <template #header>
                <span>操作</span>
              </template>
              <template v-slot="{ row }">
                <span class="action-group">
                  <span class="action-btn" @click="_action('reset', row)">重置</span>
                  <span class="action-divider">|</span>
                  <span class="action-btn" @click="_action('del',row)">删除</span>
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
    <setting-dialog
      :visible.sync="dialogVisible"
      :editingdata="dialogData"
      :mode="dialogType"
      @update="_search"
    />
  </div>
</template>

<script>
import pageMixin from '@/mixin/page.mixin'
import searchMixin from '@/mixin/searchMixin'
import settingDialog from './settingDialog'
import search from './search'
import moduleSrv from '@/api/dispatch'
import Clipboard from 'clipboard'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'Appraise',
  components: {
    search,
    settingDialog
  },
  mixins: [pageMixin, searchMixin],
  data() {
    return {
      dialogVisible: false,
      dialogType: '',
      dialogData: {},
      tableColumn: [
        {
          prop: 'sysName',
          label: '平台系统',
          visible: true,
          minWidth: '120'
        },
        {
          prop: 'apiAuth',
          label: '密钥',
          visible: true,
          minWidth: '220'
        },
        {
          prop: 'status',
          label: '启停状态',
          visible: true,
          minWidth: '120'
        }
      ]
    }
  },
  computed: {
    // 把字典转换为字典方式存储，方便获取对应中文
    eventPlatformOptionsMap() {
      const platform = this.$store.getters.getBsDictsByType('event_platform')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    eventUrgentOptionsMap() {
      const platform = this.$store.getters.getBsDictsByType('event_urgent_level')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    }

  },
  methods: {
    copy() {
      const clipboard = new Clipboard('.tag-read')
      clipboard.on('success', e => {
        this.$message.success('复制成功')
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        // 不支持复制
        this.$message.error('该浏览器不支持自动复制')
        // 释放内存
        clipboard.destroy()
      })
    },
    // 自定义序号
    indexMethod(index) {
      return index + 1 > 9 ? index + 1 : `${index + 1}`
    },

    _search() {
      const { pageNum = 1, pageSize = 10 } = this.page
      const params = {
        pageNum,
        pageSize,
        ...this.searchParams
      }
      this.loading = true
      moduleSrv
        .getAuthPageList(params)
        .then((res) => {
          const { list = [], total = 0 } = res.data
          if (res.code === SUCCESS_CODE) {
            this.dataList = list
            this.page.total = total
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 删除
    _del(row) {
      this.$confirm('确定要删除该配置吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'cestc-confirm-warning'
      }).then(() => {
        const params = {
          id: row.id,
          sysCode: row.sysCode,
          apiAuth: row.apiAuth,
          secret: row.secret,
          status: row.status,
          isDelete: 1
        }
        moduleSrv.postAuthPageUpdate(params).then((res) => {
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
    // 启用、停用状态
    _changeStatus(row) {
      moduleSrv.postAuthPageUpdate({
        id: row.id,
        sysCode: row.sysCode,
        apiAuth: row.apiAuth,
        secret: row.secret,
        status: row.status
      }).then((res) => {
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
    _reset(row) {
      const params = {
        sysCode: row.sysCode
      }
      moduleSrv.postGenerateSecret(params).then((res) => {
        if (res.code === SUCCESS_CODE) {
          const useApiAuth = res.data.apiAuth
          const useSecret = res.data.secret
          const params2 = {
            id: row.id,
            sysCode: row.sysCode,
            apiAuth: useApiAuth,
            secret: useSecret,
            status: row.status
          }
          moduleSrv.postAuthPageUpdate(params2).then((res) => {
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
        } else {
          console.warn('postGenerateSecret 接口报错')
        }
      })
    },
    _action(action, row) {
      switch (action) {
        case 'add':
        case 'edit':
          this.dialogVisible = true
          this.dialogType = action
          this.dialogData = row || {}
          break
        case 'del':
          this._del(row)
          break
        case 'reset':
          this._reset(row)
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
      if (column.property === 'platformSrc') {
        return this.eventPlatformOptionsMap.get(row.platformSrc)
      }
      if (column.property === 'eventUrgent') {
        return this.eventUrgentOptionsMap.get(row.eventUrgent) || '全部'
      }
      if (column.property === 'eventTypeName') {
        return row.eventTypeName || '全部'
      }
      return cellValue || '-'
    }
  }
}
</script>

<style scoped lang="scss">
.page-wrapper {
  height: 100%;
  @include resultContent;
  ::v-deep {
    @include oneLineSearch;
  }
}
</style>
