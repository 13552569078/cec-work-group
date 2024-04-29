/**
 * @Description: 页面搜索项缓存
 * @Author: zhangsen
 * @Date: 2020-11-05
 */
import { isArray } from '@l/utils/type-judgment.js'
import { parseTime } from '@l/utils'

export default {
  data() {
    return {
      queryCacheDataNames: [], // 指定需要缓存的组件数据名称
      loading: false,
      tableHeight: null,
      searchForm: {},
      searchParams: {},
      timeRange: null, // 专为时间查询控件使用
      dataList: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const cache = window.sessionStorage.getItem('queryCache')
      if (cache) {
        const obj = JSON.parse(cache)
        if (obj[this.$route.path]) {
          for (const key in obj[this.$route.path]) {
            this[key] = obj[this.$route.path][key]
          }
          // 回填有效查询条件
          if (this.searchParams && Object.keys(this.searchParams).length) {
            Object.keys(this.searchParams).forEach(k => {
              this.$set(this.searchForm, k, this.searchParams[k])
            })
          }
        }
        obj[this.$route.path] = ''
        window.sessionStorage.setItem('queryCache', JSON.stringify(obj))
      }
      this.search && this.search(this.page.pageNum)
    },
    handleSearch() {
      this.searchParams = { ...this.searchForm }
      const pageNum = 1
      this.search && this.search(pageNum)
    },
    handleReset() {
      this.searchForm = {}
      this.searchParams = {}
      this.timeRange = null
      this.search && this.search(1)
    },
    handlePageSizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.handleSearch()
    },
    handleCurrentChange(pageNum) {
      this.search && this.search(pageNum)
    },
    getQueryParams(pageNum) {
      return {
        ...this.searchParams,
        pageSize: this.page.pageSize,
        pageNum: pageNum || this.page.pageNum
      }
    },
    searchAfterDel() {
      let pageNum = this.page.pageNum
      if (this.dataList.length === 1 && pageNum > 1) {
        pageNum--
      }
      this.search && this.search(pageNum)
    },
    dateFormatter(row, column, data) {
      return parseTime(data)
    },
    doQueryCache(arr) {
      if (!isArray(arr)) return
      this.queryCacheDataNames = arr // 指定缓存的数据名称
      this.queryCacheDataNames.push('searchParams')
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
