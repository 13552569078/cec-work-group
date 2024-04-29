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
import moduleSrv from '@/api/dispatchWhh'
export default {
  name: 'Search',
  components: {
    search
  },
  mixins: [speTypeMixin, paramsMixin],
  data() {
    return {
      searchFilterItems: [],
      orgOptions: []
    }
  },
  computed: {
    eventUrgentOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('event_urgent_level')
    },
    eventStateOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const filterOptions = ['待审核', '待调度', '待处理']
      if (this.$route.name === 'collectionUnsolved') {
        return this.$store.getters.getBsDictsByType('event_state').filter(item => filterOptions.includes(item.dictDesc))
      }
      return this.$store.getters.getBsDictsByType('event_state')
    },
    eventSourceOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const temp = this.$store.getters.getBsDictsByType('event_origin')
      return temp
      // return temp.filter(item => !['11', '12', '13'].includes(item.dictValue))
    }
  },
  watch: {
    '$route': 'handleRouteChange',
    eventUrgentOptions: {
      deep: true,
      handler(val) {
        // 严重程度
        // const eventUrgent = this.searchFilterItems.find(item => item.labelKey === 'eventUrgent')
        // this.$set(eventUrgent, 'options', this.eventUrgentOptions)
      }
    }
  },
  created() {
    this.initSearchItems()
  },
  methods: {
    processToTree(source, pid, level) {
      const cache = []
      const children = []
      source.forEach((item) => {
        item.leaf = item.haveChild
        if (item.pid === pid) {
          cache.push(item)
        } else {
          children.push(item)
        }
      })
      cache.forEach((item) => {
        item.level = level
        if (item.haveChild) {
          item.children = this.processToTree(
            children,
            item.id,
            level + 1
          )
        }
      })
      return cache
    },
    async getOrgTreeData() {
      const res = await moduleSrv.getListV2WithHaveChild({ })

      this.orgOptions = this.processToTree(res.data, 0, 1)
    },
    async initSearchItems() {
      await this.$nextTick()
      await this.getOrgTreeData()
      this.searchFilterItems = [
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
          label: '事件来源',
          labelKey: 'eventSrcId',
          options: this.eventSourceOptions,
          value: '',
          defaultValue: '',
          placeholder: '请选择'
        },
        {
          type: 'input',
          label: '事件编码',
          labelKey: 'eventCode',
          options: [],
          value: '',
          defaultValue: '',
          placeholder: '请输入内容'
        },
        {
          type: 'select',
          label: '事件状态',
          labelKey: 'eventState',
          options: this.eventStateOptions,
          value: '',
          defaultValue: '',
          placeholder: '选择'
        },
        //
        {
          type: 'areaCascader', // 事件区域, 只有事件查询需要
          label: '发生地址',
          labelKey: 'areaCascader',
          options: [],
          option: {
            checkStrictly: true
          },
          gridId: '',
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
      if (this.$route.name === 'collectionAll') {
        this.searchFilterItems.splice(3, 0, {
          type: 'elCascader', // 事件类型级联
          label: '主处置部门',
          labelKey: 'masterOrg',
          options: this.orgOptions,
          props: {
            value: 'id',
            label: 'name',
            checkStrictly: true
          },
          value: '',
          nodeName: '',
          defaultValue: '',
          placeholder: '请选择'
        })
      }
    },
    handleRouteChange(to, from) {
      if (window.__POWERED_BY_WUJIE__) return
      // 仅列表页之间的切换，才重置搜索条件
      if (to.name.includes('collection') && from.name.includes('collection')) {
        this.initSearchItems()
        this._reset()
      }
    }
  }
}
</script>
