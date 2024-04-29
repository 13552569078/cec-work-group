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

export default {
  name: 'Search',
  components: {
    search
  },
  mixins: [speTypeMixin, paramsMixin],
  data() {
    return {
      searchFilterItems: []
    }
  },
  computed: {
    eventUrgentOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('event_urgent_level')
    }
  },
  watch: {
    eventUrgentOptions: {
      deep: true,
      handler(val) {
        // 严重程度
        const eventUrgent = this.searchFilterItems.find(item => item.labelKey === 'eventUrgent')
        this.$set(eventUrgent, 'options', this.eventUrgentOptions)
      }
    }
  },
  created() {
    this.initSearchItems()
  },
  methods: {
    async initSearchItems() {
      await this.$nextTick()
      this.searchFilterItems = [
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
          label: '严重程度',
          labelKey: 'eventUrgent',
          options: this.eventUrgentOptions,
          value: '',
          defaultValue: '',
          placeholder: '请选择'
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
    }
  }
}
</script>
