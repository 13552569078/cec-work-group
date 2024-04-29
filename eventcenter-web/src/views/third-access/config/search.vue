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
          label: '系统来源',
          labelKey: 'dictLabel',
          options: [],
          value: '',
          defaultValue: '',
          placeholder: '请输入内容'
        },
        {
          type: 'input',
          label: '来源编码',
          labelKey: 'dictValue',
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
