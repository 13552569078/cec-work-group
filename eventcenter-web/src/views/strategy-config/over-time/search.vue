<template>
  <search
    v-if="searchFilterItems.length"
    :search-items="searchFilterItems"
    :has-simple="false"
    @search="searchList"
    @reset="_reset"
  />
</template>
<script>
import search from '@/components/Search'
import paramsMixin from '@/mixin/paramsMixin'
import moduleSrv from '@/api/dispatch'
export default {
  name: 'Search',
  components: {
    search
  },
  mixins: [paramsMixin],
  data() {
    return {
      searchFilterItems: [],
      eventTypeList: []
    }
  },
  computed: {
    eventPlatformOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('event_platform').filter(item => item.dictValue !== '100')
    },
    eventUrgentOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('event_urgent_level')
    }
  },
  watch: {
    eventUrgentOptions: {
      deep: true,
      handler(val) {
        this.$set(this.searchFilterItems[2], 'options', val)
        const eventPlatform = this.searchFilterItems.find(item => item.labelKey === 'platformSrc')
        this.$set(eventPlatform, 'options', this.eventPlatformOptions)
      }
    }
  },
  created() {
    this.initSearchItems()
  },
  methods: {
    async getEventTypeOptions(val) {
      this.eventTypeList = []
      if (val === '' || val === null || val === undefined) return
      const res = await moduleSrv.eventTypeSelect({ platformSrc: val })
      this.eventTypeList = res.data || []
      this.$set(this.searchFilterItems[1], 'options', this.eventTypeList)
    },
    async initSearchItems() {
      await this.$nextTick()
      this.searchFilterItems = [
        {
          type: 'select',
          label: '发起方系统',
          labelKey: 'platformSrc',
          options: this.eventPlatformOptions,
          value: '',
          defaultValue: '',
          placeholder: '请选择',
          change: (val) => {
            // 查询事件类型
            this.getEventTypeOptions(val)
          }
        },
        {
          type: 'cascade', // 事件类型级联
          label: '事件类型',
          labelKey: 'eventTypeId',
          options: [],
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
        }
      ]
    }
  }
}
</script>
