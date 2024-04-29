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
import { setDefaultTimeRange } from '@/utils'
export default {
  name: 'Search',
  components: {
    search
  },
  mixins: [paramsMixin],
  data() {
    return {
      searchFilterItems: [],
      commandStatusOptions: [
        { dictValue: '', dictDesc: '全部' },
        { dictValue: '0', dictDesc: '待反馈' },
        { dictValue: '1', dictDesc: '已反馈' }
      ]
    }
  },
  computed: {

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
          label: '指令标题',
          labelKey: 'title',
          options: [],
          value: '',
          defaultValue: '',
          placeholder: '请输入'
        },
        {
          type: 'select',
          label: '指令状态',
          labelKey: 'commandStatus',
          options: this.commandStatusOptions,
          value: '',
          defaultValue: '',
          placeholder: '请选择'
        },
        {
          type: 'datetimerange',
          label: '下发时间',
          labelKey: ['startTime', 'endTime'],
          format: 'yyyy-MM-dd HH:mm:ss',
          defaultTime: ['00:00:00', '23:59:59'],
          options: [],
          value: setDefaultTimeRange(),
          defaultValue: setDefaultTimeRange(),
          placeholder: ''
        }
      ]
    }
  }
}
</script>
