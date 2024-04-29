<!--
 * @description 事件管理-事件调度、事件处理、事件结案、事件审查列表页面信息差距不大，对其进行封装
 * @date 2020-08-21
 * @author lism
-->
<template>
  <common-page-list has-footer class="common-page-list">
    <!-- 默认通用，可以进行定制化 -->
    <search-form
      slot="search"
      ref="searchRef"
      :hidden-search-list="hiddenSearchList"
      :page-type="eventType"
      @searchList="dealwithFilter"
      @reset="clearFilters"
    />
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
        @refresh="_search"
      >
        <slot name="button" />
      </search-tips>
      <div v-loading="loading" class="result-list" :style="resultStyle">
        <el-table
          ref="tableHeight"
          :data="tranformData"
          style="width: 100%"
          class="table"
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
              :key="index"
              :label="item.label"
              :prop="item.prop"
              :width="item.width"
              :min-width="item.minWidth"
              show-overflow-tooltip
            >
              <!-- 对事件处理状态特殊处理，给不同的状态不同的标记 -->
              <template v-if="item.prop === 'eventStateText'" v-slot="{ row }">
                <span :class="`${_tranfromState(row)}-wrapper`">
                  <svg-icon :icon-class="_tranfromState(row)" />
                  {{ row.eventStateText }}
                </span>
              </template>
              <!-- 草稿状态 -->
              <template v-else-if="item.prop === 'invalidStateText'" v-slot="{ row }">
                <span :class="`${_tranfromState(row)}-wrapper`">
                  <svg-icon :icon-class="_tranfromState(row)" />
                  {{ row.invalidStateText }}
                </span>
              </template>
              <!-- 对事件处理状态特殊处理，给不同的状态不同的标记 -->
              <template v-else-if="item.prop === 'applyType'" v-slot="{ row }">
                <span>
                  {{ row.applyType === 1 ? "申请延期" : "申请驳回" }}
                </span>
              </template>
              <!-- 对是否超时，给不同的状态不同的标记 -->
              <template v-else-if="item.prop === 'taskLeftTime'" v-slot="{ row }">
                <span :style="getTaskLeftStyle(row.taskLeftTime)">
                  {{ row.taskLeftTime || "--" }}
                </span>
              </template>
              <!--  -->
              <template v-else v-slot="{ row }">
                <span :class="row.customizeClass">
                  {{ row[item.prop] || "--" }}
                </span>
              </template>
            </el-table-column>
          </template>
          <el-table-column
            :width="actionWidth"
            fixed="right"
            class-name="table-column-action"
          >
            <template v-slot:header>
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
import SearchForm from './SearchForm.vue'
import pageMixin from '@/mixin/pageMixin'
import searchMixin from '@/mixin/searchMixin'
import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'
import { SPECIAL_EVENTTYPE, EVENTTYPE_COLUMN } from './eventListConstant'
// 置顶参数特殊处理
const topConfigKeys = [
  'eventSrcIdDesc',
  'eventTypeLIdDesc',
  'eventTypeMIdDesc',
  'eventTypeIdDesc'
]
const topConfigKeysMap = {
  eventSrcIdDesc: 'eventSrcId',
  eventTypeLIdDesc: 'eventTypeLId',
  eventTypeMIdDesc: 'eventTypeMId',
  eventTypeIdDesc: 'eventTypeId'
}

export default {
  name: 'EventCommonList',
  components: {
    SearchForm
  },
  mixins: [pageMixin, searchMixin],
  props: {
    eventState: {
      type: String,
      default: '' // 可以通过状态查询
    },
    eventType: {
      type: String,
      default: ''
    },
    actionWidth: {
      type: [String, Number],
      default: 70
    },
    showTipsBtn: {
      type: Boolean,
      default: false
    },
    hiddenSearchList: {
      // 隐藏的搜索条件集合
      type: Array,
      default: () => []
    },
    hiddenColumnsList: {
      // 隐藏的展示列集合
      type: Array,
      default: () => []
    }
  },
  doNotInit: true,
  computed: {
    eventSourceOptionsMap() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const platform = this.$store.getters.getBsDictsByType('event_origin')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    eventUrgentOptionsMap() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const platform = this.$store.getters.getBsDictsByType('event_urgent_level')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    eventStateOptionsMap() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const platform = this.$store.getters.getBsDictsByType('event_state')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    eventOverTimeOptionsMap() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const platform = this.$store.getters.getBsDictsByType('overtime_flag')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    invalidStateOptionsMap() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const platform = this.$store.getters.getBsDictsByType('invalid_flag')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    /**
     * 置顶配置，默认 null,有数据则原样传入
     * @returns {null|[string, unknown]}
     */
    customizeTopConfig() {
      if (this.eventType === 'todo') {
        return Object.entries(this.$store.state.dispatch.customizeTopConfig).reduce(
          (prev, [key, value]) => {
            prev = prev || {}
            value && (prev[key] = value)
            return prev
          },
          null
        )
      }
      return null
    },
    tranformData() {
      return this.dataList
        .map((item) => {
          item.sourceText = this.eventSourceOptionsMap.get(item.eventSrcId) || '--'
          item.urgentText = this.eventUrgentOptionsMap.get(item.eventUrgent) || '--'
          item.eventStateText = this.eventStateOptionsMap.get(item.eventState) || '--'
          item.overtimeText = this.eventOverTimeOptionsMap.get(item.overtimeFlag) || '--'
          item.invalidStateText = this.invalidStateOptionsMap.get(item.invalidState) || '--'
          // 把事件大、中、小类组合
          item.eventTypeText = `${item.eventTypeLName}/${item.eventTypeMNAME}/${item.eventTypeName}`
          // 默认，置顶：false
          item.isTop = false
          if (this.customizeTopConfig) {
            const {
              fontBold = undefined,
              fontColor = undefined
            } = this.customizeTopConfig
            // 置顶的参数需要全部为真，通过keysMap转换得到item中的_key,_value
            item.isTop = Object.entries(this.customizeTopConfig).reduce(
              (prev, [key, value]) => {
                if (topConfigKeys.includes(key)) {
                  const _key = topConfigKeysMap[key]
                  const _value = item[_key]
                  return prev && value === _value
                }
                return prev
              },
              true
            )
            // 默认置顶class
            item.customizeClass = ''
            item.isTop &&
              fontBold &&
              (item.customizeClass += fontBold === '1' ? ' bold' : '')
            item.isTop && fontColor && (item.customizeClass += ` ${fontColor}`)
          }
          return item
        })
        .sort((a, b) => {
          return b.isTop - a.isTop
        })
    },
    columns() {
      if (this.eventType && SPECIAL_EVENTTYPE.indexOf(this.eventType) > -1) {
        return EVENTTYPE_COLUMN[this.eventType]
      } else {
        let arr = [
          {
            prop: 'eventCode',
            label: '事件编号',
            visible: true,
            minWidth: 150,
            hidden: this.hiddenColumnsList.includes('eventCode')
          },
          {
            prop: 'sourceText',
            label: '事件来源',
            visible: true,
            minWidth: 150,
            hidden: this.hiddenColumnsList.includes('sourceText')
          },
          {
            prop: 'eventTypeText',
            label: '事件类型',
            visible: true,
            minWidth: 180,
            hidden: this.hiddenColumnsList.includes('eventTypeText')
          },
          {
            prop: 'urgentText',
            label: '紧急程度',
            visible: true,
            minWidth: 100,
            hidden: this.hiddenColumnsList.includes('urgentText')
          },
          {
            prop: 'eventDesc',
            label: '事件描述',
            visible: true,
            minWidth: 130,
            hidden: this.hiddenColumnsList.includes('eventDesc')
          },
          {
            prop: 'eventStateText',
            label: this.eventType === 'draft' ? '草稿状态' : '处理状态',
            visible: true,
            minWidth: 100,
            hidden: this.hiddenColumnsList.includes('eventStateText')
          },
          // {
          //   prop: 'invalidStateText',
          //   label: '作废类型',
          //   minWidth: 100,
          //   hidden: this.hiddenColumnsList.includes('invalidState')
          // },
          {
            prop: 'reporterName',
            label: this.eventType === 'approve1' ? '申请人' : '上报人',
            visible: true,
            minWidth: 110,
            hidden: this.hiddenColumnsList.includes('reporterName')
          },
          {
            prop: 'reporterMobile',
            label: this.eventType === 'approve1' ? '申请人联系方式' : '联系方式',
            visible: true,
            minWidth: 140,
            hidden: this.hiddenColumnsList.includes('reporterMobile')
          },
          {
            prop: 'happenTime',
            label: '发生时间',
            visible: true,
            minWidth: 180,
            hidden: this.hiddenColumnsList.includes('happenTime')
          },
          {
            prop: 'applyType',
            label: '审批类型',
            visible: true,
            minWidth: 120,
            hidden: this.hiddenColumnsList.includes('applyType')
          },
          // 新增吹哨级别，只有吹哨事件查询才可以看到
          {
            prop: 'whistleLevel',
            label: '吹哨级别',
            visible: false,
            minWidth: 120,
            hidden: this.hiddenColumnsList.includes('whistleLevel')
          },
          {
            prop: 'taskLeftTime',
            label: '是否超时',
            visible: true,
            minWidth: 180,
            hidden: this.hiddenColumnsList.includes('taskLeftTime')
          },
          {
            prop: 'limitTimeDesc',
            label: '处置时限',
            visible: true,
            minWidth: 100,
            hidden: this.hiddenColumnsList.includes('limitTimeDesc')
          },
          {
            prop: 'endTime',
            label: '截止时间',
            visible: true,
            minWidth: 180,
            hidden: this.hiddenColumnsList.includes('endTime')
          }
        ]

        arr = arr.filter((item) => !item.hidden)

        // 统一待办，高亮置顶配置
        if (this.eventType === 'todo') {
          arr = arr.filter(
            (v) => this.$store.state.dispatch.customizeTableConfig.indexOf(v.prop) > -1
          )
        }
        return arr
      }
    }
  },

  methods: {
    // 列表搜索接口
    async _search() {
      await this.$nextTick()
      const { pageNum = 1, pageSize = 10 } = this.page
      const params = {
        pageNum,
        pageSize,
        ...this.searchParams
      }
      const fnMap = {
        query: 'getEventList',
        cgHistory: 'getEventHisList',
        verify: 'getTodoList',
        approve: 'getTodoList',
        handle: 'getTodoList',
        dispatch: 'getTodoList',
        approve1: 'getApplyList',
        typeIn: 'getWaitEventList',
        filter: 'getFilterEventList',
        todo: 'getTodoList',
        draft: 'getDraftList',
        workHandle: 'getPassList',
        workAssist: 'getAssistList',
        workNotify: 'getNotifyList',
        workWhistle: 'getWhistleListNew'
      }
      // 特殊处理 taskNode 参数, 审核、结案
      const hasTaskNodeKey = ['verify', 'approve', 'handle', 'dispatch']

      if (hasTaskNodeKey.includes(this.eventType)) {
        params.taskNodeKey = this.eventType
      }
      // 特殊处理 置顶参数
      if (this.customizeTopConfig) { topConfigKeys.forEach((key) => (params[key] = this.customizeTopConfig[key])) }
      this.loading = true
      const res = await moduleSrv[fnMap[this.eventType]](params).finally(() => {
        this.loading = false
      })
      if (res.code === SUCCESS_CODE) {
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
      if (['0', '1', '2', '4', '8'].includes(state)) {
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
    // 超时样式
    getTaskLeftStyle(time) {
      if (!time) return {}
      let color = '#36a4ff'
      let bgColor = 'rgba(54,164,255,0.1)'
      if (time.indexOf('超时') > -1) {
        color = '#FF4D4F'
        bgColor = 'rgba(255,77,79,0.1)'
      } else if (time.indexOf('剩余') > -1) {
        color = '#4CC09E'
        bgColor = 'rgba(76,192,158,0.1)'
      }
      return {
        background: bgColor,
        borderRadius: '2px',
        border: `1px solid ${color}`,
        fontSize: '12px',
        color,
        padding: '0 4px'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.common-page-list {
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
  // 表格置顶高亮
  .table {
    ::v-deep {
      .el-table__empty-block {
        min-height: 200px;
      }
      .el-table__body {
        .el-table__row {
          td {
            .cell {
              .red {
                color: #ff4d4f;
              }

              .blue {
                color: #36a4ff;
              }

              .bold {
                font-weight: bold;
              }
            }
          }
        }
      }
    }
  }
}
</style>
