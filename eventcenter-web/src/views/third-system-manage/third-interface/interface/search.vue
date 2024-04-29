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
  created() {
    this.initSearchItems()
  },
  methods: {
    async initSearchItems() {
      await this.$nextTick()
      this.searchFilterItems = [
        {
          type: 'input',
          label: '接口编码',
          labelKey: 'apiCode',
          options: [],
          value: '',
          defaultValue: '',
          placeholder: '请输入接口编码'
        },
        {
          type: 'input',
          label: '接口名称',
          labelKey: 'apiName',
          options: [],
          value: '',
          defaultValue: '',
          placeholder: '请输入接口名称'
        }
      ]
    }
  }
}
</script>
