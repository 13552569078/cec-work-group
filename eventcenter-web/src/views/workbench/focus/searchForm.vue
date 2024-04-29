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
import speTypeMixin from '@/mixin/speTypeMixin'
import service from '@/api/dispatch'

export default {
  name: 'Search',
  components: {
    search
  },
  mixins: [speTypeMixin, paramsMixin],
  data() {
    return {
      searchFilterItems: [],
      convergeStateList: []
    }
  },
  computed: {
    eventUrgentOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('event_urgent_level')
    }
  },
  watch: {
    'bsDicts.length'(val, oVal) {
      if (oVal === 0 && val) this.initSearchItems()
    },
    convergeStateList(val) {
      const eventState = this.searchFilterItems.find(item => item.labelKey === 'eventState')
      this.$set(eventState, 'options', val)
    }
  },
  created() {
    this.bsDicts?.length && this.initSearchItems()
    this.initStateXiala()
  },
  methods: {
    async initSearchItems() {
      await this.$nextTick()
      this.searchFilterItems = [
        {
          type: 'input',
          label: '事件标题',
          labelKey: 'title',
          options: [],
          value: '',
          defaultValue: '',
          placeholder: '请输入内容'
        }, {
          type: 'input',
          label: '事件编码',
          labelKey: 'eventCode',
          options: [],
          value: '',
          defaultValue: '',
          placeholder: '请输入内容'
        },
        {
          type: 'eventCascader', // 事件类型级联
          label: '事件类型',
          labelKey: 'eventCascader',
          options: [],
          eventTypeLId: '',
          eventTypeMId: '',
          eventTypeId: '',
          eventTypeIdFour: '',
          eventTypeIdFive: '',
          nodeName: '',
          defaultValue: '',
          placeholder: '请选择'
        },
        {
          type: 'platformSource', // 来源系统
          label: '来源系统',
          labelKey: 'platformSrc',
          value: '',
          defaultValue: '',
          placeholder: '请选择',
          options: [],
          labelname: ''
        },
        {
          type: 'select',
          label: '事件状态',
          labelKey: 'eventState',
          options: this.convergeStateList,
          value: '',
          defaultValue: '',
          placeholder: '选择'
        },
        {
          type: 'areaCascader', // 事件区域, 只有事件查询需要
          label: '发生地址',
          labelKey: 'areaCascader',
          options: [],
          option: {
            checkStrictly: true
          },
          gridId: '',
          value: '',
          defaultValue: '',
          nodeNames: [],
          levels: [],
          placeholder: '请选择'
        },
        {
          type: 'date',
          timeType: 'daterange',
          label: '发生时间',
          labelKey: 'dateRange',
          options: [],
          value: [],
          defaultValue: [],
          placeholder: ''
        }
      ]
    },
    initStateXiala() {
      service.getEventConvergeStateList().then(res => {
        this.convergeStateList = res.data || []
      })
    }
  }
}
</script>

