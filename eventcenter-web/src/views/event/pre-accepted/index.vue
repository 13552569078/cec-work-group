<!--
@Author: lism
@Description: 事件预受理
@Date: 2023-11-14
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
          :show-actions="false"
          :search-items="filterTips"
          :select-count="selectCount"
          @heightChange="tipHeightChange"
          @delFilter="delFilter"
          @clear="clearFilters"
          @refresh="_search"
        />
        <div v-loading="loading" class="result-list" :style="resultStyle">
          <el-table
            ref="tableRef"
            :data="tranformData"
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
                v-if="!item.slotName"
                :key="index"
                :label="item.label"
                :prop="item.prop"
                :width="item.width"
                :min-width="item.minWidth"
                show-overflow-tooltip
                :formatter="_formatter"
              />
              <el-table-column v-else-if="item.slotName === 'eventCode'" :key="'c' + index" :label="item.label" :min-width="item.minWidth">
                <template slot-scope="scope">
                  <div class="flex items-center">
                    <span style="margin-right: 5px">{{ scope.row.eventCode }}</span>
                    <el-popover v-if="scope.row.uuid" placement="top" popper-class="table-popper" trigger="hover">
                      <div>第三方事件编码：{{ scope.row.uuid }} <el-button type="text" class="primary-text" @click="handleCopy(scope.row.uuid)">复制</el-button></div>
                      <img slot="reference" class="icon-info" :src="IconInfo">
                    </el-popover>
                  </div>
                </template>
              </el-table-column>
              <el-table-column v-else-if="item.slotName === 'eventType'" :key="'e' + index" :label="item.label" :min-width="item.minWidth">
                <template slot-scope="scope">
                  <div class="flex items-center">
                    <span style="margin-right: 5px">{{ scope.row.eventTypeText }}</span>
                    <el-popover v-if="scope.row.thirdEventTypeName" placement="top" popper-class="table-popper" trigger="hover">
                      <div>第三方事件类型：{{ scope.row.thirdEventTypeName }} <el-button type="text" class="primary-text" @click="handleCopy(scope.row.thirdEventTypeName)">复制</el-button></div>
                      <img slot="reference" class="icon-info" :src="IconInfo">
                    </el-popover>
                  </div>
                </template>
              </el-table-column>
            </template>

            <el-table-column
              :width="70"
              fixed="right"
              class-name="table-column-action"
            >
              <template #header>
                <span>操作</span>
              </template>
              <template v-slot="{row}">
                <span class="action-btn" @click="_toDetail(row)">查看</span>
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
import pageMixin from '@/mixin/page.mixin'
import searchMixin from '@/mixin/searchMixin'
import search from './search'
import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'
import IconInfo from '@/assets/table/icon_info.png'

export default {
  name: 'PreAccepted',
  components: {
    search
  },
  mixins: [pageMixin, searchMixin],
  data() {
    return {
      IconInfo,
      tableColumn: [
        {
          prop: 'title',
          label: '事件标题',
          minWidth: 180
        },
        {
          prop: 'eventCode',
          label: '事件编码',
          minWidth: 170,
          slotName: 'eventCode'
        },
        {
          prop: 'eventTypeText',
          label: '事件类型',
          minWidth: 350,
          slotName: 'eventType'
        },
        {
          prop: 'platformSrcName',
          label: '来源系统',
          minWidth: 120
        },
        {
          prop: 'eventSrcIdName',
          label: '事件来源',
          minWidth: 120
        },
        {
          prop: 'eventUrgentName',
          label: '严重程度',
          visible: true,
          minWidth: 80
        },
        {
          prop: 'happenTime',
          label: '发生时间',
          visible: true,
          minWidth: 150
        },
        {
          prop: 'acceptStateName',
          label: '受理状态',
          visible: true,
          minWidth: 80
        }
      ]
    }
  },
  computed: {
    tranformData() {
      return this.dataList.map((item) => {
        item.eventTypeText = `${item.eventTypeMaxIdName || '-'}/${item.eventTypeMiddleIdName || '-'}/${item.eventTypeIdName || '-'}`
        if (item.eventTypeIdFourName) {
          item.eventTypeText += `/${item.eventTypeIdFourName}`
        }
        if (item.eventTypeIdFiveName) {
          item.eventTypeText += `/${item.eventTypeIdFiveName}`
        }
        item.eventTypeText = item.eventTypeText.replace(/\/\//, '')
        return item
      })
    }
  },
  methods: {
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
      moduleSrv.getEventPreList(params).then((res) => {
        const { list = [], total = 0 } = res.data
        if (res.code === SUCCESS_CODE) {
          this.dataList = list
          this.page.total = total
        }
      }).finally(() => {
        this.loading = false
      })
    },
    _toDetail(row) {
      this.$router.push({
        path: '/event/pre-accepted/info',
        query: {
          id: row.id
        }
      })
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
