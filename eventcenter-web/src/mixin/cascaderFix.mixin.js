export default {
  methods: {
    async visibleChange(_val) {
      await this.$nextTick()
      // 解决多次渲染界面卡死问题
      const $el = document.querySelectorAll('.el-cascader-panel .el-cascader-node[aria-owns]')
      Array.from($el).map((item) => item.removeAttribute('aria-owns'))
      try {
        const _cascaderRef = this.$refs.cascaderRef
        const _panel = _cascaderRef?.$refs.panel.$el
        // 如果是单选，则进行
        if (_cascaderRef?.config.checkStrictly) {
          setTimeout(function() {
            _panel.querySelectorAll('.el-cascader-node__label').forEach((el) => {
              el.onclick = function() {
                console.log('el--', el)
                this.previousElementSibling?.click()
              }
            })
          }, 100)
        }
      } catch (error) {
        console.log('visibleChange==', error)
      }
    },
    // 单击节点进行单选
    async elCascaderOnlick() {
      await this.$nextTick()
      setTimeout(function() {
        document.querySelectorAll('.el-cascader-node__label').forEach((el) => {
          el.onclick = function() {
            this.previousElementSibling?.click()
          }
        })
      }, 100)
    }
  }
}
