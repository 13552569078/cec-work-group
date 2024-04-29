export default {
  data() {
    return {
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    }
  },

  methods: {
    handleCurrentChange(pageNum) {
      this.page.pageNum = pageNum
      this._search()
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this._search()
    }

  }
}
