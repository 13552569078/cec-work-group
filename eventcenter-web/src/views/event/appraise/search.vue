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
    eventSrcIdOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('event_origin')
    },
    eventUrgentOptions() {
      return this.$store.getters.getBsDictsByType('event_urgent_level')
    },
    evaluateFlagOptions() {
      return this.$store.getters.getBsDictsByType('evaluate_flag')
    },
    thirdSystemList() {
      const result = this.$store.getters.getThirdSystemList.filter(item => item.sourcePlatform)
      return [{ dictLabel: '事件中心', dictValue: '100', dictDesc: '事件中心', value: '100', sourcePlatform: true }, ...result]
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
          type: 'select',
          label: '来源系统',
          labelKey: 'platformSrc',
          options: this.thirdSystemList,
          value: '',
          defaultValue: '',
          placeholder: '请选择'
        },
        {
          type: 'select',
          label: '事件来源',
          labelKey: 'eventSrcId',
          options: this.eventSrcIdOptions,
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
          type: 'select',
          label: '严重程度',
          labelKey: 'eventUrgent',
          options: this.eventUrgentOptions,
          value: '',
          defaultValue: '',
          placeholder: '请选择'
        },
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
          type: 'datetimerange',
          label: '事件时间',
          labelKey: ['beginTime', 'endTime'],
          defaultTime: [],
          options: '',
          value: '',
          format: 'yyyy-MM-dd HH:mm:ss',
          defaultValue: '',
          placeholder: '请选择时间'
        },
        {
          type: 'select',
          label: '评价状态',
          labelKey: 'evaluateFlag',
          options: this.evaluateFlagOptions,
          value: '',
          defaultValue: '',
          placeholder: '请选择'
        }
      ]
      this.searchList()
    }
  }
}
</script>
