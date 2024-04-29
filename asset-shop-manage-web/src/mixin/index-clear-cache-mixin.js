/**
 * @Description:
 * @Author: lianpeng
 * @Date: 2022-04-11
 */

function clearQueryCache(path) {
  // 清除缓存
  const cache = window.sessionStorage.getItem('queryCache')
  if (cache) {
    const obj = JSON.parse(cache)
    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        if (key.includes(path)) {
          obj[key] = ''
        }
      }
    }
    window.sessionStorage.setItem('queryCache', JSON.stringify(obj))
  }
}

export default {
  data() {
    return {
      cachesKey: this.$route.path + this.$options.name
    }
  },
  beforeRouteEnter(to, from, next) {
    // 刷新页面去除缓存
    if (from.path === '/' || !from.query.cache) {
      clearQueryCache(to.path)
    }
    next()
  },
  beforeRouteLeave(to, from, next) {
    if (!to.query || !to.query.cache) {
      clearQueryCache(from.path)
    }
    // 解决问题：列表A------>表单A(此时缓存了列表A的查询条件)------>列表B------>列表A(A的缓存依然存在)
    if (!(from.path && from.query.cache)) {
      clearQueryCache(to.path)
    }
    // 导航离开该组件的对应路由时调用
    next()
  }

}
