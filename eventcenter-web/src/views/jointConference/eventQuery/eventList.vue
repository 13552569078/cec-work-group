<template>
  <common-page-list has-footer class="common-page-list">
    <search-form slot="search" ref="searchRef" :default-mode="defaultMode" @searchList="dealwithFilter" @reset="clearFilters" />
    <div slot="content" class="result-content">
      <search-tips
        ref="searchTips"
        :total="page.total"
        show-search-items
        :show-actions="$slots.button"
        :search-items="filterTips"
        :select-count="selectCount"
        @heightChange="tipHeightChange"
        @delFilter="delFilter"
        @clear="clearFilters"
      >
        <slot name="button" />
      </search-tips>
      <div v-loading="loading" class="result-list" :style="resultStyle">
        <el-table
          ref="tableHeight"
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
          <template v-for="(item, index) in columns">
            <el-table-column
              v-if="item.prop === 'eventStateText'"
              :key="index"
              :label="item.label"
              :prop="item.prop"
              :width="item.width"
              show-overflow-tooltip
            >
              <!-- 对事件处理状态特殊处理，给不同的状态不同的标记 -->
              <template v-slot="{ row }">
                <span :class="`${_tranfromState(row)}-wrapper`">
                  <svg-icon :icon-class="_tranfromState(row)" />
                  {{ row.eventStateText }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              v-else-if="item.prop === 'eventUrgent'"
              :key="index"
              :label="item.label"
              :prop="item.prop"
              :width="item.width"
              show-overflow-tooltip
            >
              <!-- 对事件处理状态特殊处理，给不同的状态不同的标记 -->
              <template v-slot="{ row }">
                <span>
                  {{ row.applyType === 1 ? '一般' : '紧急' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              v-else-if="item.prop === 'hasStartMeeting'"
              :key="index"
              :label="item.label"
              :prop="item.prop"
              :width="item.width"
              show-overflow-tooltip
            >
              <!-- 对事件处理状态特殊处理，给不同的状态不同的标记 -->
              <template v-slot="{ row }">
                <span>
                  {{ row.hasStartMeeting === 1 ? '是' : '否' }}
                </span>
              </template>
            </el-table-column>

            <el-table-column
              v-else
              :key="index"
              :label="item.label"
              :prop="item.prop"
              :width="item.width"
              show-overflow-tooltip
              :formatter="_formatter"
            />
          </template>
          <el-table-column
            width="180"
            align="left"
            header-align="left"
            fixed="right"
          >
            <template #header>
              <span>操作</span>
            </template>
            <template v-slot="{ row }">
              <!-- 插槽传数据给父级，父级需要用 template 接收 -->
              <slot :row="row" />
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
</template>

<script>
import SearchForm from './eventSearchForm.vue'
import pageMixin from '@/mixin/pageMixin'
import searchMixin from '@/mixin/searchMixin'
import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'EventCommonList',
  components: {
    SearchForm
  },
  mixins: [pageMixin, searchMixin],
  props: {
    eventType: {
      type: String,
      default: ''
    },
    actionWidth: {
      type: [String, Number],
      default: 80
    },
    showTipsBtn: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableColumn: [
        {
          prop: 'eventCode',
          label: '事件编号',
          visible: true,
          width: 150
        },
        {
          prop: 'platformSrcText',
          label: '平台来源',
          visible: true,
          width: 140
        },
        {
          prop: 'sourceText',
          label: '事件来源',
          visible: true,
          width: 150
        },
        {
          prop: 'eventTypeText',
          label: '事件类型',
          visible: true,
          width: 100
        },
        {
          prop: 'eventUrgent',
          label: '紧急程度',
          visible: true,
          width: 100
        },
        {
          prop: 'eventStateText',
          label: '事件状态',
          visible: true,
          width: 130
        },
        {
          prop: 'reporterName',
          label: '上报人',
          visible: true,
          width: 100
        },
        {
          prop: 'reporterMobile',
          label: '联系方式',
          visible: true,
          width: 150
        },
        {
          prop: 'hasStartMeeting',
          label: '是否发起会议',
          visible: true,
          width: 130
        },
        {
          prop: 'createTime',
          label: '事件时间',
          visible: true,
          width: 180
        }
      ],
      defaultMode: 1,
      hasSimple: true
    }
  },
  computed: {
    platformSrcOptions() {
      const platform = this.$store.getters.getBsDictsByType('event_platform')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    eventSourceOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const platform = this.$store.getters.getBsDictsByType('event_origin')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    eventUrgentOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const platform = this.$store.getters.getBsDictsByType('event_urgent_level')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    eventStateOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const platform = this.$store.getters.getBsDictsByType('event_state')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    eventOverTimeOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const platform = this.$store.getters.getBsDictsByType('overtime_flag')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    tranformData() {
      return this.dataList.map((item) => {
        item.platformSrcText = this.platformSrcOptions.get(item.platformSrc)
        item.sourceText = this.eventSourceOptions.get(item.eventSrcId)
        item.urgentText = this.eventUrgentOptions.get(item.eventUrgent)
        item.eventStateText = this.eventStateOptions.get(item.eventState)
        item.overtimeText = this.eventOverTimeOptions.get(item.overtimeFlag)
        // 把事件大、中、小类组合
        item.eventTypeText = `${item.eventTypeLName}/${item.eventTypeMNAME}/${item.eventTypeName}`
        if (item.eventTypeIdFourName) {
          item.eventTypeText += `/${item.eventTypeIdFourName}`
        }
        if (item.eventTypeIdFiveName) {
          item.eventTypeText += `/${item.eventTypeIdFiveName}`
        }
        return item
      })
    },
    columns() {
      // 截止时间，只有部分页面显示
      // 包含：事件处理、事件查询、事件审批、待办事件
      const whiteList = [
        'event/query',
        'event/cgHistory',
        'event/handle',
        'event/approval',
        'workbench/todo'
      ]
      // 吹哨事件查询，展示吹哨级别
      if (this.$route.path.indexOf('workbench/whistle') > -1) {
        this.tableColumn.forEach(item => {
          if (item.prop === 'whistleLevel') {
            item.visible = true
          }
        })
      }
      let arr = this.tableColumn.filter((item) => item.visible)
      const showEndTime = whiteList.some(
        (item) => this.$route.path.indexOf(item) > -1
      )
      if (showEndTime) {
        arr.push({
          prop: 'endTime',
          label: '截止时间',
          width: 150
        })
      }
      if (this.$route.path.indexOf('event/approval') > -1) {
        arr.push({
          prop: 'applyType',
          label: '审批类型',
          width: 80
        })
        // 审批管理页面，上报人-->申请人， 联系方式--> 申请人联系方式
        arr = arr.map((item) => {
          if (item.prop === 'reporterName') {
            item.label = '申请人'
          }
          if (item.prop === 'reporterMobile') {
            item.label = '申请人联系方式'
          }
          return item
        })
      }
      return arr
    }
  },
  mounted() {
    if (this.eventType === 'cgHistory') {
      this.defaultMode = 2
      this.hasSimple = false
    }
  },

  methods: {
    // 列表搜索接口
    async _search() {
      const { pageNum = 1, pageSize = 10 } = this.page
      const params = {
        pageNum,
        pageSize,
        ...this.searchParams,
        hasUpdMeetingStatus: 1,
        eventState: 3
      }
      const res = await moduleSrv['getEventList'](params)
      if (res.code === SUCCESS_CODE) {
        // console.log('res===', res)
        const { list = [], total = 0 } = res.data
        this.dataList = list
        this.page.total = total
      }
    },

    // 自定义序号
    indexMethod(index) {
      return index + 1 > 9 ? index + 1 : `${index + 1}`
    },
    // 批量事件状态，给予不同的状态不同的标记
    _tranfromState(row) {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.common-page-list {
  .result-content {
    height: 100%;
    .result-list {
      overflow-y: auto;
    }
    @extend %event_content_flex;
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
}
</style>
