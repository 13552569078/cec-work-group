<template>
  <search
    v-if="searchFilterItems.length"
    :search-items="searchFilterItems"
    :has-simple="!noSimpleMode"
    @search="searchList"
    @reset="_reset"
  />
</template>
<script>

import { setDefaultTimeRange } from '@/utils/index'
import search from '@/components/Search'
import paramsMixin from '@/mixin/paramsMixin'
import speTypeMixin from '@/mixin/speTypeMixin'

export default {
  name: 'InspectorSearch',
  components: {
    search
  },
  mixins: [speTypeMixin, paramsMixin],
  data() {
    return {
      searchFilterItems: [] // 搜索条件
    }
  },
  computed: {
    // 是否有简易模式
    noSimpleMode() {
      const arr = ['/inspector/settle', '/inspector/feedback']
      return arr.includes(this.$route.path)
    },
    eventSourceOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('event_origin')
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
    // 是否发起督办
    superviseFlagOptions() {
      return this.$store.getters.getBsDictsByType('superviseFlag')
    }
  },
  watch: {
    eventSourceOptions: {
      deep: true,
      handler(val) {
        if (val) {
          // 对下拉数据进行更新赋值
          const currentItem = this.searchFilterItems.filter(item => item.labelKey === 'eventSrcId')
          // eventUrgentOptions
          const eventUrgentItem = this.searchFilterItems.filter(item => item.labelKey === 'eventUrgent')
          // eventStateOptions
          const eventStateItem = this.searchFilterItems.filter(item => item.labelKey === 'eventState')
          // eventOverTimeOptions
          const eventOverTimeItem = this.searchFilterItems.filter(item => item.labelKey === 'overtimeFlag')
          this.$nextTick(() => {
            currentItem.length && this.$set(currentItem[0], 'options', val)
            eventUrgentItem.length && this.$set(eventUrgentItem[0], 'options', this.eventUrgentOptions)
            eventStateItem.length && this.$set(eventStateItem[0], 'options', this.eventStateOptions)
            eventOverTimeItem.length && this.$set(eventOverTimeItem[0], 'options', this.eventOverTimeOptions)
          })
        }
      }
    }
  },
  created() {
    this.initSearchItems()
  },
  methods: {
    initSearchItems() {
      this.$nextTick(() => {
        // 区分督办单、我的督办、待反馈条件
        const _route = this.$route.path
        if (_route.indexOf('/inspector/list') > -1) { // 督办单，全
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
              type: 'eventCascader', // 事件类型级联
              label: '事件类型',
              options: [],
              eventTypeLId: '',
              eventTypeMId: '',
              eventTypeId: '',
              nodeName: '',
              defaultValue: '',
              placeholder: '请选择'
            },
            {
              type: 'select',
              label: '紧急程度',
              labelKey: 'eventUrgent',
              options: this.eventUrgentOptions,
              value: '',
              defaultValue: '',
              placeholder: '请选择'
            },
            {
              type: 'input',
              label: '事件编号',
              labelKey: 'eventCode',
              options: [],
              value: '',
              defaultValue: '',
              placeholder: '请输入内容'
            },
            {
              type: 'select',
              label: '处理状态',
              labelKey: 'eventState',
              options: this.eventStateOptions,
              value: '',
              defaultValue: '',
              placeholder: '请选择',
              hidden: this.isShowEventState
            },
            {
              type: 'select',
              label: '是否督办',
              labelKey: 'superviseFlag',
              options: this.superviseFlagOptions,
              value: '',
              defaultValue: '',
              placeholder: '请选择',
              hidden: this.isShowEventState
            },
            {
              type: 'select',
              label: '超时状态',
              labelKey: 'overtimeFlag',
              options: this.eventOverTimeOptions,
              value: '',
              defaultValue: '',
              placeholder: '请选择',
              hidden: this.isShowOverTime
            },
            {
              type: 'date',
              timeType: 'daterange',
              label: '督办时间',
              labelKey: 'dateRange',
              options: [],
              value: setDefaultTimeRange(),
              defaultValue: setDefaultTimeRange(),
              placeholder: ''
            }
          ]
        } else { // 待反馈、我的督办：督办编号、事件编号、督办主题、督办时间
          this.searchFilterItems = [
            {
              type: 'input',
              label: '督办编号',
              labelKey: 'superviseCode',
              options: [],
              value: '',
              defaultValue: '',
              placeholder: '请输入内容'
            },
            {
              type: 'input',
              label: '事件编号',
              labelKey: 'eventCode',
              options: [],
              value: '',
              defaultValue: '',
              placeholder: '请输入内容'
            },
            {
              type: 'input',
              label: '督办主题',
              labelKey: 'superviseTitle',
              options: [],
              value: '',
              defaultValue: '',
              placeholder: '请输入内容'
            },
            {
              type: 'date',
              timeType: 'daterange',
              label: '督办时间',
              labelKey: 'dateRange',
              options: [],
              value: setDefaultTimeRange(),
              defaultValue: setDefaultTimeRange(),
              placeholder: ''
            }
          ]
        }
      })
    }
  }
}
</script>
