<!--
 * @Description: 我的申请
 * @Author: lianpeng
 * @Date: 2022-04-24
-->

<template>
  <router-page-layout :path="myPath">
    <div class="page-tab-wrap">
      <c-tabs v-model="pageTabKey" type="box">
        <c-tab-pane label="待审核" name="0"></c-tab-pane>
        <c-tab-pane label="已通过" name="1"></c-tab-pane>
        <c-tab-pane label="已驳回" name="2"></c-tab-pane>
      </c-tabs>
    </div>
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
            v-if="setting.tableHeight&&tableShow"
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
            <c-table-column v-for="c in columns" :key="c.prop" label="" :prop="c.prop" show-overflow-tooltip min-width="200">
              <template slot="header" slot-scope="">
                {{ c.label }}
                <c-tooltip v-if="c.tips" placement="top" popper-class="cls-form-label-tip" content="">
                  <div slot="content" v-html="c.tips">
                  </div>
                  <i class="cls-icon-info"></i>
                </c-tooltip>
              </template>
            </c-table-column>
            <c-table-column fixed="right" label="" :width="pageTabKey==1?180:70">
              <template slot="header" slot-scope="">
                操作
                <c-tooltip v-if="pageTabKey==1" placement="top" popper-class="cls-form-label-tip" content="">
                  <div slot="content" v-html="'仅生效中的订阅申请可查看升级日志'">
                  </div>
                  <i class="cls-icon-info"></i>
                </c-tooltip>
              </template>
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
        <dialogLog :visible="dialogLogVisible" :shop-code="shopCode" @close="dialogLogVisible=false" />
      </template>
    </tree-layout>
  </router-page-layout>
</template>
<script>
import treeLayout from '@/components/tree-layout'
import { applyUserList } from '@/api'
import { applyTypeList } from '@/config'
import { asseTypeFormatLong } from '@/utils/enum'
import dialogLog from './dialog-log.vue'
import myMixin from '@/mixin/list-page-cache-mixin.js'
export default {
  name: '',
  components: { treeLayout, dialogLog },
  mixins: [myMixin],
  data() {
    const ASSET_TYPE_TREE_MAP = []
    window.ENUMS.TAB_ASSET_TYPE.forEach(d => {
      if (+d.value !== 99) {
        ASSET_TYPE_TREE_MAP.push({ groupId: d.value, groupName: d.label })
        if (d.childList && d.childList.length) {
          d.childList.forEach(dd => {
            ASSET_TYPE_TREE_MAP.push({ groupId: dd.value, groupName: dd.label })
          })
        }
      }
    })
    return {
      myPath: '/myApply/asset',
      pageTabKey: '0',
      setting: {
        tableHeight: 0,
        headerHeight: 80,
        headerMargin: 0,
        footerMargin: 0,
        footerHeight: 76
      },
      // 资源的申请类型只有“资源下载、订阅”
      applyTypeList: applyTypeList.filter(d => +d.value === 1 || +d.value === 2),
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
      columns: [],
      tableShow: true,
      ASSET_TYPE_TREE: window.ENUMS.TAB_ASSET_TYPE.filter(d => +d.value !== 99),
      downloadStatusMap: {
        1: '生效中',
        5: '已失效'
      },
      shopCode: '',
      dialogLogVisible: false
    }
  },
  watch: {
    pageTabKey: {
      handler(nv) {
        this.tableShow = false
        this.tableData = []
        this.page.total = 0
        this.getList()
        const columns = [
          { label: '资源名称', prop: 'packName' },
          { label: '资源编码', prop: 'shopCode' },
          { label: '资源类型', prop: '_assetTypeName' },
          { label: '申请类型', prop: '_applyTypeName' },
          { label: '申请版本', prop: 'packVersion' }
        ]
        if (+nv === 0) {
          this.columns = [...columns, { label: '发起时间', prop: 'applyTime' }]
        } else if (+nv === 1) {
          this.columns = [
            ...columns,
            { label: '生效状态', prop: '_downloadStatusName', tips: '生效中的资源支持正常使用。下载申请成功后，该版本资源将一直生效；订阅申请成功后，若存在升级情况，则仅能使用最新版本的该资源（无需再次订阅）' },
            { label: '最新版本', prop: 'newestPackVersion', tips: '仅生效中的订阅申请显示' },
            { label: '审核时间', prop: 'handleTime' }
          ]
        } else if (+nv === 2) {
          this.columns = [...columns, { label: '审核意见', prop: 'auditMsg' }]
        }
        this.$nextTick(() => {
          this.tableShow = true
        })
      },
      immediate: true
    }
  },
  created() {
    if (this.$route.path.replace(/\/$/, '') !== this.myPath) return
  },
  methods: {
    asseTypeFilter(assetType, assetSubtype) {
      return asseTypeFormatLong(assetType, assetSubtype)
    },
    getbtns(row) {
      const arr = [{ label: '查看', row: row }]
      if (+this.pageTabKey === 1) {
        return [
          ...arr,
          { label: '评价', row: row, disabled: !!row.appraiseId },
          { label: '升级日志', row: row, disabled: !(+row.downloadStatus === 1 && +row.applyType === 2) }
        ]
      }
      return arr
    },
    handleOperateClick(msg) {
      const row = msg.row
      switch (msg.label) {
        case '查看':
          this.$router.push({
            path: '/myApply/assetDetail',
            query: {
              applyId: row.id,
              applyType: row.applyType,
              shopCode: row.shopCode,
              packVersion: row.packVersion,
              packVersionId: row.packVersionId,
              assetType: row.assetSubtype || '',
              cache: true
            }
          })
          break
        case '评价':
          this.$router.push({
            path: '/myAppraise/others/form',
            query: {
              applyId: msg.row.id,
              cache: true
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
      this.setting.tableHeight = document.getElementsByClassName('tree-layout-right')[0].offsetHeight - val - 108 - 64 - 50 + 'px'
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
    cacheTags(tags) {
      this.tags = tags
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
        queryParams.applyObject = 1
        queryParams.applyStatus = this.pageTabKey
        const result = await applyUserList(queryParams)
        this.tableData = result.data.list.map(item => {
          if (item.status === 1) {
            item.version = '--'
          }
          const _applyTypeName = this.applyTypeList.find(d => +d.value === +item.applyType)
          item._applyTypeName = _applyTypeName ? _applyTypeName.label : '--'
          item._assetTypeName = this.asseTypeFilter(item.assetType, item.assetSubtype) || '--'
          item.handleTime = item.handleTime || '--'
          item._downloadStatusName = this.downloadStatusMap[item.downloadStatus] || '--'
          item.auditMsg = item.auditMsg || '--'
          item.newestPackVersion = item.newestPackVersion || '--'
          return item
        })
        this.page.total = result.data.total
        this.doQueryCache(['searchForm', 'page', 'tags', 'pageTabKey'])
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    }
  }
}
</script>
<style scoped lang="scss">
::v-deep.page-tab-wrap {
  padding-left: 20px;
  padding-top: 20px;
  background: white;
  .c-tabs__header {
    margin-bottom: 0px;
  }
  .c-tabs__content {
    display: none;
  }
}
</style>
