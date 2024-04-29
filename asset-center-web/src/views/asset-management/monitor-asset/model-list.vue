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

          </c-form>

        </template>
        <template v-slot:content-header_left>
          <total-info :search="hasSearch" :total="page.total" />
        </template>
        <template v-slot:content-header_right>
          <!-- <c-button type="ordinary" size="small" class="btn-operate btn-import mrg-right" @click="showImportDialog({ assetType: '2', subtype: '23' })">导入资源</c-button>
          <button-dropdown :options="btnList" :text="'新建资源'" @command="handleCommand" /> -->
        </template>
        <template v-slot:table>
          <div class="assets-content-list" :style="{'height': setting.tableHeight,}">
            <div class="list" :style="{ width: '1619px' }">
              <assetsCard v-for="asset in dataList" :key="asset.assetId" class="assets-item" :is-list="true" :show-status="true"
                          :page-key="'monitorModel'" :data="asset" :btn-list="getbtns(asset)" @handleClick="handleOperateClick"></assetsCard>
            </div>
          </div>
        </template>
        <template v-slot:footer>
          <div class="lp-page-footer">
            <c-pagination
              :current-page="page.pageNum"
              :page-size="page.pageSize"
              layout="total, prev, pager, next, jumper"
              :total="page.total"
              background
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
  tagTree,
  monitorListPage,
  techDelete
} from '@/api/index'
import { subtypeListTeach } from '@/dictionary/index';
import treeLayout from '@/components/card-layout'
import postDailog from '../components/post-dialog.vue'
import copyDailog from '../components/copy-dialog.vue'
import importDailog from '../components/import-dialog.vue'
import selectDownload from '../components/select-download.vue'

import lpMixin from '@/mixin/list-page-cache-mixin'
import assetsCard from '@/views/application-management/components/assets-card.vue'
import { assetSrc } from '@/config/index'
// import { getToken } from '@/utils/auth';
import { getPermissionByAssetsbutype } from '@/utils'
export default {
  name: 'StatisticsAssetPage',
  components: {
    treeLayout,
    assetsCard,
    postDailog,
    importDailog,
    copyDailog,
    selectDownload
  },
  filters: {
    subtypeFilter(val) {
      const findOne = subtypeListTeach.find(item => {
        return item.code + '' === val + ''
      })
      if (findOne) {
        return findOne.label
      }
      return ''
    }
  },
  mixins: [lpMixin],
  data() {
    return {
      btnList: [{ label: '新建空白资源', code: '23' }, { label: '选择下载资源' }],
      myPath: '/asset-management/object-asset',

      postDailogFlag: false,
      currAsset: {},
      assetSrc: assetSrc,
      options: [{ key: 'assetSrc', value: assetSrc.map(item => ({ groupId: item.value, groupName: item.label })) }],
      subtypeListTeach: subtypeListTeach,
      interfaceDialogFlag: false,
      tagTreeDataOld: [],
      treeData: [],
      title: '添加接口',
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
    this.getTreeList()
  },
  destroyed() {
  },
  methods: {
    getbtns(row) {
      const map = [{
        permissionKey: 'view',
        label: '查看',
        row: row
      }]
      return map.filter(d => !d.hide && getPermissionByAssetsbutype(row.subtype, d.permissionKey))
    },
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
        case '页面设计':
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
      try {
        this.$router.push({
          path: '/asset-management/monitor-asset/model-asset',
          query: {
            cache: true,
            url: encodeURI(row.accessUrl)
          }
        })
      } catch (error) {
        console.log(error)
      }
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
        techDelete(row.id).then(rs => {
          this.$message.success(rs.msg)
          this.searchAfterDel()
        })
      })
    },
    handleCommand(command) {
      console.log(command, 'command')
      if (!command) {
        return this.showSelectAssetDialog({ assetType: '2', subtype: '23' })
      }
      this.handleDetail({ subtype: command }, 'add')
    },
    treeChange(list, info) {
      console.log(list)
      console.log(this.searchForm.tagIdList, 'searchForm.tagIdList')
    },

    getTableHeight() {
      this.setting.tableHeight = document.body.clientHeight - this.setting.headerHeight - this.setting.footerHeight - 64 - 128 - 85
    },
    // 获取专题树
    getTreeList() {
      tagTree().then(rs => {
        if (rs.code === 0) {
          this.treeData = rs.data
          this.tagTreeDataOld = JSON.parse(JSON.stringify(rs.data))
          this.options.push({ key: 'tagIdList', value: JSON.parse(JSON.stringify(rs.data)) })
          this.treeRecursion(this.treeData)
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
        queryParams.subtype = '61'
        const result = await monitorListPage(queryParams)
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
  background: #FFFFFF;

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
