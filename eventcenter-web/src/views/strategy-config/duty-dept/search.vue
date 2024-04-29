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
import { DUTYDEPTSTATE } from '@/constants'
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
    orgTypeOptions() {
      return this.$store.getters.getBsDictsByType('org_type')
    },
    eventLevelOptions() {
      return this.orgTypeOptions.filter((item) => item.parentValue === '0')
    }
  },
  watch: {
    eventLevelOptions: {
      deep: true,
      handler(val) {
        const deptLevel = this.searchFilterItems.find(item => item.labelKey === 'deptLevel')
        this.$set(deptLevel, 'options', val)
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
          type: 'input',
          label: '职能部门名称',
          labelKey: 'name',
          options: [],
          value: '',
          defaultValue: '',
          placeholder: '请输入内容'
        },
        {
          type: 'select',
          label: '状态',
          labelKey: 'state',
          options: DUTYDEPTSTATE,
          value: '',
          defaultValue: '',
          placeholder: '请选择'
        },
        {
          type: 'select',
          label: '部门级别',
          labelKey: 'deptLevel',
          options: this.eventLevelOptions,
          value: '',
          defaultValue: '',
          placeholder: '请选择'
        }
      ]
    }
  }
}
</script>
