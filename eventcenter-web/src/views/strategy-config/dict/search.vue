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
  name: 'StrategyDict',
  components: {
    search
  },
  mixins: [paramsMixin],
  data() {
    return {
      searchFilterItems: [] // 搜索条件
    }
  },
  created() {
    this.initSearchItems()
  },
  methods: {
    initSearchItems() {
      this.$nextTick(() => {
        this.searchFilterItems = [
          {
            type: 'input',
            label: '字典名称',
            labelKey: 'dictLabel',
            options: [],
            value: '',
            defaultValue: '',
            placeholder: '请输入内容'
          },
          {
            type: 'input',
            label: '字典编码',
            labelKey: 'dictValue',
            options: [],
            value: '',
            defaultValue: '',
            placeholder: '请输入内容'
          }
        ]
      })
    }
  }
}
</script>
