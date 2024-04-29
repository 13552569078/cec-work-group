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
            <c-table-column v-for="c in columns" :key="c.prop" :label="c.label" :prop="c.prop" show-overflow-tooltip min-width="200" />
            <c-table-column fixed="right" label="操作" :width="pageTabKey==1?120:70">
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
            class="pagination"
            :total="page.total"
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
import { applyUserList } from '@/api'
import { applyTypeList } from '@/config'
import myMixin from '@/mixin/list-page-cache-mixin.js'
export default {
  name: '',
  components: { treeLayout },
  mixins: [myMixin],
  data() {
    return {
      myPath: '/myApply/app',
      pageTabKey: '0',
      setting: {
        tableHeight: 0,
        headerHeight: 80,
        headerMargin: 0,
        footerMargin: 0,
        footerHeight: 76
      },
      // 申请类型没有“订阅”
      applyTypeList: applyTypeList.filter(d => +d.value !== 2),
      options: [
        { key: 'applyType', value: applyTypeList.map(item => ({ groupId: item.value, groupName: item.label })) }
      ],
      searchForm: {
        applyType: '',
        applyObject: 2
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
      columns: []
    }
  },
  watch: {
    pageTabKey: {
      handler(nv) {
        this.tableData = []
        this.page.total = 0
        this.getList()
        const columns = [
          { label: '资源名称', prop: 'packName' },
          { label: '资源编码', prop: 'shopCode' },
          { label: '申请类型', prop: '_applyTypeName' },
          { label: '申请版本', prop: 'packVersion' }
        ]
        if (+nv === 0) {
          this.columns = [...columns, { label: '发起时间', prop: 'applyTime' }]
        } else if (+nv === 1) {
          this.columns = [...columns, { label: '审核时间', prop: 'handleTime' }]
        } else if (+nv === 2) {
          this.columns = [...columns, { label: '审核意见', prop: 'auditMsg' }]
        }
      },
      immediate: true
    }
  },
  created() {
    if (this.$route.path.replace(/\/$/, '') !== this.myPath) return
  },
  methods: {
    goto(flag) {
      switch (flag) {
        case 'assetApply':
          this.$router.push('/myApply')
          break
        case 'appApply':
          this.$router.push('/myApply/app')
          break

        default:
          break
      }
    },
    handleLink(item, index) {
      if (item.path) {
        return this.$router.push(item.path)
      }
    },
    getbtns(row) {
      const arr = [{ label: '查看', row: row }]
      if (+this.pageTabKey === 1) {
        return [
          ...arr,
          { label: '评价', row: row, disabled: !!row.appraiseId }
        ]
      }
      return arr
    },
    handleOperateClick(msg) {
      switch (msg.label) {
        case '查看':
          this.editData(msg.row, 'detail')
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
      }
    },
    editData(row, flag) {
      this.$router.push({
        path: '/myApply/appDetail',
        query: {
          applyId: row.id,
          shopCode: row.shopCode,
          packVersion: row.packVersion,
          cache: true
        }
      })
    },
    contentHeightChange(val) {
      this.setting.tableHeight = document.getElementsByClassName('tree-layout-right')[0].offsetHeight - val - 108 - 64 - 50 + 'px'
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
        queryParams.applyObject = 2
        queryParams.applyStatus = this.pageTabKey
        const result = await applyUserList(queryParams)
        this.tableData = result.data.list.map(item => {
          if (item.status === 1) {
            item.version = '--'
          }
          const _applyTypeName = this.applyTypeList.find(d => +d.value === +item.applyType)
          item._applyTypeName = _applyTypeName ? _applyTypeName.label : '--'
          item.handleTime = item.handleTime || '--'
          item.auditMsg = item.auditMsg || '--'
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
