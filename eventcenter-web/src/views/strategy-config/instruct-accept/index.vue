<!--
@Author: lism
@Description: 指令接受
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
          :search-items="filterTips"
          :select-count="selectCount"
          @heightChange="tipHeightChange"
          @delFilter="delFilter"
          @clear="clearFilters"
          @refresh="_search"
        />
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
                  <span> {{ row[column.property] }} </span>
                </template>
              </el-table-column>
            </template>
            <el-table-column :width="100" align="left" header-align="left" fixed="right">
              <template #header>
                <span>操作</span>
              </template>
              <template v-slot="{ row }">
                <span v-if="row.commandStatus" class="action-btn" @click="_action('view', row)">查看</span>
                <span v-else class="action-btn" @click="_action('feedback',row)">反馈</span>
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
      :visible.sync="dialogVisible"
      :editingdata="dialogData"
      :mode="dialogType"
      @update="_search"
    />
  </div>
</template>

<script>
import pageMixin from '@/mixin/pageMixin'
import searchMixin from '@/mixin/searchMixin'
import cmDialog from './cmDialog'
import search from './search'
import moduleSrv from '@/api/dispatchWhh'
import { SUCCESS_CODE } from '@/constants'
import { mapGetters } from 'vuex'

export default {
  name: 'InstructAccpet',
  components: {
    search,
    cmDialog
  },
  mixins: [pageMixin, searchMixin],
  data() {
    return {
      dialogVisible: false,
      dialogType: '',
      dialogData: {},
      tableColumn: [
        {
          prop: 'title',
          label: '指令标题',
          visible: true,
          minWidth: 150
        },
        {
          prop: 'sendUserName',
          label: '发起人',
          visible: true,
          minWidth: 150
        },
        {
          prop: 'commandTime',
          label: '下发时间',
          visible: true,
          minWidth: 90
        },
        {
          prop: 'commandStatus',
          label: '指令状态',
          visible: true,
          minWidth: 120
        },
        {
          prop: 'content',
          label: '指令内容',
          visible: true,
          minWidth: 120
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['profile'])
  },
  created() {
    setTimeout(async() => {
      await this.$nextTick()
      this.$refs?.searchRef?.searchList()
    }, 10)
  },
  methods: {
    // 自定义序号
    indexMethod(index) {
      return index + 1 > 9 ? index + 1 : `${index + 1}`
    },
    _search() {
      const { pageNum = 1, pageSize = 10 } = this.page
      const params = {
        userId: this.profile.id,
        pageNum,
        pageSize,
        ...this.searchParams
      }
      this.loading = true
      moduleSrv
        .postReceive(params)
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
    _action(action, row) {
      switch (action) {
        case 'view':
        case 'feedback':
          this.dialogVisible = true
          this.dialogType = action
          this.dialogData = row || {}
          break

        default:
          break
      }
    },
    // 表格内容格式化
    _formatter(row, column, cellValue) {
      if (column.property === 'commandStatus') {
        return row.commandStatus ? '已反馈' : '待反馈'
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
