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
import moduleSrv from '@/api/dispatchWhh'
export default {
  name: 'Search',
  components: {
    search
  },
  mixins: [paramsMixin],
  data() {
    return {
      searchFilterItems: [],
      eventTypeOptions: [],
      statusOptions: [
        {
          dictDesc: '启用',
          dictValue: 1
        },
        {
          dictDesc: '停用',
          dictValue: 0
        }
      ]
    }
  },
  computed: {
    eventPlatformOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('event_platform')
    }
  },
  watch: {
    eventPlatformOptions: {
      deep: true,
      handler(val) {
        if (val?.length) {
          this.$set(this.searchFilterItems[0], 'options', val)
        }
      }
    }
  },
  created() {
    this.initSearchItems()
  },
  methods: {
    async getEventTypeOptions(val) {
      this.eventTypeWhhOptions = []
      if (val === '' || val === null || val === undefined) return
      const res = await moduleSrv.selectMinByPlatFromSearch({ platformSrc: val })
      this.eventTypeOptions = res.data || []
      this.$set(this.searchFilterItems[1], 'options', this.eventTypeOptions)
    },
    async initSearchItems() {
      await this.$nextTick()
      this.searchFilterItems = [
        {
          type: 'select',
          label: '平台系统',
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
          type: 'select',
          label: '事件类型',
          labelKey: 'eventTypeId',
          options: [],
          value: '',
          defaultValue: '',
          placeholder: '请选择'
        },
        {
          type: 'select',
          label: '状态',
          labelKey: 'status',
          options: this.statusOptions,
          value: '',
          defaultValue: '',
          placeholder: '请选择'
        },
        {
          type: 'input',
          label: '去重策略编码',
          labelKey: 'strategyCode',
          options: [],
          value: '',
          defaultValue: '',
          placeholder: '请输入内容'
        },
        {
          type: 'input',
          label: '去重策略名称',
          labelKey: 'strategyName',
          options: [],
          value: '',
          defaultValue: '',
          placeholder: '请输入内容'
        }
      ]
    }
  }
}
</script>
