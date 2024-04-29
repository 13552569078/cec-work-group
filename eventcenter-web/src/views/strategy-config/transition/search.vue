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
export default {
  name: 'Search',
  components: {
    search
  },
  mixins: [paramsMixin],
  data() {
    return {
      searchFilterItems: []
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
        this.$set(this.searchFilterItems[0], 'options', val)
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
          type: 'select',
          label: '系统来源',
          labelKey: 'sysCode',
          options: this.eventPlatformOptions,
          value: '',
          defaultValue: '',
          placeholder: '请选择'
        },
        {
          type: 'input',
          label: '值名称',
          labelKey: 'originalName',
          options: [],
          value: '',
          defaultValue: '',
          placeholder: '请输入'
        },
        {
          type: 'input',
          label: '字段值',
          labelKey: 'originalValue',
          options: [],
          value: '',
          defaultValue: '',
          placeholder: '请输入'
        },
        {
          type: 'input',
          label: '转换后值名称',
          labelKey: 'replaceName',
          options: [],
          value: '',
          defaultValue: '',
          placeholder: '请输入'
        },
        {
          type: 'input',
          label: '转换后字段值',
          labelKey: 'replaceValue',
          options: [],
          value: '',
          defaultValue: '',
          placeholder: '请输入'
        }
      ]
    }
  }
}
</script>
