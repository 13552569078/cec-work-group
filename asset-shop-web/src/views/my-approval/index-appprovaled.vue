<!--
 * @Description: 我的申请
 * @Author: lianpeng
 * @Date: 2022-04-24
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
          <c-form-item label="审核状态" class="lp-search-form-field">
            <c-select
              v-model="searchForm.applyStatusList"
              :specific-suffix="true"
              class="form-input-item"
              size="small"
              placeholder="请选择">
              <c-option v-for="item in applyStatusList" :key="item.value" :label="item.label" :value="item.value"></c-option>

            </c-select>
          </c-form-item>

          <c-form-item label="发起时间" class="lp-search-form-field">
            <c-date-picker
              v-model="searchForm.applyTime"
              style="width: 400px;"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss">
            </c-date-picker>
          </c-form-item>

          <c-form-item label="发起人" class="lp-search-form-field">
            <c-input
              v-model="searchForm.applyUserName"
              size="small"
              placeholder="请输入"
            ></c-input>
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
            <c-table-column
              prop="applyType"
              label="资源类型"
              show-overflow-tooltip
              min-width="200"
            >
              <template slot-scope="scope">
                {{ asseTypeFilter(scope.row.assetType, scope.row.assetSubtype) }}
              </template>
            </c-table-column>
            <c-table-column label="资源名称" prop="packName" show-overflow-tooltip min-width="200" />
            <c-table-column
              prop="shopCode"
              label="资源编码"
              show-overflow-tooltip
              min-width="200"
            />
            <c-table-column
              prop="applyType"
              label="申请类型"
              show-overflow-tooltip
              min-width="200"
            >
              <template slot-scope="scope">
                {{ scope.row.applyType|applyTypeFilter }}
              </template>
            </c-table-column>
            <c-table-column
              prop="packVersion"
              label="版本号"
              show-overflow-tooltip
              min-width="120"
            >
            </c-table-column>

            <c-table-column
              prop="applyStatus"
              label="审核状态"
              show-overflow-tooltip
              min-width="160"
            >
              <template slot-scope="scope">
                <div :class="getApplyStatus(scope.row.applyStatus).class">
                  <i></i>
                  <span>{{ getApplyStatus(scope.row.applyStatus).title }}</span>
                </div>
              </template>
            </c-table-column>
            <c-table-column
              prop="applyUserName"
              label="发起人"
              show-overflow-tooltip
              min-width="170"
            >
            </c-table-column>
            <c-table-column
              prop="applyTime"
              label="发起时间"
              show-overflow-tooltip
              min-width="170"
            >
            </c-table-column>
            <c-table-column
              prop="handleTime"
              label="审核时间"
              show-overflow-tooltip
              min-width="170"
            >
              <template slot-scope="scope">

                <span>{{ scope.row.handleTime||'--' }}</span>

              </template>
            </c-table-column>
            <c-table-column fixed="right" label="操作" width="90">
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
            layout="total,sizes, prev, pager, next, jumper"
            class="pagination"
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
import { applyAuditList } from '@/api'
import { applyTypeList, applyStatusList, applyObjectList } from '@/config'
import { asseTypeFormatLong } from '@/utils/enum'
export default {
  name: '',
  components: { treeLayout },
  filters: {
    applyTypeFilter(val) {
      let res = ''
      switch (val) {
        case 1:
          res = '资源下载'
          break
        case 2:
          res = '订阅申请'
          break
        case 3:
          res = '权限分配'
          break
        case 4:
          res = '独立部署'
          break

        default:
          break
      }
      return res
    },
    applyObjectFilter(val) {
      const res = applyObjectList.find(item => item.value + '' === val + '') || {}
      return res.label
    }
  },
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
      myPath: '/myApproval/appprovaled',
      setting: {
        tableHeight: 0,
        headerHeight: 80,
        headerMargin: 0,
        footerMargin: 0,
        footerHeight: 76
      },
      applyTypeList: applyTypeList,
      applyObjectList: applyObjectList,
      applyStatusList: [{ value: '1', label: '已通过' },
        { value: '2', label: '已驳回' }],
      options: [
        { key: 'applyTime', separator: ' 至 ', isTime: true },
        { key: 'handleTime', separator: ' 至 ', isTime: true },
        { key: 'applyStatusList', value: applyStatusList.map(item => ({ groupId: item.value, groupName: item.label })) },
        { key: 'applyObject', value: applyObjectList.map(item => ({ groupId: item.value, groupName: item.label })) },
        { key: 'assetType', value: ASSET_TYPE_TREE_MAP },
        { key: 'applyType', value: applyTypeList.map(item => ({ groupId: item.value, groupName: item.label })) }
      ],
      searchForm: {
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
      ASSET_TYPE_TREE: window.ENUMS.TAB_ASSET_TYPE
    }
  },
  computed: {},
  created() {
    if (this.$route.path.replace(/\/$/, '') !== this.myPath) return
    this.init()
  },
  destroyed() {
  },
  methods: {
    init() {
      this.getList()
    },
    asseTypeFilter(assetType, assetSubtype) {
      return asseTypeFormatLong(assetType, assetSubtype)
    },
    handleLink(item, index) {
      if (item.path) {
        return this.$router.push(item.path)
      }
    },
    getApplyStatus(status) {
      let res = ''
      let title = ''
      switch (status) {
        case 0:
          res = 'padding'
          title = '审核中'
          break
        case 1:
          res = 'fulfilled'
          title = '已通过'
          break
        case 2:
          res = 'rejected'
          title = '已驳回'
          break

        default:
          break
      }
      return { class: res, title: title }
    },
    getbtns(row) {
      return [{
        label: '查看',
        row: row
      }
      ]
    },
    handleOperateClick(msg) {
      switch (msg.label) {
        case '查看':
          this.editData(msg.row, 'detail')
          break
      }
    },
    goto(flag) {
      switch (flag) {
        case 'approvaling':
          this.$router.push('/myApproval')
          break
        case 'approvaled':
          this.$router.push('/myApproval/appprovaled')
          break

        default:
          break
      }
    },
    editData(row, flag) {
      if (row.applyObject + '' === '1') { // 资源
        this.$router.push({
          path: '/myApproval/appprovaled/assetDetail',
          query: {
            applyId: row.id,
            shopCode: row.shopCode,
            packVersion: row.packVersion,
            packVersionId: row.packVersionId,
            assetType: row.assetSubtype
          }
        })
      } else if (row.applyObject + '' === '2') { // 应用
        this.$router.push({
          path: '/myApproval/appprovaled/appDetail',
          query: {
            applyId: row.id,
            shopCode: row.shopCode,
            packVersion: row.packVersion
          }
        })
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
      if (this.searchForm.handleTime) {
        this.searchForm.handleTimeStart = this.searchForm.handleTime[0]
        this.searchForm.handleTimeEnd = this.searchForm.handleTime[1]
      } else {
        this.searchForm.handleTimeStart = ''
        this.searchForm.handleTimeEnd = ''
      }
      if (this.searchForm.applyTime) {
        this.searchForm.applyTimeStart = this.searchForm.applyTime[0]
        this.searchForm.applyTimeEnd = this.searchForm.applyTime[1]
      } else {
        this.searchForm.applyTimeStart = ''
        this.searchForm.applyTimeEnd = ''
      }
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
        queryParams.applyStatusList = queryParams.applyStatusList && queryParams.applyStatusList.length ? [queryParams.applyStatusList] : [1, 2]
        queryParams.orderKey = 'handleTime'
        queryParams.orderType = 'desc'
        queryParams.currentTenant = 1
        const result = await applyAuditList(queryParams)
        this.tableData = result.data.list.map(item => {
          if (item.status === 1)item.version = ''
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
.padding{
  color: #1E6FFF;
  display: flex;
  align-items: center;
  i{
    width: 16px;
    height: 16px;
    display: inline-block;
    background: url(~@/assets/imgs/icon-1.png) no-repeat center ;
background-size: 100%;
  }
}
.fulfilled{
  color: #4CC09E;
  display: flex;
  align-items: center;
i{
    width: 16px;
    height: 16px;
    display: inline-block;
    background: url(~@/assets/imgs/icon-2.png) no-repeat center ;
background-size: 100%;
  }
}
.rejected{
  color: #FF4D4F;
  display: flex;
  align-items: center;
i{
    width: 16px;
    height: 16px;
    display: inline-block;
    background: url(~@/assets/imgs/icon-3.png) no-repeat center ;
background-size: 100%;
  }
}
</style>
