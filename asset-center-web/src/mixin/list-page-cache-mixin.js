import { parseTime, openAssetEditorUrl, getPermissionByAssetsbutype } from '@/utils'
import { assetShare } from '@/api'
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

import { assetPack, checkInvalidAsset } from '@/api'
import { downloadFile, getUrlRelativePath } from '@/utils/downLoad'
import serviceSuffix, { getProxyUrl } from '@/api/service-suffix.js'
import {
  debounce
} from '@/utils/helper/tool'
export default {
  data() {
    return {
      pageListType: 'card',
      cachesKey: this.$route.path + this.$options.name,
      loading: false,
      tableHeight: null,
      tags: [],
      dialogVisibleChangeGroup: false,
      searchForm: {},
      timeRange: null, // 专为时间查询控件使用
      dataList: [],
      dialogVisibleCopy: false,
      dialogVisibleImport: false,
      dialogVisibleCopyCommon: false,
      previewUrl: getProxyUrl(serviceSuffix.fdfs_preview_prefix) + '/',
      dialogVisibleSelect: false,
      pageSizeArr: [15, 30, 60, 90],
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      queryCacheDataNames: [], // 指定需要缓存的组件数据名称
      hasSearch: false,
      getPermissionByAssetsbutype
    }
  },
  beforeRouteEnter(to, from, next) {
    // console.log(to.query, from.query.cache)
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
  watch: {
    pageListType(nv, ov) {
      if (nv !== ov) {
        this.doQueryCache(this.queryCacheDataNames)
      }
    }
  },
  methods: {
    openAssetEditorUrl(row) {
      openAssetEditorUrl(row, this.$message)
    },
    getbtns(row) {
      const map = [{
        permissionKey: 'view',
        label: '查看',
        row: row
      },
      {
        permissionKey: 'edit',
        label: '编辑',
        row: row,
        disabled: row.status !== 1
      },
      {
        permissionKey: 'design',
        label: '接口注册',
        hide: row.subtype !== 22,
        row: row,
        disabled: row.status !== 1

      },

      {
        permissionKey: 'design',
        label: '流程设计',
        hide: row.assetType !== 5,
        row: row,
        disabled: row.status !== 1
      },
      {
        permissionKey: 'design',
        label: '对象设计',
        hide: row.assetType !== 3,
        row: row,
        disabled: row.status !== 1
      },
      {
        permissionKey: 'design',
        label: '指标设计',
        hide: row.subtype !== 11,
        row: row,
        disabled: row.status !== 1
      },
      {
        permissionKey: 'design',
        label: '体征注册',
        hide: row.subtype !== 14,
        row: row,
        disabled: row.status !== 1
      },
      {
        permissionKey: 'design',
        label: '模型注册',
        hide: row.subtype !== 72,
        row: row,
        disabled: row.status !== 1
      },
      {
        permissionKey: 'share',
        label: '共享',
        hide: row.sharedFlag && row.sharedFlag !== 0,
        row: row,
        disabled: row.status === 1
      },
      {
        permissionKey: 'share',
        label: '取消共享',
        hide: row.sharedFlag !== 1,
        row: row,
        disabled: row.status === 1
      },
      {
        permissionKey: 'design',
        label: '页面设计',
        hide: row.subtype !== 23,
        row: row,
        disabled: row.status !== 1
      },
      {
        permissionKey: 'design',
        label: '脚本设计',
        hide: row.subtype !== 26,
        row: row,
        disabled: row.status !== 1
      },
      {
        permissionKey: 'design',
        label: '函数设计',
        hide: row.subtype !== 24,
        row: row,
        disabled: row.status !== 1
      },
      {
        permissionKey: 'design',
        label: '任务设计',
        hide: row.subtype !== 25,
        row: row,
        disabled: row.status !== 1
      },
      {
        permissionKey: 'public',
        label: '发布',
        row: row,
        disabled: row.status !== 1
      },
      {
        permissionKey: 'design',
        label: '任务',
        hide: row.subtype !== 13 || !row.referKpiId,
        row: row,
        disabled: row.status !== 5
      },
      {
        permissionKey: 'copy',
        label: '复制',
        hide: row.subtype === 11 || (row.subtype === 13 && row.referKpiId) || row.subtype === 72, // 数据 指标 不显示
        row: row,
        disabled: !(row.status === 1 || row.status === 5)
      },
      {
        permissionKey: 'pack',
        label: row.packStatus && row.packStatus === 1 ? '打包中' : '打包',
        hide: row.status !== 5 || row.subtype === 11 || row.subtype === 22 || (row.subtype === 13 && row.referKpiId) || row.subtype === 72, // 数据 接口 指标 不显示
        row: row,
        disabled: row.packStatus && row.packStatus !== 3
      },
      {
        permissionKey: 'pack',
        label: '下载',
        hide: row.packStatus !== 2 || row.subtype === 11 || row.subtype === 22 || (row.subtype === 13 && row.referKpiId) || row.subtype === 72, // 数据 接口 指标 不显示
        row: row,
        disabled: row.status !== 5
      },
      {
        permissionKey: 'delete',
        label: '删除',
        row: row
      }, {
        permissionKey: 'changeGroup',
        label: '场景切换',
        row: row,
        hide: row.subtype !== 13 && row.subtype !== 51
      }]
      return map.filter(d => !d.hide && getPermissionByAssetsbutype(row.subtype, d.permissionKey))
    },
    shareAsset: debounce(function(id, flag) {
      this.$confirm(
        '是否' + (+flag === 1 ? '共享' : '取消共享') + '该资源',
        '提示',
        {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true,
          type: 'warning'
        }
      )
        .then((res) => {
          assetShare({
            id,
            optType: flag
          }).then(res => {
            if (flag === '1') {
              this.$message('共享成功')
            } else {
              this.$message('取消共享成功')
            }
            this.getList()
          })
        })
        .catch(() => {

        })
    }, 500),
    closeCopyDialog(search = false) {
      console.log(search, 'search')
      this.dialogVisibleCopy = false
      this.currAsset = {}
      if (search) {
        this.getList()
      }
    },
    closeChangeGroupDialog(search = false) {
      this.dialogVisibleChangeGroup = false
      this.currAsset = {}
      if (search) {
        this.getList()
      }
    },
    closeImportDialog(search = false) {
      this.dialogVisibleImport = false
      this.currAsset = {}
      if (search) {
        this.getList()
      }
    },
    closeSelectDialog(search = false) {
      this.dialogVisibleSelect = false
      this.currAsset = {}
      if (search) {
        this.getList()
      }
    },
    // 显示复制弹框
    showCopyAssetDialog(currAsset) {
      this.currAsset = currAsset
      this.dialogVisibleCopy = true
    },
    // 显示复制公共弹框
    showCommonDialog(currAsset) {
      this.currAsset = currAsset
      this.dialogVisibleCopyCommon = true
    },
    // 显示复制公共弹框
    closeCommonDialog(search) {
      this.currAsset = {}
      this.dialogVisibleCopyCommon = false
      if (search) {
        this.getList()
      }
    },
    // 显示切换场景弹框
    showChangeGroupDialog(currAsset) {
      this.currAsset = currAsset
      this.dialogVisibleChangeGroup = true
    },
    // 显示导入弹框
    showImportDialog(currAsset) {
      this.currAsset = currAsset
      this.dialogVisibleImport = true
    },
    // 显示复制弹框
    showSelectAssetDialog(currAsset) {
      this.currAsset = currAsset
      this.dialogVisibleSelect = true
    },
    // 打包
    packageAsset(ass) {
      this.$confirm(
        '<strong class="confirm-title">请确认是否将该资源打包？</strong><br><p class="confirm-subtitle">打包预计时间约为1分钟，请稍后刷新页面查看</p>',
        '提示',
        {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true,
          type: 'warning'
        }
      )
        .then((res) => {
          // const loading = this.$loading({
          //   lock: true,
          //   text: '资源打包中...',
          //   fullscreen: false,
          //   background: 'rgba(0, 0, 0, 0)'
          // });
          assetPack({ assetCode: ass.assetCode, version: ass.version }).then(res => {
            this.search()
            // loading.close();
            // this.downloadAsset(res.data.packFilePath, ass.assetCode + '_' + ass.version + '.zip')
          }).catch(() => {
            // loading.close();
          })
        })
        .catch(() => {

        })
    },
    // 下载
    downloadAsset(ass) {
      if (ass.packFilePath) {
        let url = ass.packFilePath
        const fileName = ass.assetCode + '_' + ass.version + '.zip'
        if (!url) return this.$message.warning('资源地址为空')
        if (/http/.test(url)) {
          url = getUrlRelativePath(url)
        }
        console.log(url, 'urlurl')
        url = this.previewUrl + url.replace('?', '&')
        downloadFile(url, fileName)
      }
    },
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
        if (obj[this.cachesKey]) {
          for (const key in obj[this.cachesKey]) {
            this[key] = obj[this.cachesKey][key]
          }
        }
        obj[this.cachesKey] = ''
        window.sessionStorage.setItem('queryCache', JSON.stringify(obj))
      }
      this.search(this.page.pageNum)
    },
    cacheTags(tags) {
      this.tags = tags
    },
    getSearch(val) {
      this.searchForm = { ...val }
      this.handleSearch()
    },
    contentHeightChange(val) {
      this.setting.tableHeight = document.getElementsByClassName('tree-layout-right')[0].offsetHeight - val - 91 - 44 + 'px'
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
    getQueryParams(pageNum) {
      const search = this.hasSearch ? this.searchForm : {}
      return {
        ...search,
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
    },
    dateFormatter(row, column, data) {
      return parseTime(data)
    },
    // 发布资源
    postAsset(currAsset) {
      checkInvalidAsset({
        id: currAsset.id,
        resourceType: 'asset'
      }).then(res => {
        if (res.data.result === 1) {
          this.$message.error('存在失效的订阅资源，不能进行资源发布！');
          return
        }
        this.postDailogFlag = true
        this.currAsset = currAsset
      })
    },
    doQueryCache(arr) {
      this.queryCacheDataNames = arr // 指定缓存的数据名称
      if (arr.indexOf('hasSearch') === -1) {
        this.queryCacheDataNames.push('hasSearch')
      }
      if (arr.indexOf('pageListType') === -1) {
        this.queryCacheDataNames.push('pageListType')
      }
      const cache = window.sessionStorage.getItem('queryCache')
      let obj = {}
      if (cache) {
        obj = JSON.parse(cache)
      }
      if (this.queryCacheDataNames) {
        // 如果有设置缓存数据就缓存

        obj[this.cachesKey] = {}
        this.queryCacheDataNames.forEach(element => {
          obj[this.cachesKey][element] = this[element]
        })
        window.sessionStorage.setItem('queryCache', JSON.stringify(obj))
      }
    }
  }
}
