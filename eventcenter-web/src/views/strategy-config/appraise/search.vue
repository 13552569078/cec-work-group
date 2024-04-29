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
          type: 'input',
          label: '模型名称',
          labelKey: 'modelName',
          options: [],
          value: '',
          defaultValue: '',
          placeholder: '请输入内容'
        },
        {
          type: 'input',
          label: '模型编码',
          labelKey: 'modelCode',
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
