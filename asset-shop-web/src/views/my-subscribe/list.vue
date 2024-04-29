<!--/*
* @Author: dingli
* @Desc:
* @Date:
*/-->
<template>
  <router-page-layout :path="myPath">
    <tree-layout
      :setting="setting"
      :show-tree="false"
      :options="options"
      :init-tags="tags"
      @getHeaderHeight="contentHeightChange"
      @getSearch="getSearch"
      @cacheTags="cacheTags"
    >
      <template v-slot:header="{searchForm}">
        <c-form :model="searchForm" label-width="70px" inline @submit.native.prevent>
          <c-form-item label="上架名称" class="lp-search-form-field">
            <c-input
              v-model="searchForm.packName"
              size="small"
              placeholder="请输入"
            ></c-input>
          </c-form-item>
          <c-form-item label="商城编码" class="lp-search-form-field">
            <c-input
              v-model="searchForm.shopCode"
              size="small"
              placeholder="请输入"
            ></c-input>
          </c-form-item>
          <c-form-item label="资源类型" class="lp-search-form-field">
            <c-cascader
              ref="refAssetType"
              v-model="searchForm.assetType"
              :options="ASSET_TYPE_TREE"
              class="search-right"
              :props="{children: 'childList'}"
              clearable
              :show-all-levels="false" />
          </c-form-item>
          <c-form-item v-if="pageType=='working'" label="订阅生效时间" class="lp-search-form-field">
            <c-date-picker
              v-model="searchForm.handleTime"
              style="width: 400px;"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="yyyy-MM-dd HH:mm:ss">
            </c-date-picker>
          </c-form-item>
          <template v-else>
            <c-form-item label="失效时间" class="lp-search-form-field">
              <c-date-picker
                v-model="searchForm.invalidTime"
                style="width:400px;"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss">
              </c-date-picker>
            </c-form-item>
            <c-form-item label="失效原因" class="lp-search-form-field">
              <c-input
                v-model="searchForm.invalidDesc"
                size="small"
                placeholder="请输入"
              ></c-input>
            </c-form-item>
          </template>
          <c-form-item label="申请资源主体" class="lp-search-form-field">
            <c-input
              v-model="searchForm.referPackName"
              size="small"
              placeholder="请输入"
            ></c-input>
          </c-form-item>
        </c-form>
      </template>
      <template v-slot:content-header_left>
        <total-info :search="hasSearch" :total="page.total" />
      </template>
      <template v-slot:content-header_right></template>
      <template v-slot:table>
        <c-table
          v-if="setting.tableHeight"
          v-loading="loading"
          :height="setting.tableHeight"
          :data="tableData"
          style="width: 100%"
        >
          <c-table-column type="index" label="" width="80">
            <template slot-scope="scope">{{ page.pageSize*(page.pageNum-1)+scope.$index+1 }}</template>
          </c-table-column>
          <c-table-column label="上架名称" prop="packName" show-overflow-tooltip min-width="200" />
          <c-table-column label="资源类型" prop="assetType" show-overflow-tooltip min-width="200">
            <template slot-scope="scope">{{ scope.row|asseTypeFormat }}</template>
          </c-table-column>
          <c-table-column label="商城编码" prop="shopCode" show-overflow-tooltip min-width="200" />
          <c-table-column label="申请资源主体" prop="referPackName" show-overflow-tooltip min-width="200" />
          <template v-if="pageType=='working'">
            <c-table-column label="订阅生效时间" prop="handleTime" show-overflow-tooltip min-width="200" />
            <c-table-column label="订阅时版本号" prop="packVersion" show-overflow-tooltip min-width="200" />
            <c-table-column label="最新版本号" prop="newestPackVersion" show-overflow-tooltip min-width="200" />
          </template>
          <template v-else>
            <c-table-column label="失效时间" prop="invalidTime" show-overflow-tooltip min-width="200" />
            <c-table-column label="失效原因" prop="invalidDesc" show-overflow-tooltip min-width="200" />
          </template>

          <c-table-column fixed="right" label="操作" :width="pageType=='working'?130:70">
            <template slot-scope="scope">
              <btn-group
                :btns="getbtns(scope.row)"
                @handleClick="handleOperateClick" />
            </template>
          </c-table-column>
        </c-table>
      </template>
      <template v-slot:footer>
        <div class="lp-page-footer">
          <c-pagination
            background
            :current-page.sync="page.pageNum"
            :page-size="page.pageSize"
            :total="page.total"
            layout="total,sizes, prev, pager, next, jumper"
            class="pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </c-pagination>
        </div>
        <dialogLog :visible="dialogLogVisible" :shop-code="shopCode" @close="dialogLogVisible=false" />
      </template>
    </tree-layout>
  </router-page-layout>
</template>
<script>
import treeLayout from '@/components/tree-layout'
import { querySubcribeList } from '@/api/index'
import { asseTypeFormatLong } from '@/utils/enum'
import dialogLog from './dialog-log.vue'
function initDataFn() {
  const routePaths = ['/subscribe/working', '/subscribe/invalid']
  const myPath = routePaths.indexOf(this.$route.path) === -1 ? '' : this.$route.path
  let pageType = 'working'
  if (myPath === '/subscribe/invalid') {
    pageType = 'invalid'
  }
  const ASSET_TYPE_TREE_MAP = []
  window.ENUMS.TAB_ASSET_TYPE.forEach(d => {
    ASSET_TYPE_TREE_MAP.push({ groupId: d.value, groupName: d.label })
    if (d.childList && d.childList.length) {
      d.childList.forEach(dd => {
        ASSET_TYPE_TREE_MAP.push({ groupId: dd.value, groupName: dd.label })
      })
    }
  })

  return { myPath, ASSET_TYPE_TREE_MAP, pageType }
}
export default {
  name: '',
  components: { treeLayout, dialogLog },
  filters: {
    asseTypeFormat(row) {
      return asseTypeFormatLong(row.assetType, row.assetSubtype)
    }
  },
  data() {
    const initData = initDataFn.apply(this)
    return {
      myPath: initData.myPath,
      pageType: initData.pageType,
      ASSET_TYPE_TREE_MAP: initData.ASSET_TYPE_TREE_MAP,
      ASSET_TYPE_TREE: window.ENUMS.TAB_ASSET_TYPE.filter(d => +d.value !== 99),
      setting: {
        tableHeight: 0,
        headerHeight: 80,
        headerMargin: 0,
        footerMargin: 0,
        footerHeight: 76
      },
      options: [
        { key: 'invalidTime', separator: ' 至 ', isTime: true },
        { key: 'handleTime', separator: ' 至 ', isTime: true },
        { key: 'assetType', value: initData.ASSET_TYPE_TREE_MAP },
        { key: 'applyStatusList', value: [{ groupId: 'item.value', groupName: 'item.label' }] }
      ],
      tags: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      loading: false,
      hasSearch: false,
      tableData: [],
      searchForm: {},
      dialogLogVisible: false,
      shopCode: ''
    }
  },
  computed: {},
  created() {
    if (this.$route.path.replace(/\/$/, '') !== this.myPath) return
    this.search()
  },
  mounted() {},
  destroyed() {},
  methods: {
    getbtns(row) {
      const map = [{
        label: '查看',
        row: row
      }, {
        label: '升级日志',
        row: row
      }]
      return this.pageType === 'working' ? map : [map[0]]
    },
    handleOperateClick(msg) {
      const row = msg.row
      switch (msg.label) {
        case '查看':
          this.$router.push({
            path: `${this.myPath}/detail`,
            query: {
              shopCode: row.shopCode,
              packVersion: row.newestPackVersion || row.packVersion,
              packVersionId: row.newestPackVersionId || row.packVersionId,
              applyId: row.applyId,
              assetType: row.assetSubtype
            }
          })
          break
        case '升级日志':
          this.shopCode = row.shopCode
          this.dialogLogVisible = true
          break
      }
    },
    contentHeightChange(val) {
      this.setting.tableHeight = document.getElementsByClassName('tree-layout-right')[0].offsetHeight - val - 108 - 64 + 'px'
    },
    cacheTags(tags) {
      this.tags = tags
    },
    getSearch(val) {
      this.searchForm = { ...val }
      if (this.searchForm.handleTime) {
        this.searchForm.handleTimeStart = this.searchForm.handleTime[0]
        this.searchForm.handleTimeEnd = this.searchForm.handleTime[1]
      } else {
        this.searchForm.handleTimeStart = ''
        this.searchForm.handleTimeEnd = ''
      }
      if (this.searchForm.invalidTime) {
        this.searchForm.invalidTimeStart = this.searchForm.invalidTime[0]
        this.searchForm.invalidTimeEnd = this.searchForm.invalidTime[1]
      } else {
        this.searchForm.invalidTimeStart = ''
        this.searchForm.invalidTimeEnd = ''
      }
      if (this.searchForm.assetType) {
        const [assetType, assetSubtype] = this.searchForm.assetType
        this.searchForm.assetType = assetType
        this.searchForm.assetSubtype = assetSubtype
      }

      this.handleSearch()
    },
    handleSearch() {
      this.hasSearch = true
      const pageNum = 1
      this.search(pageNum)
    },
    async search(pageNum = 1) {
      try {
        this.page.pageNum = pageNum
        const queryParams = this.getQueryParams(this.page.pageNum)
        queryParams.downloadStatus = this.pageType === 'working' ? 1 : 5

        console.log(queryParams)
        const result = await querySubcribeList(queryParams)
        this.tableData = result.data.list.map(item => {
          if (item.status === 1)item.version = ''
          return item
        })
        this.page.total = result.data.total
        this.doQueryCache(['searchForm', 'page', 'groupId', 'tags'])
      } catch (e) {
        console.error(e)
      }
    },
    getQueryParams(pageNum) {
      const search = this.hasSearch ? this.searchForm : {}
      return {
        ...search,
        pageSize: this.page.pageSize,
        pageNum: pageNum || this.page.pageNum
      }
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

        obj[this.cachesKey] = {}
        this.queryCacheDataNames.forEach(element => {
          obj[this.cachesKey][element] = this[element]
        })
        window.sessionStorage.setItem('queryCache', JSON.stringify(obj))
      }
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.search(this.page.pageNum)
    },
    handleCurrentChange(pageNum) {
      this.search(pageNum)
    }
  }
}
</script>
<style scoped lang="scss">
</style>
