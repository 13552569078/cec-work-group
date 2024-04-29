<template>
  <search
    v-if="searchFilterItems.length"
    :search-items="searchFilterItems"
    @search="searchList"
    @reset="_reset"
  />
</template>
<script>
import search from '@/components/Search'
import paramsMixin from '@/mixin/paramsMixin'
import speTypeMixin from '@/mixin/speTypeMixin'
import { SPECIAL_EVENTTYPE } from './eventListConstant'

export default {
  name: 'EventSearch',
  components: {
    search
  },
  mixins: [speTypeMixin, paramsMixin],
  props: {
    pageType: {
      type: String,
      default: ''
    },
    hiddenSearchList: { // 隐藏的搜索条件集合
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchFilterItems: []
    }
  },
  computed: {
    // 如果是历史事件查询，则只要数郑历史、六要素历史、城管历史
    eventSourceOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const temp = this.$store.getters.getBsDictsByType('event_origin')
      return temp
      // return temp.filter(item => !['11', '12', '13'].includes(item.dictValue))
    },
    eventUrgentOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('event_urgent_level')
    },
    eventStateOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('event_state')
    },
    eventOverTimeOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('overtime_flag')
    },
    whistleLevelOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('white_num')
    },
    isEventQuery() {
      return this.pageType === 'query'
    },
    defaultEventState() {
      if (this.isShowEventState) {
        const eventStateList = this.$route.query.eventStateList
        return eventStateList || ''
      }
      return ''
    },
    eventUrgentLabel() {
      let title = '紧急程度'
      switch (this.pageType) {
        case 'filter':
        case 'approve1':
        case 'approve':
        case 'handle':
        case 'dispatch':
        case 'verify':
        case 'query':
        case 'workWhistle':
          title = '紧急程度'
          break
        case 'typeIn':
          title = '严重程度'
          break
        default:
          title = '事件紧急程度'
          break
      }
      return title
    }
  },
  watch: {
    eventUrgentOptions: {
      deep: true,
      handler(val) {
        // 事件来源
        const eventSrcId = this.searchFilterItems.find(item => item.labelKey === 'eventSrcId')
        eventSrcId && this.$set(eventSrcId, 'options', this.eventSourceOptions)

        // 紧急程度
        const eventUrgent = this.searchFilterItems.find(item => item.labelKey === 'eventUrgent')
        eventUrgent && this.$set(eventUrgent, 'options', this.eventUrgentOptions)

        // 事件状态
        const eventState = this.searchFilterItems.find(item => item.labelKey === 'eventState')
        eventState && this.$set(eventState, 'options', this.eventStateOptions)

        // 超时状态
        const overtimeFlag = this.searchFilterItems.find(item => item.labelKey === 'overtimeFlag')
        overtimeFlag && this.$set(overtimeFlag, 'options', this.eventOverTimeOptions)

        // 吹哨级别
        const whistleNum = this.searchFilterItems.find(item => item.labelKey === 'whistleNum')
        whistleNum && this.$set(whistleNum, 'options', this.whistleLevelOptions)
      }
    }
  },
  created() {
    this.initSearchItems()
  },
  methods: {
    async initSearchItems() {
      await this.$nextTick()
      // 2.3版本修改 else里的不破坏以前逻辑
      if (this.pageType && SPECIAL_EVENTTYPE.indexOf(this.pageType) > -1) {
        this.searchFilterItems = [
          {
            type: 'input',
            label: '事件编码',
            labelKey: 'eventCode',
            options: [],
            value: '',
            defaultValue: '',
            placeholder: '请输入内容'
          },
          {
            type: 'input',
            label: '事件标题',
            labelKey: 'title',
            options: [],
            value: '',
            defaultValue: '',
            placeholder: '请输入内容'
          },
          {
            type: 'eventCascader', // 事件类型级联
            label: '事件类型',
            labelKey: 'eventCascader',
            options: [],
            eventTypeLId: '',
            eventTypeMId: '',
            eventTypeId: '',
            nodeName: '',
            defaultValue: '',
            placeholder: '请选择'
          },
          // {
          //   type: 'select',
          //   label: this.eventUrgentLabel,
          //   labelKey: 'eventUrgent',
          //   options: this.eventUrgentOptions,
          //   value: '',
          //   defaultValue: '',
          //   placeholder: '请选择'
          // },
          {
            type: 'select',
            label: '事件状态',
            labelKey: 'eventState',
            options: this.eventStateOptions,
            value: this.defaultEventState,
            defaultValue: '',
            placeholder: '请选择'
          },
          {
            type: 'areaCascader', // 事件区域, 只有事件查询需要
            label: '发生地址',
            labelKey: 'areaCascader',
            options: [],
            option: {
              checkStrictly: true
            },
            gridId: '',
            defaultValue: '',
            nodeNames: [],
            levels: [],
            placeholder: '请选择'
          },
          {
            type: 'select',
            label: '是否超时',
            labelKey: 'overtimeFlag',
            options: this.eventOverTimeOptions,
            value: '',
            defaultValue: '',
            placeholder: '请选择'
          },
          {
            type: 'date',
            timeType: 'daterange',
            label: '发生时间',
            labelKey: 'dateRange',
            options: [],
            value: [],
            defaultValue: [],
            placeholder: ''
          }
        ]
      } else {
        this.searchFilterItems = [
          {
            type: 'select',
            label: '事件来源',
            labelKey: 'eventSrcId',
            options: this.eventSourceOptions,
            value: '',
            defaultValue: '',
            placeholder: '请选择'
          },
          {
            type: 'areaCascader', // 事件区域, 只有事件查询需要
            label: '发生地址',
            labelKey: 'areaCascader',
            options: [],
            option: {
              checkStrictly: true
            },
            gridId: '',
            defaultValue: '',
            nodeNames: [],
            levels: [],
            placeholder: '请选择',
            hidden: this.hiddenSearchList.includes('areaCascader')
          },
          {
            type: 'eventCascader', // 事件类型级联
            label: '事件类型',
            labelKey: 'eventCascader',
            options: [],
            eventTypeLId: '',
            eventTypeMId: '',
            eventTypeId: '',
            nodeName: '',
            defaultValue: '',
            placeholder: '请选择',
            hidden: this.hiddenSearchList.includes('eventCascader')
          },
          {
            type: 'select',
            label: this.eventUrgentLabel,
            labelKey: 'eventUrgent',
            options: this.eventUrgentOptions,
            value: '',
            defaultValue: '',
            placeholder: '请选择',
            hidden: this.hiddenSearchList.includes('eventUrgent')
          },
          {
            type: 'input',
            label: '事件编号',
            labelKey: 'eventCode',
            options: [],
            value: '',
            defaultValue: '',
            placeholder: '请输入内容',
            hidden: this.hiddenSearchList.includes('eventCode')
          },
          {
            type: 'input',
            label: ['filter', 'approve1', 'approve', 'handle', 'dispatch', 'verify', 'typeIn', 'query', 'workWhistle'].includes(this.pageType) ? '上报人' : '事件上报人',
            labelKey: 'reporterName',
            options: [],
            value: '',
            defaultValue: '',
            placeholder: '请输入内容',
            hidden: this.hiddenSearchList.includes('reporterName')
          },
          {
            type: 'select',
            label: this.isEventQuery ? '处理状态' : '事件状态',
            labelKey: 'eventState',
            options: this.eventStateOptions,
            value: this.defaultEventState,
            defaultValue: '',
            placeholder: '请输入内容',
            hidden: this.hiddenSearchList.includes('eventState')
          },
          {
            type: 'select',
            label: '超时状态',
            labelKey: 'overtimeFlag',
            options: this.eventOverTimeOptions,
            value: '',
            defaultValue: '',
            placeholder: '请输入内容',
            hidden: this.hiddenSearchList.includes('overtimeFlag')
          },
          {
            type: 'select',
            label: '吹哨级别',
            labelKey: 'whistleNum',
            options: this.whistleLevelOptions,
            value: '',
            defaultValue: '',
            placeholder: '请输入内容',
            hidden: this.hiddenSearchList.includes('whistleNum')
          },
          {
            type: 'date',
            timeType: 'daterange',
            label: '发生时间',
            labelKey: 'dateRange',
            options: [],
            value: [],
            defaultValue: [],
            placeholder: '',
            hidden: this.hiddenSearchList.includes('dateRange')
          },
          {
            type: 'input',
            label: '事件描述',
            labelKey: 'eventDesc',
            options: [],
            value: '',
            defaultValue: '',
            placeholder: '请输入',
            hidden: this.hiddenSearchList.includes('eventDesc')
          }
        ]
      }
    }
  }
}
</script>
