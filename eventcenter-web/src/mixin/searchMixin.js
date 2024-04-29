/**
 * @Description: 高级搜索、简易搜索、联动 mixin
 *  @Author: lism
 *  @Date: 2022-02-21
 */
export default {
  data() {
    return {
      dataList: [], // 检索结果
      loading: false, // 是否加载中
      filterTips: [], // 已经查询的搜索项
      searchParams: {},
      resultStyle: {
        height: `calc(100% - 64px)`
      },
      searchTipHeight: 64, // searchtip组件高度
      listMultySelect: [],
      cardFirstLoad: false,
      busy: false // 是否继续执行更多加载, false-执行; true-不执行
    }
  },
  computed: {
    selectCount() {
      let count = 0
      if (this.isCard) {
        this.dataList.forEach(item => {
          if (item.selected) count++
        })
      } else {
        count = this.listMultySelect.length
      }
      return count
    },
    btchList() {
      return this.isCard ? this.dataList.filter(item => item.selected) : this.listMultySelect
    },
    refresh() {
      return this.$route.query.refresh
    },
    speType() {
      return this.$route.query.speType || ''
    }
  },
  async activated() { // 因为设置了缓存，所以每次激活当前页面都会执行，需要按情况注释一个 create 周期里执行方法
    await this.$nextTick() // 确保重绘完成
    console.log('activated')
    try {
      setTimeout(() => {
        this.$refs?.searchRef?.searchList()
      }, 10)
    } catch (error) {
      console.log('activated error', error)
    }
  },
  created() {
    window.$wujie?.bus.$on('wujieReload', (url) => {
      // 自行根据url链接判断当前的页面是否要调接口刷新---下面的是vue2的一个判断
      if (url && url.indexOf(this.$route.path) > -1) {
        console.log('======wujieReload====', url)
          this.$refs?.searchRef?.searchList()
      }
    })
    // 如果自己的应用中参数传了刷新，则进行刷新
    if (this.refresh) {
      this.$nextTick(() => {
        this.$refs?.searchRef?.searchList()
      })
    }
  },
  watch: {
    isCard() {
      this.listMultySelect = []
      this.page.pageNum = 1
      this.cardFirstLoad = false
      this.dataList = []
      console.log('isCard')
      this._search()
    }
  },
  methods: {
    // 刷新列表，从第一页开始
    _refresh() {
      this.listMultySelect = []
      this.page && (this.page.pageNum = 1)
      this.busy = false
      this.cardFirstLoad = false
      this.dataList = []
      this._search(true)
    },
    loadMore() {
      console.log('loadMore')
      // 临时解决首次加载两次问题
      if (this.cardFirstLoad) {
        this.page && (this.page.pageNum += 1)
        this._search(true)
      }
    },
    // 搜索栏高度变化监听
    tipHeightChange(val) {
      this.searchTipHeight = val
      this.resultStyle = {
        // 非卡片 需减去分页高度
        height: `calc(100% - ${val}px)`
      }
    },
    // 删除某个筛选项, 更新 searchParams 数据
    delFilter(fTip) {
      console.log('ftips==', fTip)
      if (fTip.labelKey === 'orgId') {
        const delIdx1 = this.filterTips.findIndex(item => item.labelKey === 'orgId')
        this.filterTips.splice(delIdx1, 1)
        delete this.searchParams['orgId']
        this.$refs.searchRef.delFilter('orgId')

        const delIdx2 = this.filterTips.findIndex(item => item.labelKey === 'districtId')
        this.filterTips.splice(delIdx2, 1)
        delete this.searchParams['districtId']
        this.$refs.searchRef.delFilter('districtId')
      } else {
        const delIdx = this.filterTips.findIndex(item => item.labelKey === fTip.labelKey)
        this.filterTips.splice(delIdx, 1)
        delete this.searchParams[fTip.labelKey]
        if (fTip.labelKey.toLowerCase() === 'daterange') {
          delete this.searchParams.createBeginTime
          delete this.searchParams.createEndTime
        }
        if (fTip.labelKey.toLowerCase() === 'areacascader') {
          delete this.searchParams.gridId
          delete this.searchParams.levels
        }
        if (fTip.labelKey.toLowerCase() === 'eventcascader') {
          delete this.searchParams.eventTypeLId
          delete this.searchParams.eventTypeMId
          delete this.searchParams.eventTypeId
          delete this.searchParams.eventTypeIdFour
          delete this.searchParams.eventTypeIdFive
        }
        this.$refs.searchRef.delFilter(fTip.labelKey)
      }
      console.log('this.searchParams===', this.searchParams)
      this._refresh()
    },
    // 清除所有筛选项
    clearFilters() {
      this.$refs.searchRef.clearSearchFilter()
      this.filterTips = []
      const params = this.speType && this.speType !== 'all' ? { speType: this?.$refs?.searchRef?.getSpeParam(this.speType) } : {}
      this.searchParams = params
      this._refresh()
    },
    // 获取筛选项数据变化
    dealwithFilter({ params, displayFilters }) {
      this.searchParams = params
      this.filterTips = displayFilters
      this._refresh()
    },
    // 列表展示时多选监听
    tbListSelectChange(val) {
      this.listMultySelect = val
    },
    // 表格内容格式化
    _formatter(_row, _column, cellValue) {
      if (cellValue === 0) {
        return cellValue
      }
      return cellValue || '--'
    }
  }
}
