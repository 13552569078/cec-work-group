<!--
 * @Description:给他人的评价
 * @Author:
 * @Date:
-->

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
          <c-form-item label="资源名称" class="lp-search-form-field">
            <c-input
              v-model="searchForm.packName"
              size="small"
              placeholder="请输入"
            ></c-input>
          </c-form-item>
          <c-form-item label="资源编码" class="lp-search-form-field">
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
              :specific-suffix="true"
              :options="ASSET_TYPE_TREE"
              class="search-right"
              :props="{children: 'childList'}"
              clearable
              :show-all-levels="false" />
          </c-form-item>
          <c-form-item label="申请类型" class="lp-search-form-field">
            <c-select
              v-model="searchForm.applyType"
              :specific-suffix="true"
              class="form-input-item"
              size="small"
              placeholder="请选择">
              <c-option v-for="item in applyTypeList" :key="item.value" :label="item.label" :value="item.value"></c-option>
            </c-select>
          </c-form-item>
        </c-form>
      </template>
      <template v-slot:content-header_left>
        <total-info :search="hasSearch" :total="page.total" />
      </template>
      <template v-slot:content-header_right>
      </template>
      <template v-slot:table>
        <div>
          <c-table
            v-if="setting.tableHeight"
            v-loading="loading"
            :height="setting.tableHeight"
            :data="tableData"
            style="width: 100%"
          >
            <c-table-column
              type="index"
              label=""
              width="80"
            >
              <template slot-scope="scope">{{ page.pageSize*(page.pageNum-1)+scope.$index+1 }}</template>
            </c-table-column>
            <c-table-column v-for="c in columns" :key="c.prop" :label="c.label" :prop="c.prop" show-overflow-tooltip :width="c.width||200">
            </c-table-column>
            <c-table-column fixed="right" label="操作" :width="110">
              <template slot-scope="scope">
                <btn-group
                  :btns="getbtns(scope.row)"
                  @handleClick="handleOperateClick" />
              </template>
            </c-table-column>
          </c-table>
        </div>
      </template>
      <template v-slot:footer>
        <div class="lp-page-footer">
          <c-pagination
            background
            :current-page.sync="page.pageNum"
            :page-size="page.pageSize"
            :total="page.total"
            class="pagination"
            layout="total,sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </c-pagination>
        </div>
      </template>
    </tree-layout>
  </router-page-layout>
</template>
<script>
import treeLayout from '@/components/tree-layout'
import { appraiseReceiveList } from '@/api'
import { applyTypeList } from '@/config'
import { asseTypeFormatLong } from '@/utils/enum'
export default {
  name: '',
  components: { treeLayout },
  data() {
    const ASSET_TYPE_TREE_MAP = []
    window.ENUMS.TAB_ASSET_TYPE.forEach(d => {
      ASSET_TYPE_TREE_MAP.push({ groupId: d.value, groupName: d.label })
      if (d.childList && d.childList.length) {
        d.childList.forEach(dd => {
          ASSET_TYPE_TREE_MAP.push({ groupId: dd.value, groupName: dd.label })
        })
      }
    })
    return {
      myPath: '/myAppraise/received',
      setting: {
        tableHeight: 0,
        headerHeight: 80,
        headerMargin: 0,
        footerMargin: 0,
        footerHeight: 76
      },
      // 资源的申请类型只有“资源下载、订阅”
      applyTypeList: applyTypeList,
      options: [
        { key: 'assetType', value: ASSET_TYPE_TREE_MAP },
        { key: 'applyType', value: applyTypeList.map(item => ({ groupId: item.value, groupName: item.label })) }
      ],
      searchForm: {
        applyType: '',
        applyObject: 1
      },
      hasSearch: false,
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      loading: false,
      tableData: [],
      tags: [],
      ASSET_TYPE_TREE: window.ENUMS.TAB_ASSET_TYPE,
      shopCode: '',
      columns: [
        { label: '资源名称', prop: 'packName' },
        { label: '资源编码', prop: 'shopCode' },
        { label: '资源类型', prop: '_assetTypeName' },
        { label: '申请类型', prop: '_applyTypeName', width: 150 },
        { label: '申请版本', prop: 'packVersion', width: 150 },
        { label: '评价星级', prop: 'score', width: 120 },
        { label: '评价人', prop: 'appraiseUserName' },
        { label: '评价时间', prop: 'appraiseTime' }
      ]
    }
  },
  created() {
    if (this.$route.path.replace(/\/$/, '') !== this.myPath) return
    this.getList()
  },
  methods: {
    getbtns(row) {
      return [{ label: '查看评价', row: row }]
    },
    handleOperateClick(msg) {
      const row = msg.row
      switch (msg.label) {
        case '查看评价':
          this.$router.push({
            path: '/myAppraise/received/detail',
            query: {
              flag: 'received',
              id: row.id
            }
          })
          break
      }
    },
    contentHeightChange(val) {
      this.setting.tableHeight = document.getElementsByClassName('tree-layout-right')[0].offsetHeight - val - 108 - 64 + 'px'
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.search(this.page.pageNum)
    },
    handleCurrentChange(pageNum) {
      this.search(pageNum)
    },
    getSearch(val) {
      this.searchForm = { ...val }
      console.log(this.searchForm, '-------')
      if (this.searchForm.assetType) {
        const [assetType, assetSubtype] = this.searchForm.assetType
        this.searchForm.assetType = assetType
        this.searchForm.assetSubtype = assetSubtype
      }

      this.handleSearch()
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
    cacheTags(tags) {
      this.tags = tags
    },
    handleSearch() {
      this.hasSearch = true
      const pageNum = 1
      this.search(pageNum)
    },
    search(pageNum = 1) {
      this.page.pageNum = pageNum
      this.getList()
    },
    // 检索
    async getList() {
      this.loading = true
      try {
        const queryParams = this.getQueryParams(this.page.pageNum)
        const result = await appraiseReceiveList(queryParams)
        this.tableData = result.data.list.map(item => {
          const _applyTypeName = this.applyTypeList.find(d => +d.value === +item.applyType)
          item._applyTypeName = _applyTypeName ? _applyTypeName.label : '--'
          item._assetTypeName = asseTypeFormatLong(item.assetType, item.assetSubtype) || '--'
          return item
        })
        this.page.total = result.data.total
        this.doQueryCache(['searchForm', 'page', 'groupId', 'tags'])
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    }
  }
}
</script>
<style scoped lang="scss">
</style>
