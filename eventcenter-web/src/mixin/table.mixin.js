import { setDefaultTimeRange } from '@/utils/index'
export default {
  data() {
    return {
      tableData: [],
      searchTipsHeight: 0
    }
  },
  computed: {
    columns() {
      return this.tableColumn.filter((item) => item.visible)
    },
    tableContentHeight() {
      return `calc(100% - ${this.searchTipsHeight}px - 20px)`
    }
  },
  created() {
    this.$nextTick(() => {
      this.dateRange = setDefaultTimeRange()
      // 给表单赋值初始的开始和结束时间
      this.form.startTime = this.dateRange[0]
      this.form.endTime = this.dateRange[1]
      this.resultList()
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.searchTipsHeight = this.$refs.searchTips && this.$refs.searchTips.$el && this.$refs.searchTips.$el.clientHeight
    })
  },
  watch: {
    dateRange: {
      handler(nVal) {
        if (!nVal || !nVal.length) {
          this.form.startTime = ''
          this.form.endTime = ''
        } else {
          this.form.startTime = nVal[0]
          this.form.endTime = nVal[1]
        }
      }
    }
  },
  methods: {
    // 自定义序号
    indexMethod(index) {
      return index + 1 > 9 ? index + 1 : `${index + 1}`
    },
    reset() {
      this.$nextTick(() => {
        this.form = {}
        this.dateRange = setDefaultTimeRange()
        this.resultList()
      })
    }
  }
}
