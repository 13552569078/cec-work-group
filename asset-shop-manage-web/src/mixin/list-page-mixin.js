export default {
  data() {
    return {
      loading: false,
      tableHeight: null,
      searchForm: {},
      dataList: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  created() {
    this.handleSearch()
  },
  methods: {
    getTableHeight(contentHeight) {
      this.tableHeight = contentHeight - 54
    },
    handleSearch() {
      const pageNum = 1
      this.search(pageNum)
    },
    handleReset() {
      this.searchForm = {}
      this.handleSearch()
    },
    handleCurrentChange(pageNum) {
      this.search(pageNum)
    },
    getQueryParams(pageNum) {
      return {
        ...this.searchForm,
        pageSize: this.page.pageSize,
        pageNum: pageNum || this.page.pageNum
      }
    },
    searchAfterDel() {
      let pageNum = this.page.pageNum
      if (this.dataList.length === 1 && pageNum > 1) {
        pageNum--
      }
      this.search(pageNum)
    }
  }
}
