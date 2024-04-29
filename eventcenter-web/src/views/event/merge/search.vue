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
    },
    duplicateStateOptions() {
      const duplicate_stateOptions = this.$store.getters.getBsDictsByType('duplicate_state')
      return duplicate_stateOptions.filter(val => !['2', '3'].includes(val.dictValue))
    }
  },
  // 解决页面首次或刷新搜索项空的问题--字典没fuzhi上
  watch: {
    'bsDicts.length'(val, oVal) {
      if (oVal === 0 && val) {
        const platformSrc = this.searchFilterItems.find(item => item.labelKey === 'platformSrc')
        if (platformSrc) this.$set(platformSrc, 'options', this.eventPlatformOptions)
        const duplicateState = this.searchFilterItems.find(item => item.labelKey === 'duplicateState')
        if (duplicateState) this.$set(duplicateState, 'options', this.duplicateStateOptions)
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
          label: '平台系统',
          labelKey: 'platformSrc',
          options: this.eventPlatformOptions,
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
          label: '合并状态',
          labelKey: 'duplicateState',
          options: this.duplicateStateOptions,
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
          label: '事件标题',
          labelKey: 'title',
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
