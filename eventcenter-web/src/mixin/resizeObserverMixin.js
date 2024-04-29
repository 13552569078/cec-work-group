/**
 * @Description: 算是监听实例，之前的element-resize-detector插件无痕下不兼容
 *  @Author: lism
 *  @Date: 2022-02-21
 */
export default {
  data() {
    return {
      obServer: null, // 元素观察实例
      obServerEl: null // 要观察的元素
    }
  },
  methods: {
    initObServer(element, cb) {
      if (!element) return
      // 指定要观察的元素
      this.obServerEl = element
      if (!this.obServer) {
        this.obServer = new ResizeObserver(cb)
      }
      if (this.obServerEl) {
        this.obServer.observe(this.obServerEl)
      }
    }
  },
  beforeDestroy() {
    if (this.obServerEl) {
      this.obServer?.unobserve(this.obServerEl)
    }
  }
}
