<!--
 * @Description: 技术资源管理
 * @Author: liu lianpeng
 * @Date: 2021-05-07
-->
<template>
  <router-page-layout :path="myPath">
    <div class="tech-wrap">
      <tree-layout
        :setting="setting"
        :show-tree="false"
        :options="options"
        :init-tags="tags"
        @cacheTags="cacheTags"

        @getHeaderHeight="contentHeightChange"
        @getSearch="getSearch"
      >
        <template v-slot:header="{searchForm}">
          <c-form
            ref="searchForm"
            class="search-form"
            :model="searchForm"
            inline
            @submit.native.prevent
          >
            <c-form-item
              label="资源名称"
              class="lp-search-form-field"
            >
              <c-input
                v-model="searchForm.assetName"
                :placeholder="'请输入'"
                clearable
                size="small"
              />
            </c-form-item>
            <!-- <c-form-item
              label="资源编码"
              class="lp-search-form-field"
            >
              <c-input
                v-model="searchForm.assetCode"
                :placeholder="'请输入'"
                clearable
                size="small"
              />
            </c-form-item> -->

            <!-- <c-form-item
              label="资源标签"
              class="tagIdList lp-search-form-field"
            >
              <cestc-tree-select
                v-model="searchForm.tagIdList"
                :multiple="true"
                clearable
                :placeholder="'请选择'"
                :search="true"
                :get-leaf-only="true"
                :options="treeData"
                :props="defaultProps"
                @getValue="list => {
                  treeChange(list, searchForm)
                }"
              />
            </c-form-item> -->
            <c-form-item label="模型类型" class="lp-search-form-field">
              <c-select
                v-model="searchForm.businessType"
                :specific-suffix="true"

                size="small"
                placeholder="请选择">
                <c-option v-for="item in pageTypeList" :key="item.value" :label="item.label" :value="item.value"></c-option>
              </c-select>
            </c-form-item>
            <c-form-item label="资源状态" class="lp-search-form-field">
              <c-select v-model="searchForm.status" :specific-suffix="true" class="form-input-item" size="small"
                        placeholder="请选择">
                <c-option v-for="item in assetStatus" :key="item.value" :label="item.label" :value="item.value"></c-option>

              </c-select>
            </c-form-item>
            <c-form-item label="共享状态" class="lp-search-form-field">
              <c-select v-model="searchForm.sharedFlag" :specific-suffix="true" class="form-input-item" size="small"
                        placeholder="请选择">
                <c-option v-for="item in shareStatus" :key="item.value" :label="item.label" :value="item.value"></c-option>

              </c-select>
            </c-form-item>
          </c-form>

        </template>
        <template v-slot:content-header_left>
          <total-info :search="hasSearch" :total="page.total" />
          <iconSwitch v-model="pageListType" />
        </template>
        <template v-slot:content-header_right>
          <c-button
            v-show="getPermissionByAssetsbutype(72, 'add')"
            type="gradual" size="small" class="btn-operate btn-add mrg-right" @click="handleCommand({command:'72'})">新建资源</c-button>
        </template>
        <template v-slot:table>
          <div v-show="pageListType=='card'" class="assets-content-list" :style="{'height': setting.tableHeight,}">
            <div class="list" :style="{ width: '1619px' }">
              <assetsCard v-for="asset in dataList" :key="asset.assetId" class="assets-item" :is-list="true" :show-status="true"
                          :page-key="'modelAsset'" :data="asset" :btn-list="getbtns(asset)" @handleClick="handleOperateClick"></assetsCard>
            </div>
          </div>
          <assetsTable
            v-show="pageListType=='list'"
            :page-key="'modelAsset'"
            :data="dataList"
            :height="setting.tableHeight"
            :page="page"
            :getbtns="getbtns"
            @handleOperateClick="handleOperateClick"></assetsTable>
        </template>
        <template v-slot:footer>
          <div class="lp-page-footer">
            <c-pagination
              :current-page="page.pageNum"
              :page-size="page.pageSize"
              :page-sizes="pageSizeArr"
              layout="sizes,total, prev, pager, next, jumper"
              :total="page.total"
              background
              class="size-left"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </template>
      </tree-layout>
      <postDailog :post-dailog-flag="postDailogFlag" :curr-asset="currAsset" @close="closePostDialog" />
      <copyDailog v-if="dialogVisibleCopy" :dialog-flag="dialogVisibleCopy" :curr-id="currAsset.id" @close="closeCopyDialog" />
      <importDailog v-if="dialogVisibleImport" :dialog-flag="dialogVisibleImport" :curr-id="currAsset.id" :curr-asset="currAsset" @close="closeImportDialog" />
      <selectDownload v-if="dialogVisibleSelect" :dialog-flag="dialogVisibleSelect" :asset-type="currAsset.assetType" :subtype="currAsset.subtype" @close="closeSelectDialog" />
    </div>
  </router-page-layout>

</template>
<script>

import {
  modeList,
  modeDelete
} from '@/api/'
// import cestcTreeSelect from '@/components/cestc-tree-select'
import treeLayout from '@/components/card-layout'
import postDailog from '../components/post-dialog.vue'
import copyDailog from '../components/copy-dialog.vue'
import importDailog from '../components/import-dialog.vue'
import selectDownload from '../components/select-download.vue'
import lpMixin from '@/mixin/list-page-cache-mixin'

import assetsCard from '@/views/application-management/components/assets-card.vue'
import { assetSrc, assetStatus, shareStatus } from '@/config/index'
import iconSwitch from '@/views/asset-management/components/icon-switch.vue'
import assetsTable from '@/views/asset-management/components/assets-table.vue'

export default {
  name: 'ModeAsset',
  components: {
    treeLayout,
    assetsCard,
    postDailog,
    importDailog,
    copyDailog,
    selectDownload,
    iconSwitch,
    assetsTable
  },

  mixins: [lpMixin],
  data() {
    const pageTypeList = window.__systemConfig && window.__systemConfig.bizType && window.__systemConfig.bizType.modelList && window.__systemConfig.bizType.modelList.map(item => {
      return { label: item.name, value: item.type }
    }) || []
    return {
      btnList: [{ label: '新建空白资源', code: '72' }, { label: '选择下载资源' }],
      myPath: '/asset-management/mode-asset',
      postDailogFlag: false,
      currAsset: {},
      interfaceDialogFlag: false,
      tagTreeDataOld: [],
      treeData: [],
      assetSrc: assetSrc,
      pageTypeList: pageTypeList,
      shareStatus,
      assetStatus,
      options: [
        { key: 'businessType', value: pageTypeList.map(item => ({ groupId: item.value, groupName: item.label })) },
        { key: 'status', value: assetStatus.map(item => ({ groupId: item.value, groupName: item.label })) },
        { key: 'sharedFlag', value: shareStatus.map(item => ({ groupId: item.value, groupName: item.label })) }
      ],
      title: '添加模型',
      tagDetailNameList: this.$route.query.flag === 'detail' && this.$route.query.tagNameList ? decodeURIComponent(this.$route.query.tagNameList).split(',') : [],
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
  },
  destroyed() {
  },
  methods: {
    closePostDialog(search = false) {
      this.postDailogFlag = false
      if (search) {
        this.getList()
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
        case '模型注册':
          this.openAssetEditorUrl(msg.row)
          break
        case '发布':
          this.postAsset(msg.row)
          break
        case '删除': this.handleDelete(msg.row)
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
    closeDialog() {
      this.interfaceDialogFlag = false
      this.flag = ''
      this.getList()
    },

    handleDetail(row, flag = 'detail') {
      this.interfaceDialogFlag = true
      this.currAssetId = row.id
      switch (flag) {
        case 'detail':
          this.title = '查看模型'
          break;
        case 'add':
          this.title = '添加模型'
          break;
        case 'edit':
          this.title = '编辑模型'
          break;
        default:
          break;
      }
      this.$router.push({
        path: '/asset-management/mode-asset/mode-asset',
        query: {
          id: row.id,
          flag,
          cache: true
        }
      })
    },
    handleDelete(row) {
      this.$confirm(
        '请确认是否删除资源？',
        '资源删除', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }
      ).then(() => {
        modeDelete(row.id).then(rs => {
          this.$message.success(rs.msg)
          this.searchAfterDel()
        })
      })
    },
    handleCommand(command) {
      console.log(command, 'cdddommand')
      if (!command) {
        return this.showSelectAssetDialog({ assetType: '7', subtype: '72' })
      }
      this.handleDetail({ subtype: command }, 'add')
    },
    treeChange(list, info) {
      console.log(list)
      console.log(this.searchForm.tagIdList, 'searchForm.tagIdList')
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
        queryParams.subtype = '72' //
        const result = await modeList(queryParams)
        this.dataList = result.data.list.map(item => {
          if (item.status === 1)item.version = ''
          return item
        })
        this.page.total = result.data.total
        this.doQueryCache(['searchForm', 'page', 'tags'])
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
.tech-wrap {
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
.cls-operation-wrapper {
  text-align: right;

}
.assets-content-list {
  overflow: auto;

  .list {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: flex-start;
    margin: auto;

  }

  .assets-item {
    margin-bottom: 20px;
    margin-right: 18px;

    &:nth-child(5n) {
      margin-right: 0px;
    }
  }

}
</style>
