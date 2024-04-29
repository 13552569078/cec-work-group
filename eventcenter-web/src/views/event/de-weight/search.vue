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

export default {
  name: 'Search',
  components: {
    search
  },
  mixins: [speTypeMixin, paramsMixin],
  data() {
    return {
      searchFilterItems: []
    }
  },
  computed: {
    duplicateStateOptions() {
      const duplicate_stateOptions = this.$store.getters.getBsDictsByType('duplicate_state')
      return duplicate_stateOptions.filter(val => val.dictValue !== '5')
    }
  },
  // 解决页面首次或刷新搜索项空的问题--字典没fuzhi上
  watch: {
    'bsDicts.length'(val, oVal) {
      if (oVal === 0 && val) {
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
          type: 'platformSource',
          label: '来源系统',
          labelKey: 'platformSrc',
          options: [],
          labelname: '',
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
        },
        {
          type: 'select',
          label: '去重状态',
          labelKey: 'duplicateState',
          options: this.duplicateStateOptions,
          value: '',
          defaultValue: '',
          placeholder: '请选择'
        }
      ]
    }
  }
}
</script>
