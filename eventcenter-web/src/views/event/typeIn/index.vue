<!--
 * @description 事件管理-事件录入
 * @date 2020-08-19
 * @author lism
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
            @click.stop="_handle_action('add')"
          >新增事件录入</el-button>
        </search-tips>
        <div v-loading="loading" class="result-list" :style="resultStyle">
          <el-table ref="tableRef" :data="tranformData" style="width: 100%" tooltip-effect="light">
            <el-table-column
              type="index"
              width="55"
              :index="indexMethod"
              class-name="table-column-index"
            />
            <el-table-column
              v-for="(item, index) in tableColumn"
              :key="index"
              :label="item.label"
              :prop="item.prop"
              :width="item.width"
              :min-width="item.minWidth"
              show-overflow-tooltip
              :formatter="_formatter"
            />
            <el-table-column :width="200" fixed="right" class-name="table-column-action">
              <template #header>
                <span>操作</span>
              </template>
              <template v-slot="{ row }">
                <span class="action-group">
                  <span class="action-btn" @click="_handle_action('view', row)">查看</span>
                  <span class="action-divider">|</span>
                  <span class="action-btn" @click="_handle_action('edit', row)">编辑</span>
                  <span class="action-divider">|</span>
                  <span class="action-btn" @click="_handle_action('submit', row)">提交</span>
                  <span class="action-divider">|</span>
                  <span class="action-btn" @click="_delete(row)">删除</span>
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
  </div>
</template>

<script>
import moduleSrv from '@/api/dispatch'
import search from './search'
import pageMixin from '@/mixin/page.mixin'
import searchMixin from '@/mixin/searchMixin'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'TypeIn',
  components: {
    search
  },
  mixins: [pageMixin, searchMixin],
  data() {
    return {
      tableColumn: [
        {
          prop: 'title',
          label: '事件标题'
        },
        {
          prop: 'eventTypeText',
          label: '事件类型'
        },
        {
          prop: 'eventAddress',
          label: '发生地址'
        },
        {
          prop: 'eventUrgentText',
          label: '严重程度'
        },
        {
          prop: 'happenTime',
          label: '发生时间'
        }
      ]
    }
  },
  computed: {
    eventUrgentOptionsMap() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const platform = this.$store.getters.getBsDictsByType('event_urgent_level')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    tranformData() {
      return this.dataList.map((item) => {
        item.eventUrgentText = this.eventUrgentOptionsMap.get(item.eventUrgent)
        // 把事件大、中、小类组合
        item.eventTypeText = `${item.eventTypeLName || ''}/${item.eventTypeMNAME || ''}/${item.eventTypeName || ''}`
        if (item.eventTypeIdFourName) {
          item.eventTypeText += `/${item.eventTypeIdFourName}`
        }
        if (item.eventTypeIdFiveName) {
          item.eventTypeText += `/${item.eventTypeIdFiveName}`
        }
        // 省略因数据为空导致的//
        item.eventTypeText = item.eventTypeText.replace(/\/\//, '') || '-'
        return item
      })
    },
    speType() {
      return this.$route.query.speType || ''
    }
  },
  methods: {
    // 自定义序号
    indexMethod(index) {
      return index + 1 > 9 ? index + 1 : `${index + 1}`
    },
    async _search() {
      await this.$nextTick()
      const { pageNum = 1, pageSize = 10 } = this.page
      const params = {
        pageNum,
        pageSize,
        ...this.searchParams
      }
      if (params.gridId) {
        params.deptId = params.gridId
      }
      this.loading = true
      const res = await moduleSrv.getWaitEventList(params).finally(() => {
        this.loading = false
      })
      if (res.code === SUCCESS_CODE) {
        const { list = [], total = 0 } = res.data
        this.dataList = list
        this.page.total = total
      }
    },
    // 操作处理
    _handle_action(action, row) {
      const queryParams = {}
      if (this.speType) queryParams.speType = this.speType
      switch (action) {
        case 'add':
          this.$router.push({ path: '/event/type-in/type-in-add', query: queryParams })
          break
        case 'view':
          this.$router.push({
            path: '/event/type-in/info',
            query: {
              taskId: row.taskId,
              id: row.id,
              refresh: true
            }
          })
          break
        case 'edit':
          this.$router.push({
            path: '/event/type-in/type-in-edit',
            query: { id: row.id, ...queryParams }
          })
          break
        case 'submit':
          this._submit(row)
          break

        default:
          break
      }
    },
    _submit(row) {
      moduleSrv.submitEvent(row).then(res => {
        if (res.code === SUCCESS_CODE) {
          this.$message.success(res.message)
          this._search()
        }
      })
    },
    // 删除事件录入
    _delete(row) {
      this.$confirm('确定要删除该事件吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'cestc-confirm-warning'
      }).then(() => {
        const params = {
          eventIds: [row.id]
        }
        moduleSrv.batchDelete(params).then((res) => {
          if (res.code === SUCCESS_CODE) {
            this.$message({
              message: '删除成功！',
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
      })
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
