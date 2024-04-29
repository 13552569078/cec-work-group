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
    acceptStateOptions() {
      return this.$store.getters.getBsDictsByType('pre_event_accept_state')
    }
  },
  watch: {
    acceptStateOptions: {
      deep: true,
      handler(val) {
        const acceptState = this.searchFilterItems.find(item => item.labelKey === 'acceptState')
        this.$set(acceptState, 'options', val)
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
          labelKey: 'srcSystemCode',
          options: [],
          labelname: '',
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
          type: 'select',
          label: '受理状态',
          labelKey: 'acceptState',
          options: this.acceptStateOptions,
          value: '',
          defaultValue: '',
          placeholder: '请选择'
        }
      ]
    }
  }
}
</script>
