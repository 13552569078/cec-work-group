export default {
  data() {
    return {
      defaultSearchForm: {},
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
    if (this.searchForm) {
      this.defaultSearchForm = JSON.parse(JSON.stringify(this.searchForm))
    }
    this.$nextTick(() => {
      this._search()
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.calcTableHeight()
    })
  },
  watch: {
  },
  methods: {
    calcTableHeight() {
      this.searchTipsHeight = this.$refs.searchTips && this.$refs.searchTips.$el && this.$refs.searchTips.$el.clientHeight
    },
    // 自定义序号
    indexMethod(index) {
      return index + 1 > 9 ? index + 1 : `${index + 1}`
    },
    // 重置
    reset() {
      this.searchForm = JSON.parse(JSON.stringify(this.defaultSearchForm))
      this.$nextTick(() => {
        this._search()
      })
    }
  }
}
