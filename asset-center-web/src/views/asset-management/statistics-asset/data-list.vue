<!--
 * @Description:
 * @Author: lianpeng
 * @Date: 2021-12-21
-->
<template>
  <div class="data-main">
    <tree-layout :setting="setting" :show-tree="false" :init-tags="tags" :options="options"
                 @cacheTags="cacheTags" @getHeaderHeight="contentHeightChange"
                 @getSearch="getSearch">

      <template v-slot:header="{searchForm}">
        <c-form ref="searchForm" :model="searchForm" inline @submit.native.prevent>
          <c-form-item label="资源名称" class="lp-search-form-field">
            <c-input v-model="searchForm.assetName" :placeholder="'请输入'" clearable size="small" />
          </c-form-item>
          <c-form-item label="资源编码" class="lp-search-form-field">
            <c-input v-model="searchForm.assetCode" :placeholder="'请输入'" clearable size="small" />
          </c-form-item>
          <c-form-item label="资源标签" class="tagIdList lp-search-form-field">
            <cestc-tree-select v-model="searchForm.tagIdList" :multiple="true" clearable
                               :placeholder="'请选择'" :search="true" :get-leaf-only="true"
                               :options="tagTreeData" :props="defaultProps" />
          </c-form-item>
          <c-form-item label="资源来源" class="lp-search-form-field">
            <c-select v-model="searchForm.assetSrc" :specific-suffix="true" class="form-input-item"
                      size="small" placeholder="请选择">
              <c-option v-for="item in assetSrc" :key="item.value" :label="item.label"
                        :value="item.value"></c-option>

            </c-select>
          </c-form-item>
          <c-form-item label="资源状态" class="lp-search-form-field">
            <c-select v-model="searchForm.status" :specific-suffix="true" class="form-input-item" size="small"
                      placeholder="请选择">
              <c-option v-for="item in assetStatus" :key="item.value" :label="item.label" :value="item.value"></c-option>

            </c-select>
          </c-form-item>
          <c-form-item
            label="场景分类"
            prop="sceneId"
            class="lp-search-form-field"
          >

            <c-cascader
              v-model="searchForm.sceneId"
              style="width:100%"
              size="small"
              :specific-suffix="true"
              :show-all-levels="false"
              :options="treeData"

              :props="{
                multiple: false,
                value: 'groupId',
                label: 'groupName',
                children: 'childList',
                emitPath: false,
                checkStrictly: true
              }"
              :placeholder="'请选择'"
              clearable
            />
          </c-form-item>
        </c-form>
      </template>
      <template v-slot:content-header_left>

        <total-info :search="hasSearch" :total="page.total" />
      </template>
      <template v-slot:content-header_right>
        <c-button
          v-show="getPermissionByAssetsbutype(13, 'import')"
          type="ordinary" size="small"
          class="btn-operate btn-import mrg-right"
          @click="showImportDialog({ assetType: '1', subtype: '13' })">导入资源</c-button>
        <button-dropdown
          v-show="getPermissionByAssetsbutype(13, 'add')"
          :options="btnList" :text="'新建资源'"
          @command="handleCommand" />
      </template>

      <template v-slot:table>
        <div class="assets-content-list" :style="{'height': setting.tableHeight,}">
          <div class="list" :style="{ width: '1619px' }">
            <assetsCard v-for="asset in dataList" :key="asset.assetId" class="assets-item"
                        :page-key="'dataAsset'" :is-list="true" :show-status="true" :data="asset" :btn-list="getbtns(asset)"
                        @handleClick="handleOperateClick"></assetsCard>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div class="lp-page-footer">
          <c-pagination :current-page="page.pageNum" :page-size="page.pageSize"
                        layout="total, prev, pager, next, jumper" :total="page.total" background
                        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </template>
    </tree-layout>
    <changeGroupDialog v-if="dialogVisibleChangeGroup" :dialog-flag="dialogVisibleChangeGroup"
                       :curr="currAsset" @close="closeChangeGroupDialog" />
    <postDailog :post-dailog-flag="postDailogFlag" :curr-asset="currAsset"
                @close="closePostDialog" />
    <copyDailog v-if="dialogVisibleCopy" :dialog-flag="dialogVisibleCopy" :curr-id="currAsset.id"
                @close="closeCopyDialog" />
    <importDailog v-if="dialogVisibleImport" :dialog-flag="dialogVisibleImport" :group-id="sceneId"
                  :curr-id="currAsset.id" :curr-asset="currAsset" @close="closeImportDialog" />
    <selectDownload v-if="dialogVisibleSelect" :group-id="sceneId"
                    :dialog-flag="dialogVisibleSelect" :asset-type="currAsset.assetType"
                    :subtype="currAsset.subtype" @close="closeSelectDialog" />
  </div>
</template>

<script>
import {
  tagTree,
  statsListPage,
  // statsDelete,
  dataAssetDelApi,
  getTree,
  updateTree,
  addTree,
  delTree
} from '@/api/index'
import postDailog from '../components/post-dialog.vue'
import { subtypeListStatis } from '@/dictionary/index';
import cestcTreeSelect from '@/components/cestc-tree-select'
import treeLayout from '@/components/card-layout'
import copyDailog from '../components/copy-dialog.vue'
import importDailog from '../components/import-dialog.vue'
import selectDownload from '../components/select-download.vue'
import lpMixin from '@/mixin/list-page-cache-mixin'
import ButtonDropdown from '@/components/button-dropdown'
import changeGroupDialog from '../components/change-group-dialog.vue'
import assetsCard from '@/views/application-management/components/assets-card.vue'
import { assetSrc, assetStatus } from '@/config/index'

// import ctree from '@/components/ctree'
import qs from 'qs'
// import { getToken } from '@/utils/auth'

export default {
  name: 'DataAsset',
  components: {
    cestcTreeSelect,
    treeLayout,
    assetsCard,
    copyDailog,
    changeGroupDialog,
    postDailog,
    importDailog,
    ButtonDropdown,
    selectDownload
  },
  filters: {
    subtypeFilter(val) {
      const findOne = subtypeListStatis.find(item => {
        return item.code + '' === val + ''
      })
      if (findOne) {
        return findOne.label
      }
      return ''
    },
    assetKpiTypeFilter(val) {
      let res = ''
      switch (val) {
        case 1:
          res = '基础指标'
          break;
        case 3:
          res = '指标簇'
          break;
        default:
          break;
      }
      return res
    }
  },
  mixins: [lpMixin],
  props: {
    activeTab: {
      type: String
    }
  },
  data() {
    return {
      searchForm: {},
      btnList: [{ label: '新建空白资源', code: '13' }, { label: '选择下载资源' }],
      defaultExpandedKey: [],
      postDailogFlag: false,
      sceneId: '',
      treeData: [],
      assetSrc: assetSrc,
      assetStatus,
      options: [{ key: 'assetSrc', value: assetSrc.map(item => ({ groupId: item.value, groupName: item.label })) },
        { key: 'status', value: assetStatus.map(item => ({ groupId: item.value, groupName: item.label })) }
      ],
      isPlus: false, // 是否允许添加
      currAsset: {},
      subtypeListStatis: subtypeListStatis,
      dialogVisible: false,
      tagTreeData: [],
      setting: {
        tableHeight: 0,
        headerHeight: 80,
        headerMargin: 0,
        footerMargin: 0,
        footerHeight: 76
      },
      defaultProps: {
        children: 'childList',
        label: 'groupName',
        pid: 'parentId',
        value: 'groupId',
        disabled: 'disabled'
      }
    }
  },

  mounted() {
    this.getTreeList()
    this.getTagTreeList()
  },
  destroyed() {
  },
  methods: {
    handleCommand(command) {
      console.log(command, 'cdddommand')
      if (!command) {
        return this.showSelectAssetDialog({ assetType: '1', subtype: '13' })
      }
      this.handleDetail({ subtype: command }, 'add')
    },
    // 获取专题树
    getTreeList() {
      getTree().then(rs => {
        this.treeData = rs.data.map((d) => ({
          ...d,
          childList: d.childList.length ? d.childList.map((dd) => ({ ...dd, childList: null, leaf: true })) : null
        }));
        this.options.push({ key: 'sceneId', value: JSON.parse(JSON.stringify(rs.data)) })
      })
    },
    treeChange(node) {
      node = node[0] || {}
      console.log(!node.childList, !node.childList.length, 'treeChange')
      if (!node.childList || !node.childList.length) {
        this.isPlus = true
      } else this.isPlus = false
      this.sceneId = node.groupId
      this.search()
    },
    // 保存树
    saveNode(node) {
      if (node.groupId) {
        this.groupId = node.parentId
        const params = {
          ...node
        }
        updateTree(params).then(rs => {
          if (rs.code === 0) {
            this.getTreeList()
            this.$message.success(rs.msg)
          }
        })
      } else {
        this.groupId = node.parentId
        const paramsAdd = {
          ...node
        }
        addTree(paramsAdd).then(rs => {
          this.getTreeList()
          this.$message.success(rs.msg)
        })
      }
    },
    deleteTree(node) {
      if (!node.groupId) {
        this.getTreeList()
      } else {
        this.$confirm('请确认是否删除节点?', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        })
          .then(() => {
            delTree({}, node.groupId).then(rs => {
              if (rs.code === 0) {
                this.getTreeList()
                this.$message.success(rs.msg)
              } else {
                this.$message.error(rs.msg)
              }
            })
          })
      }
    },

    handleOperateClick(msg) {
      switch (msg.label) {
        case '共享':
          this.shareAsset(msg.row.id, '1')
          break
        case '取消共享':
          this.shareAsset(msg.row.id, '2')
          break
        case '查看':
          this.handleDetail(msg.row, 'detail')
          break
        case '编辑':
          this.handleDetail(msg.row, 'edit')
          break
        case '任务':
          this.gotoTask(msg.row, 'edit')
          break
        case '发布':
          this.postAsset(msg.row)
          break
        case '删除': this.handleDelete(msg.row)
          break
        case '场景切换':
          this.showChangeGroupDialog(msg.row)
          break
        case '复制':
          this.showCopyAssetDialog(msg.row)
          break
        case '下载':
          this.downloadAsset(msg.row)
          break
        case '打包':
          this.packageAsset(msg.row)
          break
      }
    },
    gotoTask({ referKpiCode, assetCode, referKpiVersion, version, referKpiName, storeName }) {
      if (window.__systemConfig && window.__systemConfig.taskEditorUrl) {
        this.$router.push({
          path: '/asset-management/statistics-asset/data-asset/task-add',
          query: {
            cache: true,
            url: encodeURI(window.__systemConfig.taskEditorUrl + '?' + qs.stringify({
              embed: 1,
              state: 2, // 1,新建 2,编辑 3,详情
              system: window.__systemConfig.sysCode,
              business: assetCode + '₪' + (version || ''),
              name: referKpiName, // 指标名称
              table: storeName + '_' + (version || ''), // 表名
              code: referKpiCode,
              version: referKpiVersion
            }))
          }
        })
      } else {
        this.$message.warning('没有获取到指标平台跳转地址，请刷新页面后重试')
      }
    },

    closePostDialog(search = false) {
      this.postDailogFlag = false
      if (search) {
        this.getList()
      }
    },

    handleDetail(row, flag = 'detail') {
      console.log(row, 'row')
      if (row.subtype + '' === '13') { // 数据
        this.$router.push({
          path: '/asset-management/statistics-asset/data-asset/add',
          query: Object.assign({}, {
            id: row.id,
            sceneId: this.sceneId,
            flag: flag,
            cache: true
          })
        })
        return
      }
    },
    handleDelete(row) {
      this.$confirm('此操作会导致创建的数据表、任务被删除，请确认是否删除资源？', '资源删除', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }
      ).then(() => {
        dataAssetDelApi(row.id).then(rs => {
          this.$message.success(rs.msg)
          this.searchAfterDel()
        })
      })
    },
    // handleCommand(command = '11') {
    //   return this.handleDetail({ subtype: command }, 'add')
    // },
    getTableHeight() {
      this.setting.tableHeight = document.body.clientHeight - this.setting.headerHeight - this.setting.footerHeight - 64 - 128 - 85
    },
    // 获取专题树
    getTagTreeList() {
      tagTree().then(rs => {
        if (rs.code === 0) {
          this.tagTreeData = rs.data
          this.options.push({ key: 'tagIdList', value: JSON.parse(JSON.stringify(rs.data)) })
          this.treeRecursion(this.tagTreeData)
        }
      })
    },
    search(pageNum = 1) {
      this.page.pageNum = pageNum
      this.getList()
    },
    // 获取指标列表
    async getList() {
      this.loading = true
      try {
        const queryParams = this.getQueryParams(this.page.pageNum)
        queryParams.subtype = '13'
        const result = await statsListPage(queryParams)
        this.dataList = result.data.list.map(item => {
          if (item.status === 1) item.version = ''
          return item
        })
        this.page.total = result.data.total
        this.doQueryCache(['searchForm', 'page', 'sceneId', 'activeTab', 'tags', 'isPlus'])
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';
.data-main {
  height: 100%;
}
.tab-list-own {
  background: #fff;
  padding: 23px 0px 0px;
  &::v-deep {
    .c-tabs__nav {
      margin-left: 22px;
    }
    .c-tabs__header {
      margin: 0;
    }

    .c-tabs__item {
      line-height: 16px;
    }
  }
}
.has-tree {
  margin-top: 20px;
  &::v-deep .page-header {
    border-top: 0px !important;
  }
}
.statistic-wrap {
  height: 100%;
}
.tagIdList {
  .c-scrollbar .c-scrollbar__view .c-select-dropdown__item {
    height: auto;
    max-height: 274px;
    padding: 0;
    overflow-x: hidden;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 4px;
      background-color: #fff;
      border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb {
      width: 4px;
      background-color: #ccc;
      border-radius: 4px;
    }
  }

  .c-select-dropdown__item.selected {
    font-weight: normal;
  }
}
.assets-content-list {
  overflow: auto;
  background: #ffffff;
  .list {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: flex-start;
    margin: auto;
    padding: 8px 0 0 9px;
  }
  .assets-item {
    margin-bottom: 26px;
    margin-right: 22px;
    &:nth-child(5n) {
      margin-right: 0px;
    }
  }
}
</style>
