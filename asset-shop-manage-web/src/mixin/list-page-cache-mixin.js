import { parseTime } from '@l/utils'
function clearQueryCache(path) {
  // 清除缓存
  const cache = window.sessionStorage.getItem('queryCache')
  if (cache) {
    const obj = JSON.parse(cache)
    obj[path] = ''
    window.sessionStorage.setItem('queryCache', JSON.stringify(obj))
  }
}
export default {
  data() {
    return {
      loading: false,
      tableHeight: null,
      searchForm: {},
      timeRange: null, // 专为时间查询控件使用
      dataList: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      queryCacheDataNames: [], // 指定需要缓存的组件数据名称
      hasSearch: false
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
  },
  created() {
    this.init()
  },
  methods: {
    // 处理标签树的数据,只能选择叶节点
    treeRecursion(data) {
      if (Array.isArray(data) && data.length) {
        data.forEach((unit, index) => {
          if (!unit.parentId || unit.childList.length) {
            unit.disabled = true
          }
          if (unit.childList && unit.childList.length) {
            this.treeRecursion(unit.childList)
          }
        })
      }
    },
    init() {
      const cache = window.sessionStorage.getItem('queryCache')
      if (cache) {
        const obj = JSON.parse(cache)
        if (obj[this.$route.path]) {
          for (const key in obj[this.$route.path]) {
            this[key] = obj[this.$route.path][key]
          }
        }
        obj[this.$route.path] = ''
        window.sessionStorage.setItem('queryCache', JSON.stringify(obj))
      }
      this.search(this.page.pageNum)
    },
    getTableHeight(contentHeight) {
      this.tableHeight = contentHeight - 54
    },
    handleSearch() {
      this.hasSearch = true
      const pageNum = 1
      this.search(pageNum)
    },
    handleReset() {
      this.searchForm = {}
      this.timeRange = null
      this.hasSearch = false
      this.search(1)
    },
    handleCurrentChange(pageNum) {
      this.search(pageNum)
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.search(this.page.pageNum)
    },
    getQueryParams(pageNum, pageSize) {
      const search = this.hasSearch ? this.searchForm : {}
      return {
        ...search,
        pageSize: pageSize || this.page.pageSize,
        pageNum: pageNum || this.page.pageNum
      }
    },
    searchAfterDel() {
      let pageNum = this.page.pageNum
      if (this.dataList.length === 1 && pageNum > 1) {
        pageNum--
      }
      this.search(pageNum)
    },
    dateFormatter(row, column, data) {
      return parseTime(data)
    },
    doQueryCache(arr) {
      this.queryCacheDataNames = arr // 指定缓存的数据名称
      this.queryCacheDataNames.push('hasSearch')
      const cache = window.sessionStorage.getItem('queryCache')
      let obj = {}
      if (cache) {
        obj = JSON.parse(cache)
      }
      if (this.queryCacheDataNames) {
        // 如果有设置缓存数据就缓存
        obj[this.$route.path] = {}
        this.queryCacheDataNames.forEach(element => {
          obj[this.$route.path][element] = this[element]
        })
        window.sessionStorage.setItem('queryCache', JSON.stringify(obj))
      }
    }
  }
}
