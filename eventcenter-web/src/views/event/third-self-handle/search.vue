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
import moduleSrv from '@/api/dispatch'
export default {
  name: 'Search',
  components: {
    search
  },
  mixins: [paramsMixin],
  props: {
    source: {
      type: String,
      default: 'list' // eventIn 为事件流入监控列表 共用一个组件
    },
    type: {
      type: String,
      default: 'eventIn' // eventIn self 自处置
    }
  },
  data() {
    return {
      orgOptions: [],
      searchFilterItems: [],
      systemTypeOptions: [
        {
          dictDesc: '来源系统',
          dictValue: 'sourcePlatform'
        },
        {
          dictDesc: '处置系统',
          dictValue: 'handlePlatform'
        }
      ]
    }
  },
  computed: {
    eventUrgentOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('event_urgent_level')
    },
    eventStateOptions() {
      if (this.type === 'eventIn') {
        const filterOptions = ['待审核', '待调度', '待处理']
        if (this.$route.name === 'collectionUnsolved') {
          return this.$store.getters.getBsDictsByType('event_state').filter(item => filterOptions.includes(item.dictDesc))
        }
        return this.$store.getters.getBsDictsByType('event_state')
      } else {
        return this.$store.getters.getBsDictsByType('SELF_HANDLE_EVENT_STATE')
      }
    },
    eventOverTimeOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('overtime_flag')
    }
  },
  created() {
    this.initSearchItems()
  },
  methods: {
    setLeafNodes(node) {
      if (node.children) {
        if (node.children.length === 0) {
          node.leaf = true
          node.children = ''
        } else {
          node.leaf = false
          node.children.forEach(this.setLeafNodes)
        }
      }
      return node
    },
    async getOrgTreeData() {
      const res = await moduleSrv.getDutyDeptListByTree({ state: 1 })
      // 递归遍历res.data, 如果children.length === 0, 则设置当前节点叶子节点 leaf: true，同时将 children 设置为 ''
      this.orgOptions = res.data.map(this.setLeafNodes)
    },
    async initSearchItems() {
      await this.$nextTick()
      await this.getOrgTreeData()
      // 区分 list eventin 搜索条件
      if (this.source === 'list') {
        this.searchFilterItems = [
          {
            type: 'input',
            label: '事件标题',
            labelKey: 'eventTitle',
            options: [],
            value: '',
            defaultValue: '',
            placeholder: '请输入内容'
          },
          {
            type: 'input',
            label: '事件编码',
            labelKey: this.type === 'eventIn' ? 'eventCode' : 'uuid',
            options: [],
            value: '',
            defaultValue: '',
            placeholder: '请输入内容'
          },
          {
            type: 'eventCascader',
            label: '事件类型',
            labelKey: 'eventCascader',
            option: {
              multiple: true
            },
            options: this.systemTypeOptions,
            value: '',
            defaultValue: '',
            placeholder: '请选择'
          },
          {
            type: 'platformSource',
            label: '来源系统',
            labelKey: 'sysCode',
            options: [],
            labelname: '',
            value: '',
            defaultValue: '',
            placeholder: '请选择'
          },
          {
            type: 'select',
            label: '事件状态',
            labelKey: 'dealStatus',
            options: this.eventStateOptions,
            value: '',
            defaultValue: '',
            placeholder: '选择'
          },
          {
            type: 'date',
            timeType: 'daterange',
            label: '发生时间',
            labelKey: 'dateRange5',
            options: [],
            value: [],
            defaultValue: [],
            placeholder: ''
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
            defaultValue: '',
            nodeNames: [],
            levels: [],
            placeholder: '请选择'
          },
          // {
          //   type: 'elCascader',
          //   label: '主处置部门',
          //   labelKey: 'masterOrgCate',
          //   options: this.orgOptions,
          //   props: {
          //     value: 'dictValue',
          //     label: 'dictDesc',
          //     checkStrictly: false
          //   },
          //   nodeName: '',
          //   defaultValue: '',
          //   placeholder: '请选择'
          // },
          {
            type: 'select',
            label: '超时状态',
            labelKey: 'overtimeFlag',
            options: this.eventOverTimeOptions,
            value: '',
            defaultValue: '',
            placeholder: '选择'
          }
        ]
      } else if (this.source === 'eventIn') {
        this.searchFilterItems = [
          {
            type: 'input',
            label: '事件标题',
            labelKey: 'eventTitle',
            options: [],
            value: '',
            defaultValue: '',
            placeholder: '请输入内容'
          },
          {
            type: 'input',
            label: '事件编码',
            labelKey: this.type === 'eventIn' ? 'eventCode' : 'uuid',
            options: [],
            value: '',
            defaultValue: '',
            placeholder: '请输入内容'
          },
          {
            type: 'select',
            label: '事件状态',
            labelKey: 'dealStatus',
            options: this.eventStateOptions,
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
            defaultValue: '',
            nodeNames: [],
            levels: [],
            placeholder: '请选择'
          },
          {
            type: 'select',
            label: '超时状态',
            labelKey: 'overtimeFlag',
            options: this.eventOverTimeOptions,
            value: '',
            defaultValue: '',
            placeholder: '选择'
          }
        ]
        // if (this.type === 'eventIn') {
        //   this.searchFilterItems.splice(3, 0, {
        //     type: 'elCascader', // 事件类型级联
        //     label: '主处置部门',
        //     labelKey: 'masterOrgCate',
        //     options: this.orgOptions,
        //     props: {
        //       value: 'deptCode',
        //       label: 'name',
        //       checkStrictly: true
        //     },
        //     nodeName: '',
        //     defaultValue: '',
        //     placeholder: '请选择'
        //   })
        // }
      }
    }
  }
}
</script>
