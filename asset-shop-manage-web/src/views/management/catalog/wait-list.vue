<!--
 * @Description: 等待审核列表
 * @Author: zs
 * @Date: 2022-01-20
-->
<template>
  <router-page-layout :path="myPath">
    <div class="page-wrap">
      <list-search @changeHeight="getHeaderHeight" @search="getSearch">
        <template v-slot:header="{ searchForm }">
          <c-form :model="searchForm" label-width="70px" inline>
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
                :options="ASSET_TYPE_TREE"
                class="search-right"
                :props="{children: 'childList'}"
                clearable
                :show-all-levels="false" />
            </c-form-item>
            <c-form-item label="申请类型" class="lp-search-form-field">
              <c-select
                v-model="searchForm.applyType"
                size="small"
                :specific-suffix="true"
                placeholder="请选择"
              >
                <c-option
                  v-for="item in applyTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </c-option>
              </c-select>
            </c-form-item>
            <c-form-item label="发起人" class="lp-search-form-field">
              <c-input
                v-model="searchForm.applyUserName"
                size="small"
                placeholder="请输入"
              ></c-input>
            </c-form-item>
            <c-form-item label="发起时间" class="lp-search-form-field">
              <c-date-picker
                v-model="searchForm.applyTime"
                style="width: 400px"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </c-date-picker>
            </c-form-item>
          </c-form>
        </template>
      </list-search>
      <!--内容区-->
      <div
        ref="page-content"
        class="page-content"
        :style="{ height: contentHight }"
      >
        <search-items
          :tags="searchTags"
          @clearTags="_clearTags"
          @tagBoxHeight="getTagBoxHeight"
        >
          <template v-slot:content-header_left>
            <total-info :search="totalInfoSearch" :total="page.total" />
            <!-- <c-tooltip v-if="pageStatus==0" content="刷新上架申请数据" placement="top">
              <c-button>上边</c-button>
              <i v-step-click="clickAsync" class="c-icon-refresh icon-sync" />
            </c-tooltip> -->
          </template>
        </search-items>
        <c-table :data="dataList" :height="tableHeight">
          <c-table-column label="#" type="index" width="60">
            <template slot-scope="scope">
              <span class="table-index">{{
                (page.pageNum - 1) * page.pageSize + scope.$index + 1
              }}</span>
            </template>
          </c-table-column>
          <c-table-column
            prop="_assetType"
            label="资源类型"
            show-overflow-tooltip
          />
          <c-table-column
            prop="packName"
            label="资源名称"
            show-overflow-tooltip
          />
          <c-table-column
            prop="shopCode"
            label="资源编码"
            show-overflow-tooltip
          />
          <c-table-column
            prop="_applyType"
            label="申请类型"
            show-overflow-tooltip
          />
          <c-table-column
            prop="_assetSource"
            label="申请来源"
            show-overflow-tooltip
          />
          <c-table-column
            prop="_packVersion"
            label="版本号"
            show-overflow-tooltip
          />
          <c-table-column
            v-if="pageStatus === 1"
            prop="_applyStatus"
            label="审核状态"
            show-overflow-tooltip
          />
          <c-table-column
            prop="applyUserName"
            label="发起人"
            show-overflow-tooltip
          />
          <c-table-column
            prop="applyTime"
            label="发起时间"
            show-overflow-tooltip
          />

          <c-table-column
            v-if="pageStatus === 1"
            prop="handleTime"
            label="审核时间"
            show-overflow-tooltip
          />

          <c-table-column
            label="操作"
            fixed="right"
            :width="pageStatus === 1 ? 60 : 110"
          >
            <template slot-scope="scope">
              <btn-group
                :btns="getbtns(scope.row)"
                @handleClick="handleOperateClick"
              />
            </template>
          </c-table-column>
        </c-table>
      </div>
    </div>
    <div
      class="list-page-footer"
      :class="{ 'list-page-footer-shadow': showPaginationShadow }"
    >
      <c-pagination
        background
        :current-page="page.pageNum"
        :page-sizes="[10, 50, 100, 200]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
        class="size-left"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <post-audit
      :post-dailog-flag="showPostDailog"
      :apply-type="auditItem.applyType"
      :apply-id="auditItem.id"
      @close="colseDialog"
    ></post-audit>
  </router-page-layout>
</template>
<script>
import myMixin from '@/mixin/list-page-cache-mixin.js'

import listSearch from '@/components/list-search'
import searchItems from '@/components/search-items'
import postAudit from '../components/post-audit'

import { applyList, packAsyncApi } from '@/api/manage'
import {
  applyOptionsArr,
  applyTypeOptionsArr,
  applyObjectFormat,
  applyTypeFormat,
  applyStatusOptionsArr,
  applyStatusFormat,
  ASSET_SOURCE,
  asseTypeFormat
} from '@/utils/enumerate'

export default {
  name: '',
  components: {
    listSearch,
    searchItems,
    postAudit
  },
  filters: {},
  mixins: [myMixin],
  props: {
    pageStatus: {
      type: [String, Number],
      default: 0
    } // 0 待审核列表 1 已审核列表

  },
  data() {
    return {
      myPath: '/management/waiting-audit-list',
      routesArr: [
        '/management/waiting-audit-list',
        '/management/approved-list'
      ], // 这个组件被两个页面路由引用
      applyOptions: applyOptionsArr,
      applyTypeOptions: applyTypeOptionsArr,
      searchTags: [], // 搜索标签
      contentHight: '0px', // 内容区高度
      tagBoxHeight: 0, // 搜索标签展示区高度
      myObserver: null, // 对内容展示区的元素监听对象
      showPaginationShadow: false, // 是否显示分页器的阴影
      auditItem: {},
      totalInfoSearch: false,
      showPostDailog: false,
      ASSET_TYPE_TREE: window.ENUMS.ASSET_TYPE_TREE
    }
  },
  computed: {
    applyStatusOptions() {
      return applyStatusOptionsArr.filter((item) => {
        return item.value !== 0
      })
    }
  },
  created() {
  },
  mounted() {
    this.runResizeObserver()
  },
  beforeDestroy() {
    this.myObserver && this.myObserver.disconnect()
  },
  methods: {
    asseTypeFilter(assetType, assetSubtype) {
      return asseTypeFormat(assetType, assetSubtype)
    },
    // 同步
    clickAsync() {
      packAsyncApi().then(res => {
        if (res && +res.code === 0) {
          this.$message.success('操作成功')
        }
      })
    },

    _applyObjectFormat(val) {
      return applyObjectFormat(val)
    },
    _applyTypeFormat(val) {
      return applyTypeFormat(val)
    },
    _applyStatusFormat(val) {
      return applyStatusFormat(val)
    },
    _assetSourceFormat(val) {
      return ASSET_SOURCE[val] || val
    },

    runResizeObserver() {
      this.myObserver = new ResizeObserver((entries) => {
        // 注意，entres是个数组，数组项为每个需要监听的DOM节点
        entries.forEach((entry) => {
          if (entry.target.className.indexOf('page-content') !== -1) {
            this.setTableHeight(entry.contentRect.height + 70)
          }
        })
      })
      this.$refs['page-content'] &&
        this.myObserver.observe(this.$refs['page-content'])
    },
    getTagBoxHeight(val) {
      this.tagBoxHeight = val
      this.$nextTick(() => {
        this.setTableHeight(this.$refs['page-content'].offsetHeight)
      })
    },
    setTableHeight(val) {
      // 处理树的高度
      const num = val - this.tagBoxHeight - 70
      if (num > 200) {
        this.tableHeight = num
        this.showPaginationShadow =
          this.tableHeight -
            this.$el.querySelector('.c-table__body').offsetHeight <
          48
      } else {
        this.tableHeight = undefined
        this.contentHight = 'auto'
      }
    },
    getHeaderHeight(num) {
      // console.log('获取到顶部搜索项的高度', num)
      this.contentHight = `calc(100% - ${num + 18}px)`
    },
    getSearch(val) {
      // console.log('获取到搜索内容', val)
      if (val.length) {
        this.makeSearchTags(val)
        return
      }
      // 刷新列表
      this.handleSearch()
    },
    _clearTags(val) {
      // 需要清除的搜索项
      this.searchTags = this.searchTags.filter((i) => {
        const tags = val.filter((j) => {
          return j.key === i.key
        })
        return !tags.length
      })
      this.makeSearchForm(this.searchTags)
    },
    makeSearchForm(val) {
      // 更改搜索内容
      Object.keys(this.searchForm).forEach((key) => {
        this.searchForm[key] = ''
      })
      if (val.length) {
        val.forEach((item) => {
          this.searchForm[item.key] = item.value
          if (item.key === 'assetType') {
            const [assetType, assetSubtype] = item.value
            this.searchForm.assetType = assetType
            this.searchForm.assetSubtype = assetSubtype
          }
        })
      }
      // 执行搜索
      this.handleSearch()
    },
    makeSearchTags(arr) {
      // 处理搜素标签  修改  新增
      arr.forEach((item) => {
        let hasIt = false
        this.searchTags.forEach((t) => {
          if (t.key === item.key) {
            // 更新
            t.valueName = this.getValName(item)
            t.value = item.value
            hasIt = true
          }
        })
        if (!hasIt) {
          // 新增
          this.searchTags.push({
            key: item.key,
            valueName: this.getValName(item),
            value: item.value,
            label: item.label
          })
        }
      })
      this.makeSearchForm(this.searchTags)
    },
    // 获取值的真实显示数据
    getValName(item) {
      // 特殊需要换取展示值的进行处理
      if (item.key === 'applyObject') {
        return applyObjectFormat(item.value)
      } else if (item.key === 'applyTime' || item.key === 'applyHandleTime') {
        return item.value[0] + ' 至 ' + item.value[1]
      } else if (item.key === 'applyType') {
        return applyTypeFormat(item.value)
      } else if (item.key === 'applyStatusList') {
        return applyStatusFormat(item.value)
      } else if (item.key === 'assetType') {
        return asseTypeFormat(...item.value)
      }
      return item.value
    },

    colseDialog(msg) {
      this.showPostDailog = false
      this.auditItem = {}
      if (msg) {
        // 刷新列表
        this.handleSearch()
      }
    },
    getbtns(row) {
      // 启用状态不允许编辑/删除
      if (this.pageStatus === 1) {
        return [
          {
            label: '查看',
            row: row
          }
        ]
      } else {
        return [
          {
            label: '查看',
            row: row
          },
          {
            label: '审核',
            row: row
          }
        ]
      }
    },
    // 操作列按钮事件
    handleOperateClick(msg) {
      switch (msg.label) {
        case '查看':
          this.handleDetail(msg.row)
          break
        case '审核':
          this.runPostAudit(msg.row)
          break
        default:
          break
      }
    },
    handleDetail(row) {
      let path = '/management/waiting-audit-list/detail'
      if (this.pageStatus === 0) {
        path = '/management/waiting-audit-list/detailing'
      }
      this.$router.push({
        path,
        query: {
          id: row.id,
          status: this.pageStatus,
          cache: true,
          applyObject: row.applyObject,
          applyType: row.applyType,
          assetType: row.assetSubtype
        }
      })
    },
    runPostAudit(row) {
      this.showPostDailog = true
      this.auditItem = row
    },
    createQueryParams(val) {
      if (this.pageStatus === '') {
        this.getPageStatus()
      }
      const data = Object.assign({}, val)
      // 处理请求数据
      // 发起时间处理
      if (data.applyTime && data.applyTime.length) {
        data.applyTimeStart = data.applyTime[0]
        data.applyTimeEnd = data.applyTime[1]
        delete data.applyTime
      }

      // 审核时间处理
      if (
        this.pageStatus === 1 &&
        data.applyHandleTime &&
        data.applyHandleTime.length
      ) {
        data.handleTimeStart = data.applyHandleTime[0]
        data.handleTimeEnd = data.applyHandleTime[1]
        delete data.applyHandleTime
      }

      // 审核状态
      if (this.pageStatus === 1) {
        data.applyStatusList = data.applyStatusList ? [data.applyStatusList] : [1, 2]
      } else if (this.pageStatus === 0) {
        data.applyStatusList = [0]
      }

      // 排序字段
      data.orderKey = this.pageStatus === 1 ? 'handleTime' : 'applyTime'

      // 倒序
      data.orderType = 'desc'
      return data
    },
    async search(pageNum = 1) {
      this.totalInfoSearch = false
      const queryParams = this.getQueryParams(pageNum)
      const res = await applyList(this.createQueryParams(queryParams))
      this.dataList = (res.data.list || []).map(d => ({
        ...d,
        _assetType: this.asseTypeFilter(d.assetType, d.assetSubtype) || '--',
        _applyType: this._applyTypeFormat(d.applyType) || '--',
        _assetSource: this._assetSourceFormat(d.assetSource) || '--',
        _packVersion: d.packVersion || '--',
        _applyStatus: this._applyStatusFormat(d.applyStatus) || '--'
      }))
      this.page = {
        ...this.page,
        pageNum: res.data.currPage,
        pageSize: res.data.pageSize,
        total: res.data.total
      }
      this.doQueryCache(['searchForm', 'page', 'searchTags'])
    }
  }
}
</script>

<style scoped lang='scss'>
.icon-sync {
  margin-left: 16px;
  width: 32px;
  height: 32px;
  line-height: 32px;
  border-radius: 2px;
  border: 1px solid #E7E7E7;
  text-align: center;
  cursor: pointer;
}
.list-page-footer {
  box-sizing: border-box;
  padding-right: 24px;
  padding-left: 20px;
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background: #ffffff;
  z-index: 1000;
}
.list-page-footer-shadow {
  box-shadow: 0px -2px 7px 0px rgba(0, 0, 0, 0.06);
}
.page-content {
  box-sizing: border-box;
  padding: 0 20px 70px;
  background: #ffffff;
  box-shadow: 0px 0px 2px 0px rgba(71, 78, 92, 0.1);
}
.page-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
