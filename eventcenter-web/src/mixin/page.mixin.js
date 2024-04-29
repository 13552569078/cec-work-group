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
    handleCurrentChange(current) {
      this.page.pageNum = current
      this.resultList ? this.resultList() : this._search()
    },
    handleSizeChange(size) {
      this.page.pageSize = size
      this.resultList ? this.resultList() : this._search()
    },
    handleCopy(content) {
      // 创建一个 textarea 元素
      const textarea = document.createElement('textarea')
      // 设置 textarea 的值为我们想要复制的文本
      textarea.value = content
      // 将 textarea 添加到文档中
      document.body.appendChild(textarea)
      // 选择 textarea 的内容
      textarea.select()
      try {
        // 尝试复制选择的内容
        const isSussess = document.execCommand('copy')
        if (isSussess) {
          this.$message({
            message: '内容已复制',
            type: 'success'
          })
        } else {
          this.$message({
            message: '复制失败',
            type: 'fail'
          })
        }
      } catch (err) {
        console.error('无法复制', err)
      }
      // 删除 textarea
      document.body.removeChild(textarea)
    }
  }
}
