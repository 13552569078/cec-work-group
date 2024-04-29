<template>
  <div class="page-wrapper">
    <common-page-list has-footer>
      <search
        v-if="thirdSystemList.length"
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
                v-if="item.prop === 'eventStateText'"
                :key="index"
                :label="item.label"
                :prop="item.prop"
                :width="item.width"
                :min-width="item.minWidth"
                show-overflow-tooltip
              >
                <!-- 对事件处理状态特殊处理，给不同的状态不同的标记 -->
                <template v-slot="{ row }">
                  <span :class="`${_tranfromEventState(row)}-wrapper`">
                    <svg-icon :icon-class="_tranfromEventState(row)" />
                    {{ row.eventStateText }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                v-else-if="item.prop === 'eventThirdStateName'"
                :key="index"
                :label="item.label"
                :prop="item.prop"
                :width="item.width"
                :min-width="item.minWidth"
                show-overflow-tooltip
              >
                <!-- 对事件处理状态特殊处理，给不同的状态不同的标记 -->
                <template v-slot="{ row }">
                  <span :class="`${_tranfromEventThirdState(row)}-wrapper`">
                    <svg-icon :icon-class="_tranfromEventThirdState(row)" />
                    {{ row.eventThirdStateName }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                v-else
                :key="index"
                :label="item.label"
                :prop="item.prop"
                :width="item.width"
                :min-width="item.minWidth"
                show-overflow-tooltip
                :formatter="_formatter"
              />
            </template>
            <el-table-column
              :width="210"
              fixed="right"
              class-name="table-column-action"
            >
              <template #header>
                <span>操作</span>
              </template>
              <template v-slot="{row}">
                <span class="action-group">
                  <span class="action-btn" @click="_handle_action('view', row)">查看详情</span>
                  <span class="action-divider">|</span>
                  <span class="action-btn" :class="{ 'is-disabled': row.evaluateFlag !== '1' }" @click="_action('appraise',row)">评价</span>
                  <span class="action-divider">|</span>
                  <span class="action-btn" :class="{ 'is-disabled': row.evaluateFlag === '1' }" @click="_action('view',row)">查看评价</span>
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
    />
  </div>
</template>

<script>
import pageMixin from '@/mixin/page.mixin'
import searchMixin from '@/mixin/searchMixin'
import cmDialog from './cmDialog'
import search from './search'
import moduleSrv from '@/api/dispatchWhh'
import { SUCCESS_CODE } from '@/constants'
import thirdSystemMixin from '@/mixin/thirdSystemMixin'

export default {
  name: 'Appraise',
  components: {
    search,
    cmDialog
  },
  mixins: [pageMixin, searchMixin, thirdSystemMixin],
  data() {
    return {
      dialogVisible: false,
      digType: '',
      digData: {},
      tableColumn: [
        {
          prop: 'eventCode',
          label: '事件编码',
          visible: true,
          minWidth: 180
        },
        {
          prop: 'title',
          label: '事件标题',
          visible: true,
          minWidth: 180
        },
        {
          prop: 'platformSrcName',
          label: '来源系统',
          visible: true,
          minWidth: 120
        },
        {
          prop: 'sourceText',
          label: '事件来源',
          visible: true,
          minWidth: 120
        },
        {
          prop: 'eventTypeText',
          label: '事件类型',
          visible: true,
          minWidth: 280
        },
        {
          prop: 'urgentText',
          label: '严重程度',
          visible: true,
          minWidth: 100
        },
        {
          prop: 'eventStateText',
          label: '事件状态',
          visible: true,
          minWidth: 100
        },
        {
          prop: 'reporterName',
          label: '上报人',
          visible: true,
          minWidth: 110
        },
        {
          prop: 'reporterMobile',
          label: '联系方式',
          visible: true,
          minWidth: 140
        },
        {
          prop: 'happenTime',
          label: '上报时间',
          visible: true,
          minWidth: 180
        },
        {
          prop: 'evaluateFlagName',
          label: '评价状态',
          visible: true,
          minWidth: 150
        }
      ]
    }
  },
  computed: {
    eventSourceOptionsMap() {
      const platform = this.$store.getters.getBsDictsByType('event_origin')
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
    },
    replyStateMapOptionsMap() {
      const platform = this.$store.getters.getBsDictsByType('reply_state')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    eventStateOptionsMap() {
      const platform = this.$store.getters.getBsDictsByType('event_state')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    tranformData() {
      return this.dataList.map((item) => {
        item.sourceText = this.eventSourceOptionsMap.get(item.eventSrcId)
        item.urgentText = this.eventUrgentOptionsMap.get(item.eventUrgent)
        item.eventStateText = this.eventStateOptionsMap.get(item.eventState)
        // 把事件大、中、小类组合
        item.eventTypeText = `${item.eventTypeLName}/${item.eventTypeMNAME}/${item.eventTypeName}`
        return item
      })
    }
  },
  mounted() {
    // this._search()
  },
  methods: {
    // 操作处理
    _handle_action(action, row) {
      this.$router.push({
        path: '/event/type-in/info',
        query: {
          taskId: row.taskId,
          id: row.id,
          refresh: true,
          formSource: 'evaluate'
        }
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
      moduleSrv.getEventEvaluatePage(params).then((res) => {
        const { list = [], total = 0 } = res.data
        if (res.code === SUCCESS_CODE) {
          this.dataList = list
          this.page.total = total
        }
      }).finally(() => {
        this.loading = false
      })
    },
    async viewInfo(action, row) {
      this.digType = action
      const params = {
        eventId: row.id
      }
      if (this.digType === 'edit') {
        const res = await moduleSrv.getEvaluateModelByEventCode(params)
        if (res.code === SUCCESS_CODE) {
          this.digData = Object.assign({ eventInfo: row }, { evaluateList: res.data })
          this.dialogVisible = true
        }
      } else {
        const res = await moduleSrv.getEvaluateResultByEventCode(params)
        if (res.code === SUCCESS_CODE) {
          this.digData = Object.assign({ eventInfo: row }, { evaluateList: res.data })
          this.dialogVisible = true
        }
      }
    },
    _action(action, row) {
      switch (action) {
        case 'view':
          this.viewInfo('view', row)
          break
        case 'appraise':
          this.viewInfo('edit', row)
          break
        case 'config':
          this.$router.push('/strategy-config/appraise-module')
          break

        default:
          break
      }
    },
    // 批量事件状态，给予不同的状态不同的标记
    _tranfromEventState(row) {
      const state = row.eventState || '0'
      if (['0', '1', '2', '4'].includes(state)) {
        // 待XXX
        return 'svg-warn'
      } else if (['3'].includes(state)) {
        // 待处理，为处理中的颜色
        return 'svg-handle'
      } else if (['5'].includes(state)) {
        // 办结
        return 'svg-success'
      } else if (['7'].includes(state)) {
        // 驳回
        return 'svg-error'
      } else if (['6'].includes(state)) {
        // 作废
        return 'svg-grey'
      } else {
        return 'svg-grey'
      }
    },
    _tranfromEventThirdState(row) {
      const state = row.eventThirdState || '0'
      if (['1', '2'].includes(state)) {
        // 待XXX
        return 'svg-warn'
      } else if (['3'].includes(state)) {
        // 待处理，为处理中的颜色
        return 'svg-handle'
      } else if (['4', '6'].includes(state)) {
        // 办结
        return 'svg-success'
      } else if (['5', '7', '8'].includes(state)) {
        // 驳回
        return 'svg-error'
      } else {
        return 'svg-grey'
      }
    }
  }
}
</script>

<style scoped lang="scss">
.page-wrapper {
  height: 100%;
  @include resultContent;
  .svg-success-wrapper {
      color: $success;
    }
    .svg-handle-wrapper {
      color: $primaryColor;
    }
    .svg-warn-wrapper {
      color: $warn;
    }
    .svg-error-wrapper {
      color: $error;
    }
    .svg-grey-wrapper {
      color: $defaultGrey;
    }
}
</style>
