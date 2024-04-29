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
      searchFilterItems: [],
      responeStatusOptions: [
        {
          dictDesc: '失败',
          dictValue: 0
        },
        {
          dictDesc: '成功',
          dictValue: 1
        }
      ]
    }
  },
  computed: {
    thirdSystemList() {
      const result = this.$store.getters.getThirdSystemList
      return result || []
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
          label: '事件编号',
          labelKey: 'eventCode',
          options: [],
          value: '',
          defaultValue: '',
          placeholder: '请输入内容'
        },
        {
          type: 'select',
          label: '请求系统',
          labelKey: 'requestSysCode',
          options: this.thirdSystemList.filter(item => item.sourcePlatform),
          value: '',
          defaultValue: '',
          placeholder: '请选择'
        },
        {
          type: 'select',
          label: '被请求系统',
          labelKey: 'responeSysCode',
          options: this.thirdSystemList.filter(item => item.handlePlatform),
          value: '',
          defaultValue: '',
          placeholder: '请选择'
        },
        {
          type: 'datetimerange',
          label: '请求时间',
          labelKey: ['requestTimeBegin', 'requestTimeEnd'],
          options: '',
          value: '',
          format: 'yyyy-MM-dd HH:mm:ss',
          defaultTime: ['00:00:00', '23:59:59'],
          placeholder: '请选择时间'
        },
        {
          type: 'select',
          label: '响应状态',
          labelKey: 'responeStatus',
          options: this.responeStatusOptions,
          value: '',
          defaultValue: '',
          placeholder: '请选择'
        }
      ]
    }
  }
}
</script>
