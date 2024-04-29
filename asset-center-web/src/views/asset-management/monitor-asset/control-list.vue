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
          <c-button
            v-show="getPermissionByAssetsbutype(63, 'add')"
            type="gradual" size="small" class="btn-operate btn-add mrg-right" @click="showImportDialog({ assetType: '2', subtype: '23' })">新建资源</c-button>
          <!--  <button-dropdown :options="btnList" :text="'新建资源'" @command="handleCommand" /> -->
        </template>
        <template v-slot:table>
          <div class="assets-content-list" :style="{'height': setting.tableHeight,}">
            <div class="list" :style="{ width: '1619px' }">
              <assetsCard v-for="asset in dataList"
                          :key="asset.assetId" :page-key="'monitorDeploy'" class="assets-item" :is-list="true" :show-status="true" :btn-list="getbtns(asset)"
                          :data="asset" @handleClick="handleOperateClick"></assetsCard>
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
      <selectApp v-if="dialogVisibleImport" title="新建资源" checked-name="id"
                 tag-real-name="tagNameList" :page-data="indexDialogTable.page"
                 :table-cloumn-data="columns()" :show-list="indexDialogTable.list"
                 :init-select-arrs="indexDialogTable.selectedArr"
                 @getTableList="getDialogTableList" @saveTableList="saveIndexTableList"
                 @close="dialogVisibleImport=false" />
    </div>
  </router-page-layout>

</template>
<script>
import {
  monitorListPage,
  monitorListRefer,
  monitorControlBatchAdd,
  monitorRemove,
  appListPage
} from '@/api/index'
import { subtypeListTeach } from '@/dictionary/index';
import treeLayout from '@/components/card-layout'
import selectApp from '@/components/checkbox-notree/selectAPP.vue'

import { addParamToUrl, getPermissionByAssetsbutype } from '@/utils'
import { getToken } from '@/utils/auth';
import lpMixin from '@/mixin/list-page-cache-mixin'
import assetsCard from '@/views/application-management/components/assets-card.vue'
import { assetSrc } from '@/config/index'

export default {
  name: 'StatisticsAssetPage',
  components: {
    treeLayout,
    assetsCard,
    selectApp
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

      indexDialogTable: {
        page: { total: 0, pageSize: 10, currPage: 1 },
        list: [],
        selectedArr: []
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
  computed: {
    columns() {
      return function (type) {
        return [
          {
            lable: '应用名称',
            prop: 'appName'
          },
          {
            lable: '应用编码',
            prop: 'appCode'
          },
          {
            lable: '版本号',
            prop: 'version'
          }, {
            lable: '应用描述',
            prop: 'appDesc'
          }
        ]
      }
    }
  },

  mounted() {
    this.getMonitorListRefer()
  },
  destroyed() {
  },
  methods: {
    getbtns(row) {
      const map = [{
        permissionKey: 'view',
        label: '查看',
        row: row
      }, {
        permissionKey: 'delete',
        label: '移除',
        row: row
      }]
      return map.filter(d => !d.hide && getPermissionByAssetsbutype(row.subtype, d.permissionKey))
    },
    getMonitorListRefer() {
      monitorListRefer().then(res => {
        this.indexDialogTable.selectedArr = res.data.map(item => {
          item.id = item.referId
          return item
        })
      })
    },
    saveIndexTableList(list) {
      const params = {
        referList: list.map(item => ({
          referId: item.id
        }))
      }
      monitorControlBatchAdd(params).then(res => {
        this.getList()
        this.getMonitorListRefer()
      })
    },
    getDialogTableList(params) {
      const realParams = Object.assign(params)
      appListPage(realParams).then(res => {
        this.indexDialogTable.list = res.data.list.map(item => {
          return item
        })
        this.indexDialogTable.page = {
          total: res.data.total,
          pageSize: res.data.pageSize,
          currPage: res.data.currPage
        }
      })
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
        case '移除': this.handleDelete(msg.row)
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
      return window.open(addParamToUrl(row.accessUrl, { key: 'token', value: getToken() }))
      // try {
      //   this.$router.push({
      //     path: '/asset-management/monitor-asset/control-asset',
      //     query: {
      //       cache: true,
      //       url: encodeURI(addParamToUrl(row.accessUrl, { key: 'token', value: getToken() }))
      //     }
      //   })
      // } catch (err) {
      //   console.log(err)
      // }
    },
    handleDelete(row) {
      this.$confirm(
        '请确认是否移除资源？',
        '资源移除', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }
      ).then(() => {
        monitorRemove(row.id).then(rs => {
          this.$message.success(rs.msg)
          this.searchAfterDel()
          this.getMonitorListRefer()
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

    search(pageNum = 1) {
      this.page.pageNum = pageNum
      this.getList()
    },
    // 获取指标列表
    async getList() {
      this.loading = true
      try {
        const queryParams = this.getQueryParams(this.page.pageNum)
        queryParams.subtype = '63'
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
