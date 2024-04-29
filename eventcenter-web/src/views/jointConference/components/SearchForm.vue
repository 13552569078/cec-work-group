<template>
  <search
    v-if="searchFilterItems.length"
    :search-items="searchFilterItems"
    :default-mode="defaultMode"
    @search="searchList"
    @reset="_reset"
  />
</template>
<script>
import search from '@/components/Search'
import paramsMixin from '@/mixin/paramsMixin'
import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'
export default {
  name: 'EventSearch',
  components: {
    search
  },
  mixins: [paramsMixin],
  props: {
    // 默认模式 1简易 2高级
    defaultMode: {
      type: Number,
      default: 1
    },
    // 是否有简易模式
    hasSimple: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      searchFilterItems: []
    }
  },
  computed: {
    meetingStatusOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getMeetingDictsByType('meeting_status')
    },

    // eventUrgentOptions() {
    //   // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
    //   return this.$store.getters.getBsDictsByType('event_urgent_level')
    // }
    cascadeProps() {
      return {
        emitPath: false,
        value: 'id',
        label: 'name',
        lazy: true,
        lazyLoad: async(node, resolve) => {
          console.log('node........', node)
          let id = ''
          if (node.data) {
            id = node.data.id
          }
          // const { level } = node
          const service = moduleSrv.getContact({
            orgId: id
          })
          service.then((res) => {
            let result = []
            const { data = [] } = res
            if (res.code === SUCCESS_CODE) {
              result = data
            }
            resolve(result)
          })
        }
      }
    }

  },
  watch: {
    eventSourceOptions: {
      handler(val) {
        if (val) {
          // 对下拉数据进行更新赋值
          const currentItem = this.searchFilterItems.filter(item => item.labelKey === 'eventSrcId')
          this.$nextTick(() => {
            // 对其他数据也进行重新赋值
            this.initSearchItems()
            this.$set(currentItem[0], 'options', val)
          })
        }
      }
    }
  },
  created() {
    this.initSearchItems()
  },
  methods: {
    async getOrgId() {
      const res = await moduleSrv.getTreeListByOrgId({
        orgId: ''
      })
      if (res.code === 0) {
        this.searchFilterItems.map(item => {
          if (item.labelKey === 'orgId' || item.labelKey === 'attendOrgId') {
            item.options = res.data
          }
        })
      }
    },

    initSearchItems() {
      this.$nextTick(() => {
        this.searchFilterItems = [
          {
            type: 'input',
            label: '会议主题',
            labelKey: 'meetingTitle',
            options: [],
            value: '',
            defaultValue: '',
            placeholder: '请输入内容'
          },
          {
            type: 'cascade',
            label: '组织单位',
            labelKey: 'orgId',
            options: [],
            value: '',
            defaultValue: '',
            placeholder: '请选择'
          },
          {
            type: 'input',
            label: '会议发起人',
            labelKey: 'meetingCreateUserName',
            options: [],
            value: '',
            defaultValue: '',
            placeholder: '请输入内容'
          },
          {
            type: 'select',
            label: '会议状态',
            labelKey: 'meetingStatus',
            options: this.meetingStatusOptions,
            value: '',
            defaultValue: '',
            placeholder: '请选择',
            hidden: this.isShowEventSrcId
          },
          {
            type: 'cascade',
            label: '参会单位',
            labelKey: 'attendOrgId',
            options: [],
            value: '',
            defaultValue: '',
            placeholder: '请选择'
          },

          {
            type: 'input',
            label: '参会人员',
            labelKey: 'attendUserName',
            options: [],
            value: '',
            defaultValue: '',
            placeholder: '请输入内容'
          },
          {
            type: 'input',
            label: '关联事件编号',
            labelKey: 'eventCode',
            options: [],
            value: '',
            defaultValue: '',
            placeholder: '请输入内容'
          },
          {
            type: 'datetimerange',
            label: '会议时间',
            labelKey: ['meetingStartTime	', 'meetingEndTime'],
            options: '',
            value: '',
            format: 'yyyy-MM-dd HH:mm:ss',
            defaultValue: '',
            placeholder: '请选择时间'
          }
        ]
        this.getOrgId()
      })
    }
  }
}
</script>
