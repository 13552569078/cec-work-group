<template>
  <search
    v-if="searchFilterItems.length"
    :search-items="searchFilterItems"
    :default-mode="defaultMode"
    @search="searchList"
    @reset="_reset"
  />
</template>
<script>
import search from '@/components/Search'
import paramsMixin from '@/mixin/paramsMixin'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'EventSearch',
  components: {
    search
  },
  mixins: [paramsMixin],
  props: {
    // 默认模式 1简易 2高级
    defaultMode: {
      type: Number,
      default: 1
    },
    // 是否有简易模式
    hasSimple: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      searchFilterItems: []
    }
  },
  computed: {
    ...mapGetters(['getAllEventTypes']),
    platformSrcOptions() {
      return this.$store.getters.getBsDictsByType('event_platform')
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
    whistleLevelOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('white_num')
    },
    // 是否已发起联席会议
    sendMeetingOptiosn() {
      return this.$store.getters.getMeetingDictsByType('has_start_meeting')
    },
    allEventTypesOptions() {
      return this.getAllEventTypes
    }
  },
  watch: {
    eventSourceOptions: {
      handler(val) {
        if (val) {
          // 对下拉数据进行更新赋值
          const currentItem = this.searchFilterItems.filter(item => item.labelKey === 'eventSrcId')
          this.initSearchItems()
          this.$nextTick(() => {
            // 对其他数据也进行重新赋值
            this.$set(currentItem[0], 'options', val)
          })
        }
      }
    },
    sendMeetingOptiosn: {
      handler(val) {
        if (val) {
          // 对下拉数据进行更新赋值
          const currentItem = this.searchFilterItems.filter(item => item.labelKey === 'hasStartMeeting')
          this.initSearchItems()
          this.$nextTick(() => {
            // 对其他数据也进行重新赋值
            this.$set(currentItem[0], 'options', val)
          })
        }
      }
    },
    platformSrcOptions: {
      handler(val) {
        if (val) {
          // 对下拉数据进行更新赋值
          // const currentItem = this.searchFilterItems.filter(item => item.labelKey === 'hasStartMeeting')
          this.initSearchItems()
        }
      }
    }
  },

  async created() {
    await this.getEventType()
    this.initSearchItems()
  },
  methods: {
    ...mapActions('dispatch', ['getEventType']),
    initSearchItems() {
      this.$nextTick(() => {
        this.searchFilterItems = [
          {
            type: 'select',
            label: '平台来源',
            labelKey: 'platformSrc',
            options: this.platformSrcOptions,
            value: '',
            defaultValue: '',
            placeholder: '请选择'
          },
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
            labelKey: 'eventCascader',
            options: this.allEventTypesOptions,
            eventTypeLId: '',
            eventTypeMId: '',
            eventTypeId: '',
            nodeName: '',
            defaultValue: '',
            placeholder: '请选择'
          },
          {
            type: 'select',
            label: '是否发起会议',
            labelKey: 'hasStartMeeting',
            options: this.sendMeetingOptiosn,
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
            type: 'input',
            label: '事件上报人',
            labelKey: 'reporterName',
            options: [],
            value: '',
            defaultValue: '',
            placeholder: '请输入内容'
          },
          {
            type: 'datetimerange',
            label: '事件时间',
            labelKey: ['createBeginTime	', 'createEndTime'],
            options: '',
            value: '',
            format: 'yyyy-MM-dd HH:mm:ss',
            defaultValue: '',
            placeholder: '请选择时间'
          }
        ]
      })
    }
  }
}
</script>
